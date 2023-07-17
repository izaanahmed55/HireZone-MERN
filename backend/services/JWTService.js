import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/index.js";
import RefreshToken from "../models/token.js";

export function signAccessToken(payload, expiryTime) {
   return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: expiryTime });
}

export function signRefreshToken(payload, expiryTime) {
   return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: expiryTime });
}

export function verifyAccessToken(token) {
   return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token) {
   return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

export async function storeRefreshToken(token, userId) {
   try {
      const newToken = new RefreshToken({
         token: token,
         userId: userId,
      });

      // store in db
      await newToken.save();
   } catch (error) {
      console.log(error);
   }
}
