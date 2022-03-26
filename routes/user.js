const express = require('express');
const userRouter = express.Router();
const {userById, read, update, purchaseHistory} = require('../controllers/user');
const {requireSignin, isAuth, isAdmin} = require('../controllers/auth');


userRouter.get('/secret/:userId',requireSignin, isAuth, isAdmin, (req,res)=>{
    res.json({
        user: req.profile
    })
});

userRouter.get("/user/:userId", requireSignin, isAuth, read);
userRouter.put("/user/:userId", requireSignin, isAuth, update);
userRouter.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory);
userRouter.param('userId', userById);

module.exports = userRouter;