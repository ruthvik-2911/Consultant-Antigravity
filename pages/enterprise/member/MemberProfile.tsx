import React from "react";
import Layout from "../../../components/Layout";
import { useAuth } from "../../../App";

const MemberProfile: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="p-8">Loading profile...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="p-8 text-red-500">User not found.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <div className="bg-white p-6 rounded-xl shadow space-y-6 max-w-xl">

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-semibold">{user.role}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Verification Status</p>
            <p className="text-lg font-semibold">
              {user.is_verified ? "Verified ✅" : "Not Verified ❌"}
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default MemberProfile;