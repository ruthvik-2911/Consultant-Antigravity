import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../services/api";
import {
  Building2,
  Settings,
  ShieldCheck,
  DollarSign,
  FileText,
  Loader,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const EnterpriseSettings: React.FC = () => {
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [branding, setBranding] = useState({
    logo: null as File | null,
    logoUrl: "",
    tagline: "",
    description: "",
    defaultPricing: 150,
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [existingDocs, setExistingDocs] = useState<string[]>([]);

  const [preferences, setPreferences] = useState({
    allowConsultantPricing: true,
    autoAssignSessions: false,
  });

  const [verificationStatus, setVerificationStatus] =
    useState("PENDING");

  /* ================= FETCH SETTINGS ================= */

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/enterprise/settings");

      const data = res.data;

      setBranding({
        logo: null,
        logoUrl: data.logo || "",
        tagline: data.tagline || "",
        description: data.description || "",
        defaultPricing: data.defaultPricing || 150,
      });

      setPreferences({
        allowConsultantPricing:
          data.allowConsultantPricing ?? true,
        autoAssignSessions:
          data.autoAssignSessions ?? false,
      });

      setExistingDocs(data.documents || []);
      setVerificationStatus(data.verificationStatus || "PENDING");
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAVE SETTINGS ================= */

  const saveSettings = async () => {
    try {
      const formData = new FormData();

      formData.append("tagline", branding.tagline);
      formData.append("description", branding.description);
      formData.append(
        "defaultPricing",
        branding.defaultPricing.toString()
      );

      formData.append(
        "allowConsultantPricing",
        preferences.allowConsultantPricing.toString()
      );
      formData.append(
        "autoAssignSessions",
        preferences.autoAssignSessions.toString()
      );

      if (branding.logo) {
        formData.append("logo", branding.logo);
      }

      documents.forEach((doc) =>
        formData.append("documents", doc)
      );

      await api.put("/enterprise/settings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      addToast("Enterprise settings updated successfully", "success");
      fetchSettings();
    } catch (error) {
      console.error("Failed to save settings", error);
      addToast("Failed to update settings", "error");
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <Layout title="Enterprise Settings">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      </Layout>
    );
  }

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

        {/* ================= BRANDING ================= */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Building2 className="text-blue-600" />
            <h2 className="text-xl font-bold">Branding Controls</h2>
          </div>

          {/* Existing Logo */}
          {branding.logoUrl && (
            <img
              src={branding.logoUrl}
              alt="Company Logo"
              className="h-16 object-contain"
            />
          )}

          <input
            type="file"
            onChange={(e) =>
              setBranding({
                ...branding,
                logo: e.target.files?.[0] || null,
              })
            }
          />

          <input
            type="text"
            placeholder="Company Tagline"
            value={branding.tagline}
            onChange={(e) =>
              setBranding({
                ...branding,
                tagline: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-2 w-full"
          />

          <textarea
            placeholder="Company Description"
            rows={3}
            value={branding.description}
            onChange={(e) =>
              setBranding({
                ...branding,
                description: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-2 w-full"
          />

          <div className="flex items-center gap-3">
            <DollarSign size={18} />
            <input
              type="number"
              value={branding.defaultPricing}
              onChange={(e) =>
                setBranding({
                  ...branding,
                  defaultPricing: Number(e.target.value),
                })
              }
              className="border rounded-xl px-4 py-2 w-40"
            />
            <span className="text-gray-500 text-sm">
              Default Session Price (₹)
            </span>
          </div>
        </div>

        {/* ================= PREFERENCES ================= */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <h2 className="text-xl font-bold">
            Operational Preferences
          </h2>

          <div className="flex justify-between items-center">
            <span>Allow Consultant Pricing</span>
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

          <div className="flex justify-between items-center">
            <span>Auto Assign Sessions</span>
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

        {/* ================= DOCUMENTS ================= */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600" />
            <h2 className="text-xl font-bold">
              Enterprise Documents
            </h2>
          </div>

          <input
            type="file"
            multiple
            onChange={(e) =>
              setDocuments(Array.from(e.target.files || []))
            }
          />

          {/* Existing Docs */}
          <div className="space-y-2">
            {existingDocs.map((doc, i) => (
              <p key={i} className="text-sm text-gray-600">
                {doc}
              </p>
            ))}
          </div>
        </div>

        {/* ================= VERIFICATION ================= */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-600" />
            <h2 className="text-xl font-bold">
              Verification Status
            </h2>
          </div>

          <span
            className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
              verificationStatus === "APPROVED"
                ? "bg-green-100 text-green-700"
                : verificationStatus === "REJECTED"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {verificationStatus}
          </span>
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