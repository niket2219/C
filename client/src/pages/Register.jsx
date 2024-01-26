import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Brand from "../assets/brand.png";
import Swal from "sweetalert2";
import { registerRoute } from "../utils/APIRoutes";
import "./style.css";

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password and ConfirmPassword Should be Same",
      });
      return false;
    } else if (username.length < 3) {
      Swal.fire({
        icon: "warning",
        title: "Username should be greater than 3 characters.",
      });
      return false;
    } else if (password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Password must be at least of 8 characters",
      });
      return false;
    } else if (email === "") {
      Swal.fire({
        icon: "warning",
        title: "Email field is required",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        Swal.fire({
          icon: "error",
          title: `${data.msg}`,
        });
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        Swal.fire({
          icon: "success",
          title: `User Registered successfully`,
        });
        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="container" style={{ width: "40rem", height: "auto" }}>
        <div className="design">
          <div className="pill-1 rotate-45"></div>
          <div className="pill-2 rotate-45"></div>
          <div className="pill-3 rotate-45"></div>
          <div className="pill-4 rotate-45"></div>
        </div>
        <div className="login">
          <div className="logo">
            <img src={Brand} alt="logo" />
            <h2>Chat Vista</h2>
          </div>
          <h3 className="title">User Signup</h3>
          <div className="text-input">
            <i className="ri-user-fill"></i>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="text-input">
            <i className="ri-lock-fill"></i>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="text-input">
            <i className="ri-lock-fill"></i>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="text-input">
            <i className="ri-lock-fill"></i>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <button
            className="login-btn"
            onClick={(event) => handleSubmit(event)}
          >
            REGISTER
          </button>
        </div>
      </div>
    </>
  );
}
