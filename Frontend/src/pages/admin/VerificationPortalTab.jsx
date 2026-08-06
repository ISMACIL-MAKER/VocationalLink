import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShieldAlt, FaCheck, FaTimes } from "react-icons/fa";
import { fetchPendingVerifications, decideVerification } from "../../features/adminSlice";
import Modal from "../../components/Modal";
import DocumentPreview from "../../components/DocumentPreview";
import EmptyState from "../../components/EmptyState";

export default function VerificationPortalTab() {
  const dispatch = useDispatch();
  const { verifications, verificationsLoading } = useSelector((state) => state.admin);
  const [previewItem, setPreviewItem] = useState(null);
  const [rejectingItem, setRejectingItem] = useState(null);
  const [rejectNote, setRejectNote] = useState("");

  useEffect(() => {
    dispatch(fetchPendingVerifications());
  }, [dispatch]);

  const handleApprove = (item) => {
    dispatch(
      decideVerification({
        userId: item.userId,
        skillId: item.skillId,
        certificateId: item.certificateId,
        decision: "verified",
      }),
    );
  };

  const handleReject = () => {
    if (!rejectingItem) return;
    dispatch(
      decideVerification({
        userId: rejectingItem.userId,
        skillId: rejectingItem.skillId,
        certificateId: rejectingItem.certificateId,
        decision: "rejected",
        note: rejectNote,
      }),
    );
    setRejectingItem(null);
    setRejectNote("");
  };

  if (verificationsLoading) {
    return <p className="text-sm text-text-secondary">Loading verification queue...</p>;
  }

  if (verifications.length === 0) {
    return (
      <EmptyState
        icon={FaShieldAlt}
        title="No pending certificates"
        description="New certificate submissions from job seekers will appear here for review."
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {verifications.map((item) => (
          <div
            key={item.certificateId}
            className="bg-surface border border-border rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-text text-sm truncate">{item.username}</h3>
                <p className="text-xs text-text-secondary mt-0.5 truncate">{item.email}</p>
              </div>
              <span className="text-[10px] font-bold bg-surface-alt text-primary px-2.5 py-1 rounded-full shrink-0">
                {item.category}
              </span>
            </div>

            <div className="mt-3 bg-surface-alt rounded-lg p-3">
              <p className="text-xs font-semibold text-text">{item.title}</p>
              <p className="text-[10px] text-text-secondary mt-0.5">
                {item.skillName} • {item.proficiency}
                {item.issuer && ` • ${item.issuer}`}
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setPreviewItem(item)}
                className="flex-1 bg-surface-alt text-primary text-xs font-bold py-2 rounded-lg"
              >
                View Document
              </button>
              <button
                onClick={() => handleApprove(item)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5"
              >
                <FaCheck /> Approve
              </button>
              <button
                onClick={() => setRejectingItem(item)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5"
              >
                <FaTimes /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!previewItem} onClose={() => setPreviewItem(null)} title={previewItem?.title || "Document"}>
        <DocumentPreview fileUrl={previewItem?.fileUrl} fileName={previewItem?.fileName} />
      </Modal>

      <Modal
        isOpen={!!rejectingItem}
        onClose={() => setRejectingItem(null)}
        title="Reject Certificate"
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary">
            Let {rejectingItem?.username} know why this certificate was rejected.
          </p>
          <textarea
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            rows={3}
            placeholder="Reason for rejection..."
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={handleReject}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg text-sm"
          >
            Confirm Rejection
          </button>
        </div>
      </Modal>
    </div>
  );
}
