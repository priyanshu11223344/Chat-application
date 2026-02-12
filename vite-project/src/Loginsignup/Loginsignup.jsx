import React, { useState, useEffect } from "react";
import "./Loginsignup.css";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  resendPassOtp
} from "../redux/auth/authThunk";
import Forgetpass from "./Forgetpass";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isRightPanelActive, setRightPanelActive] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setError] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState(null);
  const [resetform, setresetform] = useState(false);

  const { isAuthenticated, otpVerified, errors } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) navigate("/chat");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (otpVerified) {
      alert("OTP verified. Please login.");
      setShowOtpPopup(false);
      setOtp("");
    }
  }, [otpVerified]);

  useEffect(() => {
    const activeError = Object.values(errors).find(Boolean);
  
    if (!activeError) return;
  
    let message;
  
    if (typeof activeError === "string") {
      message = activeError;
      // if(activeError.message==="User already exists with this mail ID"){
      //   setShowOtpPopup(false);
      // }
    } 
   
    else if (typeof activeError === "object") {
      
      message = activeError.message || activeError.error || "Something went wrong";
    }
  
    alert(message);
  }, [errors]);
  
  

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return setError("All fields required");
     dispatch(registerUser({ name, email, password }));
    setShowOtpPopup(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };
  const handleOtpReset = () => {
    alert("OTP re-sent. Please check your email");
    dispatch(resendOTP({ email }));
  };
  
  const handleResendOtp=()=>{
      setresetform(true)
      dispatch(resendPassOtp({email}));

  }

  return (
    <div className="App">
      <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}>

        {/* SIGN UP */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignup}>
            <div className="text-3xl font-semibold">Create Account</div>
            <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="auth-btn">Sign Up</button>
          </form>
        </div>

        {/* LOGIN */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <div className= "text-3xl font-semibold">Login</div>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <div className="forget-pass cursor-pointer" onClick={handleResendOtp}>Forget password</div>
            <button type="submit" className="auth-btn">Login</button>
          </form>
        </div>

        {/* OVERLAY */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <div className="text-4xl">Welcome Back!</div>
              <button className="auth-btn ghost" onClick={() => setRightPanelActive(false)}>Login</button>
            </div>
            <div className="overlay-panel overlay-right">
              <div className="text-2xl">Hello, Friend!</div>
              <button className="auth-btn ghost" onClick={() => setRightPanelActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpPopup &&
  createPortal(
    <div className="otp-overlay">
      <div className="otp-popup">
        <button
          className="otp-close"
          onClick={() => {
            setShowOtpPopup(false);
            setOtp("");
          }}
        >
          ✖
        </button>

        <h2>Verify OTP</h2>

        <input
          type="number"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          type="button"
          className="otp-verify-btn"
          onClick={() => dispatch(verifyOTP({ email, OTP: Number(otp) }))}
        >
          Verify
        </button>

        <button
          type="button"
          className="otp-resend-btn"
          onClick={handleOtpReset}
        >
          Resend OTP
        </button>
      </div>
    </div>,
    document.body
  )
}


      {/* FORGET PASSWORD MODAL */}
      {resetform &&
        createPortal(
          <div className="fixed top-0 left-0 w-screen h-screen z-9999 flex items-center justify-center bg-black/50">
            <div className="relative flex flex-col w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <button
                className="absolute right-3 mr-5 top-4 text-gray-500"
                onClick={() => setresetform(false)}
              >
                ✖
              </button>
              <Forgetpass />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default Login;
