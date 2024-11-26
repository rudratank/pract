import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModels.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  const userSocketMap = new Map();

  const handleDisconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`Removed user ${userId} from the socket map.`);
        break;
      }
    }
  };

  const sendMessage=async(message)=>{
    
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId=userSocketMap.get(message.recipient);

    const createdMessage = await Message.create(message);

    const messageData=await Message.findById(createdMessage._id).populate("sender","id email firstName lastName image color")
    .populate("recipient","id email firstName lastName image color");

    if(recipientSocketId){
      io.to(recipientSocketId).emit("reciveMessage",messageData)
    }
    if(senderSocketId){
      io.to(senderSocketId).emit("sendetMessage",messageData)

    }
  }

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.warn("User ID not provided during connection.");
      socket.disconnect();
    }

    socket.on("SendMessage",sendMessage)

    socket.on("disconnect", () => handleDisconnect(socket));

    socket.on("send_message", (message) => {
      console.log(`Message from ${userId}: ${message}`);
    });
  });
};

export default setupSocket;
