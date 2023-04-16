import db from "../models";
import bcryptjs from "bcryptjs";

const hashPass = (pass) => {
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(pass, salt);
  return hash;
};

export const register = ({ email, pass }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        where: { email },
        defaults: { email, pass: hashPass(pass) },
      });

      resolve({
        error: response[1] ? 0 : 1,
        message: response[1] ? "register success" : "email already exists",
        response,
      });

      resolve({
        message: "register service",
      });
    } catch (error) {
      reject(error);
    }
  });
