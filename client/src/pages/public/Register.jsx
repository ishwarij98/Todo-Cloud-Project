import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/public/register`, formData);
      setMsg(res.data.msg);
      navigate("/login");
    } catch (error) {
      const errorMsg = error?.response?.data?.msg || "Something went wrong.";
      console.error("Error:", error);
      setMsg(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4ebe2] flex items-center justify-center px-4 font-serif">
      <div className="max-w-3xl w-full bg-white border-[3px] border-[#d5c7b2] rounded-3xl p-8 md:p-12 shadow-none">
        <h2 className="text-4xl font-bold text-center text-[#5a4a3c] mb-8 tracking-wider">Register</h2>

        {msg && (
          <div className="mb-6 bg-[#fef7e0] border border-[#e0d3a1] text-[#7d6532] px-6 py-3 rounded-lg text-center">
            <h2 className="font-medium">{msg}</h2>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your Full name" },
            { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Phone Number", name: "phone", type: "tel", placeholder: "xxxxxxxxxx" },
            { label: "Password", name: "password", type: "password", placeholder: "•••••••" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block mb-1 text-[#5e4b3c] font-medium">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                placeholder={field.placeholder}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-[#fcfaf7] border border-[#d7c6ae] rounded-xl text-[#3b2f25] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#b39a78] transition-all"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-[#c98f63] text-white text-lg py-3 rounded-xl tracking-wide font-semibold transition-all duration-300 hover:bg-[#b5784c]"
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full bg-[#7e6651] text-white text-lg py-3 rounded-xl tracking-wide font-semibold transition-all duration-300 hover:bg-[#6d5641]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
