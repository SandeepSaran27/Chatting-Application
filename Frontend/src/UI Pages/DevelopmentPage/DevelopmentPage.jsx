import { Link } from "react-router-dom";
import style from "./DevelopmentPage.module.css";

function DevelopmentPage() {
    return (
        <div className={style.pageWrapper}>
            <div className={style.card}>

                <Link
                    to="/home"
                    className={style.homeButton}
                >
                    <p className={style.homeInnerButton}>🏠Home</p>
                </Link>

                <div className={style.icon}>
                    🚧
                </div>

                <h1 className={style.title}>
                    Development In Progress
                </h1>

                <p className={style.description}>
                    We're currently building this feature and making
                    sure everything works perfectly before launch.
                </p>

                <div className={style.badge}>
                    <span className={style.dot}></span>
                    Coming Soon
                </div>

                <div className={style.footerText}>
                    Thank you for your patience ❤️
                </div>
            </div>
        </div>
    );
}

export default DevelopmentPage;