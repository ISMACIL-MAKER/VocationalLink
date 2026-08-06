import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateEmployerProfile } from "../features/employerSlice";
import { SOMALILAND_REGIONS, REGION_LABELS } from "../constants/enums";

const fileToBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result?.toString() || "");
    reader.readAsDataURL(file);
  });

export default function EmployerProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const employerProfile = user?.employerProfile || {};

  const [companyName, setCompanyName] = useState(employerProfile.companyName || "");
  const [companyDescription, setCompanyDescription] = useState(
    employerProfile.companyDescription || "",
  );
  const [companyLogo, setCompanyLogo] = useState(employerProfile.companyLogo || "");
  const [region, setRegion] = useState(employerProfile.region || "Hargeisa");
  const [saving, setSaving] = useState(false);
  const [docSaving, setDocSaving] = useState(false);
  const [pendingDoc, setPendingDoc] = useState(null);

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompanyLogo(await fileToBase64(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await dispatch(
      updateEmployerProfile({ companyName, companyDescription, companyLogo, region }),
    );
    setSaving(false);
  };

  const handleDocChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setPendingDoc({ name: file.name, data: base64 });
  };

  const handleSubmitVerification = async () => {
    if (!pendingDoc) return;
    setDocSaving(true);
    const documents = [...(employerProfile.registrationDocuments || []), pendingDoc.data];
    await dispatch(updateEmployerProfile({ registrationDocuments: documents }));
    setPendingDoc(null);
    setDocSaving(false);
  };

  return (
    <div className="w-full bg-surface-alt min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-primary text-2xl font-bold">Company Profile</h1>
        <button
          type="button"
          onClick={() => navigate("/emmploye-Dashoard")}
          className="text-sm font-semibold text-primary hover:text-primary-dark underline"
        >
          Back to Dashboard
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface rounded-2xl border border-border p-6 max-w-3xl mb-6"
      >
        <div className="mb-6 flex items-center gap-4">
          <img
            src={
              companyLogo ||
              "https://tse3.mm.bing.net/th/id/OIP.6E59fA0XA6lx8RsJjtAjXwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
            }
            alt="Company logo"
            className="w-20 h-20 rounded-xl object-cover border border-border"
          />
          <div>
            <label className="text-sm font-semibold text-text block mb-1">
              Company Logo
            </label>
            <input type="file" accept="image/*" onChange={handleLogoChange} className="text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-text block mb-1">
              Company Name
            </label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Hargeisa Power Co"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-text block mb-1">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            >
              {SOMALILAND_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {REGION_LABELS[r] || r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-semibold text-text block mb-1">
            Company Description
          </label>
          <textarea
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            rows={4}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder="Describe your company or hiring goals..."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 bg-primary hover:bg-primary-dark disabled:bg-border disabled:text-text-secondary text-white px-5 py-2.5 rounded-lg text-sm font-bold"
        >
          {saving ? "Saving..." : "Save Company Profile"}
        </button>
      </form>

      <div className="bg-surface rounded-2xl border border-border p-6 max-w-3xl">
        <h2 className="text-text font-bold text-base mb-1">Company Verification</h2>
        <p className="text-xs text-text-secondary mb-4">
          Upload a business registration document to request the verified employer badge.
          Our Super-Admin team reviews submissions manually.
        </p>

        <p className="text-xs font-semibold text-text mb-3">
          Status:{" "}
          <span className="capitalize">
            {(employerProfile.registrationStatus || "not_submitted").replace("_", " ")}
          </span>
        </p>

        <input type="file" accept="image/*,.pdf" onChange={handleDocChange} className="text-xs" />
        {pendingDoc && (
          <p className="text-xs text-text-secondary mt-2">Ready to submit: {pendingDoc.name}</p>
        )}
        <button
          type="button"
          onClick={handleSubmitVerification}
          disabled={!pendingDoc || docSaving}
          className="mt-4 bg-surface-alt hover:bg-border disabled:opacity-50 text-primary px-5 py-2.5 rounded-lg text-sm font-bold block"
        >
          {docSaving ? "Submitting..." : "Submit for Verification"}
        </button>
      </div>
    </div>
  );
}
