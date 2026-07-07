import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployerProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return setFetching(false);
      try {
        const response = await fetch(`http://localhost:5000/api/User/${user.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to load profile.");
        setUsername(data.username || "");
        setBio(data.bio || "");
        setProfileImage(data.profileImage || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`http://localhost:5000/api/User/${user.id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, bio, profileImage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile.");
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("profile-updated"));
      setMessage("Employer profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[#1E3A8A] text-2xl font-bold">Employer Profile</h1>
        <button
          type="button"
          onClick={() => navigate("/emmploye-Dashoard")}
          className="text-sm font-semibold text-[#00236F] hover:text-[#1E3A8A] underline"
        >
          Back to Dashboard
        </button>
      </div>

      {fetching && <p className="text-sm text-[#64748B]">Loading profile...</p>}
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {message && <p className="text-sm text-emerald-600 mb-3">{message}</p>}

      {!fetching && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <img
              src={profileImage || "https://tse3.mm.bing.net/th/id/OIP.6E59fA0XA6lx8RsJjtAjXwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border border-[#CBD5E1]"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => setProfileImage(reader.result?.toString() || "");
                reader.readAsDataURL(file);
              }}
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm" placeholder="Company/Employer Name" />
            <input value={user?.email || ""} disabled className="border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC]" />
          </div>

          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm mt-4" placeholder="Describe your company or hiring goals..." />

          <button type="submit" disabled={loading} className="mt-6 bg-[#00236F] hover:bg-[#1E3A8A] disabled:bg-[#94A3B8] text-white px-5 py-2.5 rounded-lg text-sm font-bold">
            {loading ? "Saving..." : "Save Employer Profile"}
          </button>
        </form>
      )}
    </div>
  );
}
