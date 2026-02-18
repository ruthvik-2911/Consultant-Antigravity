import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { consultants as consultantsApi } from "../services/api";
import api from "../services/api";
import { Consultant } from "../types";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { Star, Calendar, Loader } from "lucide-react";

<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { consultants as consultantsApi } from '../services/api';
import { Consultant } from '../types';
import { Search, Filter, Star, ShieldCheck, MapPin, Globe, Loader } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [consultantsData, setConsultantsData] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
=======
const days = [
  "Monday","Tuesday","Wednesday",
  "Thursday","Friday","Saturday","Sunday"
];

const ratingOptions = [
  { label: "All Ratings", value: "all" },
  { label: "4★ & above", value: 4 },
  { label: "3★ & above", value: 3 },
  { label: "2★ & above", value: 2 },
];

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
>>>>>>> Stashed changes

  const [consultantsData, setConsultantsData] = useState<Consultant[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<any>("all");
  const [maxPrice, setMaxPrice] = useState(5000);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchConsultants();
<<<<<<< Updated upstream
  }, []);

  const fetchConsultants = async (domain?: string) => {
    setLoading(true);
    try {
      const data = await consultantsApi.getAll(domain);
      setConsultantsData(data || []);
    } catch (err) {
      console.error("Failed to fetch consultants", err);
      setError("Failed to load consultants. Please try again.");
    } finally {
      setLoading(false);
=======
    fetchWallet();
  }, []);

  const fetchConsultants = async () => {
    try {
      const data = await consultantsApi.getAll();
      console.log("Consultants:", data);
      setConsultantsData(data || []);
    } catch (err) {
      console.error("Failed to fetch consultants");
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

  /* ================= BOOK SESSION ================= */
  const handleBookSession = async (consultantId: number, price: number) => {
    if (walletBalance < price) {
      addToast("Insufficient balance", "error");
      return;
    }

    setBookingLoading(consultantId);

    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split("T")[0];

      const bookingData = {
        consultant_id: consultantId,
        date: dateStr,
        time_slot: "10:00 AM"
      };

      const response = await api.post("/bookings/create", bookingData);
      addToast("Booking confirmed!", "success");
      setWalletBalance(response.data.remaining_balance);
    } catch (err) {
      addToast("Booking failed", "error");
    } finally {
      setBookingLoading(null);
    }
  };

  /* ================= FILTER LOGIC ================= */

  const uniqueDomains = [...new Set(consultantsData.map(c => c.domain))];

  const toggleSelection = (value: string, state: string[], setter: any) => {
    if (state.includes(value)) {
      setter(state.filter(item => item !== value));
    } else {
      setter([...state, value]);
>>>>>>> Stashed changes
    }
  };

  const clearFilters = () => {
    setSelectedDomains([]);
    setSelectedDays([]);
    setSelectedRating("all");
    setMaxPrice(5000);
  };

  const filteredConsultants = consultantsData.filter(c => {
    return (
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedDomains.length ? selectedDomains.includes(c.domain) : true) &&
      (selectedDays.length
        ? c.availability_days?.some(day => selectedDays.includes(day))
        : true) &&
      (selectedRating !== "all" ? (c.rating || 0) >= selectedRating : true) &&
      (c.hourly_price || 0) <= maxPrice
    );
  });

  return (
    <Layout title="Find Experts">
<<<<<<< Updated upstream
      <div className="max-w-6xl mx-auto space-y-8">
=======
      <div className="flex flex-col lg:flex-row gap-10">
>>>>>>> Stashed changes

        {/* ================= FILTER SIDEBAR ================= */}
        <div className="lg:w-1/4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-6 space-y-8">

          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear
            </button>
          </div>

<<<<<<< Updated upstream
        {/* Results Info */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500 font-medium">Found <span className="text-gray-900 font-bold">{filteredConsultants.length}</span> experts available for booking</p>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Sort by:</span>
            <select className="bg-transparent border-none font-bold text-blue-600 outline-none">
              <option>Popularity</option>
              <option>Rating (High-Low)</option>
              <option>Price (Low-High)</option>
            </select>
          </div>
        </div>

        {/* Loading / Error State */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-500 font-bold">
            {error}
          </div>
        )}

        {/* Consultants Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredConsultants.map((c) => (
              <div key={c.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="relative h-48">
                  <img src={c.profile_pic || c.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                  {c.is_verified && (
                    <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                      <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                        <ShieldCheck size={16} />
                      </div>
                      <span className="text-white text-xs font-black uppercase tracking-widest shadow-sm">Verified Premium</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center space-x-1 shadow-lg">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span className="text-xs font-bold text-gray-800">{c.rating || "5.0"}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{c.name || c.user?.email || "Consultant"}</h3>
                      <p className="text-sm text-blue-600 font-bold uppercase tracking-wider">{c.domain}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">{c.bio || "No bio available."}</p>

                  <div className="flex items-center space-x-4 mb-6 text-gray-400 text-xs font-bold">
                    <div className="flex items-center"><MapPin size={14} className="mr-1" /> Global</div>
                    <div className="flex items-center"><Globe size={14} className="mr-1" /> {c.languages || "English"}</div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div>
                      <p className="text-2xl font-black text-gray-900">${c.hourly_price || c.hourly_price}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Hourly Rate</p>
                    </div>
                    <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - Mock for now */}
        {!loading && filteredConsultants.length > 0 && (
          <div className="flex justify-center pt-8">
            <div className="flex space-x-2">
              <button className="w-10 h-10 rounded-xl bg-blue-600 border border-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-100">1</button>
=======
          {/* Domain */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700">Domain</h4>
            <div className="space-y-2">
              {uniqueDomains.map(domain => (
                <label key={domain} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDomains.includes(domain)}
                    onChange={() =>
                      toggleSelection(domain, selectedDomains, setSelectedDomains)
                    }
                    className="accent-blue-600"
                  />
                  <span className="text-sm">{domain}</span>
                </label>
              ))}
>>>>>>> Stashed changes
            </div>
          </div>

          {/* Availability */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700">Availability</h4>
            <div className="grid grid-cols-2 gap-2">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() =>
                    toggleSelection(day, selectedDays, setSelectedDays)
                  }
                  className={`text-xs px-3 py-2 rounded-xl border transition ${
                    selectedDays.includes(day)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 hover:bg-blue-50"
                  }`}
                >
                  {day.slice(0,3)}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700">
              Max Price ₹{maxPrice}
            </h4>
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Rating */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700">Rating</h4>
            {ratingOptions.map(r => (
              <label key={r.label} className="flex items-center gap-3 text-sm mb-2 cursor-pointer">
                <input
                  type="radio"
                  checked={selectedRating === r.value}
                  onChange={() => setSelectedRating(r.value)}
                  className="accent-blue-600"
                />
                {r.label}
              </label>
            ))}
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="lg:w-3/4 space-y-6">

          {/* Search Bar */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

              {filteredConsultants.map(c => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg transition"
                >
                  <img
                    src={c.profile_pic || "https://via.placeholder.com/150"}
                    alt={c.name}
                    className="h-24 w-24 rounded-full mx-auto object-cover"
                  />

                  <h3 className="mt-4 font-bold text-lg">{c.name}</h3>
                  <p className="text-blue-600 text-sm">{c.domain}</p>

                  <div className="flex items-center justify-center mt-1 text-yellow-500 text-sm">
                    <Star size={14} fill="currentColor" className="mr-1"/>
                    {c.rating || 5}
                  </div>

                  <p className="mt-3 font-black text-xl">
                    ₹{c.hourly_price}
                  </p>

                  <button
                    onClick={() => handleBookSession(c.id, c.hourly_price || 0)}
                    disabled={bookingLoading === c.id}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                  >
                    {bookingLoading === c.id ? "Booking..." : "Book Now"}
                  </button>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
