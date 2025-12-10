

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../authSlice";


import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  // -------- Redux Login Logic ---------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { loading } = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth) || {};
  useEffect(() => {
  if (authState.isAuthenticated) {
    navigate("/home");
  }
}, [authState.isAuthenticated]);

  const loading = authState.loading || false;


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
    } catch (err) {
      console.error("Login dispatch error:", err);
      // If axios response present, log the server response body for debugging
      try {
        console.error("Server response:", err?.response?.data ?? err?.payload ?? err);
      } catch (e) {
        console.error(e);
      }
      const msg =
        err?.message || err?.response?.data?.message || "Invalid credentials.";

      toast.error(msg);
      setError(msg);
    }
  };

  // ------------ UI Animations (eyes, hearts, skew, trails) ------------------

  const emojis = ["❤️", "😍", "🙈", "😘", "❤️‍🔥"];
  const [hearts, setHearts] = useState([]);
  const [blushVisible, setBlushVisible] = useState(false);

  const parentRefs = useRef([]);
  const containerRefs = useRef([]);
  parentRefs.current = [];
  containerRefs.current = [];

  const circleRef = useRef(null);
  const innerCircleRef = useRef(null);
  const innerInnerCircleRef = useRef(null);

  const createHeart = useCallback(() => {
    const id = Date.now() + Math.random();

    const left = Math.random() * window.innerWidth;
    const top = window.innerHeight - 200;

    const fontSize = 20 + Math.random() * 40;
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    setHearts((prev) => [...prev, { id, left, top, fontSize, emoji }]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 2000);
  }, []);

  useEffect(() => {
    const h = (e) => {
      const x = e.clientX,
        y = e.clientY;

      setTimeout(
        () =>
          circleRef.current?.style.setProperty(
            "transform",
            `translate(${x}px,${y}px)`
          ),
        100
      );
      setTimeout(
        () =>
          innerCircleRef.current?.style.setProperty(
            "transform",
            `translate(${x}px,${y}px)`
          ),
        200
      );
      setTimeout(
        () =>
          innerInnerCircleRef.current?.style.setProperty(
            "transform",
            `translate(${x}px,${y}px)`
          ),
        300
      );

      if (parentRefs.current.length > 0) {
        const rect = parentRefs.current[0].getBoundingClientRect();
        const dx = x - rect.left;
        const dy = y - rect.top;
        const angle = Math.atan2(dy, dx);

        const deg = (angle * 180) / Math.PI;

        parentRefs.current.forEach((ref) => {
          if (ref) ref.style.transform = `rotate(${deg + 120}deg)`;
        });

        containerRefs.current.forEach((ref) => {
          if (ref) ref.style.transform = `skew(${deg / 10}deg)`;
        });
      }
    };

    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const triggerLoginAnimation = () => {
    setBlushVisible(true);

    for (let i = 0; i < 40; i++) {
      setTimeout(createHeart, i * 80);
    }

    setTimeout(() => setBlushVisible(false), 2000);
  };

  return (
    <div
      className="
        w-screen h-screen 
        flex flex-col md:flex-row-reverse 
        items-center justify-center md:justify-start
        overflow-hidden relative
      "
    >
      {/* RIGHT SIDE (FORM) */}
      <div className="w-full md:w-1/2 h-auto md:h-full flex items-center justify-center bg-white py-10 md:py-0">

        <form
          onSubmit={(e) => {
            triggerLoginAnimation();
            handleLogin(e);
          }}
          className="bg-white shadow-form rounded-2xl 
          w-11/12 sm:w-3/4 md:w-3/5 
          p-6 flex flex-col gap-6 
          shadow-[0px_5px_30px_1px_rgba(0,0,0,0.5)]"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Login
          </h1>

          {error && <p className="text-red-600 text-center">{error}</p>}

          {/* EMAIL */}
          <div className="group relative">
            <label
              className={`font-semibold absolute duration-300 
                group-focus-within:-top-6 group-focus-within:text-[13px]
                ${email ? "-top-6 text-[14px]" : "top-0"}
            `}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b outline-none pt-2 text-sm sm:text-base"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="group relative">
            <label
              className={`font-semibold absolute duration-300 
                group-focus-within:-top-6 group-focus-within:text-[13px]
                ${password ? "-top-6 text-[14px]" : "top-0"}
            `}
            >
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b outline-none pr-10 pt-2 text-sm sm:text-base"
                required
              />

              <span
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-1 bottom-0 cursor-pointer text-xl"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-lg py-2 text-lg mt-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* NAVIGATE */}
          <p className="text-center mt-3 text-sm sm:text-base">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-500 cursor-pointer underline"
            >
              Register
            </span>
          </p>
        </form>
      </div>

      {/* LEFT SIDE ANIMATED EYES */}
      <div className="w-full md:w-1/2 h-[300px] md:h-full relative overflow-hidden hidden md:flex">

        {/* Hearts flying */}
        {hearts.map((h) => (
          <div
            key={h.id}
            className="fixed animate-floatup pointer-events-none text-red-500"
            style={{ left: h.left, top: h.top, fontSize: h.fontSize }}
          >
            {h.emoji}
          </div>
        ))}

        {/* Container 1 */}
        <div
          ref={(el) => el && containerRefs.current.push(el)}
          className="fixed bottom-0 left-0 w-[100px] h-[200px] bg-sky-400 flex gap-5"
        >
          {[0, 1].map((i) => (
            <div key={i} className="h-[50px] w-[50px] flex justify-center items-center">
              <div
                ref={(el) => el && parentRefs.current.push(el)}
                className="h-[30px] w-[30px] bg-black rounded-full relative"
              >
                <div className="h-[10px] w-[10px] bg-white rounded-full absolute translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>
          ))}

          {blushVisible && (
            <div className="absolute top-[60px] w-full px-5 flex justify-between">
              <div className="w-[12%] h-[18px] bg-[rgba(255,80,80,0.8)] blur-md rounded-full"></div>
              <div className="w-[12%] h-[18px] bg-[rgba(255,80,80,0.8)] blur-md rounded-full"></div>
            </div>
          )}
        </div>

        {/* Container 2 */}
        <div
          ref={(el) => el && containerRefs.current.push(el)}
          className="fixed bottom-0 left-[100px] w-[250px] h-[150px] bg-yellow-300 rounded-t-[50px] flex justify-center gap-5"
        >
          {[0, 1].map((i) => (
            <div key={i} className="h-[50px] w-[50px] flex justify-center items-center">
              <div
                ref={(el) => el && parentRefs.current.push(el)}
                className="h-[30px] w-[30px] bg-black rounded-full relative"
              >
                <div className="h-[10px] w-[10px] bg-white rounded-full absolute translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>
          ))}

          {blushVisible && (
            <div className="absolute top-[60px] w-full px-5 flex justify-between">
              <div className="w-[12%] h-[18px] bg-[rgba(255,80,80,0.8)] blur-md rounded-full"></div>
              <div className="w-[12%] h-[18px] bg-[rgba(255,80,80,0.8)] blur-md rounded-full"></div>
            </div>
          )}
        </div>

        {/* Container 3 */}
        <div
          ref={(el) => el && containerRefs.current.push(el)}
          className="fixed bottom-0 left-[30px] w-[150px] h-[300px] bg-lime-400 rounded-t-[50px] -z-10 flex justify-center gap-5"
        >
          {[0, 1].map((i) => (
            <div key={i} className="h-[50px] w-[50px] flex justify-center items-center">
              <div
                ref={(el) => el && parentRefs.current.push(el)}
                className="h-[30px] w-[30px] bg-black rounded-full relative"
              >
                <div className="h-[10px] w-[10px] bg-white rounded-full absolute translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>
          ))}

          {blushVisible && (
            <div className="absolute top-[60px] w-full px-5 flex justify-between">
              <div className="w-[12%] h-[18px] bg-[rgba(255,80,80,0.8)] blur-md rounded-full"></div>
              <div className="w-[12%] h-[18px] bg-[rgba(255,80,80,0.8)] blur-md rounded-full"></div>
            </div>
          )}
        </div>

        {/* Container 4 */}
        <div
          ref={(el) => el && containerRefs.current.push(el)}
          className="fixed bottom-0 left-[150px] w-[150px] h-[250px] bg-red-300 rounded-t-[50px] -z-10 flex justify-center gap-5"
        >
          {[0, 1].map((i) => (
            <div key={i} className="h-[50px] w-[50px] flex justify-center items-center">
              <div
                ref={(el) => el && parentRefs.current.push(el)}
                className="h-[30px] w-[30px] bg-black rounded-full relative"
              >
                <div className="h-[10px] w-[10px] bg-white rounded-full absolute translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>
          ))}

          {blushVisible && (
            <div className="absolute top-[60px] w-full px-5 flex justify-between">
              <div className="w-[12%] h-[18px] bg-[rgba(255,80,80,0.8)] blur-md rounded-full"></div>
              <div className="w-[12%] h-[18px] bg-[rgba(255,80,80,0.8)] blur-md rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../../authSlice";
// import { FiEye, FiEyeOff } from "react-icons/fi";

// const Login = () => {
//   // --------------------- STATE ---------------------
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const authState = useSelector((state) => state.auth) || {};
//   const loading = authState.loading || false;

//   // --------------------- REDIRECT AFTER LOGIN ---------------------
//   useEffect(() => {
//     if (authState.isAuthenticated) {
//       navigate("/home");
//     }
//   }, [authState.isAuthenticated, navigate]);

//   // --------------------- LOGIN HANDLER ---------------------
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Please fill in both fields.");
//       return;
//     }

//     try {
//       const credentials = { email, password };
//       await dispatch(loginUser(credentials)).unwrap();
//       toast.success("Login successful!");
//     } catch (err) {
//       const msg =
//         err?.message || err?.response?.data?.message || "Invalid credentials.";
//       toast.error(msg);
//       setError(msg);
//     }
//   };

//   // -------------------------------------------------------------
//   // CLEAN VERSION: ALL ANIMATION CODE REMOVED FOR STABILITY
//   // -------------------------------------------------------------

//   return (
//     <div
//       className="
//         w-screen h-screen 
//         flex items-center justify-center
//         overflow-hidden relative bg-white
//       "
//     >
//       {/* RIGHT SIDE (FORM) */}
//       <div className="w-full max-w-md bg-white py-10 px-8 shadow-lg rounded-xl border">
//         <form onSubmit={handleLogin} className="flex flex-col gap-6">
//           <h1 className="text-3xl font-bold text-center">Login</h1>

//           {error && <p className="text-red-600 text-center">{error}</p>}

//           {/* EMAIL */}
//           <div className="relative">
//             <label className="font-semibold">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border-b outline-none pt-2 text-sm"
//               required
//             />
//           </div>

//           {/* PASSWORD */}
//           <div className="relative">
//             <label className="font-semibold">Password</label>

//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full border-b outline-none pr-10 pt-2 text-sm"
//                 required
//               />

//               <span
//                 onClick={() => setShowPassword((p) => !p)}
//                 className="absolute right-1 bottom-1 cursor-pointer text-xl"
//               >
//                 {showPassword ? <FiEyeOff /> : <FiEye />}
//               </span>
//             </div>
//           </div>

//           {/* LOGIN BUTTON */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-black text-white rounded-lg py-2 text-lg mt-4"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>

//           {/* NAVIGATE */}
//           <p className="text-center mt-3 text-sm">
//             Don’t have an account?{" "}
//             <span
//               onClick={() => navigate("/register")}
//               className="text-blue-500 cursor-pointer underline"
//             >
//               Register
//             </span>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../../authSlice";
// import { FiEye, FiEyeOff } from "react-icons/fi";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const authState = useSelector((state) => state.auth);

//   // Redirect after login
//   useEffect(() => {
//     if (authState.isAuthenticated) {
//       navigate("/home");
//     }
//   }, [authState.isAuthenticated, navigate]);

//   const loading = authState.loading;

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Please fill in both fields.");
//       return;
//     }

//     try {
//       const credentials = { email, password };
//       await dispatch(loginUser(credentials)).unwrap();

//       toast.success("Login successful!");
//     } catch (err) {
//       const msg =
//         err?.message ||
//         err?.response?.data?.message ||
//         "Invalid credentials.";

//       toast.error(msg);
//       setError(msg);
//     }
//   };

//   return (
//     <div className="w-screen h-screen flex items-center justify-center bg-white">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white shadow-xl rounded-2xl w-11/12 sm:w-3/4 md:w-1/3 p-6 flex flex-col gap-6"
//       >
//         <h1 className="text-3xl font-bold text-center">Login</h1>

//         {error && <p className="text-red-600 text-center">{error}</p>}

//         {/* EMAIL */}
//         <div className="group relative">
//           <label
//             className={`font-semibold absolute duration-200
//               ${email ? "-top-6 text-sm" : "top-0"}
//             `}
//           >
//             Email
//           </label>

//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border-b outline-none pt-2 text-base"
//             required
//           />
//         </div>

//         {/* PASSWORD */}
//         <div className="group relative">
//           <label
//             className={`font-semibold absolute duration-200
//               ${password ? "-top-6 text-sm" : "top-0"}
//             `}
//           >
//             Password
//           </label>

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border-b outline-none pr-10 pt-2 text-base"
//               required
//             />

//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-1 bottom-0 cursor-pointer text-xl"
//             >
//               {showPassword ? <FiEyeOff /> : <FiEye />}
//             </span>
//           </div>
//         </div>

//         {/* LOGIN BUTTON */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-black text-white rounded-lg py-2 text-lg"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         {/* NAVIGATE */}
//         <p className="text-center mt-2">
//           Don’t have an account?{" "}
//           <span
//             onClick={() => navigate("/register")}
//             className="text-blue-500 cursor-pointer underline"
//           >
//             Register
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;
