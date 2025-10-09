import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle, Key } from 'lucide-react';
import useChangePassword from '../contexts/useChangePassword';

const ChangePassword = () => {
  const { changePassword, loading, error, success } = useChangePassword();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength calculator
  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (newPassword.length >= 8) strength += 25;
    if (newPassword.length >= 12) strength += 25;
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) strength += 25;
    if (/[0-9]/.test(newPassword)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(newPassword)) strength += 10;
    
    setPasswordStrength(Math.min(strength, 100));
  }, [newPassword]);

  // Reset form on success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setValidationErrors({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validateForm = () => {
    const errors = {};
    
    if (!oldPassword) {
      errors.oldPassword = 'Current password is required';
    }
    
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (oldPassword && newPassword && oldPassword === newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }
    
    const response = await changePassword(oldPassword, newPassword, confirmPassword);
    if (response) {
      console.log('Password changed successfully', response);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleChangePassword();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Notification */}
        {success && (
          <div className="mb-6 animate-in slide-in-from-top">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Password changed successfully!</p>
                <p className="text-xs text-green-600 mt-1">Your password has been updated securely.</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-300 px-8 py-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white text-center mb-2">Change Password</h1>
            <p className="text-blue-100 text-center text-sm">Update your password to keep your account secure</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-12 py-3 border ${
                      validationErrors.oldPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {validationErrors.oldPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.oldPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-12 py-3 border ${
                      validationErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">Password Strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength < 40 ? 'text-red-600' : 
                        passwordStrength < 70 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {validationErrors.newPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.newPassword}
                  </p>
                )}
                
                {/* Password Requirements */}
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
                  <ul className="space-y-1">
                    <li className={`text-xs flex items-center ${
                      newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      <span className="mr-2">{newPassword.length >= 8 ? '✓' : '○'}</span>
                      At least 8 characters
                    </li>
                    <li className={`text-xs flex items-center ${
                      /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      <span className="mr-2">
                        {/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? '✓' : '○'}
                      </span>
                      Upper & lowercase letters
                    </li>
                    <li className={`text-xs flex items-center ${
                      /[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      <span className="mr-2">{/[0-9]/.test(newPassword) ? '✓' : '○'}</span>
                      At least one number
                    </li>
                    <li className={`text-xs flex items-center ${
                      /[^a-zA-Z0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      <span className="mr-2">{/[^a-zA-Z0-9]/.test(newPassword) ? '✓' : '○'}</span>
                      Special character (recommended)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-12 py-3 border ${
                      validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Re-enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.confirmPassword}
                  </p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="mt-2 text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* API Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-300 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Change Password
                  </>
                )}
              </button>
            </div>

            {/* Security Tips */}
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Security Tips</h3>
                  <ul className="space-y-1 text-xs text-blue-700">
                    <li>• Use a unique password you don't use anywhere else</li>
                    <li>• Avoid using personal information in your password</li>
                    <li>• Consider using a password manager</li>
                    <li>• Change your password regularly for better security</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;