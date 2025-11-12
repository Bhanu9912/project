

import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../../slice';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';


const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(pixelCrop.width));
      canvas.height = Math.max(1, Math.round(pixelCrop.height));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        Math.round(pixelCrop.x),
        Math.round(pixelCrop.y),
        Math.round(pixelCrop.width),
        Math.round(pixelCrop.height),
        0,
        0,
        canvas.width,
        canvas.height
      );
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas is empty'));
        const reader = new FileReader();
        reader.onloadend = () => resolve({ blob, dataUrl: reader.result });
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.9);
    };
    image.onerror = (e) => reject(e);
    image.src = imageSrc;
  });
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user || {});

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    profilePhoto: null,
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  // visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // cropper modal state
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropping, setCropping] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handlePreviewClick = () => {
    if (!profilePhotoPreview) {
      document.getElementById('profileFileInput')?.click();
      return;
    }
    setImageSrc(profilePhotoPreview);
    setShowCropper(true);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSaveCropped = async () => {
    if (!croppedAreaPixels || !imageSrc) {
      alert('Please select a crop area.');
      return;
    }
    setCropping(true);
    try {
      const { blob, dataUrl } = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      setFormData((p) => ({ ...p, profilePhoto: file }));
      setProfilePhotoPreview(dataUrl);
      setShowCropper(false);
      setImageSrc(null);
      setZoom(1);
    } catch (err) {
      console.error('Crop/save error:', err);
      alert('Failed to crop image.');
    } finally {
      setCropping(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validatePassword = (password) => {
    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return uppercaseRegex.test(password) && specialCharRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      // !formData.phone ||
      !formData.profilePhoto
    ) {
      setFormError('Please fill all input fields and upload a profile photo.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setFormError('Password must contain at least one uppercase letter and one special character.');
      return;
    }

    const registerData = new FormData();
    registerData.append('username', formData.username);
    registerData.append('email', formData.email);
    registerData.append('password', formData.password);
    registerData.append('phone', formData.phone);
    registerData.append('profilePhoto', formData.profilePhoto);

    try {
      await dispatch(registerUser(registerData)).unwrap();
      toast.success('Registration successful!');
      setSuccess('Registration successful!');
      navigate('/');
    } catch (err) {
      const errMsg = err?.message || (typeof err === 'string' ? err : JSON.stringify(err));
      console.error('Register error:', err);
      toast.error(errMsg || 'Registration failed');
      setFormError(errMsg || 'Registration failed');
    }
  };

  const passwordMismatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword;

  const errorMessage = error?.message || (typeof error === 'string' ? error : '');

  return (
    <div className="min-h-screen bg-[url('/img.jpg')] bg-cover flex items-center justify-end px-100 pr-50   bg-black/50 bg-blend-multiply">
      <div className="  w-full max-w-md p-10 transition-transform duration-300 hover:scale-105 border-2 bg-black/50 shadow-2xl shadow-white rounded-2xl   ">
       {/* <div className="flex justify-center items-center min-h-screen bg-[url('/public/img.jpg')] bg-cover p-6 pl-180"> */}
       {/* <div className="w-full max-w-md p-6 rounded-lg border-2"> */}
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Registration</h2>

        {(formError || errorMessage) && (
          <p className="text-red-500 text-center mb-4 font-semibold">{formError || errorMessage}</p>
        )}
        {success && <p className="text-green-600 text-center mb-4 font-semibold">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4  ">
         {/* Book Page Animation for Profile Preview */}
  {profilePhotoPreview && (
  <div className="flex justify-center mb-6 relative h-[300px]">
    <motion.div
      initial={{ rotateY: -180, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      whileHover={{ rotateY: 25 }}
      className="relative w-[250px] h-[300px] [transform-style:preserve-3d] [perspective:1000px] cursor-pointer group"
      onClick={handlePreviewClick}
    >
      {/* Front side */}
      <motion.div
        className="absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden shadow-2xl"
        whileHover={{ rotateY: -20 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={profilePhotoPreview}
          alt="Profile Preview"
          className="w-full h-full object-cover border-4 border-white rounded-xl"
        />
      </motion.div>

      {/* Back side */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-600 rounded-xl text-white text-lg font-semibold [transform:rotateY(180deg)] [backface-visibility:hidden]"
      >
        <p>Click to Crop / Change</p>
      </div>

      {/* Page shadow effect */}
      <div className="absolute inset-0 bg-black/10 rounded-xl group-hover:bg-black/20 transition-all duration-500 pointer-events-none"></div>
    </motion.div>
  </div>
)}



          <div className="flex justify-center mb-4">
            <input
              id="profileFileInput"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById('profileFileInput')?.click()}
              className="px-4 py-2 border rounded bg-gradient-to-r from-indigo-600 to-pink-600  text-white transition-transform duration-300 hover:scale-105 hover:opacity-90 font-medium"
            >
              {profilePhotoPreview ? 'Change / Crop Photo' : 'Upload Profile Photo'}
            </button>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full  border-gray-300 rounded-lg bg-gray-50 rounded p-2 h-9 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:scale-110"
              placeholder='Enter your name'
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full  border-gray-300 rounded-lg bg-gray-50 rounded p-2 h-9 focus:scale-110 focus:ring-indigo-300 focus:ring-3 focus:outline-none transition-transform duration-300"
             placeholder='Enter your email'
            />
          </div>

          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-white">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full  border-gray-300 rounded-lg bg-gray-50 rounded p-2 h-9 pr-10 focus:scale-110 focus:ring-3 focus:ring-indigo-300 focus:outline-none transition-transform duration-300"
              placeholder='Enter your password'
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-9 text-gray-600"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-white">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='Re-enter password'
              className={`w-full  border-gray-300 rounded-lg bg-gray-50 rounded p-2 h-9  pr-10 focus:scale-110 focus:ring-3 focus:ring-indigo-300 focus:outline-none transition-transform duration-300 ${

                passwordMismatch ? 'border-red-500' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-3 top-9 text-gray-600"
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>

            {passwordMismatch && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>
            )}
          </div>
{/* 
          <div>
            <label className="block mb-2 text-sm font-medium text-white">Phone Number</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full  border-gray-300 rounded-lg bg-gray-50 bg-gray-100 bg-white rounded p-2  px-5 focus:ring-indigo-300 focus:scale-110 focus:border-blue-500 focus:outline-none transition-transform duration-300"
             placeholder='Enter your phone-No'
            />
          </div> */}

          <div className="flex justify-center py-4">
            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold  py-2 px-4 w-full border rounded transition-transform duration-300 hover:scale-105 hover:opacity-90 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>

      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl overflow-hidden shadow-lg">
            <div className="relative w-full h-[60vh] bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveCropped}
                  disabled={cropping}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  {cropping ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setShowCropper(false);
                    setImageSrc(null);
                  }}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
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
