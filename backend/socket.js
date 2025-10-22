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


