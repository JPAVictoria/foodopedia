const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const router = Router();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminEmail = decoded.email; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};


router.put("/change-name", verifyToken, async (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ message: "First name and last name are required." });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { email: req.adminEmail },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const updatedAdmin = await prisma.admin.update({
      where: { email: req.adminEmail },
      data: { firstName, lastName },
    });

    return res.json({ message: "Name updated successfully.", admin: updatedAdmin });
  } catch (err) {
    console.error("Name update error:", err);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
});

module.exports = router;
