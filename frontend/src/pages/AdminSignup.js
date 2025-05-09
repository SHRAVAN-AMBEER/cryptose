import { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSignup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const showMessage = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!username || !email || !password) {
      showMessage('Please fill all fields!', true);
      return;
    }
    
    try {
      const result = await register({ username, email, password }, 'admin');
      
      if (result.success) {
        showMessage('Admin account created successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        showMessage(result.error || 'Registration failed. Please try again.', true);
        if (result.error?.includes('already exists')) {
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    } catch (error) {
      showMessage('Registration failed. Please try again.', true);
    }
  };

  useEffect(() => {
    const form = document.getElementById('signupForm');
    form.addEventListener('submit', handleSubmit);
    return () => form.removeEventListener('submit', handleSubmit);
  }, [navigate]);

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>Admin Signup</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4 font-['Poppins']" style={{ background: 'linear-gradient(to bottom right, #111827, #1f2937, #374151)' }}>
        <div className="w-full max-w-md animate__animated animate__fadeIn">
          <div className="form-container bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700 transform transition duration-500 hover:scale-[1.01]">
            <div className="text-center mb-8">
              <FaUserShield className="text-5xl mb-4 text-yellow-400 animate__animated animate__fadeInDown mx-auto" />
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent animate__animated animate__fadeIn">Admin Signup</h2>
              <p className="text-gray-400 mt-2">Create your administrator account</p>
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded text-white text-center ${isError ? 'bg-red-600' : 'bg-green-600'}`}>
                {message}
              </div>
            )}

            <form id="signupForm" className="space-y-5">
              <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 hover:border-yellow-500 transition duration-300">
                <FaUser className="h-5 w-5 text-yellow-400" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Full Name"
                  className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 hover:border-yellow-500 transition duration-300">
                <FaEnvelope className="h-5 w-5 text-yellow-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 hover:border-yellow-500 transition duration-300">
                <FaLock className="h-5 w-5 text-yellow-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-400 hover:text-yellow-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-600 to-red-600 text-white py-3 rounded-lg shadow-lg hover:from-yellow-700 hover:to-red-700 transition duration-300 font-bold flex items-center justify-center"
              >
                <FaUserShield className="mr-2" /> Create Admin Account
              </button>

              <div className="text-center text-gray-400">
                Already have an account? <button onClick={handleNavigateToLogin} className="text-yellow-400 hover:underline">Login here</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSignup;
