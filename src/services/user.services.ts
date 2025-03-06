import { envConfig } from "../config/envConfig";
import { ErrorMsgs, SuccessMsgs } from "../enums/common";
import { User } from "../models/user.schema";
import ApiResponse from "../utils/ApiResponse";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const signup = async (body: any, res: any) => {
  try {
    const { firstName, lastName, email, password } = body;
    const userExist = await User.findOne({ email }).exec();

    if (userExist) {
      return res.json(ApiResponse(false, 200, ErrorMsgs.USER_EXIST, null));
    }

    await new User({
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      password,
    }).save();
    return res.json(ApiResponse(true, 200, SuccessMsgs.USER_CREATED, null));
  } catch (error: any) {
    return res.json(ApiResponse(false, 400, error.message + "error", null));
  }
};

const signin = async (body: any, res: any) => {
  try {
    const { email, password } = body;
    const userExist = await User.findOne({ email }).exec();

    if (!userExist) {
      return res.json(ApiResponse(false, 200, ErrorMsgs.USER_NOTFOUND, null));
    }

    const isValid = await validatePassword(password, userExist?.password);

    if (!isValid) {
      return res.json(
        ApiResponse(false, 200, ErrorMsgs.PASSWORD_NOTMATCH, null)
      );
    }

    const tokenData = {
      id: userExist._id,
      email: userExist.email,
    };

    const accessToken = jwt.sign(
      tokenData,
      envConfig.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      tokenData,
      envConfig.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    let respObj = {
      firstName: userExist?.firstName,
      lastName: userExist?.lastName,
      email: userExist?.email,
      accessToken,
      refreshToken,
    };
    return res.json(ApiResponse(true, 200, SuccessMsgs.USER_LOGGEDIN, respObj));
  } catch (error: any) {
    return res.json(ApiResponse(false, 400, error.message + "error", null));
  }
};

const refreshToken = async (body: any, res: any) => {
  try {
    const { refreshToken } = body;
    const response = await generateATfromRT(refreshToken);
    return res.json(response);
  } catch (error: any) {
    return res.json(ApiResponse(false, 400, error.message + "error", null));
  }
};

async function generateATfromRT(refreshToken: string) {
  try {
    const verified: any = jwt.verify(
      refreshToken,
      envConfig.REFRESH_TOKEN_SECRET as string
    );

    if (!verified) {
      return ApiResponse(false, 401, ErrorMsgs.INVALID_REFRESH_TOKEN, null);
    }
    const { iat, exp, ...jwtPayload } = verified;

    const newAccessToken = jwt.sign(
      jwtPayload,
      envConfig.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    const newRefreshToken = jwt.sign(
      jwtPayload,
      envConfig.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    return ApiResponse(true, 200, SuccessMsgs.TOKEN_GENERATED, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error: any) {
    return ApiResponse(false, 401, ErrorMsgs.TOKEN_EXPIRED, null);
  }
}

const validatePassword = async (password: string, dbPassword: string) => {
  return password === dbPassword;
};

const authServices = { signup, signin, refreshToken };
export default authServices;
