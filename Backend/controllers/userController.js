const User = require("../model/userModel.js");
//const { userRouter } = require("../routes/userRoutes.js");
const { setUser, getUser } = require("../services/auth.js");
const { getChatId } = require("../services/chatServices.js");
const MSG = require("../model/msgModel.js");

async function handleUserLogIn(req, res) {
    const DATA = req.body;
    const userData = await User.findOne({
        userName: DATA.name,
        password: DATA.passWord,
    });
    if (!userData) {
        return res.status(400).json({ msg: 'User not found' });
    }
    const token = setUser(userData);
    if (!token) {
        return res.status(400).json({ msg: 'token not generated @controler' });
    }
    res.cookie("uid", token, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
    });
    return res.status(200).json({
        msg: 'login completed',
        userData: userData,
    });
}

async function handleUserLogOut(req, res) {
    try {

        res.clearCookie("uid", {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
        });

        return res.status(200).json({
            msg: "Logout Successful"
        });

    } catch (error) {

        console.log("Logout Error:", error);

        return res.status(500).json({
            msg: "Internal Server Error"
        });

    }
}

async function handleUserSignUp(req, res) {
    const DATA = req.body;
    const result = await User.create({
        userName: DATA.name,
        password: DATA.password,
    });
    return res.status(200).json({ msg: 'singup completed' });
}

async function connectionReqHandling(req, res) {
    const data = req.body;
    const { usertoken, receiver } = data;
    const userData = getUser(usertoken);
    const userId = userData.userName;

    const user = await User.findOne({ userName: userId });
    const receiverData = await User.findOne({ userName: receiver });

    try {
        if (!user || !receiverData) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (user.userName === receiverData.userName ||
            user.connection.includes(receiverData.userName) ||
            user.userName === null || receiverData.userName === null) {
            console.log("Users new connection request is blocked");
            return res.status(400).json({
                message: "Cannot connect"
            });
        } else {
            if (user && receiverData) {
                user.connection.push(receiver);;
                receiverData.connection.push(userId);
                await user.save();
                await receiverData.save();

                //Storing ChatID
                chatID = getChatId(userId, receiver);
                const msgRes = await MSG.create({
                    chat_id:chatID,
                    chatData:[
                    {
                        from:userId,
                        to:receiver,
                        msg:"Connected to you",                    
                    }
                ]});

                return res.status(200).json({
                    message: "Connection created"
                });
            } else {
                console.log("Error in finding users");
                return res.status(400).json({
                    message: "Cannot connect"
                });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

async function getUserData(req, res) {
    const token = req.query.token;
    const tokenData = getUser(token);
    const data = await User.findOne({ userName: tokenData.userName });
    if (data) {
        return res.json({ "data": data });
    } else {
        console.log("Error@121");
    }
}

async function getAllUsers(req, res) {
    const data = await User.find({});
    const userNames = data.map(user => user.userName);
    if (data) {
        return res.json({ "data": userNames })
    } else {
        return res.json({ "data": "Error in finding People" });
    }
}

module.exports = {
    handleUserLogIn,
    handleUserLogOut,
    handleUserSignUp,
    connectionReqHandling,
    getUserData,
    getAllUsers,
}
