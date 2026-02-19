import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../services/api";
import {
  Users,
  Plus,
  Trash2,
  CalendarPlus,
  Loader,
} from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  status: string;
  earnings?: number;
  total_sessions?: number;
  success_rate?: number;
}

const TeamManagement: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
  });

  /* ================= FETCH TEAM ================= */

  const fetchTeam = async () => {
    try {
      const res = await api.get("/enterprise/team");

      // 🔥 FIX: Ensure always array
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.team || [];

      setTeam(data);
    } catch (err) {
      console.error("Failed to fetch team");
      setTeam([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  /* ================= ADD MEMBER ================= */

  const handleAddMember = async () => {
    try {
      await api.post("/enterprise/team", newMember);

      setNewMember({ name: "", email: "" });
      setShowAddModal(false);
      fetchTeam();
    } catch (err) {
      console.error("Failed to add member");
    }
  };

  /* ================= REMOVE MEMBER ================= */

  const handleRemoveMember = async (id: number) => {
    try {
      await api.delete(`/enterprise/team/${id}`);
      fetchTeam();
    } catch (err) {
      console.error("Failed to remove member");
    }
  };

  if (loading) {
    return (
      <Layout title="Team Management">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Team Management">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold">
              Enterprise Team Management
            </h1>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} /> Add Member
          </button>
        </div>

        {/* TEAM LIST */}
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          {team.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No team members found.
            </div>
          ) : (
            team.map((member) => (
              <div
                key={member.id}
                className="border-b p-6 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <h3 className="font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {member.email}
                  </p>

                  <div className="flex gap-6 mt-3 text-xs text-gray-600">
                    <span>
                      Status:
                      <span
                        className={`ml-1 font-semibold ${
                          member.status === "ACTIVE"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {member.status}
                      </span>
                    </span>

                    <span>
                      Earnings: ₹{member.earnings || 0}
                    </span>

                    <span>
                      Sessions: {member.total_sessions || 0}
                    </span>

                    <span>
                      Success Rate: {member.success_rate || 0}%
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-xl flex items-center gap-2">
                    <CalendarPlus size={16} /> Assign
                  </button>

                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-xl flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ADD MEMBER MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-xl">
              <h2 className="text-xl font-bold mb-6">
                Add Enterprise Member
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border rounded-xl px-4 py-3"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded-xl px-4 py-3"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddMember}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeamManagement;
