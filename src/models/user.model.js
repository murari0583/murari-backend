// import mongoose,{Schema} from 'mongoose'
// import jwt from "jsonwebtoken"
// import bcrypt from "bcrypt"

// const UserSchema = new mongoose.Schema({
//     usename:{
//         type:String,
//         required: true,
//         unique:true,
//         lowecase : true,
//         index:true
//     },
//     email:
//     {
//         type:String,
//         required:true,
//         unique:true,
//         trim:true
//     },
//     fullname:{
//         type:String,
//         required:true,
//         trim:true,
//         index:true
//     },
//     avatar:{
//         type:String,// cloudinary url
//         required : true


//     },
//     coverImage:{
//         type:String
//     },
//     watchHistory:[{
//         type:Schema.Types.ObjectId,
//         ref:"video"
//     }],
//     pasword:{
//         type:String,
//         required:true,
//     },
//     refreshToken:{
//         type:string
//     }

// })
// // mongo db me password save karne se pahle password ko hash kar rahe hai
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     const hashedPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashedPassword;
//     next();
//   } catch (err) {
//     next(err);
//   }
// })
// UserSchema.methods.isPasswordCorrect= async function
// (password){
//   return await bcrypt.compare(password,this.password)
// }
// UserSchema.methods.generateAccessToken= function(){
//    return jwt.sign(
//         {
//             _id: this,
//             email:this.email,
//             username: this.username,
//             fullname: this.fullname
//         },
//         process.env.ACCESS_TOKEN_SECRET,{
//             expiryIn: process.env.ACCESS_TOKEN_EXPIRY
//         }
//     )
// }
// UserSchema.methods.generateRefreshToken = function (){
//     return jwt.sign(
//         {
//             _id: this,
//             email:this.email,
//             username: this.username,
//             fullname: this.fullname
//         },
//         process.env.ACCESS_TOKEN_SECRET,{
//             expiryIn: process.env.ACCESS_TOKEN_EXPIRY
//         }
//     )
// }
// export const User = mongoose.model("User","UserShema")

import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  avatar: {
    type: String,
    required: true // Cloudinary URL
  },
  coverImage: {
    type: String
  },
  watchHistory: [{
    type: Schema.Types.ObjectId,
    ref: 'video'
  }],
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  }
}, { timestamps: true });

//  Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//  Generate access token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

//  Generate refresh token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const User = mongoose.model('User', UserSchema);
export default User;