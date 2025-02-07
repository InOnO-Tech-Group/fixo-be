import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

const setupSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Allow all origins (adjust as needed)
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle receiving a message
    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      console.log(`Message from ${senderId} to ${receiverId}: ${message}`);

      // Emit message to the specific receiver
      io.to(receiverId).emit("receiveMessage", { senderId, message });
    });

    // Handle user joining a room (user's own ID as room)
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default setupSocket;
