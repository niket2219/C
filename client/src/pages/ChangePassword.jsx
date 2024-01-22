import React, { useState } from "react";
import { changePasswordRoute } from "../utils/APIRoutes";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function ChangePassword(props) {
  const navigate = useNavigate();
  const { curremail } = props;
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");

  const handlepassword = (e) => {
    setpassword(e.target.value);
  };
  const handlecpassword = (e) => {
    setcpassword(e.target.value);
  };

  const changePassword = async () => {
    const response = await axios.post(changePasswordRoute, {
      email: curremail,
      password,
      cpassword,
    });

    if (response.data.status == true) {
      Swal.fire({
        icon: "success",
        title: `${response.data.message}`,
      });
      navigate("/login");
    } else if (response.data.status == false) {
      Swal.fire({
        icon: "success",
        title: `Something Went Wrong`,
      });
    }
  };

  return (
    <Container>
      <div className="container">
        <div className="password">
          <input
            className="text-input"
            name="password"
            type="password"
            placeholder="Enter Your new Password"
            onChange={(e) => handlepassword(e)}
          />
          <input
            className="text-input"
            name="cpassword"
            type="password"
            placeholder="Confirm Your new Password"
            onChange={(e) => handlecpassword(e)}
          />
          <button type="submit" onClick={changePassword}>
            Change Password
          </button>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  body {
    font-family: "Poppins", sans-serif;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom right, #ff966d, #fa538d, #89379c);
  }
  .container {
    width: 40vw;
    height: 50vh;
    display: grid;
    grid-template-columns: 100%;
    grid-template-areas: "login";
    box-shadow: 0 0 17px 10px rgb(0 0 0 / 30%);
    border-radius: 20px;
    background: white;
    overflow: hidden;
  }
  .password {
    grid-area: login;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background: white;
  }
  .text-input {
    background: #e6e6e6;
    height: 40px;
    display: flex;
    width: 60%;
    align-items: center;
    border-radius: 10px;
    padding: 0 15px;
    margin: 5px 0;
  }
  .text-input input {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    margin-left: 10px;
  }
  button {
    width: 62%;
    padding: 15px;
    color: white;
    background: linear-gradient(to right, #ff966d, #fa538d, #89379c);
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-top: 10px;
    font-size: 1rem;
  }
`;

export default ChangePassword;
