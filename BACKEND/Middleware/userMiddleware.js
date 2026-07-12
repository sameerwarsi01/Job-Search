const jwt = require("jsonwebtoken");
const blacklistToken = require("../Models/blaclistToken.model");
const UserModel = require("../Models/user.model");

module.exports.userAuthentication = async (req, res, next) => {
    try {

        const token =
            req.cookies.token ||
            req.headers.authorization?.split(" ")[1];


        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const isBlacklisted = await blacklistToken.findOne({ token });

        if (isBlacklisted) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(token, process.env.Key);

        const user = await UserModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({
            message: "Unauthorized"
        });

        res.user = user;
    }

        next();

    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Invalid Token"
        });
    }
};