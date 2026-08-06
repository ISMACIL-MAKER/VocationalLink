import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFileAlt, FaUpload, FaTrash } from "react-icons/fa";
import { updateSeekerProfile } from "../../features/seekerSlice";
import DocumentPreview from "../../components/DocumentPreview";
import EmptyState from "../../components/EmptyState";

const fileToBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result?.toString() || "");
    reader.readAsDataURL(file);
  });

export default function CvTab() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.seeker);
  const [pendingFile, setPendingFile] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileUrl = await fileToBase64(file);
    setPendingFile({ fileUrl, fileName: file.name });
  };

  const handleUpload = () => {
    if (!pendingFile) return;
    dispatch(updateSeekerProfile({ cvName: pendingFile.fileName, cvFile: pendingFile.fileUrl }));
    setPendingFile(null);
  };

  const handleRemove = () => {
    if (!window.confirm("Remove your uploaded CV?")) return;
    dispatch(updateSeekerProfile({ cvName: "", cvFile: "" }));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-text text-lg font-bold">My CV</h2>
        <p className="text-text-secondary text-xs">
          Upload a CV/resume file employers can view alongside your Skills portfolio.
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-6">
        {user?.cvFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-surface-alt text-primary text-lg">
                  <FaFileAlt />
                </div>
                <p className="text-sm font-semibold text-text">{user.cvName || "Your CV"}</p>
              </div>
              <button
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1.5"
              >
                <FaTrash /> Remove
              </button>
            </div>
            <DocumentPreview fileUrl={user.cvFile} fileName={user.cvName} />
          </div>
        ) : (
          <EmptyState
            icon={FaFileAlt}
            title="No CV uploaded yet"
            description="Upload a PDF or image of your CV so employers can review it alongside your skills."
          />
        )}

        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="text-xs"
          />
          <button
            onClick={handleUpload}
            disabled={!pendingFile || loading}
            className="bg-primary hover:bg-primary-dark disabled:bg-border disabled:text-text-secondary text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 shrink-0"
          >
            <FaUpload /> {loading ? "Uploading..." : "Upload CV"}
          </button>
        </div>
      </div>
    </div>
  );
}
