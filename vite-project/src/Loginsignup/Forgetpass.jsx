import React, { useState } from 'react'
import "./Forgetpass.css"
import { useDispatch } from 'react-redux';
import { resetPassword } from '../redux/auth/authThunk';
const Forgetpass = () => {
    const [email,setemail]=useState("");
    const [pass,setpass]=useState("");
    const [confirm,setconfirm]=useState("");
    const [OTP,setOTP]=useState(null);
    const dispatch=useDispatch();

    const handleResetPass=()=>{
        dispatch(resetPassword({email,OTP:Number(OTP),pass,newpass:confirm}))
        console.log(email,OTP,pass,confirm)

    }
    return (
      <form className="flex flex-col gap-4 mt-6" onSubmit={handleResetPass}>
        <h2 className="text-xl font-semibold text-center">Reset Password</h2>
  
        <input className="border p-2 rounded" placeholder="Email" value={email} onChange={(e)=>setemail(e.target.value)}/>
        <input className="border p-2 rounded" placeholder="OTP" value={OTP} onChange={(e)=>setOTP(e.target.value)}/>
        <input className="border p-2 rounded" placeholder="New Password" value={pass} onChange={(e)=>setpass(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Confirm Password" value={confirm} onChange={(e)=>setconfirm(e.target.value)} />
  
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
    );
  };
  
  export default Forgetpass;
  