import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host, AllGroups } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import GroupchatContainer from "../components/GroupchatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Groups from "../components/Groups";
import { Button } from "react-bootstrap";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [groups, setgroups] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [chatType, setchatType] = useState("personal");
  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentChat) {
      socket.current = io(host);
      socket.current.emit("add-user", currentChat._id);
    }
  }, [currentChat]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        console.log("getting data....");
        const data = await axios.get(`${AllGroups}/${currentUser.username}`);
        setgroups(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <Container>
        <div class="chatTypes">
          <button
            onClick={() => {
              setchatType("personal");
            }}
          >
            <span className="text-center">Chats</span>
          </button>
          <button
            onClick={() => {
              setchatType("group");
            }}
          >
            <span className="text-center">Groups</span>
          </button>
        </div>
        <div className="container">
          {chatType === "personal" ? (
            <Contacts contacts={contacts} changeChat={handleChatChange} />
          ) : (
            <Groups groups={groups} changeChat={handleChatChange} />
          )}
          {currentChat === undefined ? (
            <Welcome />
          ) : chatType === "personal" ? (
            <ChatContainer currentChat={currentChat} socket={socket} />
          ) : (
            <GroupchatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #a7bcff;
  .chatTypes {
    display: flex;
    flex-direction: row;
    gap: 5rem;
  }
  .chatTypes button {
    display: flex;
    flex-direction: row;
    gap: 5rem;
    width: 20rem;
    height: 2rem;
  }
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #ddddf7;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
