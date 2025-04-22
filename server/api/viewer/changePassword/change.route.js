const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const router = Router();

const verifyViewerToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.viewerEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

router.put("/change-password", verifyViewerToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new passwords are required." });
  }

  try {
    const viewer = await prisma.viewer.findUnique({
      where: { email: req.viewerEmail },
    });

    if (!viewer) {
      return res.status(404).json({ message: "Viewer not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, viewer.password);

    if (!isMatch) {
      return res.status(403).json({ message: "Current password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.viewer.update({
      where: { email: req.viewerEmail },
      data: { password: hashedPassword },
    });

    return res.json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Viewer password change error:", err);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
});

module.exports = router;
