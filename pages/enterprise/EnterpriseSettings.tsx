import React, { useState } from "react";
import Layout from "../../components/Layout";
import {
  Building2,
  Upload,
  Settings,
  ShieldCheck,
  DollarSign,
  FileText,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const EnterpriseSettings: React.FC = () => {
  const { addToast } = useToast();

  const [branding, setBranding] = useState({
    logo: null as File | null,
    tagline: "",
    description: "",
    defaultPricing: 150,
  });

  const [documents, setDocuments] = useState<File[]>([]);

  const [preferences, setPreferences] = useState({
    allowConsultantPricing: true,
    autoAssignSessions: false,
  });

  const handleBrandingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBranding({ ...branding, [e.target.name]: e.target.value });
  };

  const saveSettings = () => {
    addToast("Enterprise settings updated successfully", "success");
  };

  return (
    <Layout title="Enterprise Settings">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <Settings size={36} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Enterprise Settings
          </h1>
        </div>
        <p className="text-gray-500">
          Manage enterprise branding, pricing, documents, and operational preferences.
        </p>

        {/* ================= BRANDING CONTROLS ================= */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Building2 className="text-blue-600" />
            <h2 className="text-xl font-bold">Branding Controls</h2>
          </div>

          <div>
            <label className="text-sm font-semibold">Company Logo</label>
            <input
              type="file"
              onChange={(e) =>
                setBranding({
                  ...branding,
                  logo: e.target.files ? e.target.files[0] : null,
                })
              }
              className="mt-2"
            />
          </div>

          <input
            type="text"
            name="tagline"
            placeholder="Company Tagline"
            value={branding.tagline}
            onChange={handleBrandingChange}
            className="input"
          />

          <textarea
            name="description"
            placeholder="Company Description"
            rows={3}
            value={branding.description}
            onChange={handleBrandingChange}
            className="textarea"
          />

          <div className="flex items-center gap-3">
            <DollarSign size={18} />
            <input
              type="number"
              name="defaultPricing"
              value={branding.defaultPricing}
              onChange={handleBrandingChange}
              className="input w-40"
            />
            <span className="text-gray-500 text-sm">
              Default Session Price ($)
            </span>
          </div>
        </div>

        {/* ================= ENTERPRISE PREFERENCES ================= */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Settings className="text-blue-600" />
            <h2 className="text-xl font-bold">Operational Preferences</h2>
          </div>

          <div className="flex items-center justify-between">
            <span>Allow Consultants to Set Their Own Pricing</span>
            <input
              type="checkbox"
              checked={preferences.allowConsultantPricing}
              onChange={() =>
                setPreferences({
                  ...preferences,
                  allowConsultantPricing:
                    !preferences.allowConsultantPricing,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Auto-Assign Sessions to Consultants</span>
            <input
              type="checkbox"
              checked={preferences.autoAssignSessions}
              onChange={() =>
                setPreferences({
                  ...preferences,
                  autoAssignSessions:
                    !preferences.autoAssignSessions,
                })
              }
            />
          </div>
        </div>

        {/* ================= DOCUMENT MANAGEMENT ================= */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600" />
            <h2 className="text-xl font-bold">Enterprise Documents</h2>
          </div>

          <p className="text-gray-500 text-sm">
            Upload business documents, compliance certificates, and verification files.
          </p>

          <input
            type="file"
            multiple
            onChange={(e) =>
              setDocuments(Array.from(e.target.files || []))
            }
          />

          <div className="space-y-2">
            {documents.map((doc, i) => (
              <p key={i} className="text-sm text-gray-600">
                {doc.name}
              </p>
            ))}
          </div>
        </div>

        {/* ================= VERIFICATION STATUS ================= */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-600" />
            <h2 className="text-xl font-bold">Verification Status</h2>
          </div>

          <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">
            Pending Verification
          </span>

          <p className="text-gray-500 text-sm">
            Your enterprise verification is currently under review by the admin team.
          </p>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Save All Changes
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default EnterpriseSettings;
