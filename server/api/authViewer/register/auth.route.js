const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const router = Router();

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingViewer = await prisma.viewer.findUnique({
      where: { email },
    });

    if (existingViewer) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const viewer = await prisma.viewer.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      id: viewer.id,
      firstName: viewer.firstName,
      lastName: viewer.lastName,
      email: viewer.email,
    });
  } catch (err) {
    console.error("Viewer signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
