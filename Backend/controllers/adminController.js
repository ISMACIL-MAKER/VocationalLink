export const getPendingVerifications = async (req, res) => {
  try {
    // 🛑 Dhabar-jebinta Browser Caching (Stop 304 status)
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const seekers = await User.find({
      role: "Job-Seeker",
      "seekerProfile.skills.certificates.verificationStatus": "pending",
    }).select("username email seekerProfile");

    // 🔍 Debugging: Eeg Terminal-ka Node.js (Render / VS Code)
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