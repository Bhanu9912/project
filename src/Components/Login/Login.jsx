import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../slice";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading}=useSelector((state)=>state.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    try {
      const credentials = { email, password };
      const result = await dispatch(loginUser(credentials)).unwrap();
      toast.success("Login successful!");
      localStorage.setItem("user", JSON.stringify(result));
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err?.message || err?.response?.data?.message || "Invalid credentials.";
      toast.error(msg);
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/image.jpg')] bg-cover flex items-center px-100">
      <div className="rounded-lg w-full px-50 py-20 flex justify-end flex-col">
        <h2 className="text-2xl font-semibold text-center mb-8">
          LOGIN TO YOUR ACCOUNT
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-indigo-600 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
