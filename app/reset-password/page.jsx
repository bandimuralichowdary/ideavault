"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState(null);

  // Handle client-side only searchParams
  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  async function sendResetLink() {
    if (!email.trim()) return alert("Email is required");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://ideavault-gray.vercel.app/reset-password",
      });
      if (error) throw error;
      alert("If this email exists, a reset link has been sent. Check your inbox.");
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (!newPassword.trim() || !confirmPassword.trim()) return alert("All fields required");
    if (newPassword !== confirmPassword) return alert("Passwords do not match");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      alert("Password updated! Please login.");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="p-10 w-full max-w-md bg-white rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Reset Password
        </h2>

        {!otpSent ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="lux-input placeholder-gray-400 text-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className={`lux-btn primary w-full ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
              onClick={sendResetLink}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        ) : (
          <>
            <input
              type="password"
              placeholder="New Password"
              className="lux-input placeholder-gray-400 text-gray-100"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="lux-input placeholder-gray-400 text-gray-100"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className={`lux-btn primary w-full ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
              onClick={handlePasswordReset}
              disabled={loading}
            >
              {loading ? "Saving..." : "Update Password"}
            </button>
          </>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          <a href="/login" className="text-purple-600 font-medium hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
