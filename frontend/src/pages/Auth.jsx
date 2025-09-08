import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Wallet, Mail, Lock, User } from 'lucide-react';

export const Auth = ({ LinkComponent = Link }) => {
  const [isLogin, setIsLogin] = useState(true);
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State for the user's role during signup
  const [role, setRole] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 font-sans">
      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Panel - Image and Welcome Text */}
            <div className="md:w-1/2 relative">
              <div
                className="h-64 md:h-full bg-cover bg-center"
                style={{
                  backgroundImage: 'linear-gradient(rgba(26, 71, 42, 0.7), rgba(26, 71, 42, 0.8)), url("https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=800")'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="text-center text-white">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">Join the Carbon Revolution</h2>
                    <p className="text-lg opacity-90">Every transaction makes a difference for our planet</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="md:w-1/2 p-8 md:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-green-800 mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h1>
                  <p className="text-gray-600">
                    {isLogin ? 'Sign in to your CarbonCycle account' : 'Start your journey with CarbonCycle'}
                  </p>
                </div>

                {/* Form Fields */}
                <form className="space-y-4">
                  {!isLogin && (
                    <>
                      {/* Full Name Input (Signup only) */}
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                      </div>
                      {/* Role Dropdown (Signup only) */}
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className={`w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white ${role === '' ? 'text-gray-400' : 'text-black'}`}
                        >
                          <option value="" disabled>Select a role</option>
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email Input */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Confirm Password Input (Signup only) */}
                  {!isLogin && (
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  )}

                  {/* Remember Me & Forgot Password (Login only) */}
                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                      <LinkComponent to="#" className="text-sm text-blue-600 hover:text-blue-700">
                        Forgot password?
                      </LinkComponent>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                {/* Web3 Connect Button */}
                <div className="mt-4">
                  <button className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect with MetaMask
                  </button>
                </div>

                {/* Toggle between Login and Signup */}
                <div className="text-center mt-6">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span className="font-medium text-blue-600">
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </span>
                  </button>
                </div>

                {/* Terms and Conditions (Signup only) */}
                {!isLogin && (
                  <div className="text-xs text-gray-500 text-center mt-6">
                    By creating an account, you agree to our{' '}
                    <LinkComponent to="#" className="text-blue-600 hover:underline">Terms of Service</LinkComponent>{' '}
                    and{' '}
                    <LinkComponent to="#" className="text-blue-600 hover:underline">Privacy Policy</LinkComponent>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
