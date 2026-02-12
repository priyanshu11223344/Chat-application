const mongoose=require("mongoose");
const group_schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    admin:{
        type:String,
        required:true
    },
    members:{
        type:[String],
        required:true,
    },
    lastMessage:{
        type:String,
        default:""
    },
    lastMessageTime:{
        type:Date,
    }

},
{timestamps:true});
module.exports=mongoose.model("Group",group_schema)