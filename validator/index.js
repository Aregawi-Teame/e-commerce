/**
 * index.js
 * @author Aregawi T. Arefe
 * @since 03-18-2022
 */
"use strict";
const userSignUpValidator = (()=>{
    const userValidator = (req, res, next) =>{
        req.check('name', 'Name is required').notEmpty();
        req.check('email', "Email must be between 3 to 32 characters")
            .matches(/.+\@.+\..+/)
            .withMessage("Email must contain @")
            .isLength({
                min: 4,
                max: 32
            });
            req.check('password', 'Password is required').notEmpty();
            req.check('password')
                .isLength({min: 6})
                .withMessage('Password must contain at least 6 characters')
                .matches(/\d/)
                .withMessage('Password must contain a number');
    
                const errors = req.validationErrors();
                if(errors){
                    console.log(errors);
                    const firstError = errors.map(error=>error.msg)[0];
                    console.log(firstError);
                    return res.status(400).json({error: firstError});
                }
                next();
    };
    return{
        userValidator:userValidator
    }
})();

module.exports = userSignUpValidator;
