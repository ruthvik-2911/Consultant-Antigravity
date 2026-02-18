import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

interface Slot {
  _id?: string;
  startTime: string;
  endTime: string;
  type: string;
  status: "Booked" | "Available" | "Blocked";
  client?: string;
}

const AvailabilityPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /* ================= WEEK GENERATOR ================= */
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());

    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDates(selectedDate);

  /* ================= FETCH SLOTS ================= */
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/availability?date=${selectedDate.toISOString()}`
        );

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setSlots(data);
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  /* ================= MONTH NAVIGATION ================= */
  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  /* ================= DELETE SLOT ================= */
  const handleDelete = async (id?: string) => {
    if (!id) return;

    await fetch(`/api/availability/${id}`, {
      method: "DELETE",
    });

    setSlots((prev) => prev.filter((slot) => slot._id !== id));
  };

  /* ================= RENDER ================= */
  return (
    <Layout title="Work Schedule">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ================= HEADER ================= */}
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600">
              <Calendar size={32} />
            </div>

            <div>
              <h2 className="text-3xl font-black text-gray-900">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>

              <div className="flex items-center space-x-4 mt-1">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                <span
                  onClick={() => {
                    const today = new Date();
                    setCurrentDate(today);
                    setSelectedDate(today);
                  }}
                  className="text-sm font-black text-blue-600 uppercase tracking-widest cursor-pointer"
                >
                  Today
                </span>

                <button
                  onClick={() => changeMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all">
            <Plus size={20} className="mr-2" />
            Bulk Add Slots
          </button>
        </div>

        {/* ================= WEEK GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const isSelected =
              day.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-6 rounded-[32px] border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-xl"
                    : "bg-white border-gray-100"
                }`}
              >
                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    isSelected ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </p>

                <h3 className="text-2xl font-black">
                  {day.getDate()}
                </h3>
              </div>
            );
          })}
        </div>

        {/* ================= SLOT SECTION ================= */}
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
              Slots for{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h3>

            <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span>
                {slots.filter((s) => s.status === "Available").length} Slots
                Available
              </span>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading slots...</p>
          ) : (
            <div className="space-y-4">
              {slots.length === 0 && (
                <p className="text-center text-gray-400 py-10">
                  No slots for this day
                </p>
              )}

              {slots.map((slot) => (
                <div
                  key={slot._id}
                  className={`p-6 rounded-[28px] border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
                    slot.status === "Booked"
                      ? "bg-blue-50 border-blue-100"
                      : "bg-gray-50 border-transparent hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-6">
                    <div className="p-4 rounded-2xl bg-white text-gray-500">
                      <Clock size={20} />
                    </div>

                    <div>
                      <p className="font-black text-gray-900 text-lg leading-none mb-1">
                        {slot.startTime} - {slot.endTime}
                      </p>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                          {slot.type}
                        </span>

                        {slot.client && (
                          <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            CLIENT: {slot.client}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {slot.status === "Available" && (
                      <>
                        <button
                          onClick={() => handleDelete(slot._id)}
                          className="text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-widest px-4 py-2"
                        >
                          Delete
                        </button>

                        <button className="bg-white border border-gray-100 text-gray-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
                          Edit Slot
                        </button>
                      </>
                    )}

                    {slot.status !== "Available" && (
                      <button className="text-xs font-black text-blue-600 uppercase tracking-widest px-4 py-2 bg-white rounded-xl shadow-sm border border-blue-50">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button className="w-full py-6 border-4 border-dashed border-gray-50 rounded-[28px] text-gray-300 font-black text-lg hover:border-blue-200 hover:text-blue-400 transition-all flex items-center justify-center">
                <Plus size={24} className="mr-3" />
                Click to add a new slot for this day
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AvailabilityPage;
