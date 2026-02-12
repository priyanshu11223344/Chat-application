import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/auth/authThunk";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-4 h-16 bg-gray-200">
      {/* Left */}
      <div className="font-bold">
        LOGO
      </div>

      {/* Right */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;

