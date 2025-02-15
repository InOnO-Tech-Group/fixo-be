import { Server } from "socket.io";
import { Server as HttpServer } from "http";

const users: Record<string, string> = {};

const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);
    socket.on("register", (userId: string) => {
      users[userId] = socket.id;
      console.log(`🟢 User ${userId} is online`);
    });

    socket.on("newMessage", (data) => {
      console.log("🔄 Forwarding message:", data);

      const { senderId, receiverId, message } = data;
      const receiverSocketId = users[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", { senderId, message });
        console.log(`📩 Message sent from ${senderId} to ${receiverId}: ${message}`);
      } else {
        console.log(`❌ ${receiverId} is offline, message not delivered.`);
      }
    });
    socket.on("receiveMessage", (data) => {
      console.log("�� Received message:", data);
    })

    socket.on("disconnect", () => {
      const userId = Object.keys(users).find((key) => users[key] === socket.id);
      if (userId) {
        delete users[userId];
        console.log(`❌ User ${userId} disconnected`);
      }
    });
  });

  return io;
};

export { users, setupSocket };
