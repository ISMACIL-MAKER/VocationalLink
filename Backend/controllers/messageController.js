import Message from "../models/Message.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

const isParticipant = (application, userId) =>
  String(application.employerId) === String(userId) ||
  String(application.seekerId) === String(userId);

export const getMessages = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }
    if (!isParticipant(application, req.user._id)) {
      return res.status(403).json({ message: "You are not part of this conversation." });
    }

    const messages = await Message.find({ applicationId: application._id }).sort({
      createdAt: 1,
    });

    await Message.updateMany(
      { applicationId: application._id, receiverId: req.user._id, readAt: null },
      { readAt: new Date() },
    );

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: "Message text is required." });
    }

    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }
    if (!isParticipant(application, req.user._id)) {
      return res.status(403).json({ message: "You are not part of this conversation." });
    }

    const receiverId =
      String(application.employerId) === String(req.user._id)
        ? application.seekerId
        : application.employerId;

    const message = await Message.create({
      applicationId: application._id,
      senderId: req.user._id,
      receiverId,
      text: text.trim(),
    });

    await Notification.create({
      userId: receiverId,
      title: "New Message",
      type: "message",
      message: `${req.user.username} sent you a new message about your application.`,
    });

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
