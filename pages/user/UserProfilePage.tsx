import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../services/api";
import { useAuth } from "../../App";
import { useToast } from "../../context/ToastContext";
import { Camera, Wallet, Loader } from "lucide-react";

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  /* ================= LOAD USER ================= */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }

    fetchWallet();
  }, [user]);

  const fetchWallet = async () => {
    try {
      const res = await api.get("/wallet");
      setWalletBalance(res.data.balance);
    } catch (err) {
      console.error("Wallet fetch failed");
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put("/users/update-profile", formData);
      addToast("Profile updated successfully!", "success");
    } catch (err) {
      addToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="My Profile">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= PROFILE HEADER ================= */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">

          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow hover:bg-blue-700 transition">
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {formData.name || "Your Name"}
            </h2>
            <p className="text-gray-500">{formData.email}</p>
          </div>

          <div className="bg-blue-50 px-6 py-4 rounded-2xl flex items-center gap-3">
            <Wallet className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <p className="font-bold text-blue-900">
                ₹{walletBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* ================= PROFILE FORM ================= */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">

          <h3 className="text-xl font-bold text-gray-900">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                name="email"
                value={formData.email}
                disabled
                className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-xl text-gray-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">About You</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default UserProfilePage;
