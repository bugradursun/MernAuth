import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfuly" });
  } catch (error) {
    next(error); // middleware
  }
};

//next is used for handling the error
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email }); //from database
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "wrong credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  //name,email,photo from req.body
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      //if user already exists => create token and login
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    } else {
      //if the user does not exist => create password,username and save, create token
      const generatedPassword = Math.random().toString(36).slice(-8); // 8 digits random password
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 1000)
            .toString(36)
            .slice(-8),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * https://tugrulbayrak.medium.com/jwt-json-web-tokens-nedir-nasil-calisir-5ca6ebc1584a
 * authentication : kimlik dogrulama
 * authorization:sisteme giris icin yetki kontrolu
 * Bir kez authentication yapıldıktan sonra atılan her istekte authorization işlemi yapilir
 * JWT: Json web token is an open standart compact and selfcontained way
 * for securely transmitting information between parties as a JSON object
 *
 */

//signin:
// 1)send email and password as req
// 2)fetch validUser from db, fetch password
// 3)compare validPassword with crypted password
// 4) create token
