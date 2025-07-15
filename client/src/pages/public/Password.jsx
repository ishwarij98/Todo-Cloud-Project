import React, { useState } from "react";
import axios from "axios";

const Password = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post(`${apiUrl}/api/public/forgetpassword/`, { email });
      setMsg(res.data.msg || "Password reset link or new password sent to your email.");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMsg(error.response?.data?.msg || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#f4ebe2] px-4 font-serif">
  <div className="w-full max-w-md bg-white border-[3px] border-[#d5c7b2] rounded-3xl p-8 md:p-10 shadow-none relative">
    
    {/* Image placeholder border at top */}
    <div className="w-full h-36 border-2 border-dashed border-[#c8b49c] rounded-xl mb-6 flex items-center justify-center text-[#a39176]">
      {/* Replace with image */}
      <span className="text-sm">🖼️ You can place an illustration here</span>
    </div>

    <h2 className="text-3xl font-bold text-center text-[#5a4a3c] mb-6">Forgot Password</h2>

    {msg && (
      <div className="mb-4 bg-[#fef7e0] border border-[#e0d3a1] text-[#7d6532] px-4 py-3 rounded text-center">
        {msg}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block mb-1 text-[#5e4b3c] font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-4 py-2 border border-[#d7c6ae] bg-[#fcfaf7] rounded-xl text-[#3b2f25] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#b39a78]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-[#c98f63] text-white py-3 rounded-xl font-semibold text-lg transition duration-300 hover:bg-[#b5784c] ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Please wait..." : "Generate New Password 🍂"}
      </button>
    </form>
  </div>
</div>

  );
};

export default Password;
