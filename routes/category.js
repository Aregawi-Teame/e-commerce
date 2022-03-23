const express = require('express');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const categoryRouter = express.Router();
const {create, read, remove, update, categoryById, list} = require('../controllers/category');
const {userById} = require("../controllers/user");

categoryRouter.post("/category/create/:userId", requireSignin,isAuth,isAdmin,create);
categoryRouter.get("/category/:categoryId", read);
categoryRouter.delete("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, remove);
categoryRouter.put("/category/:categoryId/:userId", requireSignin,isAuth,isAdmin,update);
categoryRouter.get("/categories", list);

categoryRouter.param("userId", userById);
categoryRouter.param("categoryId", categoryById);

module.exports = categoryRouter;