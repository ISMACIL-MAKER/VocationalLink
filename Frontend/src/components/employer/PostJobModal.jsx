import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import { createEmployerJob } from "../../features/employerSlice";
import {
  SOMALILAND_REGIONS,
  REGION_LABELS,
  VOCATIONAL_CATEGORIES,
  EMPLOYMENT_TYPES,
} from "../../constants/enums";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: VOCATIONAL_CATEGORIES[0],
  region: SOMALILAND_REGIONS[0],
  location: "",
  employmentType: EMPLOYMENT_TYPES[0],
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  applicationDeadline: "",
};

const STEPS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Location & Pay" },
  { id: 3, label: "Review" },
];

function StepProgress({ step }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {STEPS.map((s, idx) => (
        <div key={s.id} className="flex items-center gap-2 flex-1">
          <div
            className={`h-1.5 flex-1 rounded-full ${
              s.id <= step ? "bg-primary" : "bg-border"
            }`}
          />
          {idx < STEPS.length - 1 && <span className="sr-only" />}
        </div>
      ))}
    </div>
  );
}

export default function PostJobModal({ isOpen, onClose, onPosted }) {
  const dispatch = useDispatch();
  const { jobsLoading } = useSelector((state) => state.employer);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [stepError, setStepError] = useState("");

  const resetAndClose = () => {
    setStep(1);
    setForm(EMPTY_FORM);
    setRequiredSkills([]);
    setStepError("");
    onClose();
  };

  const handleAddSkill = () => {
    const cleaned = skillInput.trim();
    if (!cleaned || requiredSkills.includes(cleaned)) {
      setSkillInput("");
      return;
    }
    setRequiredSkills((prev) => [...prev, cleaned]);
    setSkillInput("");
  };

  const goNext = () => {
    if (step === 1 && (!form.title.trim() || !form.description.trim())) {
      setStepError("Title and description are required.");
      return;
    }
    if (step === 2 && !form.location.trim()) {
      setStepError("Location is required.");
      return;
    }
    setStepError("");
    setStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const goBack = () => {
    setStepError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      createEmployerJob({
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        requiredSkills,
      }),
    );
    if (createEmployerJob.fulfilled.match(result)) {
      onPosted?.(result.payload);
      resetAndClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="Post a New Job" maxWidth="max-w-2xl">
      <StepProgress step={step} />
      <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wide mb-4 -mt-4">
        {STEPS.map((s) => (
          <span key={s.id} className={s.id === step ? "text-primary" : ""}>
            {s.label}
          </span>
        ))}
      </div>

      {stepError && (
        <div className="bg-red-50 text-red-600 text-xs font-semibold rounded-lg p-3 mb-4">
          {stepError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Job Title
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                >
                  {VOCATIONAL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Employment Type
                </label>
                <select
                  value={form.employmentType}
                  onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm capitalize"
                >
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Region
                </label>
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                >
                  {SOMALILAND_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {REGION_LABELS[r] || r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Location (site/city detail)
                </label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Downtown Hargeisa"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Salary Min
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.salaryMin}
                  onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Salary Max
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.salaryMax}
                  onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Currency
                </label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="USD">USD</option>
                  <option value="SLSH">SLSH</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Required Skills
              </label>
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="e.g. Residential Wiring"
                  className="flex-1 border border-border rounded-lg px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-lg bg-surface-alt text-primary text-sm font-semibold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-[#DBEAFE] text-[#1E40AF] px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() =>
                        setRequiredSkills((prev) => prev.filter((item) => item !== skill))
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Application Deadline (optional)
              </label>
              <input
                type="date"
                value={form.applicationDeadline}
                onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="bg-surface-alt rounded-xl p-4 text-xs text-text space-y-1.5">
              <p>
                <span className="font-bold">{form.title}</span> — {form.category},{" "}
                {form.employmentType.replace("-", " ")}
              </p>
              <p>
                {REGION_LABELS[form.region] || form.region} • {form.location}
              </p>
              {(form.salaryMin || form.salaryMax) && (
                <p>
                  {form.currency} {form.salaryMin || 0}–{form.salaryMax || form.salaryMin}
                </p>
              )}
              {requiredSkills.length > 0 && <p>Skills: {requiredSkills.join(", ")}</p>}
              <p className="text-text-secondary pt-1">
                Your job will be created as <strong>Pending Payment</strong> — you'll submit a
                Zaad/eDahab reference next to activate it.
              </p>
            </div>
          </>
        )}

        <div className="flex justify-between pt-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-primary bg-surface-alt"
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={goNext}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-dark"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={jobsLoading}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-dark disabled:bg-border disabled:text-text-secondary"
            >
              {jobsLoading ? "Posting..." : "Post Job"}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
