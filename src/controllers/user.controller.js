// 
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/response.js";
import user from "../models/user.model.js";


const generateAccessTokenAndRefreshTokens = async (userId) => {
  try {  
    const user = await user.findById(userId);
    const accessToken = jwt.sign(
      {
        _id: userId,    
      },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );

    const refreshToken = jwt.sign(
      {
        _id: userId,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Token generation failed: " + error.message);
  }
  // JWT token generate karne ka code yahan likhenge
};

// get user detIL FROM FRONTEND
// validation
// check user exist or not
// if exist send error
// if not exist then create user
// avatar image upload to cloudinary
// create user object - entry in db
// remove password and refresh token from response
// save user
// send responses

const registerUser = asyncHandler(async (req, res) => {

//   res.status(200).json({ message: "Register user endpoint" });
// });
  const { fullname, email, username, password } = req.body;

  if (!fullname || !email || !username || !password) {
    throw new ApiError("All fields are required", 400);
  }

  const existedUser = await user.findOne({
    $or: [{ username }, { email }]
  });

  if (existedUser) {
    throw new ApiError("User already exists with this username or email", 400);
  }
  // abhi ham image server pe hi rakhenge 

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalpath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError("Avatar image is required", 400);
  }

  // ab image ko cloudinary pe upload karna hai

  const avatarUrl = await uploadToCloudinary(avatarLocalPath);
  const coverImageUrl = await uploadToCloudinary(coverImageLocalpath);

  
  if (!avatarUrl) {
    throw new ApiError("Avatar upload failed", 500);
  }
/// database me entry
  const newUser = await user.create({
    fullname,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatarUrl,
   coverImage: coverImageUrl || "",
  });

  if (!newUser) {
    throw new ApiError("User creation failed", 400);
  }

  newUser.password = undefined;
  newUser.refreshToken = undefined;

 return  res.status(201).json(
    new ApiResponse(201, "User registered successfully", newUser)
  );
});
const loginUser = asyncHandler(async(req,res)=>{
  // req body se data lao
  const{email,username,password} = req.body
  if(!(email || username) || !password){
    throw new ApiError("All fields are required",400)
  }

  // username aur email
    const User=await User.findOne({
    $or:[{email},{username}]
  })
  if(!User){
    throw new ApiError("User not found",404)
  }
  const isPasswordCorrect=await user.isPasswordCorrect(password)
  if(!isPasswordCorrect){
    throw new ApiError("Invalid credentials",401)
  }

  const loggedInUser= await user.findById(User._id).select("-password -refreshToken -__v -createdAt -updatedAt")

  const {accessToken,refreshToken}= await generateAccessTokenAndRefreshTokens(User._id)  
  // cookie
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  return res.status(200).cookie("refreshToken",refreshToken,cookieOptions).json(
    new ApiResponse(200,"User logged in successfully",{user:loggedInUser,accessToken})
  )
});

// response bhejo
// sabse pehle validation karo

// find the user
// password check karo
// agar sab thik hai to access token aur refresh token generate karo
// refresh token ko db me save karo
// cookie me refresh token bhejo

const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new ApiError("No refresh token found", 400);
  }
  // Add your logout logic here, e.g., remove refresh token from DB, clear cookie, etc.
  res.clearCookie("refreshToken");
  return res.status(200).json(
    new ApiResponse(200, "User logged out successfully")
  );
});

  

export { registerUser,
          loginUser ,
          logoutUser

 };
