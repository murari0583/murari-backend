import  {v2 as cloudinary} from 'cloudinary'
import {fs} from 'fs' 

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME ,
    api_key:'process.env.CLOUDINARY_API_KEY',
    api_secret:'process.env.CLOUDINARY_CLOUD_SECRET'
});

const uploadToCloudinary = async (localFilepath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilepath, {
      folder: "user_avatars"
    });
    return result.secure_url;

    // file has been uploade successfully
  } catch (error) {
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};
