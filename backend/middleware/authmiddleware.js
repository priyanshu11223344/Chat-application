const jwt=require("jsonwebtoken");

module.exports=(req,res,next)=>{
    
    try {
        const token=req.cookies.token;
        if(!token){
            return res.status(400).json("token-missing");
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user=decoded;//{id,email}
        next();
    } catch (error) {
        console.error(error);
    }
};