import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/auth/authThunk";
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  // ⛔ Block app rendering until auth check finishes
  if (loading) {
    return null; // or a spinner
  }

  return children;
};

export default AuthInitializer;
