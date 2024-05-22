import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.MONGO;
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MONGO");
  })
  .catch((err) => {
    console.log("err while connecting", err);
  });

const app = express();

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
