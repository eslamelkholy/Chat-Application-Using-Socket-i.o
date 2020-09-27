const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const router = require("./router");
const PORT = process.env.PORT || 5000;
const { addUser, removeUser, getUser, getUsersInRoom } = require("./models/users");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("We Have a New Connection!!!");

  socket.on("join", (data) => {
    const { name, room } = data;
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return;

    socket.emit("message", { user: "Admin", text: `${user.name} Welcome to The Room ${user.room}` });

    socket.broadcast.to(user.room).emit("message", { user: "Admin", text: `${user.name} Has Joined The Room` });

    socket.join(user.room);

    io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) });
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (!user) return;
    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", { user: "Admin", text: `${user.name} Had Left` });
      io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) });
    }
    console.log(`${user.name} Had Left`);
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server Has Started On ${PORT}`));
