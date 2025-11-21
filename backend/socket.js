import { Server } from 'socket.io';

let io = null;

export function registerSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL || "http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", async (socket) => {
    try {
      // Accept userId via auth payload or query and join a room for targeted emits
      const auth = socket.handshake?.auth || {};
      const query = socket.handshake?.query || {};
      let userId = auth.userId || query.userId;
      
      // If token is provided, decode it to get userId
      if (!userId && auth.token) {
        try {
          const jwt = await import('jsonwebtoken');
          const payload = jwt.verify(auth.token, process.env.JWT_SECRET || "dev_secret");
          userId = payload.userId || payload.id;
        } catch (tokenError) {
          console.warn('Invalid token in socket auth:', tokenError.message);
        }
      }
      
      console.log(`🔌 Socket connected: ${socket.id}, userId: ${userId}`);
      
      if (userId) {
        socket.join(String(userId));
        console.log(`👤 User ${userId} joined room`);
      }

      // Handle joining chat room
      socket.on("join_chat", (chatId) => {
        socket.join(`chat_${chatId}`);
        console.log(`💬 User ${userId} joined chat ${chatId}`);
      });

      // Handle leaving chat room
      socket.on("leave_chat", (chatId) => {
        socket.leave(`chat_${chatId}`);
        console.log(`💬 User ${userId} left chat ${chatId}`);
      });

      // Handle typing indicator
      socket.on("typing", ({ chatId, isTyping }) => {
        socket.to(`chat_${chatId}`).emit("user_typing", {
          userId,
          isTyping
        });
      });

      socket.on("disconnect", () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
      });
    } catch (error) {
      console.error('❌ Socket connection error:', error);
    }
  });

  return io;
}

export { io };


