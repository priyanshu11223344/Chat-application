const mongoose=require('mongoose');
const Users= new mongoose.Schema({
      name:{type:String,require:true},
      email:{
        type:String,
        require:true,
        unique:true
      },
      password:{
        type:String,
        require:true
      },
      OTP:{
        type:Number
      }
      ,
      OTPexpiry:{
        type:Date
      },
      isVerified:{
        type:Boolean,
        default:false
      },
      role:{
        type:String,
        default:"User"

      }

})
const user=mongoose.model('User',Users);
module.exports=user