import authServices from "../services/user.services";

const signup = (req: any, res: any) => {
  authServices.signup(req.body, res);
};
const signin = (req: any, res: any) => {
  authServices.signin(req.body, res);
};
const refreshToken = (req: any, res: any) => {
  authServices.refreshToken(req.body, res);
};

const authController = { signup, signin, refreshToken };
export default authController;
