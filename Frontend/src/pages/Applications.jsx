import { useEffect, useState } from "react";

export default function Applications() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const [appRes, notifRes] = await Promise.all([
          fetch(`http://localhost:5000/api/Application/seeker/${user.id}`),
          fetch(`http://localhost:5000/api/Notification/${user.id}`),
        ]);
        const appData = await appRes.json();
        const notifData = await notifRes.json();
        if (!appRes.ok) {
          throw new Error(appData.message || "Failed to load applications.");
        }
        setApplications(appData);
        if (notifRes.ok) {
          setNotifications(notifData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/Notification/${notificationId}/read`,
        { method: "PUT" },
      );
      if (!response.ok) return;
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, read: true } : item,
        ),
      );
    } catch {
      // ignore network errors
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen">
      <h1 className="text-[#1E3A8A] text-2xl font-bold mb-6">My Applications</h1>

      {loading && <p className="text-sm text-[#64748B]">Loading applications...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#1E293B] mb-3">Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-sm text-[#64748B]">No notifications yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {notifications.slice(0, 8).map((note) => (
                <div
                  key={note._id}
                  className={`bg-white border rounded-xl p-4 shadow-sm ${
                    note.read ? "border-[#E2E8F0]" : "border-[#BFDBFE]"
                  }`}
                >
                  <h3 className="text-sm font-semibold text-[#1E293B]">{note.title}</h3>
                  <p className="text-sm text-[#475569] mt-1">{note.message}</p>
                  {!note.read && (
                    <button
                      onClick={() => markAsRead(note._id)}
                      className="mt-2 text-xs text-[#1D4ED8] font-semibold"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <p className="text-sm text-[#64748B]">You have not applied to any jobs yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm"
          >
            <h2 className="text-[#191C1E] font-semibold text-base">
              {item?.jobId?.title || "Job deleted"}
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              {item?.jobId?.company} - {item?.jobId?.location}
            </p>
            <p className="text-xs text-[#334155] mt-2">
              Status: <span className="font-semibold capitalize">{item.status}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}