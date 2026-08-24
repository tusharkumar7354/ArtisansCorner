require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/DB");

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {
        await connectDB();
        app.listen(PORT, () => {
            // console.log("=============================================================");
            console.log(`Artisan's Corner Server Running On http://localhost:${PORT}`);
            // console.log("=============================================================");
        });
    } catch (error) {
        console.log(error.message);
    }
};
startServer();
