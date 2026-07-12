const express = require("express");
const { body }= require("express-validator");
const router = express.Router();

const userController = require("../Controller/userController");
const middleWare = require("../Middleware/userMiddleware");


router.post('/signup',
    [
    body("fullname.firstname").trim().isLength({min: 2}).withMessage("First name must be at least 2 letters"),
    body("fullname.lastname").trim().isLength({min: 3}).withMessage("Last name must be at least 3 letters"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({min: 6}).withMessage("Password must be atleast 6 letters"),
    body("avatar").optional().isURL().withMessage("Avatar must be a valid URL")
    ],  
    userController.signUp );

router.post('/login' , [
    body("email").isEmail().withMessage("Please enter valid Email"),
    body("password").isLength({min: 6}).withMessage("Password must be atleast 6 letters")
], userController.login);

router.post('/logout' , middleWare.userAuthentication , userController.logout);

module.exports=router;