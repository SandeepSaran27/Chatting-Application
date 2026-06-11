import { useState } from "react";
import { useEffect } from "react";
import { data, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import socket from "../../OtherPages/socketConnection.jsx";
import style from './Login.module.css';

const BACKEND_SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

function LogIn() {
    console.log("BACKEND_SERVER_URL", BACKEND_SERVER_URL );
    const [userName, setUserName] = useState('');
    const [passWord, setpassWord] = useState('');
    const [status, setStatus] = useState(400);

    const navigate = useNavigate();

    async function handleLogIn(e) {

        e.preventDefault();

        const res = await fetch(`${BACKEND_SERVER_URL}user/login`, {
            method: 'POST', //GET
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userName,
                passWord: passWord,
            }),
            credentials: 'include',
        });
        if (res.status == 200) {
            const data = await res.json();
            //console.log("data", data.userData);
            const userIdToken = document.cookie.slice(4);
            const res2 = await fetch(
                `${BACKEND_SERVER_URL}user/getUserData`,
                {
                    credentials: "include",
                }
            );
            const data2 = await res2.json();
            const userId = data2.data.userName;
            socket.emit("updateOnlineStatus", userId);   
            navigate('/home');
        }
    }
    return (
        <div className={style.pageWrapper}>
            <div className={style.loginCard}>

                <div className={style.logo}>
                    💬
                </div>

                <h1 className={style.title}>
                    Welcome Back
                </h1>

                <p className={style.subtitle}>
                    Sign in to continue chatting
                </p>

                <form
                    onSubmit={handleLogIn}
                    className={style.form}
                >
                    <input
                        className={style.input}
                        placeholder="Enter username"
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <input
                        className={style.input}
                        type="password"
                        placeholder="Enter password"
                        onChange={(e) => setpassWord(e.target.value)}
                    />

                    <button
                        type="submit"
                        className={style.loginBtn}
                    >
                        Sign In
                    </button>

                    <Link
                        to="/signup"
                        className={style.signupLink}
                    >
                        Create Account
                    </Link>
                </form>

            </div>
        </div>
    );
}

export default LogIn
