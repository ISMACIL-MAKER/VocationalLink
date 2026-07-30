import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaMoneyBillWave, FaCheck, FaTimes } from "react-icons/fa";
import { fetchPendingPayments, decidePayment } from "../../features/adminSlice";
import Modal from "../../components/Modal";
import DocumentPreview from "../../components/DocumentPreview";
import EmptyState from "../../components/EmptyState";

export default function PaymentApprovalTab() {
  const dispatch = useDispatch();
  const { payments, paymentsLoading } = useSelector((state) => state.admin);
  const [previewPayment, setPreviewPayment] = useState(null);
  const [rejectingPayment, setRejectingPayment] = useState(null);
  const [rejectNote, setRejectNote] = useState("");

  useEffect(() => {
    dispatch(fetchPendingPayments());
  }, [dispatch]);

  const handleApprove = (payment) => {
    dispatch(decidePayment({ paymentId: payment._id, decision: "verified" }));
  };

  const handleReject = () => {
    if (!rejectingPayment) return;
    dispatch(
      decidePayment({
        paymentId: rejectingPayment._id,
        decision: "rejected",
        reviewNote: rejectNote,
      }),
    );
    setRejectingPayment(null);
    setRejectNote("");
  };

  if (paymentsLoading) {
    return <p className="text-sm text-[#64748B]">Loading payment queue...</p>;
  }

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={FaMoneyBillWave}
        title="No pending payments"
        description="Zaad/eDahab payment submissions from employers will appear here for review."
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {payments.map((payment) => (
          <div
            key={payment._id}
            className="bg-white border border-[#F2F4F6] rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-[#191C1E] text-sm truncate">
                  {payment.employerId?.employerProfile?.companyName ||
                    payment.employerId?.username}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5 truncate">{payment.jobId?.title}</p>
              </div>
              <span className="text-[10px] font-bold bg-[#F2F4F6] text-[#00236F] px-2.5 py-1 rounded-full shrink-0">
                {payment.method}
              </span>
            </div>

            <div className="mt-3 bg-[#F8FAFC] rounded-lg p-3 text-xs text-[#334155] space-y-1">
              <p>
                Amount:{" "}
                <span className="font-bold">
                  {payment.currency} {payment.amount}
                </span>
              </p>
              <p>Phone: {payment.payerPhone}</p>
              <p>Reference: {payment.transactionRef}</p>
            </div>

            <div className="flex gap-2 mt-4">
              {payment.receiptImage && (
                <button
                  onClick={() => setPreviewPayment(payment)}
                  className="flex-1 bg-[#F2F4F6] text-[#00236F] text-xs font-bold py-2 rounded-lg"
                >
                  View Receipt
                </button>
              )}
              <button
                onClick={() => handleApprove(payment)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 flex-1"
              >
                <FaCheck /> Approve &amp; Activate
              </button>
              <button
                onClick={() => setRejectingPayment(payment)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!previewPayment} onClose={() => setPreviewPayment(null)} title="Payment Receipt">
        <DocumentPreview fileUrl={previewPayment?.receiptImage} fileName="receipt" />
      </Modal>

      <Modal
        isOpen={!!rejectingPayment}
        onClose={() => setRejectingPayment(null)}
        title="Reject Payment"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#64748B]">
            Let the employer know why this payment was rejected.
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
