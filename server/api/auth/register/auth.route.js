const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../../../utils/hash.js");
const { validateAdmin } = require("../../../middlewares/validateAdmin.js"); // Adjusted for JS

const prisma = new PrismaClient();
const router = Router();

// Signup route with validation middleware
router.post("/signup", validateAdmin, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new admin
    const admin = await prisma.admin.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    // Send success response
    res.status(201).json(admin);
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;  // Use `module.exports` for JS
