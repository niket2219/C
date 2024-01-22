import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetAvatar from "./components/SetAvatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot_pass from "./pages/Forgot_pass";
// import ChangePassword from "./pages/ChangePassword";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/forgot_password" element={<Forgot_pass />} />
        {/* <Route path="/changePassword" element={<ChangePassword />} /> */}
        <Route path="/" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
