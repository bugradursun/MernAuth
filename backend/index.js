import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const connectionString = process.env.MONGO;
console.log("con string:", connectionString);
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MONGO");
  })
  .catch((err) => {
    console.log("err while connecting", err);
  });

const app = express();
app.use(express.json());

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});

app.use("/backend/user", userRoutes);
app.use("/backend/auth", authRoutes);
