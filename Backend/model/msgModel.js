const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
    chat_id: {
        type: String,
        required: true,
    },
    chatData: [
        {
            from: {
                type: String,
                required: true,
            },
            to: {
                type: String,
                required: true,
            },
            msg: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }
    ]

});

const MSG = mongoose.model("MSG", msgSchema);
module.exports = MSG;