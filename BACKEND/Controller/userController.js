const userService = require("../Services/useService");

const { validationResult } = require("express-validator");


const blacklistToken = require("../Models/blaclistToken.model");

module.exports.signUp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
            errors: errors.array()
            });
        }
        const { fullname, email, password } = req.body;

        const user = await userService.createUser({
            fullname,
            email,
            password
        });

        const token = user.generateToken();

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false,      // true in production with HTTPS
            sameSite: "lax"
        });

        res.status(201).json({
            message: "User registered successfully",
            user,
            token
        });

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};


module.exports.login = async (req,res) =>{
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                 errors: errors.array()
            });
        };

        const {email , password} = req.body;

        const user = await userService.login({
            email,
            password
        });

        const token =await user.generateToken();

        res.cookie("token", token , {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false,      // true in production with HTTPS
            sameSite: "lax"
        });

        res.status(201).json({
            message: "Login Succesfull",
            user,
            token
        });
    }
    catch(err){
        res.status(400).json({
            message: err.message
        });
    };
}

module.exports.logout = async (req, res) =>{
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        
        if(!token){
            return res.status(401).json({
                message : "No token Found"
            })
        }

        await blacklistToken.create({
            token
        });

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(400).json({
            message: "Logout Succesfull"
        });
    }
    catch (err){
        return res.status(401).json({
            message: "Invalid Token"
        });
    }
}