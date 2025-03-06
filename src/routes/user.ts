import express from "express";
import authController from "../controllers/user.controller";
const authRouter = express.Router();

authRouter.post("/register", authController.signup);
authRouter.post("/login", authController.signin);
authRouter.post("/refresh", authController.refreshToken);

export default authRouter;
