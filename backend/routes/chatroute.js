const express=require("express");
const router=express.Router();
const auth=require("../middleware/authmiddleware")
const {chats,getLatestChat}=require("../controllers/chatController/chatController")

router.get("/last-messages/:userId",auth,getLatestChat)
router.get("/:user1/:user2",auth,chats);
module.exports=router;