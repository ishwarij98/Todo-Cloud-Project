import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <div
                className="cursor-pointer flex items-center gap-2"
                onClick={() => navigate("/")}
            >
                <img
                    src={logo}
                    alt="Suhail TODO Logo"
                    className="w-10 h-10 object-contain"
                />  <span className="text-2xl font-bold text-purple-700 hidden sm:inline">
                    Todo App
                </span>

            </div>


            {/* Navigation */}
            <nav className="flex gap-6 items-center text-gray-700 font-medium">
                
                <button onClick={() => navigate("/home")} className="hover:text-purple-600">
                    My Todos
                </button>
                <button onClick={() => navigate("/profile")} className="hover:text-purple-600">
                    Profile
                </button>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                >
                    Logout
                </button>
            </nav>
        </header>
    );
};

export default Header;
