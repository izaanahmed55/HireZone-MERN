import Joi from "joi";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import UserDTO from "../dto/user.js";
import JWTService from "../services/JWTService.js";
import RefreshToken from "../models/token.js";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const register = async (req, res, next) => {
   const userRegisterSchema = Joi.object({
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      // confirmPassword: Joi.ref("password"),
   });
   const { error } = userRegisterSchema.validate(req.body);

   if (error) {
      return next(error);
   }

   const { name, email, password } = req.body;

   try {
      const emailInUse = await User.exists({ email });

      if (emailInUse) {
         const error = {
            status: 409,
            message: "Email already registered, use another email!",
         };

         return next(error);
      }
   } catch (error) {
      return next(error);
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   let accessToken;
   let refreshToken;

   let user;

   try {
      const userToRegister = new User({
         email,
         name,
         password: hashedPassword,
      });

      user = await userToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");

      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
   } catch (error) {
      return next(error);
   }

   // store refresh token in db
   await JWTService.storeRefreshToken(refreshToken, user._id);

   // send tokens in cookie
   res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
   });

   res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
   });

   const userDto = new UserDTO(user);

   return res.status(201).json({ user: userDto, auth: true });
};

const login = async (req, res, next) => {
   const userLoginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      // password: Joi.string().pattern(passwordPattern),
   });

   const { error } = userLoginSchema.validate(req.body);

   if (error) {
      return next(error);
   }

   const { email, password } = req.body;

   let user;

   try {
      user = await User.findOne({ email: email });

      if (!user) {
         const error = {
            status: 401,
            message: "Invalid Email",
         };

         return next(error);
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
         const error = {
            status: 401,
            message: "Invalid password",
         };

         return next(error);
      }
   } catch (error) {
      return next(error);
   }

   const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
   const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

   // update refresh token in database
   try {
      await RefreshToken.updateOne(
         {
            _id: user._id,
         },
         { token: refreshToken },
         { upsert: true }
      );
   } catch (error) {
      return next(error);
   }

   res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
   });

   res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
   });

   const userDto = new UserDTO(user);

   return res.status(200).json({ user: userDto, auth: true });
};
const logout = async (req, res, next) => {
   // 1. delete refresh token from db
   const { refreshToken } = req.cookies;

   try {
      await RefreshToken.deleteOne({ token: refreshToken });
   } catch (error) {
      return next(error);
   }

   // delete cookies
   res.clearCookie("accessToken");
   res.clearCookie("refreshToken");

   // 2. response
   res.status(200).json({ user: null, auth: false });
};

const refreshToken = async (req, res, next) => {
   const originalRefreshToken = req.cookies.refreshToken;

   let id;

   try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
   } catch (e) {
      const error = {
         status: 401,
         message: "Unauthorized",
      };

      return next(error);
   }

   try {
      const match = RefreshToken.findOne({
         _id: id,
         token: originalRefreshToken,
      });

      if (!match) {
         const error = {
            status: 401,
            message: "Unauthorized",
         };

         return next(error);
      }
   } catch (e) {
      return next(e);
   }

   try {
      const accessToken = JWTService.signAccessToken({ _id: id }, "30m");

      const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      res.cookie("accessToken", accessToken, {
         maxAge: 1000 * 60 * 60 * 24,
         httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
         maxAge: 1000 * 60 * 60 * 24,
         httpOnly: true,
      });
   } catch (e) {
      return next(e);
   }

   const user = await User.findOne({ _id: id });

   const userDto = new UserDTO(user);

   return res.status(200).json({ user: userDto, auth: true });
};

export default { register, login, logout, refreshToken };
