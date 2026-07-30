import User from "../models/User.js";
import Application from "../models/Application.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

export const getSeekerProfile = async (req, res) => {
  return res.status(200).json({ user: sanitizeUser(req.user) });
};

export const updateSeekerProfile = async (req, res) => {
  try {
    const { username, bio, profileImage, cvName, cvFile, region, availability, experienceYears, targetJobTitles } =
      req.body;

    const update = {
      ...(username !== undefined ? { username } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(profileImage !== undefined ? { profileImage } : {}),
      ...(cvName !== undefined ? { cvName } : {}),
      ...(cvFile !== undefined ? { cvFile } : {}),
      ...(region !== undefined ? { "seekerProfile.region": region } : {}),
      ...(availability !== undefined ? { "seekerProfile.availability": availability } : {}),
      ...(experienceYears !== undefined ? { "seekerProfile.experienceYears": experienceYears } : {}),
      ...(targetJobTitles !== undefined ? { "seekerProfile.targetJobTitles": targetJobTitles } : {}),
    };

    const updated = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true });

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: sanitizeUser(updated),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addOrUpdateSkill = async (req, res) => {
  try {
    const { skillId, category, skillName, proficiency, yearsExperience } = req.body;
    if (!category || !skillName) {
      return res.status(400).json({ message: "Category and skill name are required." });
    }

    const user = await User.findById(req.user._id);
    const skill = skillId ? user.seekerProfile.skills.id(skillId) : null;

    if (skillId && !skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    if (skill) {
      skill.category = category;
      skill.skillName = skillName;
      skill.proficiency = proficiency || skill.proficiency;
      skill.yearsExperience = yearsExperience ?? skill.yearsExperience;
    } else {
      user.seekerProfile.skills.push({
        category,
        skillName,
        proficiency: proficiency || "beginner",
        yearsExperience: yearsExperience || 0,
      });
    }

    await user.save();

    return res.status(200).json({
      message: skill ? "Skill updated successfully." : "Skill added successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const skill = user.seekerProfile.skills.id(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    skill.deleteOne();
    await user.save();

    return res.status(200).json({
      message: "Skill removed successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadCertificate = async (req, res) => {
  try {
    const { title, issuer, fileUrl, fileName, issuedAt } = req.body;
    if (!title || !fileUrl) {
      return res.status(400).json({ message: "Certificate title and file are required." });
    }

    const user = await User.findById(req.user._id);
    const skill = user.seekerProfile.skills.id(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    skill.certificates.push({
      title,
      issuer: issuer || "",
      fileUrl,
      fileName: fileName || "",
      issuedAt: issuedAt || undefined,
    });

    await user.save();

    return res.status(201).json({
      message: "Certificate submitted for verification.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const skill = user.seekerProfile.skills.id(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    const certificate = skill.certificates.id(req.params.certificateId);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found." });
    }

    certificate.deleteOne();
    await user.save();

    return res.status(200).json({
      message: "Certificate removed successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { seekerId: req.user._id };
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate("jobId")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
