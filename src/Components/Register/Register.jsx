import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../../slice";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";

// ================= CROPPER FUNCTION =================
const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(pixelCrop.width);
      canvas.height = Math.round(pixelCrop.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Crop failed"));
          const reader = new FileReader();
          reader.onloadend = () => resolve({ blob, dataUrl: reader.result });
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        0.9
      );
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
};

// ================= MAIN COMPONENT =================
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user || {});

  // FORM FIELDS
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePhoto: null,
  });

  // PREVIEW + ERRORS
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [formError, setFormError] = useState("");

  // PASSWORD EYE TOGGLE
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ================== CROPPER ==================
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef(null);

  // ================== ANIMATIONS ==================
  const [imageStage, setImageStage] = useState("idle");
  const [blushVisible, setBlushVisible] = useState(false);
  const [hearts, setHearts] = useState([]);

  const emojis = ["❤️", "😍", "🙈", "😘", "❤️‍🔥"];

  const parentRefs = useRef([]);
  const containerRefs = useRef([]);

  parentRefs.current = [];
  containerRefs.current = [];

  const createHeart = useCallback(() => {
    const id = Date.now() + Math.random();
    const left = Math.random() * (window.innerWidth / 4);
    const top = window.innerHeight - 200;
    const fontSize = 20 + Math.random() * 40;
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    setHearts((prev) => [...prev, { id, left, top, fontSize, emoji }]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 2000);
  }, []);

  const startPhotoAnimation = useCallback(() => {
    setImageStage("show");
    setBlushVisible(true);

    for (let i = 0; i < 50; i++) {
      setTimeout(createHeart, i * 80);
    }
  }, []);

  // ================== MOUSE EYE MOVEMENT ==================
  useEffect(() => {
    const handler = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (parentRefs.current.length > 0) {
        const rect = parentRefs.current[0].getBoundingClientRect();
        const dx = x - rect.left;
        const dy = y - rect.top;
        const deg = (Math.atan2(dy, dx) * 180) / Math.PI;

        parentRefs.current.forEach((ref) => {
          if (ref) ref.style.transform = `rotate(${deg + 120}deg)`;
        });

        containerRefs.current.forEach((ref) => {
          if (ref) ref.style.transform = `skew(${deg / 10}deg)`;
        });
      }
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // ================= INPUT HANDLERS ==================
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCropped = async () => {
    const { blob, dataUrl } = await getCroppedImg(imageSrc, croppedAreaPixels);

    const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

    setFormData((p) => ({ ...p, profilePhoto: file }));
    setProfilePhotoPreview(dataUrl);

    setShowCropper(false);
    startPhotoAnimation();
  };

  // ================= SUBMIT ==================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.profilePhoto) return setFormError("Upload your photo");
    if (formData.password !== formData.confirmPassword)
      return setFormError("Passwords do not match");

    try {
      const send = new FormData();

      send.append("username", formData.username);
      send.append("email", formData.email);
      send.append("password", formData.password);
      send.append("profilePhoto", formData.profilePhoto); // ✔ Backend correct field

      await dispatch(registerUser(send)).unwrap();

      toast.success("Registered!");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration Failed");
    }
  };

  const imageWidthClass = imageStage === "show" ? "w-2/5" : "w-0";

  // =================== UI ===================
  return (
    <div className="w-screen h-screen flex flex-row-reverse overflow-hidden">

      {/* RIGHT SIDE FORM */}
      <div className="w-1/2 h-full flex items-center justify-center bg-white">
        <div className="w-full flex items-center justify-center">

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl w-3/5 p-6 flex flex-col gap-6 shadow-[0px_5px_30px_rgba(0,0,0,0.5)]"
          >
            <h1 className="text-2xl font-bold text-center">Register</h1>

            {formError && (
              <p className="text-red-500 text-center">{formError}</p>
            )}

            {/* Username */}
            <div className="group relative">
              <label
                className={`absolute duration-300 font-semibold ${
                  formData.username ? "-top-6 text-[14px]" : "top-0"
                } group-focus-within:-top-6`}
              >
                Username
              </label>
              <input
                name="username"
                onChange={handleChange}
                className="w-full border-b outline-none"
              />
            </div>

            {/* Email */}
            <div className="group relative">
              <label
                className={`absolute duration-300 font-semibold ${
                  formData.email ? "-top-6 text-[14px]" : "top-0"
                } group-focus-within:-top-6`}
              >
                Email
              </label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                className="w-full border-b outline-none"
              />
            </div>

            {/* Password */}
            <div className="group relative">
              <label
                className={`absolute duration-300 font-semibold ${
                  formData.password ? "-top-6 text-[14px]" : "top-0"
                } group-focus-within:-top-6`}
              >
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  className="w-full border-b outline-none pr-10"
                />
                <span
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-1 bottom-0 text-xl cursor-pointer"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>

            {/* Confirm */}
            <div className="group relative">
              <label
                className={`absolute duration-300 font-semibold ${
                  formData.confirmPassword ? "-top-6 text-[14px]" : "top-0"
                } group-focus-within:-top-6`}
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  onChange={handleChange}
                  className="w-full border-b outline-none pr-10"
                />
                <span
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-1 bottom-0 text-xl cursor-pointer"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>

            {/* Photo */}
            <div>
              <label className="font-semibold">Profile Photo</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full border-b outline-none"
              />
            </div>

            <button className="bg-black text-white rounded-lg py-2">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* RIGHT IMAGE PANEL */}
          <div
            className={`transition-all duration-700 h-full flex flex-col items-center justify-center overflow-hidden ${imageWidthClass}`}
          >
            {profilePhotoPreview && (
              <img
                src={profilePhotoPreview}
                onClick={() => {
                  setImageSrc(profilePhotoPreview);
                  setShowCropper(true);
                }}
                className="w-[90%] h-[48%] object-cover rounded-xl shadow-lg cursor-pointer"
              />
            )}

            {imageStage === "show" && (
              <button
                onClick={() => {
                  setImageStage("idle");
                  setBlushVisible(false);
                }}
                className="mt-4 bg-green-600 text-white px-8 py-2 rounded-xl"
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LEFT SIDE — ALL 4 CONTAINERS + ANIMATIONS */}
      <div className="w-1/2 h-full relative">

        {/* FLOATING HEARTS */}
        {hearts.map((h) => (
          <div
            key={h.id}
            className="fixed animate-floatup pointer-events-none"
            style={{ left: h.left, top: h.top, fontSize: h.fontSize }}
          >
            {h.emoji}
          </div>
        ))}

        {/* ===== CONTAINER 1 ===== */}
        <div
          ref={(el) => el && containerRefs.current.push(el)}
          className="fixed bottom-0 left-0 w-[100px] h-[200px] bg-sky-400 flex gap-5"
        >
          {[0, 1].map(() => (
            <div className="h-[50px] w-[50px] flex justify-center items-center">
              <div
                ref={(el) => el && parentRefs.current.push(el)}
                className="h-[30px] w-[30px] bg-black rounded-full relative"
              >
                <div className="h-[10px] w-[10px] bg-white rounded-full absolute translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>
          ))}

          {blushVisible && (
            <div className="absolute top-[60px] w-full flex justify-between px-5">
              <div className="w-[14%] h-[20px] bg-red-400 blur-md rounded-full"></div>
              <div className="w-[14%] h-[20px] bg-red-400 blur-md rounded-full"></div>
            </div>
          )}
        </div>

        {/* ===== CONTAINER 2 ===== */}
        <div
          ref={(el) => el && containerRefs.current.push(el)}
          className="fixed bottom-0 left-[100px] w-[250px] h-[150px] bg-yellow-300 rounded-t-[50px] flex justify-center gap-5"
        >
          {[0, 1].map(() => (
            <div className="h-[50px] w-[50px] flex justify-center items-center">
              <div
                ref={(el) => el && parentRefs.current.push(el)}
                className="h-[30px] w-[30px] bg-black rounded-full relative"
              >
                <div className="h-[10px] w-[10px] bg-white rounded-full absolute translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>
          ))}

          {blushVisible && (
            <div className="absolute top-[60px] px-5 w-full flex justify-between">
              <div className="w-[14%] h-[20px] bg-red-400 blur-md rounded-full"></div>
              <div className="w-[14%] h-[20px] bg-red-400 blur-md rounded-full"></div>
            </div>
          )}
        </div>

        {/* ===== CONTAINER 3 ===== */}
        <div
          ref={(el) => el && containerRefs.current.push(el)}
          className="fixed bottom-0 left-[30px] w-[150px] h-[300px] bg-lime-400 rounded-t-[50px] -z-10 flex justify-center gap-5"
        >
          {[0, 1].map(() => (
            <div className="h-[50px] w-[50px] flex justify-center items-center">
              <div
                ref={(el) => el && parentRefs.current.push(el)}
                className="h-[30px] w-[30px] bg-black rounded-full relative"
              >
                <div className="h-[10px] w-[10px] bg-white rounded-full absolute translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>
          ))}

          {blushVisible && (
            <div className="absolute top-[60px] px-5 w-full flex justify-between">
              <div className="w-[14%] h-[20px] bg-red-400 blur-md rounded-full"></div>
              <div className="w-[14%] h-[20px] bg-red-400 blur-md rounded-full"></div>
            </div>
          )}
        </div>

        {/* ===== CONTAINER 4 ===== */}
        <div
          ref={(el) => el && containerRefs.current.push(el)}
          className="fixed bottom-0 left-[150px] w-[150px] h-[250px] bg-red-300 rounded-t-[50px] -z-10 flex justify-center gap-5"
        >
          {[0, 1].map(() => (
            <div className="h-[50px] w-[50px] flex justify-center items-center">
              <div
                ref={(el) => el && parentRefs.current.push(el)}
                className="h-[30px] w-[30px] bg-black rounded-full relative"
              >
                <div className="h-[10px] w-[10px] bg-white rounded-full absolute translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>
          ))}

          {blushVisible && (
            <div className="absolute top-[60px] px-5 w-full flex justify-between">
              <div className="w-[14%] h-[20px] bg-red-400 blur-md rounded-full"></div>
              <div className="w-[14%] h-[20px] bg-red-400 blur-md rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* CROP MODAL */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl w-[90%] max-w-[800px]">
            <div className="w-full h-[60vh] bg-black relative">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, a) => setCroppedAreaPixels(a)}
              />
            </div>

            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label>Zoom</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveCropped}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>

                <button
                  onClick={() => setShowCropper(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Register;
