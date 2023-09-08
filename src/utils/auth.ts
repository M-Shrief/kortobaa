import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_PRIVATE } from "../config";

export const hashPassword = async (password: string) => {
  const salt = bcrypt.genSaltSync(); // default 10
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (raw: string, hash: string) =>
  await bcrypt.compare(raw, hash);

export const signToken = (user: any, options?: SignOptions) => {
  return jwt.sign(user, JWT_PRIVATE as string, options);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};

export const verifyToken = (token: string) => {
  return jwt.verify(
    token,
    JWT_PRIVATE as string,
    { algorithms: ["RS256"] },
    // function (err, payload) {
    // if token alg != RS256,  return err == invalid signature
    // }
  );
};
