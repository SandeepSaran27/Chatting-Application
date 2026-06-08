// src/socket.js
import { useEffect } from "react";
import { io } from "socket.io-client";

const BACKEND_SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

const socket = io(BACKEND_SERVER_URL);

export default socket;