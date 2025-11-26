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
        redirectTo: `${window.location.origin}/login`, // redirect after reset
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
      <div className="p-10 w-full max-w-md bg-white rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Reset Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="border p-3 w-full mb-6 rounded-xl focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className={`w-full py-3 rounded-xl text-white font-semibold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
          }`}
          onClick={handleResetLink}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          <a href="/login" className="text-purple-600 font-medium hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
