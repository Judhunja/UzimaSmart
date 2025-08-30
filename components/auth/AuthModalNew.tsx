'use client';

import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Phone, Lock, MessageSquare } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      password: ''
    });
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 254, use as is
    if (cleaned.startsWith('254')) {
      return `+${cleaned}`;
    }
    
    // If it starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      return `+254${cleaned.substring(1)}`;
    }
    
    // If it starts with 7, add 254
    if (cleaned.startsWith('7') && cleaned.length === 9) {
      return `+254${cleaned}`;
    }
    
    return phone;
  };

  const validateForm = (): boolean => {
    if (!isLogin && !formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    if (!formData.email && !formData.phoneNumber) {
      setError('Email or phone number is required');
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.phoneNumber) {
      const formatted = formatPhoneNumber(formData.phoneNumber);
      const phoneRegex = /^\+254[0-9]{9}$/;
      if (!phoneRegex.test(formatted)) {
        setError('Please enter a valid Kenyan phone number');
        return false;
      }
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const phoneNumber = formData.phoneNumber ? formatPhoneNumber(formData.phoneNumber) : '';
      
      const requestData = {
        email: formData.email || undefined,
        phoneNumber: phoneNumber || undefined,
        password: formData.password,
        ...((!isLogin && formData.name) && { name: formData.name })
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (data.success) {
        if (isLogin) {
          setSuccess('Login successful! Welcome to UzimaSmart.');
          onLogin(data.user);
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1000);
        } else {
          setSuccess('Account created successfully! You can now log in.');
          setTimeout(() => {
            setIsLogin(true);
            setSuccess(null);
            setFormData(prev => ({ ...prev, name: '', password: '' }));
          }, 1500);
        }
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <MessageSquare size={24} />
            <h2 className="text-xl font-semibold">
              {isLogin ? 'Login to UzimaSmart' : 'Join UzimaSmart'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-blue-700">
            <strong>🔐 Secure Login</strong> - Access your SMS subscription preferences and climate reports
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name field (registration only) */}
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address {!isLogin && <span className="text-gray-500">(optional if phone provided)</span>}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          {/* Phone field */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number {!isLogin && <span className="text-gray-500">(optional if email provided)</span>}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0712345678 or +254712345678"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              📱 Required for SMS alerts • Kenyan numbers only
            </p>
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                🔒 Minimum 6 characters for security
              </p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">❌ {error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-600 text-sm">✅ {success}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </span>
            ) : (
              <>
                {isLogin ? '🔐 Login' : '🚀 Create Account'}
              </>
            )}
          </button>

          {/* SMS Benefits */}
          {!isLogin && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">📱 SMS Benefits:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 🌦️ Real-time weather alerts</li>
                <li>• 🚨 Emergency climate warnings</li>
                <li>• ✅ Report confirmations</li>
                <li>• 📊 Personalized climate insights</li>
              </ul>
            </div>
          )}

          {/* Switch mode */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                {isLogin ? 'Create one here' : 'Log in instead'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
