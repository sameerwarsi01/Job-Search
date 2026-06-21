const mongoose = require("mongoose");

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.dburl ,{
            serverSelectionTimeoutMS : 15000,
        }),
        console.log("mongoose connected");
    }
    catch(err) {
        console.log(err);
        process.exit(1);
    }

}

module.exports = connectDb;