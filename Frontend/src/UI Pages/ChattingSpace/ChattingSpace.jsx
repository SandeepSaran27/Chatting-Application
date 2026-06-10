import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import socket from '../OtherPages/socketConnection.jsx';
import style from './ChattingSpace.module.css';

const BACKEND_SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

function ChattingSpace() {
    const [chatsData, setChatsData] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const receiver = searchParams.get("receiver");

    useEffect(() => {
        async function removeNfy() {
            const response = await fetch(
                `${BACKEND_SERVER_URL}msg/removeNewMsgNotificationStatus`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        from: receiver,
                    }),
                }
            );

            const data = await response.json();
            console.log(data);
        }
        removeNfy();
    }, [chatsData]);

    useEffect(() => {
        async function getChatsData() {
            const res = await fetch(
                `${BACKEND_SERVER_URL}msg/getChat`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        receiverId: receiver,
                    }),
                }
            );
            const resData = await res.json();
            setChatsData(resData.data);
        }
        getChatsData();
    }, []);

    useEffect(() => {
        socket.on("receivemessage", (msg) => {
            console.log("msg", msg);
            setChatsData(msg);
        });
        return () => {
            socket.off("receivemessage");
        };
    }, [chatsData]);

    async function sendMsg() {
        //const userID = document.cookie.slice(4);
         const res = await fetch(
                `${BACKEND_SERVER_URL}user/getUserData`,
                {
                    credentials: "include",
                }
            );
        const data = await res.json();
        //console.log("res", res);
        console.log("Data object at send msg", data);
        console.log("data.data.userName", data.data.userName);
        const userId = data.data.userName;
        socket.emit("sendmessage", {
            userId: userId,
            receiverId: receiver,
            msg: message,
        });
        setMessage("");
    }
    return (
        <div className={style.chatContainer}>
            {/* Top Navigation Row */}
            <div className={style.topNav}>
                {/* Left Side Group: Controls, Avatar, Name & Status */}
                <div className={style.navLeft}>
                    <button className={style.backBtn} onClick={() => navigate('/home')} title="Back to home">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>

                    <div className={style.friendAvatar}>
                        {receiver ? receiver.charAt(0).toUpperCase() : 'F'}
                    </div>

                    <div className={style.metaData}>
                        <h2 className={style.friendName}>{receiver}</h2>
                        <p className={style.descriptionText}>Message yourself</p>
                    </div>
                </div>

                {/* Right Side Group: Three Vertical Dots Option Menu Icon */}
                <button className={style.menuBtn} title="More options">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                </button>
            </div>

            {/* Scrollable Core Message Feed Panel Container */}
            <div className={style.messageFeed}>
                {chatsData?.chatData?.map((chat, index) => {
                    const isFromReceiver = chat.from === receiver;
                    return (
                        <div
                            key={index}
                            className={style.messageRow}
                            style={{ justifyContent: isFromReceiver ? "flex-start" : "flex-end" }}
                        >
                            <p className={`${style.bubble} ${isFromReceiver ? style.incoming : style.outgoing}`}>
                                {chat.msg}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Lower Control Input Interface Bar */}
            <div className={style.inputBar}>
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={style.messageInput}
                    onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                />
                <button onClick={() => sendMsg()} className={style.sendBtn} title="Send Message">
                    {/* Enlarged send arrow icon with balanced stroke lines */}
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    );

}

export default ChattingSpace
