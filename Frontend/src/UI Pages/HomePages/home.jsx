import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import socket from '../OtherPages/socketConnection.jsx';
import style from './Home.module.css';

const BACKEND_SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

function HomePage() {

    const [userData, setUserData] = useState(null);
    const [newMsgFrom, setnewMsgFrom] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getLastMsg() {
            const response = await fetch(
                `${BACKEND_SERVER_URL}msg/getLastMessages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userIdToken: document.cookie.slice(4),
                    }),
                }
            );

            const data = await response.json();
            console.log("LastMsg:", data.data);
            setLastMessages(data.data);
        }
        getLastMsg();
    }, []);

    useEffect(() => {
        async function getUserData() {
            const UID = document.cookie.slice(4);
            const res = await fetch(`${BACKEND_SERVER_URL}user/getUserData?token=${UID}`);
            const resData = await res.json();
            console.log("userData", resData.data);
            setUserData(resData.data);
        }
        getUserData();
    }, []);

    useEffect(() => {
        if (userData && userData.connection) {
            if (userData.connection?.length === 0) {
                navigate('/newpeople');
            }
        }
    }, [navigate, userData])

    useEffect(() => {        
        async function getAllNotifications() {
            const response = await fetch(
                `${BACKEND_SERVER_URL}msg/getNotifications`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userIdToken: document.cookie.slice(4),
                    }),
                }
            );

            const data = await response.json();
            console.log("newMsgFrom", data.new_msg_from);

            /*setnewMsgFrom((prev) => [
                ...prev,
                data.new_msg_from
            ]);*/
            console.log("newMsgFrom", data.new_msg_from);
            setnewMsgFrom(data.new_msg_from);
        }

        socket.on("updatenotification", getAllNotifications);
        getAllNotifications();
        return () => {
            socket.off("updatenotification", getAllNotifications);
        };
    }, []);

    useEffect(() => {
        const userIdToken = document.cookie.slice(4);
        socket.emit("updateOnlineStatus", userIdToken);
        socket.on("receivemessage", async (msg) => {
            console.log("msg", msg);
            const lastMessage = msg.chatData[msg.chatData.length - 1];
            setnewMsgFrom((prev) => [
                ...prev,
                lastMessage.from
            ]);
            //console.log("lastMessage.from", lastMessage.from)
        });
        return () => {
            socket.off("receivemessage");
        };
    }, []);

    async function openChatOf(person) {
        const response = await fetch(
            `${BACKEND_SERVER_URL}msg/removeNewMsgNotificationStatus`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userIdToken: document.cookie.slice(4),
                    from: person,
                }),
            }
        );

        const data = await response.json();
        console.log(data);

        navigate(`/mainChattingSpace?receiver=${person}`);
    }

    return (
        <div className={style.pageWrapper}>

            {/* Header */}
            <div className={style.mainHeader}>
                <div className={style.headerLeft}>
                    <div className={style.userAvatar}>
                        {userData?.userName
                            ? userData.userName.charAt(0).toUpperCase()
                            : "U"}
                    </div>

                    <h1 className={style.title}>Chats</h1>
                </div>

                {/* Edit Profile Button */}
                {/* /editprofile */}
                <Link to="/underdevelopement" className={style.addFriendBtn}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                </Link>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search"
                className={style.searchBar}
            />

            {/* Friends */}
            <div className={style.friendList}>
                {userData &&
                    userData.connection &&
                    userData.connection.map((person) => {
                        const isNewMsg = newMsgFrom.includes(person);

                        const lastMsgObj = lastMessages.find(
                            (msg) => msg.from === person
                        );

                        const lastMessageText =
                            lastMsgObj?.lastMsg?.msg ||
                            "No previous messages";

                        return (
                            <div
                                key={person}
                                onClick={() => openChatOf(person)}
                                className={style.friendItem}
                            >
                                {/* Avatar */}
                                <div className={style.friendAvatar}>
                                    {person.charAt(0).toUpperCase()}
                                </div>

                                {/* Name + Message */}
                                <div className={style.textContainer}>
                                    <p
                                        className={`${style.friendName} ${isNewMsg
                                            ? style.nameUnread
                                            : style.nameRead
                                            }`}
                                    >
                                        {person}
                                    </p>

                                    <p
                                        className={`${style.messageText} ${isNewMsg
                                            ? style.msgUnread
                                            : style.msgRead
                                            }`}
                                    >
                                        {isNewMsg
                                            ? "New message"
                                            : lastMessageText}
                                    </p>
                                </div>

                                {/* Notification Dot */}
                                {isNewMsg && (
                                    <div className={style.unreadDot}></div>
                                )}
                            </div>
                        );
                    })}
            </div>

            {/* Floating New People Button */}
            <Link
                to="/newpeople"
                className={style.floatingNewPeopleBtn}
                title="Find New People"
            >
                <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Person */}
                    <circle cx="9" cy="8" r="4"></circle>
                    <path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6"></path>

                    {/* Plus */}
                    <line x1="19" y1="8" x2="19" y2="14"></line>
                    <line x1="16" y1="11" x2="22" y2="11"></line>
                </svg>
            </Link>

        </div>
    );
}

export default HomePage