const express = require('express');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const productRouter = express.Router();
const {create, productById, read, remove, update, list, listRelated, listCategories,listBySearch, photo} = require('../controllers/product');
const {userById} = require("../controllers/user");

productRouter.get("/product/:productId", read);
productRouter.post("/product/create/:userId", requireSignin,isAuth,isAdmin,create);
productRouter.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, remove);
productRouter.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, update);
productRouter.get("/products", list);
productRouter.get("/products/related/:productId", listRelated);
productRouter.get("/products/categories", listCategories);
productRouter.post("/products/by/search", listBySearch);
productRouter.get("/product/photo/:productId", photo);


productRouter.param("userId", userById);
productRouter.param("productId", productById);

module.exports = productRouter;