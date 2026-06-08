import { useState } from "react";
import { data, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import style from './SignUp.module.css';

const BACKEND_SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

function SignUp() {

    const [userName, setUserName] = useState('');
    const [passWord, setpassWord] = useState('');
    const [mobileNumber, setmobileNumber] = useState('');
    const [email, setemail] = useState('');

    const navigate = useNavigate();

    async function handleSignUp(e) {

        e.preventDefault();

        const res = await fetch(`${BACKEND_SERVER_URL}user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userName,
                password: passWord,
            }),
        });
        console.log("res.status", res.status);
        if (res.status == 200) {
            console.log("navigating");
            navigate('/');
        }
    }

    return (
        <div className={style.pageWrapper}>
            <div className={style.signupCard}>

                <div className={style.logo}>
                    ✨
                </div>

                <h1 className={style.title}>
                    Create Account
                </h1>

                <p className={style.subtitle}>
                    Join TalkVerse and start connecting
                </p>

                <form
                    onSubmit={handleSignUp}
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
                        className={style.signupBtn}
                    >
                        Create Account
                    </button>

                    <Link
                        to="/"
                        className={style.loginLink}
                    >
                        Already have an account? Sign In
                    </Link>
                </form>

            </div>
        </div>
    );
}

export default SignUp