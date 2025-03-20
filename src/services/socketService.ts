import { Server } from "socket.io";
import { Server as HttpServer } from "http";

// Keep the existing users structure for backward compatibility
const users: Record<string, string> = {};

// Add additional tracking for WebRTC state
interface CallRequest {
  callerId: string;
  callId: string;
  issue?: string;
  timestamp: number;
}

// Track pending call requests
const pendingCalls: Record<string, CallRequest> = {};

const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // Keep original register handler
    socket.on("register", (data) => {
      const {userId,userType} = data
      users[userId] = socket.id;
      
      // If userType is provided, it's the new system; otherwise use existing behavior
      if (userType) {
        // Notify admins when a new user connects
        if (userType === 'user') {
          io.emit("userStatusUpdate", { userId, status: "online" });
        }
        console.log(`🟢 ${userType.charAt(0).toUpperCase() + userType.slice(1)} ${userId} is online`);
      } else {
        // Original behavior
        console.log(`🟢 User ${userId} is online`);
      }
    });

    // Keep original message handlers
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
      console.log("📨 Received message:", data);
    });

    // Add new WebRTC signaling handlers
    
    // Handle support call requests
    socket.on("requestSupport", (data) => {
      const { userId, issue } = data;
      const callId = `call-${Date.now()}-${userId}`;
      
      // Store call request
      pendingCalls[callId] = {
        callerId: userId,
        callId,
        issue,
        timestamp: Date.now()
      };
      
      // Broadcast call request to all admins
      io.emit("incomingCall", {
        callId,
        callerId: userId,
        issue,
        timestamp: Date.now()
      });
      
      console.log(`📞 User ${userId} requested support with issue: ${issue}`);
    });

    // Get pending calls
    socket.on("getPendingCalls", () => {
      socket.emit("pendingCalls", Object.values(pendingCalls));
    });

    // Handle call acceptance
    socket.on("acceptCall", (data) => {
      const { callId, adminId } = data;
      const callRequest = pendingCalls[callId];
      console.log((users));
      
      
      if (callRequest) {
        const { callerId } = callRequest;
        const callerSocketId = users[callerId];
        const adminSocketId = users[adminId];
     
        if (callerSocketId && adminSocketId) {
          // Notify caller that their call was accepted
          io.to(callerSocketId).emit("callAccepted", { callId, adminId });
          
          // Remove from pending calls
          delete pendingCalls[callId];
          
          console.log(`✅ Admin ${adminId} accepted call from user ${callerId}`);
        } else {
          console.log(`❌ User ${callerId} or Admin ${adminId} is not available`);
        }
      } else {
        console.log(`❌ Call ${callId} not found in pending calls`);
      }
    });

    // WebRTC Signaling
    socket.on("sendOffer", (data) => {
      const { receiverId, offer } = data;
      const receiverSocketId = users[receiverId];
      console.log("receiver socket id",receiverSocketId);
      
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveOffer", {
        senderId: getKeyBySocketId(socket.id),
          offer
        });
        console.log(`📤 Sent offer from ${getKeyBySocketId(socket.id)} to ${receiverId}`);
      } else {
        console.log(`❌ User ${receiverId} is not available to receive offer`);
      }
    });

    socket.on("sendAnswer", (data) => {
      const { receiverId, answer } = data;
      const receiverSocketId = users[receiverId];
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveAnswer", {
          senderId: getKeyBySocketId(socket.id),
          answer
        });
        console.log(`📤 Sent answer from ${getKeyBySocketId(socket.id)} to ${receiverId}`);
      } else {
        console.log(`❌ User ${receiverId} is not available to receive answer`);
      }
    });

    socket.on("sendIceCandidate", (data) => {
      const { receiverId, candidate } = data;
      const receiverSocketId = users[receiverId];
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveIceCandidate", {
          senderId: getKeyBySocketId(socket.id),
          candidate
        });
        console.log(`📤 Sent ICE candidate from ${getKeyBySocketId(socket.id)} to ${receiverId}`);
      } else {
        console.log(`❌ User ${receiverId} is not available to receive ICE candidate`);
      }
    });

    // Handle call ending
    socket.on("endCall", (data) => {
      const { userId, peerId } = data;
      const peerSocketId = users[peerId];
      
      if (peerSocketId) {
        io.to(peerSocketId).emit("callEnded", { peerId: userId });
        console.log(`📞 Call between ${userId} and ${peerId} ended`);
      }
    });

    // Keep original disconnect handler
    socket.on("disconnect", () => {
      const userId = Object.keys(users).find((key) => users[key] === socket.id);
      if (userId) {
        delete users[userId];
        io.emit("userStatusUpdate", { userId, status: "offline" });
        console.log(`❌ User ${userId} disconnected`);
      }
    });
  });

  // Helper function to find userId by socketId
  const getKeyBySocketId = (socketId: string): string | null => {
    for (const [key, value] of Object.entries(users)) {
      if (value === socketId) {
        return key;
      }
    }
    return null;
  };

  return io;
};

// Get all active call requests
const getPendingCalls = () => Object.values(pendingCalls);

export { users, pendingCalls, getPendingCalls, setupSocket };