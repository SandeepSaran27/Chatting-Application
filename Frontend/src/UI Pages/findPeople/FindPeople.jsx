import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
//import socket from "../OtherPages/socketConnection.jsx";
import style from "./FindPeople.module.css";

const BACKEND_SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

function NewPeoplePage() {

    const [newPeople, setNewPeople] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        async function getUserData() {
            const res = await fetch(
                `${BACKEND_SERVER_URL}user/getUserData`,
                {
                    credentials: "include",
                }
            );
        console.log("Res", res);
        const resData = await res.json();
        console.log("Data object at send msg", resData.data);
        console.log("userData", resData.data);
        setUserData(resData.data);
        }
        getUserData();
    }, []);

    useEffect(() => {
        async function getNewPeopleData() {
            const res = await fetch(`${BACKEND_SERVER_URL}user/getAllUsers`);
            const data = await res.json();
            setNewPeople(data);
        }
        getNewPeopleData();
    }, []);

    async function connectUsers(receiver) {
        console.log("User data:", userData);
        const response = await fetch(
            `${BACKEND_SERVER_URL}user/connect`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },                
                body: JSON.stringify({
                    receiver: receiver,
                }),
            }
        );

        const data = await response.json();
        console.log(data);
        window.location.reload();
    }

    return (
        <div className={style.pageWrapper}>
            {/* Header */}
            <div className={style.mainHeader}>
                <div className={style.headerLeft}>
                    <Link to="/home">
                        <div className={style.homeButton}>
                            🏚️
                        </div>
                    </Link>
                    <h1 className={style.title}>Chats</h1>
                </div>

                {/* Edit Profile Button */}
                {/* /viewFriends */}
                <Link to="/underdevelopement" className={style.viewFriendsButton}>
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
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </Link>
            </div>

            <div className={style.heroSection}>
                <div className={style.heroContent}>
                    <h1 className={style.heroTitle}>Discover People</h1>

                    <p className={style.heroText}>
                        Expand your network and start new conversations.
                    </p>
                </div>

                <div className={style.heroBadge}>
                    {newPeople?.data?.filter(
                        (person) =>
                            person !== userData?.userName &&
                            !userData?.connection?.includes(person)
                    ).length}
                    <span> New</span>
                </div>
            </div>

            <div className={style.searchBox}>
                <input
                    type="text"
                    placeholder="Search people..."
                    className={style.searchInput}
                />
            </div>

            <div className={style.peopleGrid}>
                {newPeople.data &&
                    newPeople.data
                        .filter(
                            (person) =>
                                person !== userData?.userName &&
                                !userData?.connection?.includes(person)
                        )
                        .map((person, ind) => (
                            <div
                                key={ind}
                                className={style.personCard}
                            >
                                <div className={style.cardTop}>
                                    <div className={style.avatar}>
                                        {person.charAt(0).toUpperCase()}
                                    </div>

                                    <div className={style.onlineDot}></div>
                                </div>

                                <h3 className={style.personName}>
                                    {person}
                                </h3>

                                <p className={style.personTag}>
                                    Ready to connect
                                </p>

                                <button
                                    className={style.connectBtn}
                                    onClick={() => connectUsers(person)}
                                >
                                    Connect
                                </button>
                            </div>
                        ))}
            </div>
        </div>
    );

}

export default NewPeoplePage
