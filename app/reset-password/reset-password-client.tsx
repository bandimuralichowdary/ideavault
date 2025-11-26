"use client";

import { useEffect, useState } from "react";

export default function ResetPasswordClient() {
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Extract token from URL hash
  useEffect(() => {
    const hash = window.location.hash; // "#access_token=xyz&expires_at=..."
    const params = new URLSearchParams(hash.replace("#", ""));
    const accessToken = params.get("access_token");
    setToken(accessToken);
  }, []);

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Invalid or expired link!
      </div>
    );
  }

  const handleReset = async () => {
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen text-white">
      <div className="w-full max-w-md bg-[#0b0b0b] border border-neutral-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full mb-4 p-3 rounded-md bg-black border border-neutral-700 text-white"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Update Password
        </button>

        {message && <p className="mt-4 text-blue-400">{message}</p>}
      </div>
    </div>
  );
}
