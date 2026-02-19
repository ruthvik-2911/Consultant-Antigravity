import React, { useMemo, useState } from "react";
import Layout from "../../components/Layout";
import {
  DollarSign,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Download,
  PieChart,
} from "lucide-react";
import { MOCK_SESSIONS } from "../../constants";

const EnterpriseEarnings: React.FC = () => {
  const [activeView, setActiveView] = useState("Month");

  /* ================= DYNAMIC CALCULATIONS ================= */

  const completedSessions = MOCK_SESSIONS.filter(
    (s) => s.status === "COMPLETED"
  );

  const totalRevenue = completedSessions.reduce(
    (sum, s) => sum + (s.price || 0),
    0
  );

  const avgPerSession =
    completedSessions.length > 0
      ? totalRevenue / completedSessions.length
      : 0;

  const withdrawable = totalRevenue * 0.6; // 60% available
  const pending = totalRevenue * 0.2;

  const monthlyData = useMemo(() => {
    const months = Array(12).fill(0);

    completedSessions.forEach((session) => {
      const month = new Date(session.startTime).getMonth();
      months[month] += session.price || 0;
    });

    return months;
  }, [completedSessions]);

  const reports = [
    { name: "Enterprise Q1 Report.pdf", date: "Jan 05, 2026" },
    { name: "Monthly Revenue.csv", date: "Feb 01, 2026" },
    { name: "Tax Summary.pdf", date: "Jan 10, 2026" },
  ];

  return (
    <Layout title="Enterprise Earnings">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Revenue",
              value: `$${totalRevenue.toLocaleString()}`,
              change: "+12%",
              up: true,
              icon: <DollarSign size={24} />,
              color: "bg-emerald-50 text-emerald-600",
            },
            {
              label: "Withdrawable",
              value: `$${withdrawable.toLocaleString()}`,
              change: "Available",
              up: true,
              icon: <TrendingUp size={24} />,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Avg. per Session",
              value: `$${avgPerSession.toFixed(0)}`,
              change: "-3%",
              up: false,
              icon: <PieChart size={24} />,
              color: "bg-purple-50 text-purple-600",
            },
            {
              label: "Pending Payout",
              value: `$${pending.toLocaleString()}`,
              change: "Processing",
              up: true,
              icon: <Calendar size={24} />,
              color: "bg-amber-50 text-amber-600",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm"
            >
              <div
                className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}
              >
                {card.icon}
              </div>

              <p className="text-3xl font-black text-gray-900 mb-2">
                {card.value}
              </p>

              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  {card.label}
                </p>
                <div
                  className={`flex items-center text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                    card.up
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {card.up ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}
                  {card.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= CHART SECTION ================= */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 uppercase">
                Earnings Trend
              </h3>
              <div className="flex p-1 bg-gray-50 rounded-xl">
                {["Week", "Month", "Year"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveView(t)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase ${
                      activeView === t
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 flex items-end justify-between space-x-2">
              {monthlyData.map((amount, i) => {
                const height = totalRevenue
                  ? (amount / totalRevenue) * 100
                  : 0;

                return (
                  <div key={i} className="flex-1 group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${amount}
                    </div>
                    <div
                      className="bg-blue-100 rounded-t-lg group-hover:bg-blue-600 transition-all"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-6 px-2 text-[10px] font-black text-gray-400 uppercase">
              {[
                "Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec",
              ].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>

          {/* ================= WITHDRAW ================= */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-[40px] p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Withdraw Funds</h3>
              <p className="text-gray-400 text-sm mb-6">
                Transfer your available enterprise earnings securely.
              </p>

              <button className="w-full bg-blue-600 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all">
                Withdraw ${withdrawable.toLocaleString()}
              </button>
            </div>

            {/* ================= REPORTS ================= */}
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black uppercase mb-6">
                Reports
              </h3>
              <div className="space-y-3">
                {reports.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <Download size={18} />
                      <div>
                        <p className="text-xs font-black">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {file.date}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight size={16} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default EnterpriseEarnings;
