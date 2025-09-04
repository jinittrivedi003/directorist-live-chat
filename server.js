const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // for testing, later restrict to your domain
  },
});

// Store connected users
let connectedUsers = {};

app.get("/", (req, res) => {
  res.send("Directorist Live Chat Server ✅");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle user connection
  socket.on("user_connected", (username) => {
    console.log("User logged in:", username);
    connectedUsers[username] = socket.id;
    socket.username = username;
    
    // Broadcast updated user list to all clients
    io.emit("update_user_status", connectedUsers);
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    console.log("New message:", data);
    io.emit("new_message", data); // broadcast to all clients
  });

  // Handle message editing
  socket.on("edit_message", (data) => {
    console.log("Edit message:", data);
    io.emit("edit_message", data); // broadcast to all clients
  });

  // Handle message deletion
  socket.on("delete_message", (data) => {
    console.log("Delete message:", data);
    io.emit("delete_message", data); // broadcast to all clients
  });

  // Handle message read status
  socket.on("message_read", (data) => {
    console.log("Message read:", data);
    io.emit("message_read", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    
    // Remove user from connected users list
    if (socket.username) {
      delete connectedUsers[socket.username];
      // Broadcast updated user list
      io.emit("update_user_status", connectedUsers);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
});