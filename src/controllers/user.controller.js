// 
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/response.js";
import user from "../models/user.model.js";

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
    coverImage: coverImage?.url || "",
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

export { registerUser };
