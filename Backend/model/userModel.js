const mongoose = require("mongoose");

//Define Schema
const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        unique : true,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        default : "user"
    },
    connection:{
        type: Array,
        default : [],
    },
});

//Create Model
const User = mongoose.model('User', userSchema);

module.exports = User;