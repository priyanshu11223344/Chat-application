import React, { useEffect } from 'react'
import ChatArea from '../Components/Chat-area/Chats'
import Navbar from '../Components/Navbar/Navbar'
import LeftSideBar from '../Components/LeftSideBar/LeftSideBar'
import { useDispatch } from 'react-redux'
import { checkAuth } from '../redux/auth/authThunk'
import wp from "../assets/WhatsAppbg.jpg"
const Chat = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="h-screen md:w-[1500px] flex flex-col bg-gray-900">

      {/* NAVBAR */}
      <div className="h-[60px] shrink-0">
        <Navbar />
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-[210px] border-r sm:w-[250px]  border-gray-700">
          <LeftSideBar />
        </div>

        {/* CHAT AREA */}
        <div
  className="flex-1"
  style={{
    backgroundImage: `url(${wp})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}
>
  <ChatArea />
</div>


      </div>
    </div>
  );
};

export default Chat
