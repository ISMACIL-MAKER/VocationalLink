import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaBuilding, FaCheck, FaTimes } from "react-icons/fa";
import { fetchPendingEmployers, decideEmployer } from "../../features/adminSlice";
import Modal from "../../components/Modal";
import DocumentPreview from "../../components/DocumentPreview";
import EmptyState from "../../components/EmptyState";
import { REGION_LABELS } from "../../constants/enums";

export default function EmployerApprovalTab() {
  const dispatch = useDispatch();
  const { employers, employersLoading } = useSelector((state) => state.admin);
  const [previewEmployer, setPreviewEmployer] = useState(null);
  const [rejectingEmployer, setRejectingEmployer] = useState(null);
  const [rejectNote, setRejectNote] = useState("");

  useEffect(() => {
    dispatch(fetchPendingEmployers());
  }, [dispatch]);

  const handleApprove = (employer) => {
    dispatch(decideEmployer({ userId: employer._id, decision: "approved" }));
  };

  const handleReject = () => {
    if (!rejectingEmployer) return;
    dispatch(
      decideEmployer({
        userId: rejectingEmployer._id,
        decision: "rejected",
        reviewNote: rejectNote,
      }),
    );
    setRejectingEmployer(null);
    setRejectNote("");
  };

  if (employersLoading) {
    return <p className="text-sm text-[#64748B]">Loading employer queue...</p>;
  }

  if (employers.length === 0) {
    return (
      <EmptyState
        icon={FaBuilding}
        title="No pending employer registrations"
        description="Company registrations awaiting approval will appear here."
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employers.map((employer) => (
          <div
            key={employer._id}
            className="bg-white border border-[#F2F4F6] rounded-xl p-5 shadow-sm"
          >
            <h3 className="font-bold text-[#191C1E] text-sm">
              {employer.employerProfile?.companyName || employer.username}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">{employer.email}</p>
            <p className="text-xs text-[#64748B]">
              {REGION_LABELS[employer.employerProfile?.region] ||
                employer.employerProfile?.region}
            </p>
            {employer.employerProfile?.companyDescription && (
              <p className="text-xs text-[#64748B] mt-2 line-clamp-2">
                {employer.employerProfile.companyDescription}
              </p>
            )}

            <div className="flex gap-2 mt-4">
              {employer.employerProfile?.registrationDocuments?.length > 0 && (
                <button
                  onClick={() => setPreviewEmployer(employer)}
                  className="flex-1 bg-[#F2F4F6] text-[#00236F] text-xs font-bold py-2 rounded-lg"
                >
                  View Documents
                </button>
              )}
              <button
                onClick={() => handleApprove(employer)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 flex-1"
              >
                <FaCheck /> Approve
              </button>
              <button
                onClick={() => setRejectingEmployer(employer)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!previewEmployer}
        onClose={() => setPreviewEmployer(null)}
        title="Registration Documents"
      >
        <div className="space-y-3">
          {previewEmployer?.employerProfile?.registrationDocuments?.map((doc, idx) => (
            <DocumentPreview key={idx} fileUrl={doc} fileName={`document-${idx + 1}`} />
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={!!rejectingEmployer}
        onClose={() => setRejectingEmployer(null)}
        title="Reject Employer"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#64748B]">
            Let {rejectingEmployer?.username} know why their registration was rejected.
          </p>
          <textarea
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            rows={3}
            placeholder="Reason for rejection..."
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
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
