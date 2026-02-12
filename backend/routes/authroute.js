const express=require('express');
 const auth=require("../middleware/authmiddleware")
 const role=require("../middleware/rolemiddleware");
const {register,verifyOTP,resendOTP,login,resendPassOTP,verifyPassResOtp,forgetpass,getAllUsers,logout,getMe}=require("../controllers/authController/authcontroller");
const router=express.Router();
router.post("/register",register);
router.post("/verify-otp",verifyOTP);
router.post("/resend-otp",resendOTP);
router.post("/resend-pass-otp",resendPassOTP)
router.post("/login",login);
// router.post('/logout',logout);
router.post("/forget-pass",forgetpass);
router.post("/Verify-reset-pass-otp",verifyPassResOtp)
router.post("/logout",logout);
router.get(
    "/dashboard/user",
    auth,
    role("User"),
    (req, res) => {
      res.json({ message: `User dashboard: ${req.user.name} Role is ${req.user.role}` });
    }
  );
  router.get(
    "/dashboard/sub-admin",
    auth,
    role("Sub-admin"),
    (req, res) => {
      res.json({ message: `Sub-admin dashboard: ${req.user.name}  Role is ${req.user.role}` });
    }
  );
  router.get(
    "/dashboard/admin",
    auth,
    role("Admin"),
    (req, res) => {
      res.json({ message: `Admin dashboard: ${req.user.name}  Role is ${req.user.role}` });
    }
  );
  router.get("/dashboard", auth, (req, res) => {
    const role = req.user.role;
  
    if (role === "Admin") return res.json({ redirect: "/api/auth/dashboard/admin" });
    if (role === "Subadmin") return res.json({ redirect: "/api/auth/dashboard/sub-admin" });
    return res.json({ redirect: "/api/auth/dashboard/user" });
  });
  router.get("/getAllUsers",auth,getAllUsers)
  router.get("/me",auth,getMe)
  
module.exports=router;