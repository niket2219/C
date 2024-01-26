import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Brand from "../assets/brand.png";
import Swal from "sweetalert2";
import { loginRoute } from "../utils/APIRoutes";
import "./style.css";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      Swal.fire({
        icon: "question",
        title: "Username must not be Empty",
      });
      return false;
    } else if (password === "") {
      Swal.fire({
        icon: "question",
        title: "Password must not be Empty",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        Swal.fire({
          icon: "error",
          title: "Something Went Wrong...",
          text: `${data.msg}`,
        });
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        Swal.fire({
          icon: "success",
          title: "User Loginned Successfully...",
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
          <h3 className="title">User Login</h3>
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
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <button
            className="login-btn"
            onClick={(event) => handleSubmit(event)}
          >
            LOGIN
          </button>
          <Link to="/forgot_password" className="forgot">
            Forgot Username/Password?
          </Link>
          <div className="create">
            <Link to="/register">Create Your Account</Link>
            <i className="ri-arrow-right-fill"></i>
          </div>
        </div>
      </div>
    </>
  );
}
