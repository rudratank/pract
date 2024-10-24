import mongoose from "mongoose";
import bcrypt, { compare } from "bcrypt"; 
import User from "../models/Usermodels.js";
import jwt from 'jsonwebtoken';
import { request } from "express";
import sendToken from "../util/sendToken.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (request, response) => {
    try {
        const { email, password } = request.body;
        console.log(request.body);

        if (!email || !password) {
            return response.status(400).send("Email and Password are required...");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(409).send("User Already Exists.");
        }

        const user = await User.create({ email, password });

        response.cookie('jwt', createToken(email, user.id), {
            maxAge,
            httpOnly: true,
        });

        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};

export const login = async (request, response) => {
    const { email, password } = request.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return response.status(400).send('User not found');
        }

        const isMatch = password === user.password;

        if (!isMatch) {
            return response.status(400).send('Invalid credentials');
        }

        user.lastLogin.push(new Date());
        await user.save();
        sendToken(user,200,response);
        // response.cookie('jwt', createToken(email, user.id), {
        //     maxAge,
        //     httpOnly: true,
        // });

        // return response.status(200).json({
        //     message: 'Login successful',
        //     user: {
        //         id: user.id,
        //         email: user.email,
        //         lastLogin: user.lastLogin.toLocaleString(),
        //     },
        // });

    } catch (error) {
        console.log(error);
        return response.status(500).send('Internal server error');
    }
};

export const auditdata = async (request, response) => {
    try {
        const users = await User.findById(request.user.id);
        return response.status(200).json({
            users
        });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};
