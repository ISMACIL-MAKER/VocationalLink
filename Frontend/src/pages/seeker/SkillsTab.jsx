import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaTrash, FaUpload, FaCertificate } from "react-icons/fa";
import {
  addOrUpdateSkill,
  deleteSkill,
  uploadCertificate,
  deleteCertificate,
} from "../../features/seekerSlice";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { VOCATIONAL_CATEGORIES, PROFICIENCY_LEVELS } from "../../constants/enums";

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

export default function SkillsTab() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const seekerProfile = user?.seekerProfile || {};

  const [skillForm, setSkillForm] = useState(EMPTY_SKILL_FORM);
  const [certUploadForSkill, setCertUploadForSkill] = useState(null);
  const [certForm, setCertForm] = useState(EMPTY_CERT_FORM);

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
    <div>
      <div className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="text-text font-bold text-lg mb-1">Vocational Skill Matrix</h2>
        <p className="text-xs text-text-secondary mb-4">
          Add each vocational skill you're experienced or certified in — this also doubles as
          your CV, since employers see your skills and verified certificates together.
        </p>

        <form onSubmit={handleAddSkill} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <select
            value={skillForm.category}
            onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
            className="border border-border rounded-lg px-3 py-2 text-sm"
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
            className="border border-border rounded-lg px-3 py-2 text-sm md:col-span-2"
            required
          />
          <select
            value={skillForm.proficiency}
            onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}
            className="border border-border rounded-lg px-3 py-2 text-sm capitalize"
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
              className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold shrink-0"
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
              <div key={skill._id} className="border border-border rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-primary bg-surface-alt px-2 py-0.5 rounded-full">
                      {skill.category}
                    </span>
                    <h3 className="font-bold text-text text-sm mt-1.5">{skill.skillName}</h3>
                    <p className="text-xs text-text-secondary capitalize mt-0.5">
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
                          className="flex items-center justify-between bg-surface-alt rounded-lg px-3 py-2"
                        >
                          <div>
                            <p className="text-xs font-semibold text-text">{cert.title}</p>
                            {cert.issuer && (
                              <p className="text-[10px] text-text-secondary">{cert.issuer}</p>
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
                      className="flex flex-col gap-2 bg-surface-alt rounded-lg p-3"
                    >
                      <input
                        value={certForm.title}
                        onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                        placeholder="Certificate title"
                        className="border border-border rounded-lg px-3 py-1.5 text-xs"
                        required
                      />
                      <input
                        value={certForm.issuer}
                        onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                        placeholder="Issuing institution (optional)"
                        className="border border-border rounded-lg px-3 py-1.5 text-xs"
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
                          className="text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-lg"
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          onClick={() => setCertUploadForSkill(null)}
                          className="text-xs font-semibold text-text-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setCertUploadForSkill(skill._id)}
                      className="text-xs font-semibold text-primary flex items-center gap-1.5 hover:underline"
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
