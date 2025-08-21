import React, { useState } from 'react';
import handyBot from "../assets/handy-resize.png"
import { BsGithub } from "react-icons/bs";
import { Link, useNavigate,useLocation} from 'react-router-dom';
import { useAuth } from '../context/contexts-Files/authContext';


function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signin } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signin(formData.email, formData.password);
      navigate(from,{replace:true}); // Redirect to the original location after successful login
      console.log('User signed in:', formData);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
   <> 
   <div className='min-h-screen w-full bg-black flex  flex-col items-center justify-center  py-8 '>
          {/* Header */}
          <div className="text-start mb-6 flex justify-between items-end  w-[38%] relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-800 to-white text-transparent bg-clip-text ml-4">
              Sign-in
            </h1>
            {/* <p className="text-sm text-gray-400">
              Please enter your credentials to continue
            </p> */}
            <img src={handyBot} alt="Handy Bot" className='h-30 w-auto  absolute right-0 bottom-[-35px] z-40' />
          </div>

          {/* Form */}
      <div className='w-[38%] h-[70vh] bg-gray-900/50 rounded backdrop-blur-sm border border-white/10 flex flex-col justify-center'>
        <div className='max-w-md mx-auto w-full px-4'>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-lg font-medium text-gray-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-2 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-700 bg-black/50 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-blue-300 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all duration-300 font-semibold text-sm"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-4 text-sm">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="relative my-4">
            <div className=" inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 mt-2 bg-gray-900/50 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors duration-300">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-4 w-4 mr-2" />
              <span className="text-gray-300 text-sm">Google</span>
            </button>
            <button className="flex items-center justify-center px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors duration-300">
              <BsGithub  className="h-5 w-5 mr-2" />
              <span className="text-gray-300 text-sm">GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {error && (
    <div className="text-red-500 text-sm text-center mb-4">
      {error}
    </div>
  )}
    </>
  );
}

export default SignIn;