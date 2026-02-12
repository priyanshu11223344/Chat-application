const express=require("express");
const router=express.Router();
const auth= require("../middleware/authmiddleware");
const {createGroup,getMyGroups,sendGroupMessage,getGroupMessages}=require("../controllers/groupController/groupController");
router.post("/create",auth,createGroup);
router.get("/my-groups",auth,getMyGroups);
router.post("/message",auth,sendGroupMessage);
router.get("/messages/:groupId",auth,getGroupMessages);
module.exports=router;