// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const server = http.createServer(app);

// app.use(cors());
// app.use(express.json());

// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173" },
// });

// /* ---------------- MongoDB ---------------- */

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch(console.error);

// /* ---------------- Schema ---------------- */

// const conversationSchema = new mongoose.Schema(
//   {
//     participants: [String],
//     messages: [
//       {
//         sender: String,
//         text: String,
//         timestamp: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const Conversation = mongoose.model("Conversation", conversationSchema);

// /* ---------------- Online Users ---------------- */

// const onlineUsers = {}; // { username: socketId }

// /* ---------------- API ---------------- */

// app.get("/messages/:user1/:user2", async (req, res) => {
//   const { user1, user2 } = req.params;

//   let conversation = await Conversation.findOne({
//     participants: { $all: [user1, user2] },
//   });

//   if (!conversation) {
//     conversation = await Conversation.create({
//       participants: [user1, user2],
//       messages: [],
//     });
//   }

//   res.json(conversation.messages);
// });

// /* ---------------- Socket ---------------- */

// io.on("connection", (socket) => {
//   console.log("🟢 Connected:", socket.id);

//   socket.on("registerUser", (username) => {
//     onlineUsers[username] = socket.id;
//     io.emit("onlineUsers", Object.keys(onlineUsers));
//   });

//   socket.on("sendMessage", async ({ sender, receiver, message }) => {
//     let conversation = await Conversation.findOne({
//       participants: { $all: [sender, receiver] },
//     });

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [sender, receiver],
//         messages: [],
//       });
//     }

//     const newMessage = {
//       sender,
//       text: message,
//       timestamp: new Date(),
//     };

//     conversation.messages.push(newMessage);
//     await conversation.save();

//     // Send ONLY to sender & receiver
//     const receiverSocket = onlineUsers[receiver];
//     const senderSocket = onlineUsers[sender];

//     if (receiverSocket) io.to(receiverSocket).emit("receiveMessage", newMessage);
//     if (senderSocket) io.to(senderSocket).emit("receiveMessage", newMessage);
//   });

//   socket.on("disconnect", () => {
//     for (const user in onlineUsers) {
//       if (onlineUsers[user] === socket.id) {
//         delete onlineUsers[user];
//         break;
//       }
//     }
//     io.emit("onlineUsers", Object.keys(onlineUsers));
//   });
// });

// /* ---------------- Server ---------------- */

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () =>
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// );




// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173" },
// });

// app.use(cors());
// app.use(express.json());

// /* ---------------- MongoDB ---------------- */

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch(console.error);

// /* ---------------- Schemas ---------------- */

// const userSchema = new mongoose.Schema({
//   username: String,
//   name: String,
//   password: String,
//   roomId: String,
// });

// const conversationSchema = new mongoose.Schema({
//   roomId: String,
//   participants: [String],
//   messages: [{
//     sender: String,
//     text: String,
//     timestamp: { type: Date, default: Date.now },
//   }],
// });

// const User = mongoose.model("User", userSchema);
// const Conversation = mongoose.model("Conversation", conversationSchema);

// /* ---------------- Admin Login ---------------- */

// const ADMIN = {
//   username: "vinodadmin@gmail.com",
//   password: "viru@3045",
// };

// app.post("/admin/login", (req, res) => {
//   const { username, password } = req.body;
//   if (username === ADMIN.username && password === ADMIN.password) {
//     return res.json({ role: "admin" });
//   }
//   res.status(401).json({ message: "Invalid admin credentials" });
// });

// /* ---------------- Create User (Admin) ---------------- */

// app.post("/admin/create-user", async (req, res) => {
//   const { username, name, password, roomId } = req.body;
//   await User.create({ username, name, password, roomId });
//   res.json({ message: "User created" });
// });

// /* ---------------- User Login ---------------- */

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username, password });
//   if (!user) return res.status(401).json({ message: "Invalid credentials" });
//   res.json(user);
// });

// /* ---------------- Get Users By Room ---------------- */

// app.get("/users/:roomId", async (req, res) => {
//   const users = await User.find({ roomId: req.params.roomId });
//   res.json(users);
// });

// /* ---------------- Messages ---------------- */

// app.get("/messages/:roomId", async (req, res) => {
//   let convo = await Conversation.findOne({ roomId: req.params.roomId });
//   if (!convo) convo = await Conversation.create({ roomId: req.params.roomId, participants: [], messages: [] });
//   res.json(convo.messages);
// });

// /* ---------------- Socket ---------------- */

// io.on("connection", (socket) => {
//   socket.on("joinRoom", ({ username, roomId }) => {
//     socket.join(roomId);
//     io.to(roomId).emit("userJoined", username);
//   });

//   socket.on("sendMessage", async ({ roomId, sender, text }) => {
//     let convo = await Conversation.findOne({ roomId });
//     if (!convo) convo = await Conversation.create({ roomId, participants: [], messages: [] });

//     convo.messages.push({ sender, text });
//     await convo.save();

//     io.to(roomId).emit("receiveMessage", { sender, text });
//   });
// });

// /* ---------------- Server ---------------- */

// server.listen(5000, () => {
//   console.log("🚀 Server running on http://localhost:5000");
// });



// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173" },
// });

// app.use(cors());
// app.use(express.json());

// /* ---------------- MongoDB ---------------- */

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch(console.error);

// /* ---------------- Schemas ---------------- */

// const userSchema = new mongoose.Schema({
//   username: { type: String, unique: true },
//   name: String,
//   password: String,
//   rooms: [String],
// });

// const conversationSchema = new mongoose.Schema({
//   roomId: String,
//   messages: [
//     {
//       sender: String,
//       text: String,
//       timestamp: { type: Date, default: Date.now },
//     },
//   ],
// });

// const User = mongoose.model("User", userSchema);
// const Conversation = mongoose.model("Conversation", conversationSchema);

// /* ---------------- Admin ---------------- */

// const ADMIN = {
//   username: "vinodadmin@gmail.com",
//   password: "viru@3045",
// };

// app.post("/admin/login", (req, res) => {
//   const { username, password } = req.body;
//   if (username === ADMIN.username && password === ADMIN.password) {
//     return res.json({ role: "admin" });
//   }
//   res.status(401).json({ message: "Invalid admin credentials" });
// });

// /* Create user */
// app.post("/admin/create-user", async (req, res) => {
//   const { username, name, password, rooms } = req.body;

//   const exists = await User.findOne({ username });
//   if (exists) {
//     return res.status(400).json({ message: "User already exists" });
//   }

//   await User.create({ username, name, password, rooms });
//   res.json({ message: "User created successfully" });
// });

// /* Get all users */
// app.get("/admin/users", async (req, res) => {
//   const users = await User.find({}, { password: 0 });
//   res.json(users);
// });

// /* Add room to user */
// app.post("/admin/add-room", async (req, res) => {
//   const { username, roomId } = req.body;

//   const user = await User.findOne({ username });
//   if (!user) return res.status(404).json({ message: "User not found" });

//   if (!user.rooms.includes(roomId)) {
//     user.rooms.push(roomId);
//     await user.save();
//   }

//   res.json({ message: "Room added" });
// });

// /* ---------------- User Login ---------------- */

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   const user = await User.findOne({ username, password });
//   if (!user) return res.status(401).json({ message: "Invalid credentials" });

//   res.json({
//     username: user.username,
//     name: user.name,
//     rooms: user.rooms,
//   });
// });

// /* ---------------- Room APIs ---------------- */

// app.get("/room-users/:roomId", async (req, res) => {
//   const users = await User.find(
//     { rooms: req.params.roomId },
//     { password: 0 }
//   );
//   res.json(users);
// });

// app.get("/messages/:roomId", async (req, res) => {
//   let convo = await Conversation.findOne({ roomId: req.params.roomId });
//   if (!convo) convo = await Conversation.create({ roomId, messages: [] });
//   res.json(convo.messages);
// });

// app.get("/user/:username/rooms", async (req, res) => {
//   const user = await User.findOne(
//     { username: req.params.username },
//     { rooms: 1 }
//   );
//   res.json(user?.rooms || []);
// });



// /* ---------------- Socket ---------------- */

// io.on("connection", (socket) => {
//   socket.on("joinRoom", ({ username, roomId }) => {
//     socket.join(roomId);
//   });

//   socket.on("sendGroupMessage", async ({ roomId, sender, text }) => {
//     let convo = await Conversation.findOne({ roomId });
//     if (!convo) convo = await Conversation.create({ roomId, messages: [] });

//     const msg = { sender, text };
//     convo.messages.push(msg);
//     await convo.save();

//     io.to(roomId).emit("receiveGroupMessage", msg);
//   });

//   socket.on("sendPrivateMessage", ({ sender, receiver, text }) => {
//     io.emit("receivePrivateMessage", { sender, receiver, text });
//   });
// });

// server.listen(5000, () =>
//   console.log("🚀 Server running on http://localhost:5000")
// );




const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

app.use(cors());
app.use(express.json());

/* ---------------- MongoDB ---------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(console.error);

/* ---------------- Schemas ---------------- */

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: String,
  password: String,

  // ✅ IMPORTANT FIX
  rooms: {
    type: [String],
    default: [],
  },
});

const conversationSchema = new mongoose.Schema({
  roomId: String,
  messages: [
    {
      sender: String,
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", userSchema);
const Conversation = mongoose.model("Conversation", conversationSchema);

/* ---------------- Admin ---------------- */

const ADMIN = {
  username: "vinodadmin@gmail.com",
  password: "viru@3045",
};

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    return res.json({ role: "admin" });
  }
  res.status(401).json({ message: "Invalid admin credentials" });
});

/* ---------------- Create User ---------------- */

app.post("/admin/create-user", async (req, res) => {
  try {
    const { username, name, password, rooms } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username & password required" });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      name,
      password,
      rooms: Array.isArray(rooms) ? rooms : [],
    });

    console.log("✅ USER CREATED:", user.username);
    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error("❌ CREATE USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- Get All Users ---------------- */

app.get("/admin/users", async (req, res) => {
  const users = await User.find({}, { password: 0 });
  console.log("📋 ADMIN USERS:", users.length);
  res.json(users);
});

/* ---------------- Add Room ---------------- */

app.post("/admin/add-room", async (req, res) => {
  const { username, roomId } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.rooms.includes(roomId)) {
    user.rooms.push(roomId);
    await user.save();
  }

  res.json({ message: "Room added" });
});

/* ---------------- User Login ---------------- */

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    username: user.username,
    name: user.name,
    rooms: user.rooms,
  });
});

/* ---------------- Room APIs ---------------- */

app.get("/room-users/:roomId", async (req, res) => {
  const users = await User.find(
    { rooms: req.params.roomId },
    { password: 0 }
  );
  res.json(users);
});

app.get("/messages/:roomId", async (req, res) => {
  let convo = await Conversation.findOne({ roomId: req.params.roomId });
  if (!convo) convo = await Conversation.create({ roomId, messages: [] });
  res.json(convo.messages);
});

/* ---------------- Socket ---------------- */

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
  });


  socket.on("sendGroupMessage", async ({ roomId, sender, text }) => {
    let convo = await Conversation.findOne({ roomId });
    if (!convo) convo = await Conversation.create({ roomId, messages: [] });

    const msg = { sender, text };
    convo.messages.push(msg);
    await convo.save();

    io.to(roomId).emit("receiveGroupMessage", msg);
  });


  socket.on("sendPrivateMessage", ({ sender, receiver, text }) => {
    io.emit("receivePrivateMessage", { sender, receiver, text });
  });
});

server.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);
