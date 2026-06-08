const express = require("express");
const {
    handleUserLogIn,
    handleUserLogOut,
    handleUserSignUp,
    connectionReqHandling,
    getUserData,
    getAllUsers,
} = require("../controllers/userController.js");

const userRouter = express.Router();

userRouter.post("/signup", handleUserSignUp);
userRouter.post("/login", handleUserLogIn);
userRouter.get("/logout", handleUserLogOut);
userRouter.post("/connect", connectionReqHandling);
userRouter.get("/getUserData", getUserData);
userRouter.get("/getAllUsers", getAllUsers);

module.exports = {
    userRouter,
}
