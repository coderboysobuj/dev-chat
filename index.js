require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");


const {
  getCurrentUser,
  getRoomUsers,
  joinUser,
  userLeave,
} = require("./utils/users");
const { formatMessage } = require("./utils/message");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
const server = http.createServer(app);

const io = new Server(server);

const bootName = "DevChat";

io.on("connection", (socket) => {
  socket.on("join-room", ({ username, room }) => {
    const user = joinUser({ username, room, id: socket.id });

    socket.join(user.room);

    // welcome to current user
    socket.emit("message", formatMessage(bootName, "Welcome to DevChat"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(bootName, `${user.username} has joined the chat`)
      );

    // send users and room info
    io.to(user.room).emit("room-users", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // listenig for message
  socket.on("chat-message", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // listing for disconnect users
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(bootName, `${user.username} has left the chat`)
      );
    }

    // send updated room info
    io.to(user.room).emit("room-users", {
      room: user?.room,
      users: getRoomUsers(user.room),
    });
  });
});

server.listen(5000, () => console.log("Server running... 🚀"));
