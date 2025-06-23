import React, { useState } from 'react';
import { Globe, Eye, EyeOff } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { login } from '../lib/api.js';
import useLogin from '../hooks/useLogin.js';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const {loginMutation, isPending, error} = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base-200 overflow-auto" data-theme="dracula">
      {/* Welcome */}
      <div className="flex items-center space-x-2 mb-4">
        <Globe className="w-8 h-8 text-[#539aa0]" />
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#3f7f84] via-[#539aa0] to-[#6bbcc1] bg-clip-text text-transparent">
          Welcome Back to LinguaLink
        </h1>
      </div>
      <div className="w-16 h-1 bg-[#539aa0] rounded mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl bg-base-100 rounded-2xl shadow-xl overflow-hidden">
        {/* Image Section */}
        <div className="hidden md:block">
          <img
            src="/Video call-amico.svg"
            alt="Login"
            className="object-cover h-full w-full"
          />
        </div>

        {/* Form Section */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#68c1c8] text-center mb-2">Log In</h2>
          <p className="text-center text-lg text-base-content mb-6">
            Welcome back! Please enter your credentials to continue.
          </p>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response?.data?.message || "Login failed."}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#539aa0]"
                required
              />
            </div>

            {/* Password with toggle */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text text-base-content">Password</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input input-bordered w-full pr-10 focus:outline-none focus:ring-2 focus:ring-[#539aa0]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute top-12 right-3"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
              </button>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn bg-[#539aa0] hover:bg-[#397778] text-white w-full transition-colors duration-200"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </div>

            {/* Signup Link */}
            <p className="text-center mt-4 text-base-content">
              Don't have an account? <a href="/signup" className="underline text-[#539aa0]">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;