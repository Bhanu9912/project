
import React, { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { registerUser } from '../../slice';
import { useDispatch, useSelector } from 'react-redux';


const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading,error} = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        setFormData({ ...formData, photo: file });
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file.');
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

  // ✅ Basic validation (you already had this)
  if (
    !formData.username ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword ||
    !formData.phone ||
    !formData.photo
  ) {
    setFormError('Please fill all input fields and upload a photo.');
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  const uppercaseRegex = /[A-Z]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!uppercaseRegex.test(formData.password) || !specialCharRegex.test(formData.password)) {
    setError('Password must contain at least one uppercase letter and one special character.');
    return;
  }

  const registerData = new FormData();
registerData.append('username', formData.username);
registerData.append('email', formData.email);
registerData.append('password', formData.password);
registerData.append('phone', formData.phone);
registerData.append('photo', formData.photo);


  try {
  await dispatch(registerUser(registerData)).unwrap();
  toast.success('Registration successful!');
  navigate('/'); // navigate to login page
} catch (err) {
  console.error('Register error:', err);
  toast.error(err.message || 'Registration failed');
}

};

  

  return (
    <div className="flex justify-end py-0 px-50 items-center min-h-screen bg-[url('/public/image.jpg')] bg-cover overflow-hidden">
      <div className="w-full max-w-md p-2 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Registration</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}
          {success && <p className="text-green-600 text-center mb-4 font-semibold">{success}</p>}

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
            {formData.password &&
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>
              )}
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="photo" className="block text-gray-700 text-sm font-bold mb-2">
              Photo
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          {photoPreview && (
            <div className="mb-4">
              <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;


