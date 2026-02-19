import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { ShieldCheck, Users, ArrowRight } from "lucide-react";

const EnterpriseSelectMode: React.FC = () => {
  const navigate = useNavigate();

  return (
   
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-10 border">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Choose Access Mode
            </h1>
            <p className="text-gray-500 text-sm">
              Continue as Enterprise Admin or Team Member
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* ADMIN CARD */}
            <div
              onClick={() => navigate("/enterprise/dashboard")}
              className="group bg-gray-50 rounded-2xl p-8 cursor-pointer border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 group-hover:bg-blue-200 transition">
                <ShieldCheck className="text-blue-600" size={28} />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Enterprise Admin
              </h2>

              <p className="text-gray-500 text-sm mb-6">
                Manage consultants, sessions, pricing, earnings and enterprise analytics.
              </p>

              <div className="flex items-center text-blue-600 font-semibold text-sm">
                Continue as Admin
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={16} />
              </div>
            </div>

            {/* MEMBER CARD */}
            <div
              onClick={() => navigate("/enterprise/member/dashboard")}
              className="group bg-gray-50 rounded-2xl p-8 cursor-pointer border-2 border-transparent hover:border-green-500 hover:bg-green-50 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-6 group-hover:bg-green-200 transition">
                <Users className="text-green-600" size={28} />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Team Member
              </h2>

              <p className="text-gray-500 text-sm mb-6">
                Access assigned sessions, earnings and manage availability.
              </p>

              <div className="flex items-center text-green-600 font-semibold text-sm">
                Continue as Member
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={16} />
              </div>
            </div>

          </div>
        </div>
      </div>

  );
};

export default EnterpriseSelectMode;
