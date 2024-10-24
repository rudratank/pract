import mongoose from "mongoose";
import {genSalt, hash} from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        require:[true,'Email is Required...'],
        unique:true
    },
    password:{
        type:String,
        require:[true,"Password is Required..."],
    },
    firstName:{
        type:String,
        require:false,
    },
    lastName:{
        type:String,
        require:false,
    },
    image:{
        type:String,
        required:false,
    },
    color:{
        type:Number,
        require:false,
    },
    profileSetup:{
        type:Boolean,
        default:false,
    },
    lastLogin: [{
        type: Date,  // New field to store the last login time
        default: null,
    }],
});

UserSchema.pre("save",async function(next) 
{
    // const salt = await genSalt();
    // this.password=await hash(this.password,salt);
    next();
});

//generate jwt token
UserSchema.methods.getJWTToekn = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };

const User = mongoose.model("Users",UserSchema);

export default User;