

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../slice";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  // -------- Redux Login Logic ---------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

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

    const left = Math.random() * (window.innerWidth);
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
    <div className="w-screen h-screen flex flex-row-reverse overflow-hidden relative">

      {/* RIGHT SIDE (FORM) */}
      <div className="w-1/2 h-full flex items-center justify-center bg-white">

        <form
          onSubmit={(e) => {
            triggerLoginAnimation();
            handleLogin(e);
          }}
          className="bg-white shadow-form rounded-2xl w-3/5 p-6 flex flex-col gap-6 shadow-[0px_5px_30px_1px_rgba(0,0,0,0.5)]"
        >
          <h1 className="text-3xl font-bold text-center mb-2">Login</h1>

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
              className="w-full border-b outline-none pt-2"
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
                className="w-full border-b outline-none pr-10 pt-2"
                required
              />

              {/* Eye icon */}
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
          <p className="text-center mt-3">
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
      <div className="w-1/2 h-full relative">

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

        {/* --- CONTAINERS + EYES (Same as earlier) --- */}

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

