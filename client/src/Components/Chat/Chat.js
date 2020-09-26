import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";

let socket;
const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const END_POINT = "localhost:5000";

  // This Use Effect Trick To Prevent Rendre Twice to The Back-end Server!
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(END_POINT);
    setName(name);
    setRoom(room);
    socket.emit("join", { name, room });
    // This Used For Unmounting
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [END_POINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => setMessages([...messages, message]));
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) socket.emit("sendMessage", message, () => setMessage(""));
  };
  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
        />
      </div>
    </div>
  );
};

export default Chat;
