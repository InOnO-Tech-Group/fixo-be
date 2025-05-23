
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

interface SupportRequest {
  userId: string;
  username: string;
  timestamp: number;
}

interface Technician {
  technicianId: string;
  technicianName: string;
  socketId: string;
}

const supportRequests: Map<string, SupportRequest> = new Map();
const technicians: Map<string, Technician> = new Map();
const userSocketMap: Map<string, string> = new Map();
const techSocketMap: Map<string, string> = new Map();
const activeCalls: Map<string, string> = new Map(); 

export const setupWebRTCHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);
    
    socket.on('requestSupport', ({ userId, username }) => {
      console.log(`User ${username} (${userId}) requested support`);
      
      const request: SupportRequest = {
        userId,
        username,
        timestamp: Date.now()
      };
      
      supportRequests.set(userId, request);
      userSocketMap.set(userId, socket.id);
      for (const [_, technician] of technicians) {
        io.to(technician.socketId).emit('newSupportRequest', request);
      }
    });

      socket.on('technicianOnline', ({ technicianId, technicianName }) => {
      console.log(`Technician ${technicianName} (${technicianId}) is online`);
      
      const technicianInfo: Technician = {
        technicianId,
        technicianName,
        socketId: socket.id
      };
      
      technicians.set(technicianId, technicianInfo);
      techSocketMap.set(technicianId, socket.id);

       for (const [_, request] of supportRequests) {
        socket.emit('newSupportRequest', request);
      }
    });
    socket.on('acceptSupport', ({ userId, technicianId, technicianName }) => {
      console.log(`Technician ${technicianName} accepted support for user ${userId}`);
      
      const userSocketId = userSocketMap.get(userId);
      
      if (userSocketId) {
           io.to(userSocketId).emit('supportAccepted', { 
          technicianId, 
          technicianName 
        });
        supportRequests.delete(userId);
        activeCalls.set(userId, technicianId);
        
         for (const [techId, technician] of technicians.entries()) {
          if (techId !== technicianId) {
            io.to(technician.socketId).emit('supportRequestAccepted', { userId });
          }
        }
      }
    });
    socket.on('iceCandidate', ({ to, candidate }) => {
      console.log(`ICE candidate from ${socket.id} to ${to}`);
      
      const targetSocketId = userSocketMap.get(to) || techSocketMap.get(to);
      
      if (targetSocketId) {
        io.to(targetSocketId).emit('iceCandidate', { 
          from: socket.id,
          candidate 
        });
      }
    });
    socket.on('offer', ({ to, offer }) => {
      console.log(`Offer from ${socket.id} to ${to}`);
      
      const targetSocketId = userSocketMap.get(to) || techSocketMap.get(to);
      
      if (targetSocketId) {
        io.to(targetSocketId).emit('offer', { 
          from: socket.id,
          offer 
        });
      }
    });

    socket.on('answer', ({ to, answer }) => {
      console.log(`Answer from ${socket.id} to ${to}`);
      
      const targetSocketId = userSocketMap.get(to) || techSocketMap.get(to);
      
      if (targetSocketId) {
        io.to(targetSocketId).emit('answer', { 
          from: socket.id,
          answer 
        });
      }
    });

    socket.on('cancelRequest', ({ userId }) => {
      console.log(`Support request for user ${userId} canceled` );
    });
    socket.on('endSupport', ({ userId }) => {
      io.emit('requestCanceled', { userId });
      
      const userSocketId = userSocketMap.get(userId);
      const technicianId = activeCalls.get(userId);

      if (userSocketId) {
        io.to(userSocketId).emit('supportEnded', { userId });
      }
      
      if (technicianId) {
        const techSocketId = techSocketMap.get(technicianId);
        if (techSocketId) {
          io.to(techSocketId).emit('supportEnded', { userId });
        }
      }

      supportRequests.delete(userId);
      activeCalls.delete(userId);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          supportRequests.delete(userId);
          userSocketMap.delete(userId);
          
          const technicianId = activeCalls.get(userId);
          if (technicianId) {
            const techSocketId = techSocketMap.get(technicianId);
            if (techSocketId) {
              io.to(techSocketId).emit('supportEnded', { userId });
            }
            activeCalls.delete(userId);
          }
          
          console.log(`Support user ${userId} disconnected`);
          break;
        }
      }
      
      for (const [techId, socketId] of techSocketMap.entries()) {
        if (socketId === socket.id) {
          technicians.delete(techId);
          techSocketMap.delete(techId);
          
          const impactedUsers: string[] = [];
          
          for (const [userId, technicianId] of activeCalls.entries()) {
            if (technicianId === techId) {
              const userSocketId = userSocketMap.get(userId);
              if (userSocketId) {
                io.to(userSocketId).emit('supportEnded', { userId });
              }
              impactedUsers.push(userId);
            }
          }
          
          impactedUsers.forEach(userId => activeCalls.delete(userId));
          
          console.log(`Technician ${techId} disconnected`);
          break;
        }
      }
    });
  });
};

export const getWebRTCMaps = () => {
  return {
    supportRequests,
    technicians,
    userSocketMap,
    techSocketMap,
    activeCalls
  };
};

export default setupWebRTCHandlers;