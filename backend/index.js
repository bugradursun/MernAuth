import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import path from "path";

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
//to deploy our app
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
//deploy our app
//with using render.com we can deploy our application with connecting via github
app.use(express.json());

app.use(cookieParser());

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});

app.use("/backend/user", userRoutes);
app.use("/backend/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
