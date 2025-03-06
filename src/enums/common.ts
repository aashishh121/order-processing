export enum ErrorMsgs {
  USER_NOTFOUND = "User not found.",
  USER_EXIST = "User already exist",
  PASSWORD_NOTMATCH = "Wrong password, try again",
  SOME_ERR = "Something went wron",
  OLD_NEW_PASSWRD = "Old and new passwrod can not be same",
  OLD_PASSWORD = "Wrong old password",
  INVALID_REFRESH_TOKEN = "Invalid refresh token!",
  INVALID_ACCESS_TOKEN = "Invalid access token!",
  TOKEN_EXPIRED = "Token expired or invalid!",
}

export enum SuccessMsgs {
  USER_FOUND = "User found.",
  USER_LOGGEDIN = "User logged in successfully",
  USER_CREATED = "User created successfully",
  ORDER_CREATED = "Order created successfully",
  PASSWORD_UPDAE = "Password updated successfully",
  USER_UPDATED = "User updated successfully",
  TOKEN_GENERATED = "Token generated successfully!",
}
