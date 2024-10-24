import User from "../models/Usermodels.js"
import jwt from "jsonwebtoken"
// const ErrorHandler = require("../utils/errorHandlers");
// const catchAsyncErrors = require("./catchAsyncErrors");

const isAuthenticatedUser = async (req, res, next) => {
  const token = req.query.token;
  // const { token } = req.cookies;
  console.log("token : " + token);

  if (!token || token == "null") {
    return res.status(401).send(
      "error in token"
    );
  }
  const decodeData = jwt.verify(token, process.env.JWT_KEY);
  console.log("aas "+decodeData);
  
  req.user = await User.findById(decodeData.id);
  console.log(req.user);
  
  next();
};

export default isAuthenticatedUser;
