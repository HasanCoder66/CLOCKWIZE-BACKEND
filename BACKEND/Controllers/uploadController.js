import fs from "fs-extra";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
// import PhotoModel from "../Models/PhotosModel.js"; // Import your photo model

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadImages = async (req, res, next) => {
  try {
    fs.readdirSync("uploads/").forEach((file) => {
      cloudinary.v2.uploader.upload(
        `uploads/${file}`,
        {},
        async (error, result) => {
          if (error) {
            return res.status(400).json({
              message: error,
            });
          }
          const { url } = result;

          // // Create a new photo document and push the URL into the photos array
          // try {
          //   const newPhoto = new PhotoModel({
          //     photos: [url], // Assuming you want to store a single URL for each photo document
          //     albumName: 'New Folder', // You can change this default value if needed
          //   });
          //   await newPhoto.save();
          //   console.log("Image URL saved to MongoDB:", url);
          // } catch (error) {
          //   console.error("Error saving image URL to MongoDB:", error);
          // }

          fs.remove(`uploads/${file}`, (err) => {
            if (err) return console.error(err);
            console.log("success");
          });

          res.status(200).send({
            status: "success",
            message: "image Uploaded",
            result: url,
          });
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

// MULTIPLE IMAGES UPLOAD
// http://localhost:8000/api/upload/multipleImages
// export const MultipleUploadImages = async (req, res, next) => {
//   try {
//     const images = req.files;
//     console.log(images);
//     const imageUrls = [];

//     for (const image of images) {
//       const result = await cloudinary.uploader.upload(image.path, {
//         resource_type: "auto",
//       });
//       const { secure_url } = result;
//       imageUrls.push(secure_url);
//     }

//     req.images = imageUrls;
//     res
//       .status(200)
//       .json({ message: "Images uploaded successfully", imageUrls });
//   } catch (error) {
//     res.status(500).send({
//       message: "Internal server Error",
//       error,
//       status: "Unsuccessful",
//     });
//   }
// };




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

    res.status(200).json({ message: "Images uploaded successfully", imageUrls });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({
      message: "Internal server Error",
      error,
      status: "Unsuccessful",
    });
  }
};
