const express = require('express');
const authRouter = express.Router();
const {signup, signin, signout} = require('../controllers/auth');
const userSignupValidator  = require("../validator");


authRouter.post("/signup", userSignupValidator.userValidator ,signup);

authRouter.post("/signin" ,signin);
authRouter.get("/signout" ,signout);

module.exports = authRouter;