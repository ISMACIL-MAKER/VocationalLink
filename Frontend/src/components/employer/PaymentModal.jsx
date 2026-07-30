import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import { submitJobPayment } from "../../features/paymentSlice";
import { PAYMENT_METHODS } from "../../constants/enums";

const EMPTY_FORM = {
  method: PAYMENT_METHODS[0],
  payerPhone: "",
  transactionRef: "",
  amount: "",
  currency: "USD",
};

export default function PaymentModal({ job, onClose }) {
  const dispatch = useDispatch();
  const submitting = useSelector((state) => state.payment.submitting);
  const [form, setForm] = useState(EMPTY_FORM);
  const [receiptImage, setReceiptImage] = useState("");

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setReceiptImage(reader.result?.toString() || "");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      submitJobPayment({
        jobId: job._id,
        ...form,
        amount: Number(form.amount),
        receiptImage,
      }),
    );
    if (submitJobPayment.fulfilled.match(result)) {
      setForm(EMPTY_FORM);
      setReceiptImage("");
      onClose();
    }
  };

  return (
    <Modal isOpen={!!job} onClose={onClose} title="Activate Job with Zaad / eDahab">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-[#64748B] bg-[#F8FAFC] rounded-lg p-3">
          Submit your mobile money payment reference for{" "}
          <span className="font-semibold">{job?.title}</span>. Our team verifies each
          receipt manually — your job goes live once approved.
        </p>

        <div>
          <label className="text-xs font-semibold text-[#191C1E] block mb-1">
            Payment Method
          </label>
          <select
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#191C1E] block mb-1">
              Payer Phone Number
            </label>
            <input
              required
              value={form.payerPhone}
              onChange={(e) => setForm({ ...form, payerPhone: e.target.value })}
              placeholder="+252 63 XXXXXXX"
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#191C1E] block mb-1">
              Transaction Reference
            </label>
            <input
              required
              value={form.transactionRef}
              onChange={(e) => setForm({ ...form, transactionRef: e.target.value })}
              placeholder="e.g. ZAAD-928172"
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#191C1E] block mb-1">
              Amount Paid
            </label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#191C1E] block mb-1">Currency</label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
            >
              <option value="USD">USD</option>
              <option value="SLSH">SLSH</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#191C1E] block mb-1">
            Receipt Screenshot (optional)
          </label>
          <input type="file" accept="image/*" onChange={handleReceiptChange} className="text-xs" />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#00236F] hover:bg-[#1E3A8A] disabled:bg-[#94A3B8] text-white font-bold py-3 rounded-xl text-sm"
        >
          {submitting ? "Submitting..." : "Submit Payment"}
        </button>
      </form>
    </Modal>
  );
}
