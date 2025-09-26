import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Wallet, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { backend_url } from '../../api endpoints/backend_url';

export const Auth = ({ setupBlockchain, LinkComponent = Link }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const clearInputs = () => {
        setFullName('');
        setRole('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError(null);
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        clearInputs();
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        setLoading(true);

        try {
            const response = await fetch(`${backend_url}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed.');
            }

            console.log('Login successful:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify(data.projects));

            // Connect to blockchain AFTER successful login
            await setupBlockchain();

            // Navigate after connection is established
            if(data.role === 'admin'){
                navigate('/admin/dashboard');
            } else if(data.role === 'seller'){
                navigate('/owner/dashboard');
            } else {
                navigate('/marketplace');
            }

        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (!fullName || !role || !email || !password || !confirmPassword) {
            setError("Please fill out all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);

        try {
            const response = await fetch(`${backend_url}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fullName,
                    role,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed.');
            }

            console.log('Registration successful:', data);
            setIsLogin(true);
            clearInputs();

        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 font-sans">
            <div className="max-w-6xl w-full">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Left Panel */}
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

                                <form className="space-y-4" onSubmit={isLogin ? handleLogin : handleRegister}>
                                    {!isLogin && (
                                        <>
                                            {/* Full Name Input */}
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                />
                                            </div>
                                            {/* Role Dropdown */}
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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

                                    {/* Confirm Password Input */}
                                    {!isLogin && (
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="password"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            />
                                        </div>
                                    )}
                                    
                                    {error && (
                                        <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                                            <AlertCircle className="w-5 h-5 mr-2" />
                                            <span className="font-medium">{error}</span>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (isLogin ? 'Sign In' : 'Create Account')}
                                    </button>
                                </form>

                                <div className="text-center mt-6">
                                    <button
                                        onClick={toggleAuthMode}
                                        className="text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                                        <span className="font-medium text-blue-600">
                                            {isLogin ? 'Sign up' : 'Sign in'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};