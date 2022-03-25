const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressValidator = require('express-validator');
// import routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const braintreeRouter = require("./routes/braintree");
const orderRouter = require("./routes/order");
// app
const app = express();

//db
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true
}).then(()=>console.log("DB Connected"));


// middlewares
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(expressValidator());
app.use(cors());
// routes middleware
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);
app.use("/api", braintreeRouter);
app.use("/api", orderRouter);



app.use((req,res)=>{
    res.status(404).json({
        error: "404 page not found"
    })
})
const port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});



