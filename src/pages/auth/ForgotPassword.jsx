import React, { useState } from "react";
import useForgotPassword from "../../contexts/useForgotPassword";

const ForgotPasswordForm = () => {
  const { sendOtp, verifyOtp, updatePassword, resendOtp, clearMessages, loading, error, success } = useForgotPassword();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(0);

  // Handle Email Submit - Send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!email) {
      return;
    }

    const result = await sendOtp(email);
    if (result.success) {
      setStep(2);
      startResendTimer();
    }
  };

  // Handle OTP Submit - Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (otp.length !== 6) {
      return;
    }

    const result = await verifyOtp(email, otp);
    if (result.success) {
      setStep(3);
    }
  };

  // Handle Password Submit - Update Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (password !== password_confirmation) {
      return;
    }

    if (password.length < 6) {
      return;
    }

    const result = await updatePassword(password, password_confirmation);
    if (result.success) {
      setTimeout(() => {
        setEmail("");
        setOtp("");
        setPassword("");
        setPasswordConfirmation("");
        setStep(1);
      }, 2000);
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    clearMessages();
    const result = await resendOtp(email);
    if (result.success) {
      startResendTimer();
    }
  };

  // Start resend timer (60 seconds)
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8" style={{ borderTop: "4px solid #2D7DB5" }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#2D7DB5" }}>
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">Step {step} of 3</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className="h-2 flex-1 rounded-full transition-all"
              style={{
                backgroundColor: num <= step ? "#2D7DB5" : "#e0e0e0",
              }}
            />
          ))}
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors"
                style={{ focusBorderColor: "#2D7DB5" }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-70"
              style={{ backgroundColor: "#2D7DB5" }}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">OTP Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors text-center text-2xl tracking-widest"
                style={{ focusBorderColor: "#2D7DB5" }}
                required
              />
              <p className="text-gray-500 text-sm mt-2">OTP sent to {email}</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-70"
              style={{ backgroundColor: "#2D7DB5" }}
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>

            {/* Resend OTP */}
            <div className="mt-4 text-center">
              {resendTimer > 0 ? (
                <p className="text-gray-600 text-sm">
                  Resend OTP in <span style={{ color: "#2D7DB5" }} className="font-semibold">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-sm font-semibold hover:underline disabled:opacity-70"
                  style={{ color: "#2D7DB5" }}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors"
                style={{ focusBorderColor: "#2D7DB5" }}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-2 transition-colors"
                style={{ focusBorderColor: "#2D7DB5" }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-70"
              style={{ backgroundColor: "#2D7DB5" }}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "#e8f4f0" }}>
            <p style={{ color: "#2D7DB5" }} className="text-sm font-medium">{success}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;