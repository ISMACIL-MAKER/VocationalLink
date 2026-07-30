import Job from "../models/Job.js";

const EMPLOYER_PUBLIC_FIELDS =
  "username employerProfile.companyName employerProfile.companyLogo employerProfile.region";

export const searchJobs = async (req, res) => {
  try {
    const { q, region, category, employmentType, page = 1, limit = 9 } = req.query;

    const filter = { status: "active" };
    if (region && region !== "All") filter.region = region;
    if (category && category !== "All") filter.category = category;
    if (employmentType && employmentType !== "All") filter.employmentType = employmentType;
    if (q) filter.$text = { $search: q };

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 9, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate("employerId", EMPLOYER_PUBLIC_FIELDS)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(filter),
    ]);

    return res.status(200).json({
      jobs,
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

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate("employerId", EMPLOYER_PUBLIC_FIELDS);

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
