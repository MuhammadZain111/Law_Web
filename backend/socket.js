export function registerSocket(io) {
  io.on("connection", (socket) => {
    try {
      // Accept userId via auth payload or query and join a room for targeted emits
      const auth = socket.handshake?.auth || {};
      const query = socket.handshake?.query || {};
      const userId = auth.userId || query.userId;
      if (userId) {
        socket.join(String(userId));
      }

      socket.on("disconnect", () => {});
    } catch (_) {}
  });
}


