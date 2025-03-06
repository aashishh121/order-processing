import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse";
import { envConfig } from "../config/envConfig";
import { ErrorMsgs } from "../enums/common";

export const validateAuth = (req: any, res: any, next: any) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.json(
        ApiResponse(false, 401, "Access Denied. No token provided.", null)
      );
    }

    const bearerToken = token.split(" ")[1];

    const verified: any = jwt.verify(
      bearerToken,
      envConfig.ACCESS_TOKEN_SECRET!
    );
    if (!verified) {
      res.json(ApiResponse(false, 401, ErrorMsgs.INVALID_ACCESS_TOKEN, null));
    }
    next();
  } catch (error) {
    console.error(error);
    return res.json(
      ApiResponse(false, 401, ErrorMsgs.INVALID_ACCESS_TOKEN, null)
    );
  }
};
