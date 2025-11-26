"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleResetLink() {
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="p-10 w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Reset Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-4 mb-6 rounded-2xl bg-white/10 border border-white/20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm transition duration-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className={`w-full py-3 rounded-2xl text-white font-semibold text-lg transition-all duration-300 shadow-lg shadow-black/30 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
          }`}
          onClick={handleResetLink}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-700">
          <a
            href="/login"
            className="font-medium text-purple-600 hover:underline"
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
