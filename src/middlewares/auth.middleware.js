import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";


 export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
   
   
   
   const { accessToken } = req.cookies; 
 
   if (!token) {    

        throw new ApiError("Unauthorized, token not found", 401);
    }
   const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
        throw new ApiError("Unauthorized, invalid token", 401);
    }
    req.user = decoded;
    next();
  });
  await User.findById(req.user._id);
  
  if (!user) {
    throw new ApiError("User not found", 404);
  } 

  req.user = user;
  next();
});