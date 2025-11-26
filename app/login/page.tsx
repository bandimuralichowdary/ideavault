"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) return alert("Both fields are required");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("email not confirmed"))
          return alert("Please confirm your email first.");
        throw error;
      }

      // Only after successful login:
      router.replace("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="p-10 w-full max-w-md bg-white rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-4 rounded-xl focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-6 rounded-xl focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className={`w-full py-3 rounded-xl text-white font-semibold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
          }`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <a href="/register" className="hover:text-purple-600">Register</a>
          <a href="/reset" className="hover:text-purple-600">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
