const onlineUsers = {};
const Message = require("../models/one-to-one_chat/message")
const chatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);
        socket.on("register", (userId) => {
            onlineUsers[userId] = socket.id;
            console.log("Online users:", onlineUsers);
        });
        socket.on("private_message", async ({ from, to, message }) => {
            try {
                const savedMessage = await Message.create({
                    sender: from,
                    receiver: to,
                    message: message,
                });
        
                // 🔥 Emit to receiver
                const receiverSocket = onlineUsers[to];
                if (receiverSocket) {
                    io.to(receiverSocket).emit("receiver_message", savedMessage);
                }
        
                // 🔥 ALSO emit back to sender
                const senderSocket = onlineUsers[from];
                if (senderSocket) {
                    io.to(senderSocket).emit("receiver_message", savedMessage);
                }
        
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });
        
        socket.on("disconnect", () => {
            for (let user in onlineUsers) {
                if (onlineUsers[user] === socket.id) {
                    delete onlineUsers[user]
                    break;
                }

            }
            console.log("User disconnected:", socket.id);
        });
        socket.on("join-group",(groupIds)=>{
            groupIds.forEach((id)=>socket.join(id));
        });
        socket.on("send-group-message",(data)=>{
            io.to(data.groupId).emit("receive-group-message",data);
        })
    });
};
module.exports = chatSocket;