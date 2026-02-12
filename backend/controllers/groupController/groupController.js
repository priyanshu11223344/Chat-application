const Group=require("../../models/Group_chat/group_schema");
const GroupMessage=require("../../models/Group_chat/group_msg_schema")
/*------------------CREATE GROUP---------------------------------*/
exports.createGroup=async(req,res)=>{
    try {
        const{name,members}=req.body;
        const adminId=req.user.id;
        const group=await Group.create({
            name,
            admin:adminId,
            members:[...new Set([...members,adminId])],//ensure admin included

        });
        res.status(201).json({message:"Group created Successfully",group});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
// ----------------------------------GET GROUPS SIDEBAR-----------------------------
exports.getMyGroups=async(req,res)=>{
    try {
        const userId=req.user.id;
        console.log(userId);
        const groups=await Group.find({
            members:userId,
        }).sort({lastMessageTIme:-1});
        res.json(groups);

    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// ----------------GROUP MESSAGE CONTROLLER---------------------   

exports.sendGroupMessage=async(req,res)=>{
    try {
        const {groupId,message}=req.body;
        const senderId=req.user.id;
        const msg=await GroupMessage.create({
            groupId,
            sender:senderId,
            senderName:req.user.name,
            message,
        })
        //update group preview
        await Group.findByIdAndUpdate(groupId,{
            lastMessage:message,
            lastMessageTime:new Date(),
        })
        res.status(201).json(msg);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// ----------------GET MESSAGE OF GROUP---------------------
exports.getGroupMessages=async(req,res)=>{
    try {
        const {groupId}=req.params;
        const messages=await GroupMessage.find({groupId}).sort({
            createdAt:1,
        })
        res.json(messages);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}