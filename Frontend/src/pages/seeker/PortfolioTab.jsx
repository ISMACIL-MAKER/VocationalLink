import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaTrash, FaUpload, FaCertificate } from "react-icons/fa";
import {
  updateSeekerProfile,
  addOrUpdateSkill,
  deleteSkill,
  uploadCertificate,
  deleteCertificate,
} from "../../features/seekerSlice";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import {
  SOMALILAND_REGIONS,
  REGION_LABELS,
  VOCATIONAL_CATEGORIES,
  PROFICIENCY_LEVELS,
  AVAILABILITY_OPTIONS,
} from "../../constants/enums";

const fileToBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result?.toString() || "");
    reader.readAsDataURL(file);
  });

const EMPTY_SKILL_FORM = {
  category: VOCATIONAL_CATEGORIES[0],
  skillName: "",
  proficiency: "beginner",
  yearsExperience: 0,
};

const EMPTY_CERT_FORM = { title: "", issuer: "", fileUrl: "", fileName: "" };

export default function PortfolioTab() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.seeker);
  const seekerProfile = user?.seekerProfile || {};

  const [bio, setBio] = useState(user?.bio || "");
  const [region, setRegion] = useState(seekerProfile.region || "Hargeisa");
  const [availability, setAvailability] = useState(seekerProfile.availability || "available");
  const [targetJobTitleInput, setTargetJobTitleInput] = useState("");
  const [targetJobTitles, setTargetJobTitles] = useState(seekerProfile.targetJobTitles || []);

  const [skillForm, setSkillForm] = useState(EMPTY_SKILL_FORM);
  const [certUploadForSkill, setCertUploadForSkill] = useState(null);
  const [certForm, setCertForm] = useState(EMPTY_CERT_FORM);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(updateSeekerProfile({ bio, region, availability, targetJobTitles }));
  };

  const handleAddTargetTitle = () => {
    const cleaned = targetJobTitleInput.trim();
    if (!cleaned || targetJobTitles.includes(cleaned)) {
      setTargetJobTitleInput("");
      return;
    }
    setTargetJobTitles((prev) => [...prev, cleaned]);
    setTargetJobTitleInput("");
  };

  const handleRemoveTargetTitle = (title) => {
    setTargetJobTitles((prev) => prev.filter((item) => item !== title));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillForm.skillName.trim()) return;
    dispatch(addOrUpdateSkill(skillForm));
    setSkillForm(EMPTY_SKILL_FORM);
  };

  const handleDeleteSkill = (skillId) => {
    if (!window.confirm("Remove this skill and its certificates?")) return;
    dispatch(deleteSkill(skillId));
  };

  const handleCertFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setCertForm((prev) => ({ ...prev, fileUrl: base64, fileName: file.name }));
  };

  const handleUploadCertificate = (e, skillId) => {
    e.preventDefault();
    if (!certForm.title.trim() || !certForm.fileUrl) return;
    dispatch(uploadCertificate({ skillId, certificate: certForm }));
    setCertForm(EMPTY_CERT_FORM);
    setCertUploadForSkill(null);
  };

  const handleDeleteCertificate = (skillId, certificateId) => {
    if (!window.confirm("Remove this certificate?")) return;
    dispatch(deleteCertificate({ skillId, certificateId }));
  };

  return (
    <div className="space-y-8">
      {/* PROFILE & AVAILABILITY */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-2xl border border-[#F2F4F6] p-6"
      >
        <h2 className="text-[#191C1E] font-bold text-lg mb-4">Profile &amp; Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#191C1E] block mb-1">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
            >
              {SOMALILAND_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {REGION_LABELS[r] || r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#191C1E] block mb-1">
              Availability
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm capitalize"
            >
              {AVAILABILITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-[#191C1E] block mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
            placeholder="Tell employers about your experience..."
          />
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-[#191C1E] block mb-1">
            Target Job Titles
          </label>
          <div className="flex gap-2">
            <input
              value={targetJobTitleInput}
              onChange={(e) => setTargetJobTitleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTargetTitle();
                }
              }}
              className="flex-1 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Site Electrician"
            />
            <button
              type="button"
              onClick={handleAddTargetTitle}
              className="px-4 py-2 rounded-lg bg-[#F2F4F6] text-[#00236F] text-sm font-semibold"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {targetJobTitles.map((title) => (
              <span
                key={title}
                className="text-xs bg-[#DBEAFE] text-[#1E40AF] px-3 py-1 rounded-full flex items-center gap-2"
              >
                {title}
                <button type="button" onClick={() => handleRemoveTargetTitle(title)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-[#00236F] hover:bg-[#1E3A8A] disabled:bg-[#94A3B8] text-white px-5 py-2.5 rounded-lg text-sm font-bold"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {/* VOCATIONAL SKILL MATRIX */}
      <div className="bg-white rounded-2xl border border-[#F2F4F6] p-6">
        <h2 className="text-[#191C1E] font-bold text-lg mb-1">Vocational Skill Matrix</h2>
        <p className="text-xs text-[#64748B] mb-4">
          Add each vocational skill you're experienced or certified in.
        </p>

        <form
          onSubmit={handleAddSkill}
          className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6"
        >
          <select
            value={skillForm.category}
            onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
            className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
          >
            {VOCATIONAL_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            value={skillForm.skillName}
            onChange={(e) => setSkillForm({ ...skillForm, skillName: e.target.value })}
            placeholder="Skill name (e.g. Residential Wiring)"
            className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm md:col-span-2"
            required
          />
          <select
            value={skillForm.proficiency}
            onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}
            className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm capitalize"
          >
            {PROFICIENCY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="50"
              value={skillForm.yearsExperience}
              onChange={(e) =>
                setSkillForm({ ...skillForm, yearsExperience: Number(e.target.value) })
              }
              title="Years of experience"
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#00236F] text-white text-sm font-semibold shrink-0"
            >
              <FaPlus />
            </button>
          </div>
        </form>

        {(seekerProfile.skills || []).length === 0 ? (
          <EmptyState
            icon={FaCertificate}
            title="No skills added yet"
            description="Add your first vocational skill above to start building your verified portfolio."
          />
        ) : (
          <div className="space-y-4">
            {seekerProfile.skills.map((skill) => (
              <div key={skill._id} className="border border-[#F2F4F6] rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#00236F] bg-[#F2F4F6] px-2 py-0.5 rounded-full">
                      {skill.category}
                    </span>
                    <h3 className="font-bold text-[#191C1E] text-sm mt-1.5">
                      {skill.skillName}
                    </h3>
                    <p className="text-xs text-[#64748B] capitalize mt-0.5">
                      {skill.proficiency} • {skill.yearsExperience} yrs experience
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(skill._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    aria-label="Remove skill"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="mt-3">
                  {skill.certificates?.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {skill.certificates.map((cert) => (
                        <div
                          key={cert._id}
                          className="flex items-center justify-between bg-[#F8FAFC] rounded-lg px-3 py-2"
                        >
                          <div>
                            <p className="text-xs font-semibold text-[#191C1E]">{cert.title}</p>
                            {cert.issuer && (
                              <p className="text-[10px] text-[#64748B]">{cert.issuer}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={cert.verificationStatus} />
                            <button
                              onClick={() => handleDeleteCertificate(skill._id, cert._id)}
                              className="text-red-500 hover:text-red-700 text-xs"
                              aria-label="Remove certificate"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {certUploadForSkill === skill._id ? (
                    <form
                      onSubmit={(e) => handleUploadCertificate(e, skill._id)}
                      className="flex flex-col gap-2 bg-[#F8FAFC] rounded-lg p-3"
                    >
                      <input
                        value={certForm.title}
                        onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                        placeholder="Certificate title"
                        className="border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs"
                        required
                      />
                      <input
                        value={certForm.issuer}
                        onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                        placeholder="Issuing institution (optional)"
                        className="border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs"
                      />
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleCertFileChange}
                        className="text-xs"
                        required
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="text-xs font-bold bg-[#00236F] text-white px-3 py-1.5 rounded-lg"
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          onClick={() => setCertUploadForSkill(null)}
                          className="text-xs font-semibold text-[#64748B]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setCertUploadForSkill(skill._id)}
                      className="text-xs font-semibold text-[#00236F] flex items-center gap-1.5 hover:underline"
                    >
                      <FaUpload /> Upload Certificate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
