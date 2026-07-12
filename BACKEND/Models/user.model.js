const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true
        },

        lastname: {
            type: String,
            required: true
        },
    },

    email: {
        type: String,
        required: true,
        lowerCase: true

    },

    password: {
        type: String,
        require: function(){
            return !this.googleId;
        }
    },

    googleId: {
        type: String,
    },

    avatar: {
        type: String,
        default: ""
    }
},
{
    timestamps: true,
});

userSchema.methods.hassPassword = async function(password){
    return await bcrypt.hash(password, 10);
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = async function(){
    const token = await jwt.sign({_id: this._id}, process.env.key, {expiresIn: "24"} )
    return token;
}

module.exports = userSchema;