import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
import {
  loadChats,
  loadGroupMessages,
  sendGroupMessage
} from "../../redux/chat/chatThunk";
import {
  addMessage,
  addGroupMessage
} from "../../redux/chat/chatSlice";

const ChatArea = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.auth);
  const {
    selectedUser,
    selectedGroup,
    messages,
    groupMessages,
    loading
  } = useSelector((state) => state.chat);

  // 🔥 Decide active messages
  const activeMessages = selectedGroup ? groupMessages : messages;

  /* ---------------- REGISTER USER ---------------- */
  useEffect(() => {
    if (!user?._id) return;
    socket.emit("register", user._id);
  }, [user]);

  /* ---------------- LOAD PRIVATE CHAT ---------------- */
  useEffect(() => {
    if (!user?._id || !selectedUser?._id) return;

    dispatch(
      loadChats({
        senderId: user._id,
        receiverId: selectedUser._id,
      })
    );
  }, [selectedUser, user, dispatch]);

  /* ---------------- LOAD GROUP CHAT ---------------- */
  useEffect(() => {
    if (!selectedGroup?._id) return;

    dispatch(loadGroupMessages(selectedGroup._id));
  }, [selectedGroup, dispatch]);

  /* ---------------- PRIVATE MESSAGE LISTENER ---------------- */
  useEffect(() => {
    socket.on("receiver_message", (data) => {
      dispatch(addMessage(data));
    });

    return () => socket.off("receiver_message");
  }, [dispatch]);

  /* ---------------- GROUP MESSAGE LISTENER ---------------- */
  useEffect(() => {
    socket.on("receive-group-message", (data) => {
      dispatch(addGroupMessage(data));
    });

    return () => socket.off("receive-group-message");
  }, [dispatch]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = () => {
    if (!message.trim() || !user?._id) return;

    // 🔥 GROUP MESSAGE
    if (selectedGroup?._id) {

      socket.emit("send-group-message", {
        groupId: selectedGroup._id,
        sender: user._id,
        senderName: user.name,
        message,
        createdAt: new Date().toISOString(),
      });

      // Save to DB only
      dispatch(
        sendGroupMessage({
          groupId: selectedGroup._id,
          message,
        })
      );
    }

    // 🔥 PRIVATE MESSAGE
    else if (selectedUser?._id) {
      socket.emit("private_message", {
        from: user._id,
        to: selectedUser._id,
        message,
      });
    }

    setMessage("");
  };

  /* ---------------- EMPTY STATE ---------------- */
  if (!selectedUser && !selectedGroup) {
    return (
      <div className="p-4 text-white">
        Select a chat to start messaging
      </div>
    );
  }
  console.log("active", activeMessages)
  return (
    <div className="flex flex-col h-full w-full">

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-600">
        {loading ? (
          <p>Loading chats...</p>
        ) : (
          activeMessages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${msg.sender === user._id ? "text-right" : "text-left"
                }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg text-sm ${msg.sender === user._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                  }`}
              >
                {selectedGroup && msg.sender !== user._id && (
                  <div className="text-xs font-semibold text-green-800">
                    {msg.senderName}
                  </div>
                )}

                {msg.message}

                <div className="flex justify-end">
                  <span className={`text-xs ${msg.sender!==user._id?"text-gray-400":"text-black"}`}>
                    {msg.createdAt &&
                      new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                  </span>
                </div>
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="flex gap-2 p-3 border-t shrink-0 bg-gray-800">
        <input
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
