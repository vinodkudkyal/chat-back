const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

// 🔹 Conversation Schema
const conversationSchema = new mongoose.Schema(
  {
    participants: [String], // ["UserA", "UserB"]
    messages: [
      {
        sender: String,
        text: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

// 🔹 Get conversation messages
app.get("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  let conversation = await Conversation.findOne({
    participants: { $all: [user1, user2] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [user1, user2],
      messages: [],
    });
  }

  res.json(conversation.messages);
});

// 🔹 Socket handling
io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [],
      });
    }

    const newMessage = {
      sender,
      text: message,
      timestamp: new Date(),
    };

    conversation.messages.push(newMessage);
    await conversation.save();

    io.emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
