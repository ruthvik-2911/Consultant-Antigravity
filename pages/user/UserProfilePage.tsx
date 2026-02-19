import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import api from "../../services/api";
import { useAuth } from "../../App";
import { useToast } from "../../context/ToastContext";
import { Camera, Wallet, Loader, Pencil } from "lucide-react";

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
  });

  const [originalData, setOriginalData] = useState(formData);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
      };

      setFormData(userData);
      setOriginalData(userData);
      setPreviewImage(user.avatar || null);
    }

    fetchWallet();
  }, [user]);

  const fetchWallet = async () => {
    try {
      const res = await api.get("/wallet");
      setWalletBalance(res.data.balance || 0);
    } catch (err) {
      console.error("Wallet fetch failed");
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= HANDLE IMAGE CHANGE ================= */
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);

    const formDataImage = new FormData();
    formDataImage.append("avatar", file);

    try {
      await api.put("/users/update-avatar", formDataImage, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      addToast("Profile photo updated!", "success");
    } catch (err) {
      addToast("Failed to upload photo", "error");
    }
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put("/users/update-profile", formData);
      addToast("Profile updated successfully!", "success");
      setIsEditing(false);
      setOriginalData(formData);
    } catch (err) {
      addToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  return (
    <Layout title="My Profile">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= PROFILE HEADER ================= */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">

          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {isEditing && (
              <>
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow hover:bg-blue-700 transition"
                >
                  <Camera size={16} />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </>
            )}
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

          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              Personal Information
            </h3>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-blue-600 font-semibold"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 rounded-xl border text-gray-600"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"
                >
                  {loading && <Loader size={16} className="animate-spin" />}
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <input
                name="name"
                value={formData.name}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Location</label>
              <input
                name="location"
                value={formData.location}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl disabled:bg-gray-100"
              />
            </div>

          </div>

          <div>
            <label className="text-sm text-gray-500">About You</label>
            <textarea
              name="bio"
              value={formData.bio}
              disabled={!isEditing}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl disabled:bg-gray-100"
            />
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default UserProfilePage;
