import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import background from "../../assets/todo.jpg";
import bear from "../../assets/teddy.jpg";

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [logData, setLogData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setLogData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/public/login/`, logData);
      setMsg(res.data.msg);
      localStorage.setItem("id", res.data.id); //save user ID/token
      navigate("/home"); // user should go next
    } catch (error) {
      console.error("Login Error:", error.response?.data?.msg || error.message);
      setMsg(error.response?.data?.msg || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 font-serif bg-[#e8dccf]"
      //  style={{
      //   backgroundImage: `url(${background})`,
      //   backgroundColor: "#f4ebe2",
      // }}
    >
      <div className="w-full max-w-6xl bg-white border-[3px] border-[#d5c7b2] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-none">
        {/* Left: Image Area */}
        {/* Left: Image Area */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#f4ede4] border-r border-[#e5dbc7] p-10">
          <div className="w-full flex justify-center mb-6">
            <div className="w-full max-w-[250px] aspect-square border-2 border-dashed border-[#c8b49c] rounded-xl flex items-center justify-center bg-[#fffdf8] shadow-inner">
              <img
                src={bear}
                alt="Bear Reading"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-[#4f3e30] mb-3">
            Hey!! Welcome Back!
          </h2>
          <ul className="list-disc list-inside text-[#5e4b3c] space-y-1 text-base">
            <li>Access your daily tasks</li>
            <li>Organize, plan, and reset focus</li>
           
            <li>Smooth, simple UI</li>
          </ul>
        </div>

        {/* Right: Login Form */}
        <div className="p-8 md:p-12 bg-[#fdfaf6] text-[#3f3b37]">
          <h2 className="text-4xl font-bold text-center mb-6 tracking-wide text-[#5a4a3c]">
            Login
          </h2>

          {msg && (
            <div className="mb-4 bg-[#fef1f1] border border-[#e1bdbd] text-[#b24c4c] px-5 py-3 rounded-lg text-center">
              <h2 className="font-medium">{msg}</h2>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-[#5e4b3c]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={logData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
                className="w-full px-4 py-2 bg-[#fcfaf7] border border-[#d7c6ae] rounded-xl text-[#3b2f25] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#b39a78]"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#5e4b3c]">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={logData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 bg-[#fcfaf7] border border-[#d7c6ae] rounded-xl text-[#3b2f25] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#b39a78]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#c98f63] text-white py-3 rounded-xl font-semibold text-lg transition duration-300 hover:bg-[#b5784c] ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-[#7e6651] text-white py-3 rounded-xl font-semibold text-lg transition duration-300 hover:bg-[#6d5641]"
            >
              Register
            </button>

            <button
              type="button"
              onClick={() => navigate("/forgot")}
              className="w-full bg-[#a59b83] text-white py-3 rounded-xl font-semibold text-lg transition duration-300 hover:bg-[#8f8570]"
            >
              Forgot Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
