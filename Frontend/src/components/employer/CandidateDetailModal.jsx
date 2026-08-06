import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import Modal from "../Modal";
import StatusBadge from "../StatusBadge";
import { updateApplicationStage } from "../../features/employerSlice";
import { fetchMessages, sendMessage } from "../../features/messageSlice";
import { APPLICATION_STAGES } from "../../constants/enums";

const ALL_STAGES = [...APPLICATION_STAGES, "rejected"];

export default function CandidateDetailModal({ application, onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const messages = useSelector(
    (state) => state.messages.byApplication[application?._id] || [],
  );
  const sending = useSelector((state) => state.messages.sending);

  const [status, setStatus] = useState(application?.status || "pending");
  const [feedbackNote, setFeedbackNote] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewMode, setInterviewMode] = useState("video");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [messageText, setMessageText] = useState("");

  // Reset the local stage selector whenever a different candidate is opened.
  // Adjusting state during render (React's recommended pattern for this) rather
  // than in an effect, since this candidate switch is derived from props, not
  // an external event.
  const [openApplicationId, setOpenApplicationId] = useState(application?._id);
  if (application && application._id !== openApplicationId) {
    setOpenApplicationId(application._id);
    setStatus(application.status);
  }

  useEffect(() => {
    if (application?._id) {
      dispatch(fetchMessages(application._id));
    }
  }, [dispatch, application?._id]);

  if (!application) return null;

  const seeker = application.seekerId || {};
  const skills = seeker.seekerProfile?.skills || [];

  const handleUpdateStage = () => {
    dispatch(updateApplicationStage({ applicationId: application._id, status }));
  };

  const handleAddFeedback = () => {
    if (!feedbackNote.trim()) return;
    dispatch(
      updateApplicationStage({ applicationId: application._id, feedbackNote }),
    );
    setFeedbackNote("");
  };

  const handleScheduleInterview = () => {
    if (!interviewDate) return;
    dispatch(
      updateApplicationStage({
        applicationId: application._id,
        interview: {
          scheduledAt: new Date(interviewDate).toISOString(),
          mode: interviewMode,
          location: interviewLocation,
        },
      }),
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    dispatch(sendMessage({ applicationId: application._id, text: messageText.trim() }));
    setMessageText("");
  };

  return (
    <Modal isOpen={!!application} onClose={onClose} title="Candidate Details" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* CANDIDATE SUMMARY */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-text text-base">{seeker.username}</h3>
            <p className="text-xs text-text-secondary mt-0.5">{seeker.email}</p>
            {seeker.phone && <p className="text-xs text-text-secondary">{seeker.phone}</p>}
            <p className="text-xs text-text-secondary mt-1">
              Applied for <span className="font-semibold">{application.jobId?.title}</span>
            </p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill._id}
                className="text-[10px] font-semibold bg-surface-alt text-primary px-2.5 py-1 rounded-full flex items-center gap-1"
              >
                {skill.skillName} ({skill.proficiency})
                {skill.certificates?.some((c) => c.verificationStatus === "verified") && (
                  <FaCheckCircle className="text-emerald-500" />
                )}
              </span>
            ))}
          </div>
        )}

        {/* STAGE TRANSITION */}
        <div className="border-t border-border pt-4">
          <h4 className="text-xs font-bold text-text mb-2">Update Pipeline Stage</h4>
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm capitalize"
            >
              {ALL_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <button
              onClick={handleUpdateStage}
              className="bg-primary hover:bg-primary-dark text-white text-sm font-bold px-4 py-2 rounded-lg"
            >
              Update
            </button>
          </div>
        </div>

        {/* FEEDBACK NOTES */}
        <div className="border-t border-border pt-4">
          <h4 className="text-xs font-bold text-text mb-2">Feedback Notes</h4>
          {application.feedbackNotes?.length > 0 && (
            <div className="space-y-2 mb-3">
              {application.feedbackNotes.map((note) => (
                <div key={note._id} className="bg-surface-alt rounded-lg p-3 text-xs text-text">
                  {note.note}
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <textarea
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              rows={2}
              placeholder="Leave feedback for this candidate..."
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={handleAddFeedback}
              className="bg-surface-alt text-primary text-sm font-bold px-4 py-2 rounded-lg h-fit"
            >
              Add
            </button>
          </div>
        </div>

        {/* INTERVIEW SCHEDULING */}
        <div className="border-t border-border pt-4">
          <h4 className="text-xs font-bold text-text mb-2">Schedule Interview</h4>
          {application.interview?.scheduledAt && (
            <p className="text-xs text-text-secondary mb-2">
              Currently scheduled: {new Date(application.interview.scheduledAt).toLocaleString()}{" "}
              ({application.interview.mode})
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={interviewMode}
              onChange={(e) => setInterviewMode(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm capitalize"
            >
              <option value="video">Video</option>
              <option value="phone">Phone</option>
              <option value="in-person">In-Person</option>
            </select>
            <input
              value={interviewLocation}
              onChange={(e) => setInterviewLocation(e.target.value)}
              placeholder="Location / link"
              className="border border-border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleScheduleInterview}
            className="mt-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold px-4 py-2 rounded-lg"
          >
            Schedule
          </button>
        </div>

        {/* MESSAGING */}
        <div className="border-t border-border pt-4">
          <h4 className="text-xs font-bold text-text mb-2">Direct Message</h4>
          <div className="bg-surface-alt rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 mb-3">
            {messages.length === 0 ? (
              <p className="text-xs text-text-secondary">No messages yet. Say hello!</p>
            ) : (
              messages.map((msg) => {
                const isMine = String(msg.senderId) === String(user?.id);
                return (
                  <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-lg text-xs ${
                        isMine
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-surface border border-border text-text rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-primary hover:bg-primary-dark disabled:bg-border disabled:text-text-secondary text-white px-4 py-2 rounded-lg"
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
