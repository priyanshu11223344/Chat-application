const express=require('express');
const app=express();
const session=require('express-session')
const http=require("http");
const {Server}=require("socket.io");
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const cors=require('cors')
const connectDB=require("./config/db.js")
const chatSocket=require("./socket/chatSocket.js")
const cookieParser = require("cookie-parser");
const groupRoutes=require("./routes/groupRoute.js")
// app.use(session({
//     secret:"supersecretkey",
//     resave:false,
//     saveUninitialized:true,
//     cookie:{secure:false}
// }))
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const authRoutes=require("./routes/authroute")
const chatRoutes=require("./routes/chatroute.js")
app.use("/api/auth",authRoutes);
app.use('/api/chat',chatRoutes);
app.use("/api/group",groupRoutes);
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        credentials:true,
    }
})
chatSocket(io);
server.listen(5000,()=>{
    console.log("port running");
})
connectDB()
 