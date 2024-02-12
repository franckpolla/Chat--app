const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
// Correct import statement
const { Server } = require("socket.io");

app.use(cors());
// we are creating a server  on the port 3001, and attaching it to our existing HTTP server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//we are  going to use socket as an event emitter so that we can emit events from the client side to the server side
io.on("connection", (socket) => {
  console.log(`New connection ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID : ${socket.id} Joined room :${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected from the client side : ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log(`Listening on port 3001`);
});
