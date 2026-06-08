const mongoose = require("mongoose");

const MSGNfySchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    new_msg_from: [
        {
            type: String,
            required: true,
        }
    ]
});

const msgNfy = mongoose.model('messagenotifications', MSGNfySchema)

module.exports = msgNfy;