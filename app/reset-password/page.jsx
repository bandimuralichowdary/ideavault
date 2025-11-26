"use client";

export const dynamic = "force-dynamic"; // ⬅️ critical fix

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");

  const code = params.get("code");

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Invalid or expired link!
      </div>
    );
  }

  async function handleReset() {
    if (!password.trim()) return alert("Enter a valid password");

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return alert(error.message);

    alert("Password updated!");
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-white">
      <div className="glass-box p-6 rounded-3xl border border-white/10 backdrop-blur-md shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">Reset Password</h1>

        <input
          type="password"
          placeholder="New Password"
          className="lux-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="lux-btn primary mt-4" onClick={handleReset}>
          Update Password
        </button>
      </div>
    </div>
  );
}


/*"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = typeof window !== "undefined" ? useSearchParams() : null;
  const accessToken = searchParams?.get("access_token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validLink, setValidLink] = useState(false);

  // Only run on client-side
  useEffect(() => {
    if (accessToken) {
      setValidLink(true);
    } else {
      alert("Invalid or expired link!");
      router.replace("/login");
    }
  }, [accessToken, router]);

  async function handleReset() {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      return alert("All fields are required");
    }
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser(
        { password: newPassword },
        { accessToken }
      );
      if (error) throw error;
      alert("Password updated successfully! Please login.");
      router.replace("/login");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  if (!validLink) return null; // Prevent rendering during build or invalid token

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="p-10 w-full max-w-md bg-white rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Set New Password
        </h2>

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
          onClick={handleReset}
          disabled={loading}
          className="lux-btn primary mt-4"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

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
*/
