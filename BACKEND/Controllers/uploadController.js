import fs from "fs-extra";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import PhotoModel from "../Models/PhotosModel.js"; // Import your photo model

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadImages = async (req, res, next) => {
  try {
    const uploadedResults = []; // Array to store upload results

    // Read files from uploads directory synchronously
    const files = fs.readdirSync("uploads/");

    // Process each file asynchronously
    for (const file of files) {
      // Upload file to cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(`uploads/${file}`, {}, (error, result) => {
          if (error) {
            reject(error); // Reject promise if upload fails
          } else {
            resolve(result); // Resolve promise with upload result
          }
        });
      });

      uploadedResults.push(result); // Store upload result
      fs.removeSync(`uploads/${file}`); // Remove file after upload
    }

    // Send response after all files have been processed
    res.status(200).json({
      status: "success",
      message: "Images Uploaded",
      results: uploadedResults
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Images not Uploaded",
      error: error.message // Send error message in response
    });
  }
};

// MULTIPLE IMAGES UPLOAD
// http://localhost:8000/api/upload/multipleImages
export const MultipleUploadImages = async (req, res, next) => {
  try {
    const images = req.files;
    console.log(images);
    const imageUrls = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });
      const { secure_url } = result;
      imageUrls.push(secure_url);

      // Remove uploaded image from local directory
      fs.remove(image.path, (err) => {
        if (err) {
          console.error("Error removing image from directory:", err);
        } else {
          console.log("Image removed from directory:", image.path);
        }
      });
    }

    res.status(200).json({ status: "Successfull", message: "Images uploaded successfully", imageUrls });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({
      message: "Internal server Error",
      error,
      status: "Unsuccessful",
    });
  }
};
