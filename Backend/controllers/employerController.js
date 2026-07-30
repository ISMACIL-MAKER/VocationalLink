import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { sendEmailIfConfigured } from "../utils/email.js";

const APPLICATION_STATUSES = [
  "pending",
  "reviewed",
  "shortlisted",
  "interview_scheduled",
  "hired",
  "rejected",
];

export const getEmployerProfile = async (req, res) => {
  return res.status(200).json({ user: sanitizeUser(req.user) });
};

export const updateEmployerProfile = async (req, res) => {
  try {
    const {
      companyName,
      companyLogo,
      companyDescription,
      region,
      phone,
      registrationDocuments,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (companyName !== undefined) user.employerProfile.companyName = companyName;
    if (companyLogo !== undefined) user.employerProfile.companyLogo = companyLogo;
    if (companyDescription !== undefined)
      user.employerProfile.companyDescription = companyDescription;
    if (region !== undefined) user.employerProfile.region = region;
    if (phone !== undefined) user.phone = phone;

    if (registrationDocuments !== undefined) {
      user.employerProfile.registrationDocuments = registrationDocuments;
      if (user.employerProfile.registrationStatus !== "approved") {
        user.employerProfile.registrationStatus = "pending";
      }
    }

    await user.save();

    return res.status(200).json({
      message: "Company profile updated successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      requiredSkills,
      location,
      region,
      employmentType,
      salaryMin,
      salaryMax,
      currency,
      applicationDeadline,
    } = req.body;

    if (!title || !description || !location) {
      return res
        .status(400)
        .json({ message: "Title, description, and location are required." });
    }

    const job = await Job.create({
      employerId: req.user._id,
      title,
      company: req.user.employerProfile?.companyName || req.user.username,
      description,
      category: category || "Other",
      requiredSkills: requiredSkills || [],
      location,
      region: region || "Other",
      employmentType: employmentType || "full-time",
      salaryMin: salaryMin || undefined,
      salaryMax: salaryMax || undefined,
      currency: currency || "USD",
      applicationDeadline: applicationDeadline || undefined,
      status: "pending_payment",
    });

    return res.status(201).json({
      message: "Job created. Submit a Zaad/eDahab payment to activate it.",
      job,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }
    if (String(job.employerId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only the employer owner can delete this job." });
    }

    await Application.deleteMany({ jobId: job._id });
    await Job.findByIdAndDelete(job._id);

    return res.status(200).json({ message: "Job deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const submitJobPayment = async (req, res) => {
  try {
    const { method, payerPhone, transactionRef, amount, currency, receiptImage } = req.body;
    if (!method || !payerPhone || !transactionRef || !amount) {
      return res.status(400).json({
        message: "Payment method, phone, reference, and amount are required.",
      });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }
    if (String(job.employerId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only pay for your own job posts." });
    }

    const payment = await Payment.create({
      employerId: req.user._id,
      jobId: job._id,
      purpose: "job_posting",
      amount,
      currency: currency || "USD",
      method,
      payerPhone,
      transactionRef,
      receiptImage: receiptImage || "",
    });

    job.status = "pending_payment";
    job.paymentId = payment._id;
    await job.save();

    return res.status(201).json({
      message: "Payment submitted. Your job will go live once verified by our team.",
      payment,
      job,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getEmployerApplications = async (req, res) => {
  try {
    const applications = await Application.find({ employerId: req.user._id })
      .populate("jobId")
      .populate("seekerId", "username email phone profileImage seekerProfile")
      .sort({ createdAt: -1 });
    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStage = async (req, res) => {
  try {
    const { status, feedbackNote, interview } = req.body;

    if (status && !APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const application = await Application.findById(req.params.applicationId).populate(
      "jobId",
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }
    if (String(application.employerId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this application." });
    }

    if (status) {
      application.status = status;
    }

    if (feedbackNote?.trim()) {
      application.feedbackNotes.push({ note: feedbackNote.trim(), authorId: req.user._id });
    }

    if (interview) {
      application.interview = {
        scheduledAt: interview.scheduledAt || application.interview?.scheduledAt,
        mode: interview.mode || application.interview?.mode || "in-person",
        location: interview.location ?? application.interview?.location ?? "",
      };
      if (!status) {
        application.status = "interview_scheduled";
      }
    }

    await application.save();

    if (status || interview) {
      const label = application.status.replace(/_/g, " ");
      await Notification.create({
        userId: application.seekerId,
        title: "Application Status Updated",
        type: "application_status",
        message: `Your application for "${application?.jobId?.title || "job"}" is now ${label}.`,
      });
      await sendEmailIfConfigured({
        to: application.seekerEmail,
        subject: "Application status updated",
        text: `Your application for "${application?.jobId?.title || "job"}" is now ${label}.`,
      });
    }

    return res.status(200).json({
      message: "Application updated.",
      application,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const inviteCandidate = async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;
    if (!candidateId || !jobId) {
      return res.status(400).json({ message: "Candidate and job are required." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }
    if (String(job.employerId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only invite candidates to your own jobs." });
    }
    if (job.status !== "active") {
      return res.status(400).json({ message: "Only active jobs can be used to invite candidates." });
    }

    const candidate = await User.findOne({ _id: candidateId, role: "Job-Seeker" });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    const companyName = req.user.employerProfile?.companyName || req.user.username;

    await Notification.create({
      userId: candidate._id,
      title: "Job Invitation",
      type: "system",
      message: `${companyName} invited you to apply for "${job.title}".`,
      link: `/jobs/${job._id}`,
    });

    await sendEmailIfConfigured({
      to: candidate.email,
      subject: "You've been invited to apply",
      text: `${companyName} invited you to apply for "${job.title}". View it at /jobs/${job._id}.`,
    });

    return res.status(200).json({ message: "Invitation sent successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchVocationalTalent = async (req, res) => {
  try {
    const {
      skillName,
      category,
      proficiency,
      region,
      availability,
      verifiedOnly,
      page = 1,
      limit = 12,
    } = req.query;

    const skillElemMatch = {};
    if (category && category !== "All") skillElemMatch.category = category;
    if (proficiency && proficiency !== "All") skillElemMatch.proficiency = proficiency;
    if (skillName) skillElemMatch.skillName = { $regex: skillName, $options: "i" };
    if (verifiedOnly === "true") {
      skillElemMatch["certificates.verificationStatus"] = "verified";
    }

    const filter = { role: "Job-Seeker" };
    if (Object.keys(skillElemMatch).length > 0) {
      filter["seekerProfile.skills"] = { $elemMatch: skillElemMatch };
    }
    if (region && region !== "All") filter["seekerProfile.region"] = region;
    if (availability && availability !== "All") {
      filter["seekerProfile.availability"] = availability;
    }

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const [candidates, total] = await Promise.all([
      User.find(filter)
        .select("username seekerProfile profileImage bio createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      candidates,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(Math.ceil(total / limitNum), 1),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
