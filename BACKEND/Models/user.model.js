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
        lowercase: true

    },

    password: {
        type: String,
        required: function(){
            return !this.googleId;
        }
    },

    googleId: {
        type: String,
    },

    avatar: {
        type: String,
        default: ""
    },

    stream: {
        type: String,
        enum: [
            "software_it",
            "marketing",
            "finance_accounting",
            "human_resources",
            "design_creative",
            "sales_business",
            "general",
        ],
        default: "software_it",
    },
    
    resumeInfo: {
        fileName: { type: String, default: "" },
        uploadedAt: { type: Date },
        skills: [{ type: String }],
        extractedEmail: { type: String, default: "" },
        extractedPhone: { type: String, default: ""},
        rawSummary: { type: String, default: "" },
    },

    jobAlertsEnabled: {
        type: Boolean,
        default: true,
    },

    isPro: {
        type: Boolean,
        default: false,
    },

    subscriptionPlan: {
        type: String,
        enum: ["free", "pro"],
        default: "free",
    },

    subscriptionExpiresAt: {
        type: Date,
        default: null,
    },
},
{
    timestamps: true,
});

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.key,
        { expiresIn: "24h" }
    );
};

const User = mongoose.model("User", userSchema);

module.exports = User;