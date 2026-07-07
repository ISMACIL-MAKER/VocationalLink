import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [cvName, setCvName] = useState("");
  const [cvFile, setCvFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setFetching(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/User/${user.id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile.");
        }
        setUsername(data.username || "");
        setBio(data.bio || "");
        setSkills(data.skills || []);
        setProfileImage(data.profileImage || "");
        setCvName(data.cvName || "");
        setCvFile(data.cvFile || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, [user?.id]);

  const handleAddSkill = () => {
    const cleaned = skillInput.trim();
    if (!cleaned) return;
    if (skills.includes(cleaned)) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, cleaned]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skill) => {
    setSkills((prev) => prev.filter((item) => item !== skill));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result?.toString() || "");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`http://localhost:5000/api/User/${user.id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, bio, skills, profileImage, cvName, cvFile }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("profile-updated"));
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCvUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCvFile(reader.result?.toString() || "");
      setCvName(file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[#1E3A8A] text-2xl font-bold">Profile Settings</h1>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm font-semibold text-[#00236F] hover:text-[#1E3A8A] underline"
        >
          Back Home
        </button>
      </div>
      {fetching && <p className="text-sm text-[#64748B]">Loading profile...</p>}
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {message && <p className="text-sm text-emerald-600 mb-3">{message}</p>}

      {!fetching && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-6 max-w-3xl"
        >
          <div className="mb-6 flex items-center gap-4">
            <img
              src={
                profileImage ||
                "https://tse3.mm.bing.net/th/id/OIP.6E59fA0XA6lx8RsJjtAjXwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
              }
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border border-[#CBD5E1]"
            />
            <div>
              <label className="text-sm font-semibold text-[#334155] block mb-1">
                Change Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-[#334155] block mb-1">
                Full Name
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#334155] block mb-1">Email</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-[#334155] block mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm"
              placeholder="Tell people about yourself..."
            />
          </div>

          {user?.role === "Job-Seeker" && (
            <>
              <div className="mt-4">
                <label className="text-sm font-semibold text-[#334155] block mb-1">
                  Add Skills
                </label>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                    className="flex-1 border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm"
                    placeholder="e.g. React, Node.js, UI Design"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-lg bg-[#1D4ED8] text-white text-sm font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-[#DBEAFE] text-[#1E40AF] px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)}>
                        x
                      </button>
                    </span>
                  ))}
                </div>
            </div>

              <div className="mt-4">
                <label className="text-sm font-semibold text-[#334155] block mb-1">
                  Upload CV (PDF/DOC)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvUpload}
                  className="text-xs"
                />
                {cvName && (
                  <p className="text-xs text-[#475569] mt-2">
                    Current CV: <span className="font-semibold">{cvName}</span>
                  </p>
                )}
                {cvFile && (
                  <a
                    href={cvFile}
                    download={cvName || "my-cv"}
                    className="inline-block mt-2 text-xs text-[#1D4ED8] font-semibold"
                  >
                    Download Uploaded CV
                  </a>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-[#00236F] hover:bg-[#1E3A8A] disabled:bg-[#94A3B8] text-white px-5 py-2.5 rounded-lg text-sm font-bold"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      )}
    </div>
  );
}