const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
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


router.put("/change-name", verifyViewerToken, async (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ message: "First name and last name are required." });
  }

  try {
    const viewer = await prisma.viewer.findUnique({
      where: { email: req.viewerEmail },
    });

    if (!viewer) {
      return res.status(404).json({ message: "Viewer not found." });
    }

    const updatedViewer = await prisma.viewer.update({
      where: { email: req.viewerEmail },
      data: { firstName, lastName },
    });

    return res.json({ message: "Name updated successfully.", viewer: updatedViewer });
  } catch (err) {
    console.error("Viewer name update error:", err);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
});

module.exports = router;
