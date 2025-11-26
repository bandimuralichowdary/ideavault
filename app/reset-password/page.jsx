"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"sendLink" | "resetPassword">("sendLink");

  // Detect access token in URL
  useEffect(() => {
    const access_token = searchParams.get("access_token");
    if (access_token) {
      setStep("resetPassword");
    }
  }, [searchParams]);

  async function sendResetLink() {
    if (!email.trim()) return alert("Email is required");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://ideavault-gray.vercel.app/reset-password",
      });
      if (error) throw error;
      alert(
        "If this email exists, a reset link has been sent. Please check your inbox."
      );
      setEmail("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (!newPassword.trim() || !confirmPassword.trim())
      return alert("All fields are required");
    if (newPassword !== confirmPassword)
      return alert("Passwords do not match");

    setLoading(true);
    try {
      const access_token = searchParams.get("access_token");
      if (!access_token) throw new Error("Invalid reset link");

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
        access_token,
      });

      if (error) throw error;

      alert("Password updated! Please login with your new password.");
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="p-10 w-full max-w-md bg-white rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {step === "sendLink" ? "Reset Password" : "Set New Password"}
        </h2>

        {step === "sendLink" ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="border p-3 w-full mb-6 rounded-xl focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className={`w-full py-3 rounded-xl text-white font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
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
              className="border p-3 w-full mb-4 rounded-xl focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="border p-3 w-full mb-6 rounded-xl focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className={`w-full py-3 rounded-xl text-white font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
              onClick={handlePasswordReset}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          <a
            href="/login"
            className="text-purple-600 font-medium hover:underline"
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
