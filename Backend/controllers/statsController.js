import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { VOCATIONAL_CATEGORIES } from "../constants/enums.js";

export const getPublicStats = async (req, res) => {
  try {
    const [
      totalActiveJobs,
      totalEmployers,
      totalSeekers,
      verifiedEmployers,
      verifiedSeekers,
      totalHires,
      categoryAgg,
    ] = await Promise.all([
      Job.countDocuments({ status: "active" }),
      User.countDocuments({ role: "Employer" }),
      User.countDocuments({ role: "Job-Seeker" }),
      User.countDocuments({
        role: "Employer",
        "employerProfile.registrationStatus": "approved",
      }),
      User.countDocuments({
        role: "Job-Seeker",
        "seekerProfile.skills.certificates.verificationStatus": "verified",
      }),
      Application.countDocuments({ status: "hired" }),
      Job.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);

    const countByCategory = categoryAgg.reduce((acc, entry) => {
      acc[entry._id] = entry.count;
      return acc;
    }, {});

    const categoryCounts = VOCATIONAL_CATEGORIES.map((category) => ({
      category,
      count: countByCategory[category] || 0,
    }));

    return res.status(200).json({
      totalActiveJobs,
      totalEmployers,
      totalSeekers,
      verifiedEmployers,
      verifiedSeekers,
      totalHires,
      categoryCounts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
