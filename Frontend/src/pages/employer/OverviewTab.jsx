import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBriefcase,
  FaUsers,
  FaBolt,
  FaChevronRight,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaCalendarDay,
  FaCreditCard,
} from "react-icons/fa";
import { fetchEmployerJobs, fetchEmployerApplications } from "../../features/employerSlice";
import CandidateDetailModal from "../../components/employer/CandidateDetailModal";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { computeMatchScore } from "../../utils/matchScore";

const REGISTRATION_BADGE = {
  not_submitted: {
    label: "Registration Not Submitted",
    icon: FaHourglassHalf,
    className: "bg-surface-alt text-text-secondary border-border",
  },
  pending: {
    label: "Pending Registration",
    icon: FaHourglassHalf,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  approved: {
    label: "Registered Employer",
    icon: FaCheckCircle,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Registration Rejected",
    icon: FaTimesCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function OverviewTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { jobs, applications } = useSelector((state) => state.employer);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const employerProfile = user?.employerProfile || {};

  useEffect(() => {
    dispatch(fetchEmployerJobs());
    dispatch(fetchEmployerApplications());
  }, [dispatch]);

  const registration =
    REGISTRATION_BADGE[employerProfile.registrationStatus] || REGISTRATION_BADGE.not_submitted;
  const RegistrationIcon = registration.icon;

  const isSubscriptionActive = employerProfile.subscriptionStatus === "active";
  const tierLabel = employerProfile.subscriptionTier
    ? employerProfile.subscriptionTier.charAt(0).toUpperCase() +
      employerProfile.subscriptionTier.slice(1)
    : "Free";

  const activeJobs = jobs.filter((job) => job.status === "active");
  const pendingPaymentJobs = jobs.filter((job) => job.status === "pending_payment");

  // "now" is read once per render purely to bucket existing application
  // timestamps for display (This Week / Today stats) — a stale value for a
  // single render frame has no functional consequence here.
  // eslint-disable-next-line react-hooks/purity
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nowMs = today.getTime();

  const applicationsThisWeek = applications.filter(
    (app) => nowMs - new Date(app.createdAt).setHours(0, 0, 0, 0) <= 6 * DAY_MS,
  );

  const interviewsToday = applications.filter((app) => {
    const scheduledAt = app.interview?.scheduledAt;
    if (!scheduledAt) return false;
    return new Date(scheduledAt).setHours(0, 0, 0, 0) === nowMs;
  });

  const weeklyBuckets = useMemo(() => {
    const buckets = Array.from({ length: 7 }).map((_, i) => {
      const dayStart = new Date(nowMs);
      dayStart.setDate(dayStart.getDate() - (6 - i));
      return { label: WEEKDAYS[dayStart.getDay()], time: dayStart.getTime(), count: 0 };
    });
    applications.forEach((app) => {
      const createdDay = new Date(app.createdAt).setHours(0, 0, 0, 0);
      const bucket = buckets.find((b) => b.time === createdDay);
      if (bucket) bucket.count += 1;
    });
    return buckets;
  }, [applications, nowMs]);
  const maxBucket = Math.max(...weeklyBuckets.map((b) => b.count), 1);

  const recentApplicants = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const selectedApplication =
    applications.find((app) => app._id === selectedApplicationId) || null;

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-text text-2xl font-bold tracking-tight">Employer Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">
            Welcome back, {employerProfile.companyName || user?.username}. Here's what's
            happening with your recruitment.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${registration.className}`}
            >
              <RegistrationIcon /> {registration.label}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${
                isSubscriptionActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-surface-alt text-text-secondary border-border"
              }`}
            >
              {isSubscriptionActive ? `${tierLabel} Plan — Active` : "Free Tier"}
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => toast("Report export is coming soon.")}
            className="text-primary text-sm font-semibold px-4 py-2.5 rounded-lg border border-border hover:bg-surface-alt transition-all"
          >
            Download Reports
          </button>
          <button
            onClick={() => navigate("/emmploye-Dashoard?tab=ats")}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-all"
          >
            Manage Applicants
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* STAT CARDS */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
          <div className="p-2.5 rounded-lg w-fit bg-primary/10 text-primary text-lg">
            <FaBriefcase />
          </div>
          <h2 className="text-2xl font-extrabold text-text mt-3">{activeJobs.length}</h2>
          <p className="text-xs text-text-secondary font-medium mt-1">Active Jobs</p>
          {pendingPaymentJobs.length > 0 && (
            <p className="text-[10px] text-amber-600 font-semibold mt-2">
              {pendingPaymentJobs.length} awaiting payment
            </p>
          )}
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
          <div className="p-2.5 rounded-lg w-fit bg-success/10 text-success text-lg">
            <FaUsers />
          </div>
          <h2 className="text-2xl font-extrabold text-text mt-3">{applications.length}</h2>
          <p className="text-xs text-text-secondary font-medium mt-1">Total Applicants</p>
          {applicationsThisWeek.length > 0 && (
            <p className="text-[10px] text-success font-semibold mt-2">
              +{applicationsThisWeek.length} this week
            </p>
          )}
        </div>

        {/* HIGHLIGHT CARD */}
        <div className="bg-primary text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wide text-white/70">
              New This Week
            </span>
            <FaBolt className="text-success" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mt-2">{applicationsThisWeek.length}</h2>
            <p className="text-xs text-white/80 mt-1">Applicants ready for review</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT APPLICANTS TABLE */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-text font-bold text-base">Recent Applicants</h2>
            <button
              onClick={() => navigate("/emmploye-Dashoard?tab=ats")}
              className="text-primary text-xs font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          {recentApplicants.length === 0 ? (
            <EmptyState
              icon={FaUsers}
              title="No applicants yet"
              description="Once candidates apply to your active jobs, they'll show up here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-text-secondary border-b border-border">
                    <th className="pb-2 pr-4 font-semibold">Candidate</th>
                    <th className="pb-2 pr-4 font-semibold">Role</th>
                    <th className="pb-2 pr-4 font-semibold">Match Score</th>
                    <th className="pb-2 pr-4 font-semibold">Status</th>
                    <th className="pb-2 font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {recentApplicants.map((application) => {
                    const seeker = application.seekerId || {};
                    const skills = seeker.seekerProfile?.skills || [];
                    const matchScore = computeMatchScore(application.jobId, skills);
                    return (
                      <tr
                        key={application._id}
                        onClick={() => setSelectedApplicationId(application._id)}
                        className="border-b border-border last:border-0 cursor-pointer hover:bg-surface-alt transition-colors"
                      >
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-text">
                            {seeker.username || application.seekerName}
                          </p>
                          <p className="text-[10px] text-text-secondary">
                            Applied {timeAgo(application.createdAt)}
                          </p>
                        </td>
                        <td className="py-3 pr-4 text-text-secondary">
                          {application.jobId?.title || "—"}
                        </td>
                        <td className="py-3 pr-4">
                          {matchScore != null ? (
                            <div className="flex items-center gap-2 w-28">
                              <div className="h-1.5 flex-1 bg-border rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-success rounded-full"
                                  style={{ width: `${matchScore}%` }}
                                />
                              </div>
                              <span className="text-text-secondary font-semibold">
                                {matchScore}%
                              </span>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <StatusBadge status={application.status} />
                        </td>
                        <td className="py-3 text-text-secondary">
                          <FaChevronRight />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN WIDGETS */}
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-border shadow-sm p-6">
            <h3 className="text-text font-bold text-sm mb-4">Active Hiring</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <FaCreditCard />
                </div>
                <div>
                  <p className="text-xs font-bold text-text">{pendingPaymentJobs.length}</p>
                  <p className="text-[10px] text-text-secondary">Jobs awaiting payment</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt">
                <div className="p-2 rounded-lg bg-success/10 text-success">
                  <FaCalendarDay />
                </div>
                <div>
                  <p className="text-xs font-bold text-text">{interviewsToday.length}</p>
                  <p className="text-[10px] text-text-secondary">Interviews today</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-border shadow-sm p-6">
            <h3 className="text-text font-bold text-sm mb-1">Applications This Week</h3>
            <p className="text-[10px] text-text-secondary mb-4">Daily applicant volume.</p>
            <div className="flex items-end justify-between gap-2 h-28">
              {weeklyBuckets.map((bucket) => (
                <div key={bucket.label} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t-md bg-primary/80"
                    style={{ height: `${Math.max((bucket.count / maxBucket) * 100, 4)}%` }}
                    title={`${bucket.count} applicant(s)`}
                  />
                  <span className="text-[9px] text-text-secondary">{bucket.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CandidateDetailModal
        application={selectedApplication}
        onClose={() => setSelectedApplicationId(null)}
      />
    </div>
  );
}
