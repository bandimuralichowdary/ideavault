"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim())
      return alert("All fields are required");

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: "https://ideavault.vercel.app/login",
        },
      });
      if (error) throw error;

      alert(
        "Registration successful! Please check your email and confirm your account before logging in."
      );
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-700">
      <div className="p-10 w-full max-w-md bg-white rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="border p-3 w-full mb-4 rounded-xl focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Now"}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-purple-600 font-medium hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
