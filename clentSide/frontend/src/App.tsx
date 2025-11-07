import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import PersistentLogin from "./ParsistentLogin/PersistentLogin";
import RequiredAuth from "./components/RecuiredAuth";
import Navbar from "./components/Navbar";

import Home from "./page/Home";
import SignUp from "./page/SignUp";
import Login from "./page/Login";
import Profile from "./page/Profile";
import CreateEvent from "./page/CreateEvent";

const App: React.FC = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route element={<Outlet />}>
          {/** Public routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PersistentLogin />}>
            <Route element={<RequiredAuth />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/createEvent" element={<CreateEvent />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
