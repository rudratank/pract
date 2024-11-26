import mongoose from "mongoose";
import bcrypt, { compare } from "bcrypt"; 
import User from "../models/Usermodels.js";
import jwt from 'jsonwebtoken';
import { request, response } from "express";
import sendToken from "../util/sendToken.js";
import {renameSync,unlink, unlinkSync} from "fs";
import path from "path";

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
            secure: false,  
            sameSite: 'lax',
            path: '/',       // Make the cookie available to all routes
        });

        return response.status(201).json({
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
            return response.status(404).send('User not found');
        }
        
        const isMatch = await compare(password,user.password)
        
        if (!isMatch) {
            return response.status(400).send('Invalid credentials');
        }
        
        response.cookie('jwt', createToken(email, user.id), {
            maxAge,
            httpOnly: true,
            secure: false,  
            sameSite: 'lax',
            path: '/',
        });
        
        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                color:user.color,
            },
        });
        
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



export const getUserInfo = async (request, response) => {
    try {
        const userData=await User.findById(request.userId);
        if(!userData){
            return response.status(404).send('User not found');
        }
        
        
        return response.status(200).json({
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
                color:userData.color,
        });

    } catch (error) {
        console.log(error);
        return response.status(500).send('Internal server error');
    }
};


export const updateProfile = async (request, response) => {
    try {
        const { userId } = request;
        const { firstName, lastName, color } = request.body;
        
        if (!firstName || !lastName) {
            return response.status(400).send("FirstName and LastName are required!");
        }

        const userData = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, color, profileSetup: true },
            { new: true, runValidators: true }
        );

        if (!userData) {
            return response.status(404).send("User not found");
        }

        return response.status(200).json({
            id: userData.id,
            Dataemail: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });

    } catch (error) {
        console.log(error);
        return response.status(500).send('Internal server error');
    }
};


export const addProfileImage=async (request, response) => {
    try {
        if(!request.file){
            return response.status(400).send("File is required");
        }

        const date = Date.now();
        const sanitizedFileName = request.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'); // Remove special characters
        const fileName = `profile_${date}_${sanitizedFileName}`;

        const updatedUser=await User.findByIdAndUpdate(request.userId,{image:fileName},{ new:true,runValidators:true});
        const imageUrl = `http://localhost:5173/uploads/${encodeURIComponent(fileName)}`;

        return response.status(200).json({
          image:updatedUser.image,
        });

    } catch (error) {
        console.log(error);
        return response.status(500).send('Internal server error');
    }
};

export const removeProfileImage = async (request, response) => {
    try {
        const { userId } = request;
        const user = await User.findById(userId); // Ensure async with `await`

        if (!user) {
            return response.status(404).send("User not found.");
        }

        if (user.image) {
            unlinkSync(user.image);
        }

        user.image = null;
        await user.save();

        return response.status(200).send("Profile image removed.");
    } catch (error) {
        console.error("Error in removeProfileImage:", error); // Improved logging
        return response.status(500).send('Internal server error');
    }
};


export const logout= async (request,response,next)=>{
    try {
        
        response.cookie("jwt","",{maxAge:1,secure:false, sameSite: 'lax',path:"/"});
        return response.status(200).send("Logout Syccesfull");
        
    } catch (error) {
        console.error("Error in removeProfileImage:", error); // Improved logging
        return response.status(500).send('Internal server error');
    }
}