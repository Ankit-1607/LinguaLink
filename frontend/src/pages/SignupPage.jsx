import React, { useState } from 'react';
import { Globe, Eye, EyeOff } from 'lucide-react';
import useSignup from '../hooks/useSignup.js';

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    nativeLanguage: ''
  });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // password strength checker
  const evaluatePassword = (pwd) => {
    let strength = 0;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[^A-Za-z0-9]/.test(pwd);

    if (pwd.length >= 8) strength += 1;
    if (hasUpper) strength += 1;
    if (hasNumber) strength += 1;
    if (hasSymbol) strength += 1;

    if (strength <= 1) return 'Weak';
    if (strength === 2 || (strength === 3 && !hasSymbol)) return 'Medium';
    return hasSymbol && strength >= 3 ? 'Strong' : 'Medium';
  };

  const strengthColor = {
    Weak: 'text-red-500',
    Medium: 'text-yellow-500',
    Strong: 'text-green-500'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') setPasswordStrength(evaluatePassword(value));
  };

  const handleCheckbox = (e) => setAgreed(e.target.checked);

  const { signUpMutation, isPending, error } = useSignup();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!agreed) return;
    signUpMutation(signupData);
    console.log('Error:', error);
    console.log('Signup data:', signupData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base-200 overflow-auto" data-theme="dracula">
      {/* Welcome */}
      <div className="flex items-center space-x-2 mb-4">
        <Globe className="w-8 h-8 text-[#539aa0]" />
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#3f7f84] via-[#539aa0] to-[#6bbcc1] bg-clip-text text-transparent">
          Welcome to LinguaLink
        </h1>
      </div>
      <div className="w-16 h-1 bg-[#539aa0] rounded mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl bg-base-100 rounded-2xl shadow-xl overflow-hidden">
        {/* Image Section */}
        <div className="hidden md:block">
          <img
            src="/Video call-amico.svg"
            alt="Signup"
            className="object-cover h-full w-full"
          />
        </div>

        {/* Form Section */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#68c1c8] text-center mb-2">Create an Account</h2>
          <p className="text-center text-lg text-base-content mb-6">
            Join us on a fun journey to learn and explore new languages
          </p>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={signupData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#539aa0]"
                required
              />
            </div>

            {/* Native Language */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Native Language</span>
              </label>
              <input
                type="text"
                name="nativeLanguage"
                value={signupData.nativeLanguage}
                onChange={handleChange}
                placeholder="Enter your native language"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#539aa0]"
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={signupData.email}
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
                value={signupData.password}
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
              {signupData.password && (
                <p className={`mt-1 text-sm ${strengthColor[passwordStrength]}`}>Password strength: {passwordStrength}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="form-control">
              <label className="flex items-center text-base-content">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={handleCheckbox}
                  className="checkbox checkbox-[#539aa0] mr-2"
                />
                {/* rel="noopener noreferrer" - increases security so new page can't access page where user came from */}
                <span>
                  I agree to <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-[#539aa0]">Terms of Use</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-[#539aa0]">Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn bg-[#539aa0] hover:bg-[#397778] text-white w-full transition-colors duration-200 ${!agreed ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!agreed}
              >
                {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Signing up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center mt-4 text-base-content">
              Already have an account? <a href="/login" className="underline text-[#539aa0]">Log in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;