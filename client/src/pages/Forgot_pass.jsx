import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { forgot_passwordRoute, verifyOtpRoute } from "../utils/APIRoutes";
import ChangePassword from "./ChangePassword";

function Forgot_pass() {
  const navigate = useNavigate();

  const [email, setemail] = useState("");
  const [sentotp, setsentotp] = useState(0);
  const [otpsent, setotpsent] = useState(false);
  const [otpVerified, setotpVerified] = useState(false);

  const handleOnChangeEmail = (e) => {
    setemail(e.target.value);
  };
  const handleOnChangeOTP = (e) => {
    setsentotp(e.target.value);
  };

  const sendOtp = async () => {
    const { data } = await axios.post(forgot_passwordRoute, {
      email,
    });

    if (data.status === false) {
      Swal.fire({
        icon: "error",
        title: `${data.msg}`,
      });
    }
    if (data.status === true) {
      setotpsent(true);
      Swal.fire({
        icon: "success",
        title: `OTP Sent SuccessFully To Your Email`,
      });
    }
  };

  const verifyOtp = async () => {
    const { data } = await axios.post(verifyOtpRoute, {
      email,
      otp: sentotp,
    });

    if (data.status === true) {
      setotpVerified(true);
      Swal.fire({
        icon: "success",
        title: `OTP Verified SuccessFully`,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: `Something Went Wrong`,
      });
    }
  };

  return (
    <>
      <div>
        {otpVerified == false ? (
          <Container>
            <div className="container">
              <div className="header">
                <h2>Forgot Your Password ?</h2>
                <p>
                  Please Enter the email address registered with this account
                </p>
              </div>
              <div className="login">
                <div className="text-input">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={(e) => handleOnChangeEmail(e)}
                  />
                </div>
                <div className={otpsent == true ? "text-input" : "hidden_but"}>
                  <input
                    id="otp"
                    type="password"
                    name="sentotp"
                    placeholder="enter otp"
                    onChange={(e) => handleOnChangeOTP(e)}
                  />
                </div>
                <button
                  className={otpsent == false ? "sub_but" : "hidden_but"}
                  id="submit"
                  type="submit"
                  onClick={sendOtp}
                >
                  Request OTP
                </button>
                <button
                  className={otpsent == true ? "sub_but" : "hidden_but"}
                  id="verify_butt"
                  type="submit"
                  onClick={verifyOtp}
                >
                  Verify OTP
                </button>
              </div>
              <div className="login">
                <Link style={{ fontSize: "0.9rem", color: "blue" }} to="/login">
                  <span>&#8592;</span>Back To Login
                </Link>
              </div>
            </div>
          </Container>
        ) : (
          <ChangePassword curremail={email} />
        )}
      </div>
    </>
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 0 17px 10px rgb(0 0 0 / 30%);
    border-radius: 20px;
    background: white;
    overflow: hidden;
  }
  .login {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
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
  .sub_but {
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
  .hidden_but {
    display: None;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1.4rem;
  }
  .header h2 {
    font-size: 1.4rem;
  }
  .header p {
    font-size: 0.9rem;
  }
`;

export default Forgot_pass;
