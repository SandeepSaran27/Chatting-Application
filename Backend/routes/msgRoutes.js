const express = require("express");
const {
    getChatof,
    addNewNotification,
    removeNewNotification,
    getAllNotifications,
    getAllLastMessages
} = require("../controllers/msgController.js");

const msgRouter = express.Router();

msgRouter.post("/getChat", getChatof);
msgRouter.post("/addNewMsgNotificationStatus", addNewNotification);
msgRouter.post("/removeNewMsgNotificationStatus", removeNewNotification);
msgRouter.post("/getNotifications", getAllNotifications);
msgRouter.post("/getLastMessages", getAllLastMessages);

module.exports = {
    msgRouter,
}