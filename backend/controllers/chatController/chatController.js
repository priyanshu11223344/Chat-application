const message=require("../../models/one-to-one_chat/message")
exports.chats=async(req,res)=>{
try {
    const {user1,user2}=req.params;
    const messages=await message.find({
        $or:[
            {sender:user1,receiver:user2},
            {sender:user2,receiver:user1},
        ]
    }).sort({createdAt:1});
    res.json(messages);
} catch (error) {
    console.error("Error",error);
}
}
exports.getLatestChat = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const messages = await message.aggregate([
        {
          $match: {
            $or: [
              { sender: userId },
              { receiver: userId }
            ]
          }
        },
  
        // 1️⃣ Make latest message appear first inside each group
        { $sort: { createdAt: -1 } },
  
        // 2️⃣ Group by other user
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$sender", userId] },
                "$receiver",
                "$sender"
              ]
            },
            lastMessage: { $first: "$message" },
            lastMessageTime: { $first: "$createdAt" }
          }
        },
  
        // 3️⃣ FINAL SORT → latest chat first (THIS WAS MISSING)
        { $sort: { lastMessageTime: -1 } }
      ]);
  
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  
  