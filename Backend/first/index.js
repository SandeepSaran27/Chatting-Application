const mongoose = require("mongoose");
const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const MSG = require("../model/msgModel.js");
const User = require("../model/userModel.js");
const { getUser } = require("../services/auth.js")
const { getChatId } = require("../services/chatServices.js");
const { msgRouter } = require("../routes/msgRoutes.js");
const { userRouter } = require("../routes/userRoutes.js");
const { addNewNotification } = require("../controllers/msgController.js");
const { connectDB } = require("./connectMongoose.js");
const onlineUsers = new Map();

const app = express();
const server = http.createServer(app);
const allowedOrigins = process.env.FRONTEND_WEBSITE_URL.split(",").map(origin => origin.trim());

console.log("Origins:", allowedOrigins);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

connectDB(process.env.MONGODBURL);
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

io.on('connection', (socket) => {
    console.log("A new user connected:", socket.id);
    let userIdGolbal;
    socket.on("updateOnlineStatus", (userIdToken) => {
        try {
            userId = getUser(userIdToken).userName;
            userIdGolbal = userId;
            onlineUsers.set(userId, socket.id);
            console.log("onlineUsers", onlineUsers);
        } catch (err) {
            console.log("Error @92:", err);
        }
    })

    socket.on("sendmessage", async (data) => {
        try{
        const { userId, receiverId, msg } = data;
        const senderId = userId
        const senderSocketId = onlineUsers.get(senderId);
        const receiverSocketId = onlineUsers.get(receiverId);
        const chatId = getChatId(senderId, receiverId);
        const msgResponse = await MSG.findOneAndUpdate(
            {
                chat_id: chatId,
            },
            {
                $push: {
                    chatData: {
                        from: senderId,
                        to: receiverId,
                        msg: msg
                    }
                }
            },
            {
                new: true,
                //upsert: true
            }
        );
        console.log("senderId", senderId);
        console.log("receiverId", receiverId);
        console.log("senderSocketId:", senderSocketId);
        console.log("receiverSocketId:", receiverSocketId);

        await addNewNotification(senderId, receiverId);       

        //io.to(receiverId).emit("updatenotification");
        io.to(receiverSocketId).emit("updatenotification");
        io.to(senderSocketId).emit("receivemessage", msgResponse);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receivemessage", msgResponse);
        }
        }catch(err){
            console.log("Error at sendMsg:", err);
            //return res.json({msg : "Error in sendMsg"});
        }
    });

    socket.on('disconnect', () => {
        onlineUsers.delete(userIdGolbal);
        console.log("onlineUsers", onlineUsers);
        console.log("User Disconnected");
    });
});

app.get("/", (req, res) => { 
    return res.json({msg : "Server says hii" }) 
});
app.use("/msg", msgRouter);
app.use("/user", userRouter);

server.listen(process.env.PORT || 8000, () => {
    console.log("Server connected");
})
