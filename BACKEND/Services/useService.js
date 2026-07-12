const User= require("../Models/user.model");
const bcrypt = require("bcrypt");

module.exports.createUser = async ({fullname , email , password}) =>{
    const userExist = await User.findOne({email});

    if(userExist){
        throw new Error("User already Exist");
    }

    const hashPassword= await User.hashPassword(password);

    const user = await User.create({
        fullname,
        email,
        password: hashPassword
    });
    return user;
} 


module.exports.login = async ({email , password}) =>{
    const ExistUser = await User.findOne({email});

    if(!ExistUser){
        throw new Error("There is no such user");
    }

    const compare= await ExistUser.comparePassword(password);

    if(!compare){
        throw new Error("Wrong Password");
    }

    return ExistUser;
}