import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./Routes/authRoute.js";
import residentRoutes from "./Routes/residentRoute.js";
import otpRoute from "./Routes/otpRoute.js";
import familyRoutes from "./Routes/familyRoute.js";
import logRoute from "./Routes/logRoute.js";
import notesRoute from "./Routes/NotesRoute.js";
// import fileUpload from "express-fileupload";
import uploadRoute from "./Routes/uploadRoute.js";
import careManagerRoute from "./Routes/CareMangerRoutes.js";
import adminRoutes from "./Routes/adminRoute.js";
import playlistRoute from "./Routes/playlistRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("common"));
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
// app.use(fileUpload({ useTempFiles: true }));

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/otp", otpRoute);
app.use("/api/resident", residentRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/log", logRoute);
app.use("/api/notes", notesRoute);
app.use("/api/search", careManagerRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/playlist", playlistRoute);

const BackendConnect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("BackEnd Connected");
    })
    .catch((error) => {
      throw error;
    });
};

app.listen(process.env.PORT, () => {
  BackendConnect();
  console.log(`Server listening on this ${process.env.PORT}`);
});

//Error middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  const errorStack = err.stack || "No stack trace available"; // Added to handle cases where stack trace is not provided

  // Log error to console for debugging purposes
  console.error("Error:", errorMessage);
  console.error("Stack trace:", errorStack);

  // Return error response to client
  return res.status(errorStatus).send({
    status: "failed", // Corrected spelling
    errorStatus: errorStatus,
    message: errorMessage,
    stack: errorStack,
  });
});
