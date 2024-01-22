import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Bg from "../assets/chat_bg_img.jpeg";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(async () => {
    const response = await axios.post(
      `http://localhost:5000/api/messages/getgrpmsg/${currentChat._id}`
    );
    setMessages(response.data);
    console.log(messages);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      grpId: currentChat._id,
      sender: data.username,
      message: msg,
    });
    await axios.post(
      `http://localhost:5000/api/messages/addgrpMsg/${currentChat._id}`,
      {
        grpId: currentChat._id,
        sender: data.username,
        message: msg,
      }
    );
    console.log("message sent");

    const msgs = [...messages];
    msgs.push({ grpId: currentChat._id, sender: data.username, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="username">
            <h3>{currentChat.name}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.sender ==
                  JSON.parse(
                    localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
                  ).username
                    ? "sended"
                    : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
              <div
                className={`${
                  message.sender ==
                  JSON.parse(
                    localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
                  ).username
                    ? ""
                    : "sender"
                }`}
              >
                <span
                  className={`message ${
                    message.sender ==
                    JSON.parse(
                      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
                    ).username
                      ? "resview"
                      : ""
                  }`}
                >
                  {message.sender}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    background-color: rgb(5, 64, 28);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    background: url(${Bg});
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: lightgrey;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: black;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;
      .content {
        background-color: rgb(121, 235, 178);
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: white;
      }
    }
  }
  .sender {
    background-color: rgb(195, 202, 214);
    border-radius: 9px;
    margin-bottom: 0px;
    max-width: 3rem;
  }
  .sender span {
    font-size: 0.8rem;
  }
  .resview {
    font-size: 0rem;
  }
`;
