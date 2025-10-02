// import dotenv from "dotenv";
// import connectDB from "./db/index.js";
// import express from "express";


// dotenv.config({ path: `./env` });

// const app = express(); //  This was missing

// connectDB()
//   .then(() => {
//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`server is running at port : ${process.env.PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log("mongo db connection failed !!! ", error);
//   });
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js"; //  Correct import

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(` Server is running at port: ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log(" MongoDB connection failed:", error);
  });