const dns = require("dns");
const mongoose = require("mongoose");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("==================================");
        console.log("MongoDB Connected Successfully...");
        console.log("==================================");
        console.log(`Host : ${conn.connection.host}`);
        console.log(`Database : ${conn.connection.name}`);
        console.log("MongoDB Connected:", conn.connection.host);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;