
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../authSlice";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());        // clear Redux user
    navigate("/");            // redirect to login page
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gray-50 text-gray-900">
        <div className="flex h-screen w-full">

          <div className="p-10">
            <h1 className="text-3xl font-semibold mb-6">Settings</h1>

            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;

