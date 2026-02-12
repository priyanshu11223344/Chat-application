const mongoose=require("mongoose");
const grp_msg_schema=new mongoose.Schema({
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group",
        required:true
    },
    sender:{
        type:String,
        required:true,
    },
    senderName:{
        type:String,
        required:true,
    },
    message:{
         type:String, 
         required:true
    }
},
{timestamps:true});
module.exports=mongoose.model("GroupMessage",grp_msg_schema)