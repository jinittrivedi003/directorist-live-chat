// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // for testing, later restrict to your domain
//   },
// });

// app.get("/", (req, res) => {
//   res.send("Directorist Live Chat Server ✅");
// });
// app.use("/socket.io", express.static(__dirname + "/node_modules/socket.io/client-dist"));
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("user_connected", (user) => {
//     console.log("User logged in:", user);
//     io.emit("user_connected", user);
//   });

//   socket.on("send_message", (data) => {
//     console.log("New message:", data);
//     io.emit("new_message", data); // send to everyone
//   });

//   socket.on("edit_message", (data) => {
//     console.log("Edit message:", data);
//     io.emit("edit_message", data);
//   });

//   socket.on("delete_message", (data) => {
//     console.log("Delete message:", data);
//     io.emit("delete_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`🚀 Chat server running on port ${PORT}`);
// });


const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Create socket server
const io = new Server(server, {
  cors: { origin: "*" }
});

// Serve socket.io client
app.use("/socket.io", express.static(path.join(__dirname, "node_modules", "socket.io", "client-dist")));

// Chat logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("chat message", (msg) => {
    console.log("Message:", msg);
    io.emit("chat message", msg); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});
