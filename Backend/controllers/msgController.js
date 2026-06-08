const { getUser } = require("../services/auth.js");
const { getChatId } = require("../services/chatServices.js");
const MSG = require("../model/msgModel.js");
const msgNfy = require("../model/newMsgNfyModel.js");
const User = require("../model/userModel.js");

async function getChatof(req, res) {
    const receiverId = req.body.receiverId;
    const token = req.cookies.uid;
    const userName = getUser(token).userName;
    const chatId = getChatId(userName, receiverId);
    const data = await MSG.findOne({ chat_id: chatId });
    if (data) {
        return res.json({ data });
    } else {
        console.log("Error in sending chat data@122");
    }
}

async function addNewNotification(senderId, receiverId) {

    const userId = receiverId;
    const fromId = senderId;

    const user = await msgNfy.findOne({ user_id: userId });
    if (user) {
        if (!user.new_msg_from.includes(fromId)) {
            user.new_msg_from.push(fromId);
            await user.save();
        }
    } else {
        await msgNfy.create({
            user_id: userId,
            new_msg_from: [fromId],
        })
    }
    console.log("Notification updated");
}

async function removeNewNotification(req, res) {
    const token = req.cookies.uid;
    const data = req.body;
    const userId = getUser(token).userName;
    console.log("userId in removing notification", userId);
    const fromId = data.from;
    try {
        const user = await msgNfy.findOne({ user_id: userId });
        if (user) {
            if (user.new_msg_from.includes(fromId)) {
                user.new_msg_from = user.new_msg_from.filter(
                    id => id !== fromId
                );

                await user.save();
            }
            return res.status(200).json({
                message: "Notification deleted",
            })
        } else {
            return res.json({
                message: "User not found",
            })
        }
    } catch (err) {
        console.log("Error at Remove notification:", err);
        return res.status(400).json({
            message: "Error",
        })
    }
}

async function getAllNotifications(req, res) {
    try {
        const token = req.cookies.uid;
        const userId = getUser(token).userName;
        console.log("userId in nfy:", userId);
        const user = await msgNfy.findOne({ user_id: userId });
        if (!user) {
            return res.json({
                new_msg_from: []
            })
        }
        return res.status(200).json({ new_msg_from: user.new_msg_from });
    } catch (err) {
        console.log("Error in nfy:", err);
    }
}

async function getAllLastMessages(req, res) {
    try {
        const token = req.cookies.uid;
        console.log("req.cookies", req.cookies);
        console.log("token", token);
        const userId = getUser(token).userName;
        console.log("getAllLastMessages userID", userId)
        const user = await User.findOne({ userName: userId });
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        let lastMessages = [];
        const friends = user.connection;
        for (let i = 0; i < friends.length; i++) {
            const chat_id = getChatId(friends[i], userId);
            const msgs = await MSG.findOne({ chat_id });

            let msgObject = {
                from: friends[i],
                lastMsg: msgs.chatData[msgs.chatData.length - 1],
            }

            lastMessages.push(msgObject);
        }
        return res.status(200).json({ data: lastMessages });
    } catch (err) {
        console.log("Error in nfy:", err);
        return res.status(400).json({ msg: "Bad request" });
    }
}

module.exports = {
    getChatof,
    addNewNotification,
    removeNewNotification,
    getAllNotifications,
    getAllLastMessages,
}
