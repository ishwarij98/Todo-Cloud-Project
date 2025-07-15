import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const userId = localStorage.getItem("id");
    const navigate = useNavigate()

    // Fetch profile on load

    const fetchProfile = async () => {
        try {

            const res = await axios.get(`${apiUrl}/api/private/myprofile`, {
                headers: {
                    Authorization: `Bearer ${userId}`,
                },
            });
            setProfile(res.data);
            setFormData({
                fullName: res.data.fullName,
                email: res.data.email,
                phone: res.data.phone,
            });
        } catch (error) {
            console.error("Profile fetch error:", error.response.data.msg);
        }
    };

    useEffect(() => {
        if (!userId) {
            navigate("/login")
        }

        fetchProfile();
    }, [userId, apiUrl]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            await axios.put(`${apiUrl}/api/private/update`, formData, {
                headers: {
                    Authorization: `Bearer ${userId}`,
                },
            });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Delete your account?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${apiUrl}/api/private/delete`, {
                headers: {
                    Authorization: `Bearer ${userId}`,
                },
            });
            localStorage.clear();
            alert("Account deleted.");
            window.location.href = "/login";
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete account.");
        }
    };

    if (!profile) return <p className="text-center mt-20">Loading profile...</p>;

    return (
        <>

            <Header />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
                    <h2 className="text-3xl font-bold mb-6 text-purple-700 text-center">
                        My Profile
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400"
                            />
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ${loading ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>

                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
