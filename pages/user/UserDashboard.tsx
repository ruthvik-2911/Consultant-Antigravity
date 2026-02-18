import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { bookings as bookingsApi, consultants as consultantsApi } from "../../services/api";
import api from "../../services/api";
import { Booking, Consultant } from "../../types";
import { useNavigate } from "react-router-dom";
import { Video, Calendar, Wallet, Star, Loader } from "lucide-react";
import { useAuth } from "../../App";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sessions, setSessions] = useState<Booking[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchBookings();
    fetchWallet();
    fetchConsultants();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingsApi.getAll();
      setSessions(data || []);
    } catch (err) {
      console.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await api.get("/wallet");
      setWalletBalance(res.data.balance);
    } catch (err) {
      console.error("Failed to fetch wallet");
    }
  };

  const fetchConsultants = async () => {
    try {
      const data = await consultantsApi.getAll();
      setConsultants(data?.slice(0, 3) || []);
    } catch (err) {
      console.error("Failed to fetch consultants");
    }
  };

  const liveSession = sessions.find((s) => s.status === "LIVE");
  const upcomingSessions = sessions.filter(
    (s) => s.status === "CONFIRMED"
  ).slice(0, 3);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex justify-center items-center h-screen">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ================= WELCOME SECTION ================= */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border relative overflow-hidden">
          <div className="absolute right-[-100px] top-[-40px] h-[300px] w-[300px] bg-blue-100 rounded-full opacity-40"></div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.email?.split("@")[0]} 👋
          </h1>

          <p className="text-gray-500 mb-6 text-lg">
            You have {upcomingSessions.length} upcoming session(s).
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/user/search")}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              + Book Session
            </button>

            <button
              onClick={() => navigate("/user/bookings")}
              className="border px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              View Bookings
            </button>
          </div>
        </div>

        {/* ================= LIVE SESSION ================= */}
        {liveSession && (
          <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-8 rounded-3xl flex justify-between items-center shadow-lg">
            <div>
              <p className="text-xs font-semibold bg-white/20 inline-block px-3 py-1 rounded-full mb-2">
                LIVE NOW
              </p>
              <h2 className="text-2xl font-bold">
                {liveSession.consultant?.user?.email}
              </h2>
              <p className="text-sm opacity-90">
                {liveSession.consultant?.domain}
              </p>
            </div>

            <button className="bg-white text-red-600 font-semibold px-6 py-2 rounded-xl hover:scale-105 transition">
              Join Now →
            </button>
          </div>
        )}

        {/* ================= UPCOMING SESSIONS ================= */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
            <button
              onClick={() => navigate("/user/bookings")}
              className="text-blue-600 font-semibold"
            >
              View All
            </button>
          </div>

          {upcomingSessions.length === 0 && (
            <p className="text-gray-500">No upcoming sessions.</p>
          )}

          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex justify-between items-center p-5 rounded-xl border hover:shadow-sm transition"
              >
                <div>
                  <p className="font-bold">
                    {session.consultant?.user?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(session.date).toLocaleDateString()} •{" "}
                    {session.time_slot}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(`/user/consultant/${session.consultantId}`)
                  }
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RECOMMENDED CONSULTANTS ================= */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Recommended Consultants
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {consultants.map((c) => (
              <div
                key={c.id}
                className="bg-white p-6 rounded-3xl shadow-sm border text-center hover:shadow-md transition"
              >
                <img
                  src={c.profile_pic || "https://via.placeholder.com/150"}
                  alt={c.name}
                  className="h-20 w-20 rounded-full mx-auto object-cover"
                />
                <h3 className="mt-4 font-bold">{c.name}</h3>
                <p className="text-blue-600 text-sm">{c.domain}</p>

                <div className="flex justify-center items-center mt-1 text-yellow-500 text-sm">
                  <Star size={14} fill="currentColor" className="mr-1" />
                  {c.rating || 5}
                </div>

                <button
                  onClick={() => navigate(`/user/consultant/${c.id}`)}
                  className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ================= WALLET SECTION ================= */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white p-8 rounded-3xl shadow-lg">
          <p className="text-sm opacity-80 mb-2">Wallet Balance</p>
          <h2 className="text-4xl font-bold mb-6">
            ₹{walletBalance.toFixed(2)}
          </h2>

          <button
            onClick={() => navigate("/user/wallet")}
            className="bg-white text-blue-900 px-6 py-2 rounded-xl font-semibold"
          >
            Manage Wallet
          </button>
        </div>

        {/* ================= NOTIFICATIONS ================= */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="border p-4 rounded-xl">
              <p className="font-semibold">Booking Confirmed</p>
              <p className="text-sm text-gray-500">
                Your session has been successfully scheduled.
              </p>
            </div>

            <div className="border p-4 rounded-xl">
              <p className="font-semibold">Wallet Updated</p>
              <p className="text-sm text-gray-500">
                Your credits were updated after booking.
              </p>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default UserDashboard;
