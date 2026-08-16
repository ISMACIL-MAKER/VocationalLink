import User from "../models/User.js";
import Job from "../models/Job.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";
import AuditLog from "../models/AuditLog.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { sendEmailIfConfigured } from "../utils/email.js";
import { SOMALILAND_REGIONS } from "../constants/enums.js";

export const getPendingVerifications = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const seekers = await User.find({
      role: "Job-Seeker",
      "seekerProfile.skills.certificates.verificationStatus": "pending",
    }).select("username email seekerProfile");

    console.log("Found seekers with pending certs:", seekers.length);

    const items = [];
    seekers.forEach((seeker) => {
      seeker.seekerProfile?.skills?.forEach((skill) => {
        skill.certificates?.forEach((certificate) => {
          if (certificate.verificationStatus === "pending") {
            items.push({
              userId: seeker._id,
              username: seeker.username,
              email: seeker.email,
              skillId: skill._id,
              skillName: skill.skillName,
              category: skill.category,
              proficiency: skill.proficiency,
              certificateId: certificate._id,
              title: certificate.title,
              issuer: certificate.issuer,
              fileUrl: certificate.fileUrl,
              fileName: certificate.fileName,
              issuedAt: certificate.issuedAt,
              submittedAt: certificate.createdAt,
            });
          }
        });
      });
    });

    items.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { userId, skillId, certificateId, decision, note } = req.body;
    if (!["verified", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Decision must be verified or rejected." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Seeker not found." });

    const skill = user.seekerProfile.skills.id(skillId);
    if (!skill) return res.status(404).json({ message: "Skill not found." });

    const certificate = skill.certificates.id(certificateId);
    if (!certificate) return res.status(404).json({ message: "Certificate not found." });

    certificate.verificationStatus = decision;
    certificate.verificationNote = note || "";
    certificate.verifiedBy = req.user._id;
    certificate.verifiedAt = new Date();
    await user.save();

    await Notification.create({
      userId: user._id,
      title: decision === "verified" ? "Certificate Verified" : "Certificate Rejected",
      type: "verification",
      message:
        decision === "verified"
          ? `Your certificate "${certificate.title}" has been verified. You now carry the Verified Skill Badge for ${skill.skillName}.`
          : `Your certificate "${certificate.title}" was rejected. ${note || ""}`.trim(),
    });

    await sendEmailIfConfigured({
      to: user.email,
      subject:
        decision === "verified" ? "Your certificate has been verified" : "Certificate review update",
      text:
        decision === "verified"
          ? `Your certificate "${certificate.title}" has been verified.`
          : `Your certificate "${certificate.title}" was rejected. ${note || ""}`.trim(),
    });

    await AuditLog.create({
      actorId: req.user._id,
      action: `certificate_${decision}`,
      targetType: "User",
      targetId: user._id,
      metadata: { skillId, certificateId, skillName: skill.skillName, note },
    });

    return res.status(200).json({ message: `Certificate ${decision}.` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "pending" })
      .populate("employerId", "username email employerProfile")
      .populate("jobId", "title location category region status")
      .sort({ createdAt: 1 });
    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const approvePayment = async (req, res) => {
  try {
    const { paymentId, decision, reviewNote } = req.body;
    if (!["verified", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Decision must be verified or rejected." });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found." });

    payment.status = decision;
    payment.reviewNote = reviewNote || "";
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = new Date();
    await payment.save();

    let job = null;
    if (payment.jobId) {
      job = await Job.findById(payment.jobId);
      if (job && decision === "verified") {
        job.status = "active";
        await job.save();
      }
    }

    await Notification.create({
      userId: payment.employerId,
      title: decision === "verified" ? "Payment Verified" : "Payment Rejected",
      type: "payment",
      message:
        decision === "verified"
          ? `Your payment has been verified. "${job?.title || "Your job"}" is now live.`
          : `Your payment submission was rejected. ${reviewNote || ""}`.trim(),
    });

    const employer = await User.findById(payment.employerId).select("email");
    await sendEmailIfConfigured({
      to: employer?.email,
      subject: decision === "verified" ? "Payment verified — job is live" : "Payment review update",
      text:
        decision === "verified"
          ? `Your payment has been verified. "${job?.title || "Your job"}" is now live.`
          : `Your payment submission was rejected. ${reviewNote || ""}`.trim(),
    });

    await AuditLog.create({
      actorId: req.user._id,
      action: `payment_${decision}`,
      targetType: "Payment",
      targetId: payment._id,
      metadata: { jobId: payment.jobId, amount: payment.amount, currency: payment.currency, reviewNote },
    });

    return res.status(200).json({ message: `Payment ${decision}.`, payment, job });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPendingEmployers = async (req, res) => {
  try {
    const employers = await User.find({
      role: "Employer",
      "employerProfile.registrationStatus": "pending",
    }).select("username email phone employerProfile createdAt");
    return res.status(200).json(employers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const approveEmployer = async (req, res) => {
  try {
    const { userId, decision, reviewNote } = req.body;
    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Decision must be approved or rejected." });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "Employer") {
      return res.status(404).json({ message: "Employer not found." });
    }

    user.employerProfile.registrationStatus = decision;
    user.employerProfile.registrationNote = reviewNote || "";
    await user.save();

    await Notification.create({
      userId: user._id,
      title:
        decision === "approved" ? "Company Registration Approved" : "Company Registration Rejected",
      type: "verification",
      message:
        decision === "approved"
          ? "Your company registration has been approved. You now carry the Registered Employer badge."
          : `Your company registration was rejected. ${reviewNote || ""}`.trim(),
    });

    await sendEmailIfConfigured({
      to: user.email,
      subject:
        decision === "approved" ? "Company registration approved" : "Company registration update",
      text:
        decision === "approved"
          ? "Your company registration has been approved."
          : `Your company registration was rejected. ${reviewNote || ""}`.trim(),
    });

    await AuditLog.create({
      actorId: req.user._id,
      action: `employer_${decision}`,
      targetType: "User",
      targetId: user._id,
      metadata: { reviewNote },
    });

    return res.status(200).json({ message: `Employer ${decision}.`, user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAdminAnalytics = async (req, res) => {
  try {
    const [
      totalSeekers,
      totalEmployers,
      totalAdmins,
      totalActiveJobs,
      pendingVerificationsCount,
      pendingPaymentsCount,
      pendingEmployersCount,
      regionAgg,
      skillAgg,
      revenueAgg,
      recentAuditLogs,
    ] = await Promise.all([
      User.countDocuments({ role: "Job-Seeker" }),
      User.countDocuments({ role: "Employer" }),
      User.countDocuments({ role: "Super-Admin" }),
      Job.countDocuments({ status: "active" }),
      User.countDocuments({
        role: "Job-Seeker",
        "seekerProfile.skills.certificates.verificationStatus": "pending",
      }),
      Payment.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "Employer", "employerProfile.registrationStatus": "pending" }),
      Job.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$region", count: { $sum: 1 } } },
      ]),
      Job.aggregate([
        { $match: { status: "active" } },
        { $unwind: "$requiredSkills" },
        { $group: { _id: "$requiredSkills", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Payment.aggregate([
        { $match: { status: "verified" } },
        { $group: { _id: "$currency", total: { $sum: "$amount" } } },
      ]),
      AuditLog.find().populate("actorId", "username role").sort({ createdAt: -1 }).limit(20),
    ]);

    const regionBreakdown = SOMALILAND_REGIONS.map((region) => ({
      region,
      count: regionAgg.find((entry) => entry._id === region)?.count || 0,
    }));

    return res.status(200).json({
      userBreakdown: { seekers: totalSeekers, employers: totalEmployers, admins: totalAdmins },
      totalActiveJobs,
      pendingApprovals: {
        verifications: pendingVerificationsCount,
        payments: pendingPaymentsCount,
        employers: pendingEmployersCount,
        total: pendingVerificationsCount + pendingPaymentsCount + pendingEmployersCount,
      },
      regionBreakdown,
      topSkills: skillAgg.map((entry) => ({ skill: entry._id, count: entry.count })),
      revenue: revenueAgg.map((entry) => ({ currency: entry._id, total: entry.total })),
      recentAuditLogs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};