"use strict";
const {errorHandler} = require('../helpers/dbErrorHandler');
const Category = require("../models/Category");
const _ = require("lodash");

exports.categoryById = (req, res, next, id)=>{
    Category.findById(id).exec((err, category)=>{
        if(err || !category){
            res.status(400).json({
                error: "Category not found"
            });
        }

        req.category = category;
        next();
    })
};

exports.read = (req, res)=>{
    return res.json(req.category);
}
exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });
    });
};

exports.remove = (req, res)=>{
    let category = req.category;
    category.remove((err, deletedCategory)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Deleted Successfuly"
        });
    })
};

exports.update = (req, res)=>{
    let category = req.category;
    // category = _.extend(category, req.body); this is one way
    category.name = req.body.name;
    category.save((err, category)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Updated Successfully!",
            category
        })
    });
};

exports.list = (req,res)=>{
    Category.find().exec((err, result)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(result);
    });
};