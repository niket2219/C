import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/brand.png";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

export default function Contacts({ groups, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [currentchat, setcurrentchat] = useState(undefined);
  const [show, setshow] = useState(false);
  const [show1, setshow1] = useState(false);
  const [show2, setshow2] = useState(false);
  const [cname, setcname] = useState("");
  const [grpname, setgrpname] = useState("");
  const [userTobeAdded, setuserTobeAdded] = useState(undefined);
  const [invites, setinvites] = useState(undefined);

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);

  useEffect(async () => {
    const data = await axios.get(
      `http://localhost:5000/api/messages/fetchrequests/${
        JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
          .username
      }`
    );

    if (data.data.msg != false) {
      console.log(data.data.data[0]);
      setinvites(data.data.data);
      setshow2(true);
    }
  }, []);

  const handleModal = () => {
    setshow(true);
  };

  const addGrp = async () => {
    const res = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const data = await axios.post("http://localhost:5000/api/messages/addgrp", {
      name: grpname,
      creator: res.username,
    });
    console.log(data);
    setshow(false);
    window.location.reload(true);
  };

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
    setcurrentchat(contact);
    console.log(currentchat);
    console.log(currentSelected);
  };

  const handleaddUser = async () => {
    const response = await axios.post(
      `http://localhost:5000/api/messages/addtogrp`,
      {
        user: JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        ).username,
        mem: userTobeAdded,
        group_id: currentchat._id,
      }
    );
    setshow1(false);
  };

  const acceptjoinreq = async () => {
    const data = axios.post(`http://localhost:5000/api/messages/acceptreq`, {
      user: invites[0].to,
      grpId: invites[0].grpId,
      status: true,
    });
    setshow2(false);
    alert("added to group");
    window.location.reload(true);
  };
  const declinejoinreq = async () => {
    const data = axios.post(`http://localhost:5000/api/messages/acceptreq`, {
      user: invites[0].to,
      grpId: invites[0].grpId,
      status: false,
    });
    setshow2(false);
    alert("rejected the invite");
    window.location.reload(true);
  };

  return (
    <>
      {currentUserName && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Chat Vista</h3>
          </div>
          <div className="contacts">
            {groups.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="username">
                    <h4>{contact.name}</h4>
                  </div>
                  <div className="text-right">
                    <Button
                      variant="primary"
                      onClick={() => setshow1(true)}
                      className={`${
                        contact.creator ==
                        JSON.parse(
                          localStorage.getItem(
                            process.env.REACT_APP_LOCALHOST_KEY
                          )
                        ).username
                          ? ""
                          : "addper"
                      }`}
                    >
                      + add user
                    </Button>
                  </div>
                </div>
              );
            })}
            <Modal show={show1}>
              <Modal.Header closeButton>Enter Group Details</Modal.Header>
              <Modal.Body>
                <Form.Label htmlFor="useradd">
                  Enter username to be added :{" "}
                </Form.Label>
                <Form.Control
                  name="useradd"
                  id="useradd"
                  onChange={(e) => {
                    setuserTobeAdded(e.target.value);
                  }}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={() => setshow1(false)}>
                  Cancel
                </Button>
                <Button variant="success" onClick={() => handleaddUser()}>
                  Add
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          <div className="current-user">
            <Button onClick={handleModal}>Create Group</Button>
            <Modal show={show}>
              <Modal.Header closeButton>Enter Details</Modal.Header>
              <Modal.Body>
                <Form.Label htmlFor="grpname">
                  Enter the name of the group :{" "}
                </Form.Label>
                <Form.Control
                  name="grpname"
                  id="grpname"
                  style={{ margin: "10px" }}
                  onChange={(e) => {
                    setgrpname(e.target.value);
                  }}
                />
                <Form.Label htmlFor="cname">Enter your id : </Form.Label>
                <Form.Control
                  className="m-2"
                  name="cname"
                  id="cname"
                  onChange={(e) => {
                    setcname(e.target.value);
                  }}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={() => setshow(false)}>
                  Cancel
                </Button>
                <Button variant="warning" onClick={addGrp}>
                  Create
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={show2}>
              <Modal.Header closeButton>Group Invite</Modal.Header>
              <Modal.Body>
                <p>
                  You have got a group invite from <br></br>Do You want to
                  accept ?
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={() => declinejoinreq()}>
                  Reject
                </Button>
                <Button variant="success" onClick={() => acceptjoinreq()}>
                  Accept
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #3e3c61;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.4rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 4rem;
      cursor: pointer;
      width: 98%;
      border-radius: 0.8rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 2.7rem;
        }
      }
      .username {
        h4 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #0d0d30;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 3.4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }

    button {
      position: relative;
      padding: 10px 20px;
      font-size: 16px;
      background-color: #4caf50; /* Green */
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      overflow: hidden;
    }

    button::before {
      content: "+";
      position: absolute;
      left: -10px; /* Adjust this value to control the overlap */
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      background-color: #45a049; /* Darker green for the plus sign */
      padding: 5px;
      border-radius: 50%;
    }

    button:hover {
      background-color: #45a049; /* Darker green on hover */
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }

  .addper {
    display: none;
  }
`;
