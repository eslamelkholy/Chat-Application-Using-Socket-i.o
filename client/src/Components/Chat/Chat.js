import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

let socket;
const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const END_POINT = "localhost:5000";

  // This Use Effect Trick To Prevent Rendre Twice to The Back-end Server!
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(END_POINT);
    setName(name);
    setRoom(room);
  }, [END_POINT, location.search]);

  return <p>Hello</p>;
};

export default Chat;
