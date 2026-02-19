import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../App";
import { CalendarDays, Wallet, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EnterpriseMemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<any[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API calls
    setSessions([]);
    setEarnings(1200);
    setReviews([
      { rating: 5, comment: "Great session!" },
      { rating: 4, comment: "Very helpful." }
    ]);
    setLoading(false);
  }, []);

  if (loading) return <Layout title="Dashboard">Loading...</Layout>;

  return (
    <Layout title="Enterprise Member Dashboard">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Welcome */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-500">
            Manage your sessions, earnings and availability.
          </p>
        </div>

        {/* Sessions */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CalendarDays /> Assigned Sessions
          </h2>

          {sessions.length === 0 ? (
            <p className="text-gray-500">No assigned sessions.</p>
          ) : (
            sessions.map((s, i) => (
              <div key={i} className="border-b py-3">
                {s.title}
              </div>
            ))
          )}
        </div>

        {/* Earnings */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <Wallet className="text-green-600 mb-3" />
            <p className="text-2xl font-bold">₹{earnings}</p>
            <p className="text-sm text-gray-500">Total Earnings</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <CalendarDays className="text-blue-600 mb-3" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-gray-500">Sessions Completed</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <Star className="text-yellow-500 mb-3" />
            <p className="text-2xl font-bold">
              {reviews.length > 0
                ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
                : 0}
            </p>
            <p className="text-sm text-gray-500">Average Rating</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star /> Recent Feedback
          </h2>

          {reviews.map((r, i) => (
            <div key={i} className="border-b py-3">
              ⭐ {r.rating} – {r.comment}
            </div>
          ))}
        </div>

        {/* Availability + Quick Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-8 rounded-3xl shadow-lg flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-2">
              Manage Your Availability
            </h2>
            <p className="text-sm opacity-90">
              Keep your schedule updated for new bookings.
            </p>
          </div>

          {/* ONE Quick Action Button */}
          <button
            onClick={() => navigate("/enterprise/member/profile")}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Update Availability
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default EnterpriseMemberDashboard;
