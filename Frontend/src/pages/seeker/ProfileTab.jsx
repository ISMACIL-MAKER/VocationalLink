import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSeekerProfile } from "../../features/seekerSlice";
import { SOMALILAND_REGIONS, REGION_LABELS, AVAILABILITY_OPTIONS } from "../../constants/enums";

export default function ProfileTab() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.seeker);
  const seekerProfile = user?.seekerProfile || {};

  const [bio, setBio] = useState(user?.bio || "");
  const [region, setRegion] = useState(seekerProfile.region || "Hargeisa");
  const [availability, setAvailability] = useState(seekerProfile.availability || "available");
  const [targetJobTitleInput, setTargetJobTitleInput] = useState("");
  const [targetJobTitles, setTargetJobTitles] = useState(seekerProfile.targetJobTitles || []);

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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-text text-lg font-bold">Profile</h2>
        <p className="text-text-secondary text-xs">
          Tell employers who you are and where you're based.
        </p>
      </div>

      <form
        onSubmit={handleSaveProfile}
        className="bg-surface rounded-2xl border border-border p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-text block mb-1">Region</label>
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
          <div>
            <label className="text-xs font-semibold text-text block mb-1">Availability</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm capitalize"
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
          <label className="text-xs font-semibold text-text block mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder="Tell employers about your experience..."
          />
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-text block mb-1">Target Job Titles</label>
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
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Site Electrician"
            />
            <button
              type="button"
              onClick={handleAddTargetTitle}
              className="px-4 py-2 rounded-lg bg-surface-alt text-primary text-sm font-semibold"
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
          className="mt-6 bg-primary hover:bg-primary-dark disabled:bg-border disabled:text-text-secondary text-white px-5 py-2.5 rounded-lg text-sm font-bold"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
