//here we will make the controllers
const User = require("../../models/Users/users");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET_KEY;
const bcrypt = require('bcryptjs')
const OTPGen = function () {
    return Math.floor(Math.random() * (10000 - 1000) + 1000)
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "panchalpriyanshu124@gmail.com",
        pass: "fgyp jtwl lnyq eclo"
    }
});
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json("User already exists with this mail ID")
        }
        const OTP = OTPGen();
        const OTPexpiry = new Date(Date.now() + 10 * 60 * 1000);
        const hashedpass = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedpass, OTP, OTPexpiry, role });
        await user.save();
        await transporter.sendMail({
            from: "panchalpriyanshu124@gmail.com",
            to: email,
            subject: "OTP verification",
            text: `Dear ${user.name} Your otp is ${OTP}`
        });
        res.status(201).json("User registered.Please verify via OTP send to you email")
    }
    catch (err) {
        console.error(err)
    }

};
exports.verifyOTP = async (req, res) => {
    try {
        const { email, OTP } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json("User not found please enter valid email ID")
        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" })
        }
        if (user.OTP !== OTP || user.OTPexpiry < new Date()) {
            const fotp = OTPGen();
            user.OTP = fotp;
            await user.save();
            return res.status(400).json({ message: "OTP invalid or Expired" })
        }
        user.isVerified = true;
        user.OTP = undefined;
        user.OTPexpiry = undefined;
        await user.save();
        return res.status(200).json({ message: "User verified successfully.Please return to Login" })

    } catch (error) {
        console.error(error);
    }

};
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json("User not found");
        if (user.isVerified) {
            return res.status(400).json({ message: "user already verified" });
        }
        const otp = OTPGen();
        const OTPexpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.OTP = otp;
        user.OTPexpiry = OTPexpiry
        await user.save();
        await transporter.sendMail({
            from: "panchalpriyanshu124@gmail.com",
            to: email,
            subject: "Resend OTP verification",
            text: `Your new otp is ${otp}`
        })
        res.json({ message: "OTP send successfully" });


    }
    catch (err) {
        console.error(err);
    }
};
exports.login = async (req, res) => {
    try {
        // console.log("BODY:", req.body);
        const { email, password, role } = req.body;
        // let user=await User.findOne({email,role});//for role based AUTHENTICATION
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
        const cmp = await bcrypt.compare(password, user.password);
        if (!cmp) {
            return res.status(400).json({ message: "Invalid password" })
        }
        if (!user.isVerified) return res.status(400).json("User not verified")
        //  req.session.user={id:user._id,email:user.email,name:user.name};
        //  res.json("login successfull");
        const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role },
            key
        )
        //      res.status(200).json({
        //   message: "Login successful",
        //   token
        // });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "Login Successfull" ,
                            user})




    }
    catch (err) {
        console.error(err)
    }
};
// exports.logout=async(req,res)=>{
//     req.session.destroy((err)=>{
//         if(err)return res.status(400).json("Error logging out")
//         res.json("logged out successfully")
//     })
// };
exports.dashboard = async (req, res) => {
    res.json({ message: `Welcome to the dashboard ${req.user.name} Your role is ${req.user.role}` })
};
exports.resendPassOTP = async (req, res) => {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json("User not found");
        // if(user.isVerified){
        //     return res.status(400).json({message:"user already verified"});
        // }
        // user.isVerified=false;
        const otp = OTPGen();
        const OTPexpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.OTP = otp;
        user.OTPexpiry = OTPexpiry
        await user.save();
        await transporter.sendMail({
            from: "panchalpriyanshu124@gmail.com",
            to: email,
            subject: "Resend OTP verification",
            text: `Your new otp is ${otp}`
        })
        res.json({ message: "OTP send successfully" });


    }
    catch (err) {
        console.error(err);
    }
};
exports.verifyPassResOtp = async (req, res) => {
    try {
        const { email, OTP } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json("User Does Not Exist");
        if (!OTP) return res.status(400).json("OTP not provided");
        if (user.OTP !== OTP || user.OTPexpiry < new Date()) return res.status(400).json("Invalid OTP");
        user.isVerified = true;
        user.OTP = undefined;
        user.OTPexpiry = undefined;
        await user.save();
        return res.status(200).json({ message: "User verified successfully.Please return to Reset Password" })

    } catch (error) {
        console.error(error);
    }

}
exports.forgetpass = async (req, res) => {
    try {
        const { email, OTP, pass, newpass } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User does not Exist" });
        if (!pass || !newpass || !OTP) {
            return res.status(400).json("All details required");
        }
        // pass= await bcrypt.hash(pass,10);
        // newpass=await bcrypt.hash(newpass,10);
        if (user.OTP !== OTP || user.OTPexpiry < new Date()) return res.status(400).json("Invalid OTP");
        user.isVerified = true;
        user.OTP = undefined;
        user.OTPexpiry = undefined;
        await user.save();
        if (pass !== newpass) {
            return res.status(401).json("Password Didnt Match")
        }
        const updated = await bcrypt.hash(pass, 10);
        user.password = updated;
        await user.save();
        res.status(200).json({message:"Password Reset Successfuly done"})

    } catch (error) {
        console.error(error);
    }

}
exports.getAllUsers=async(req,res)=>{
    try {
        const users= await User.find().select("-password");
        res.status(200).json({message:"Here are the users",users});

    } catch (error) {
        console.error("Error fetching users")
    }
}

exports.logout=async(req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
        });
        res.status(200).json({
            message:"Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            message:"Logout failed"
        })
    }
}
exports.getMe=async(req,res)=>{
    try {
        const user=await User.findById(req.user.id).select("-password");
        res.status(200).json({user});
    } catch (error) {
        res.status(401).json({message:"Not authenticated"})
    }
}

