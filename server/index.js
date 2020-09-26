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

  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);
    // Telling User that Welcomed To The Chat
    socket.emit("message", { user: "Admin", text: `${user.name} Welcome to The Room ${user.room}` });
    // Emit To Everyone Expect User That User Has Joined The Room
    socket.broadcast.to(user.room).emit("message", { user: "Admin", text: `${user.name} Has Joined The Room` });
    socket.join(user.room);
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("User Had Left!!");
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server Has Started On ${PORT}`));
