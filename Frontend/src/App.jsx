import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import socket from "./UI Pages/OtherPages/socketConnection.jsx"

import HomePage from './UI Pages/HomePages/home.jsx';
import LogIn from './UI Pages/InPages/LogIn/Login.jsx';
import SignUp from './UI Pages/InPages/SignUp/SignUp.jsx';
import ReportError from './UI Pages/OtherPages/ReportBug.jsx';
import NewPeoplePage from './UI Pages/findPeople/FindPeople.jsx';
import ChattingSpace from './UI Pages/ChattingSpace/ChattingSpace.jsx';
import DevelopmentPage from './UI Pages/DevelopmentPage/DevelopmentPage.jsx';

function App() {

  useEffect(() => {
    const handleOnlineStatus = () => {
      const hasUid = document.cookie
        .split("; ")
        .some(cookie => cookie.startsWith("uid="));

      if (hasUid) {
        const userIdToken = document.cookie.slice(4);
        socket.emit("updateOnlineStatus", userIdToken);
      }
    }

    socket.on('connect', handleOnlineStatus);

    return () => {
      socket.off("connect", handleOnlineStatus);
    };
  }, []);
  

  return (
    <Router>
      <Routes>
        <Route path='/home' element={<HomePage />} />
        <Route path='/' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/newpeople' element={<NewPeoplePage />} />
        <Route path='/reporterror' element={<ReportError />} />
        <Route path='/underdevelopement' element={<DevelopmentPage/>}/>
        <Route path='/mainChattingSpace' element={<ChattingSpace />} />
      </Routes>
    </Router>
  )
}

export default App