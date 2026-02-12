import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/auth/authThunk";
import { setSelectedGroup, setSelectedUser } from "../../redux/chat/chatSlice";
import { getLastMessage } from "../../redux/chat/chatThunk";
import { FaSearch } from "react-icons/fa";
import { createGroup } from "../../redux/chat/chatThunk";
import { loadGroups } from "../../redux/chat/chatThunk";
import { socket } from "../../socket";
import { FaUsers, FaUser } from "react-icons/fa";
const LeftSideBar = () => {
  const dispatch = useDispatch();

  const { users, user: userId } = useSelector((state) => state.auth);
  const { selectedUser, lastChats, groups } = useSelector(
    (state) => state.chat
  );

  const [search, setSearch] = useState("");

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [members, setSelectedMembers] = useState([]);
  const [groupSearch, setGroupSearch] = useState("");

  const lastMessageMap = {};

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(loadGroups());
  }, [dispatch]);

  useEffect(() => {
    if (userId?._id) {
      dispatch(getLastMessage({ userId: userId._id }));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (groups.length > 0) {
      const groupIds = groups.map((g) => g._id);
      socket.emit("join-group", groupIds);
    }
  }, [groups]);

  lastChats.forEach((chat) => {
    lastMessageMap[chat._id] = chat.lastMessage;
  });
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredGroups = groups.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );
  // console.log(merged)
  const toggleMember = (user) => {
    setSelectedMembers((prev) =>
      prev.some((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName || members.length === 0) return;

    dispatch(createGroup({ name: groupName, members }));

    setGroupName("");
    setSelectedMembers([]);
    setGroupSearch("");
    setShowGroupModal(false);
  };

  const formatLastMessage = (text) => {
    if (!text) return "";
    const words = text.split(" ").slice(0, 4).join(" ");
    return words.length > 16 ? words.slice(0, 16) + "…" : words;
  };

  return (
    /* ✅✅✅ CHANGE MADE HERE */
    /* Added overflow-y-auto to make whole sidebar scrollable */
    <div className="h-full flex flex-col overflow-y-auto scroll-smooth font-poppins">
      {/* SEARCH */}
      <div className="px-3 pt-3">
        <div
          className="
      flex items-center gap-2
     
      px-3 py-1.5
      rounded-4xl
     
      focus-within:border-green-500
      transition-all duration-200
      mb-2
    "
        >
          <FaSearch size={22} className="text-gray-400 text-sm" />

          <input
            type="search"
            className="
        bg-black
        outline-none
        border-none
        rounded-3xl
        focus:ring-0
        appearance-none
        text-black
        placeholder-gray-700
        w-full
        text-sm
      "
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>



      {/* CREATE GROUP */}
      <button
        onClick={() => setShowGroupModal(true)}
        className="text-white bg-green-800 mx-4 mb-2 px-3 py-1 rounded hover:bg-green-600"
      >
        Create Group
      </button>

      {/* GROUPS */}
      {groups.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center ">
            <div>
              <FaUsers className="text-white mx-[14px] mt-[4px]" size={29} />
            </div>
            <div className="text-white text-[20px] px-2 pt-2  ">Groups</div>
          </div>

          {/* ❌ Removed inner scroll container */}
          {filteredGroups.map((group) => (
            <div
              key={group._id}
              className="text-white hover:bg-gray-600 mx-2 my-1 p-2 rounded cursor-pointer"
              onClick={() => dispatch(setSelectedGroup(group))}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                  {group.name[0].toUpperCase()}
                </div>
                <div>
                  <div>{group.name}</div>
                  <div className="text-xs text-gray-300">
                    {formatLastMessage(group.lastMessage)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USERS */}
      <div>
        <div className="flex items-center">
          <div className="text-white mt-4 ml-5 te"><FaUser /></div>
          <div className="text-white mx-[17px] mt-[14px] text-xl font-light">Users</div>
        </div>

        {/* ❌ Removed inner scroll container */}
        <ul>
          {filteredUsers.map(
            (user) =>
              userId?._id !== user._id && (
                <li
                  key={user._id}
                  onClick={() => dispatch(setSelectedUser(user))}
                  className={`text-white p-2 mx-2 my-1 rounded cursor-pointer hover:bg-gray-600 ${selectedUser?._id === user._id ? "bg-gray-700" : ""
                    }`}
                >
                  <div className="flex gap-3 items-center">
                    <div className="h-7 w-7 bg-gray-500 rounded-full" />
                    <div>
                      <div>{user.name}</div>
                      <div className="text-xs text-gray-300">
                        {formatLastMessage(lastMessageMap[user._id])}
                      </div>
                    </div>
                  </div>
                </li>
              )
          )}
        </ul>
      </div>

      {/* CREATE GROUP MODAL */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">Create Group</h2>
              <button onClick={() => setShowGroupModal(false)}>✕</button>
            </div>

            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="border w-full mb-2 px-2 py-1 rounded"
            />

            <input
              type="text"
              placeholder="Search users"
              value={groupSearch}
              onChange={(e) => setGroupSearch(e.target.value)}
              className="border w-full mb-2 px-2 py-1 rounded"
            />

            {/* Modal scroll kept separate */}
            <div className="max-h-[200px] overflow-y-auto">
              {users
                .filter(
                  (u) =>
                    u._id !== userId._id &&
                    u.name.toLowerCase().includes(groupSearch.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user._id}
                    onClick={() => toggleMember(user)}
                    className={`p-2 rounded cursor-pointer mb-1 ${members.some((u) => u._id === user._id)
                      ? "bg-green-200"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    {user.name}
                  </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setShowGroupModal(false)}
                className="border px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={!groupName || members.length === 0}
                className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSideBar;
