const mongoose = require("mongoose");

async function connectDB(URL) {
    try {
        await mongoose.connect(URL);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Connection Error:", error);
    }
}

module.exports = {
    connectDB
};