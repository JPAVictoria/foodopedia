const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const router = Router();

const generateToken = (viewer) => {
  return jwt.sign(
    { id: viewer.id, email: viewer.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const viewer = await prisma.viewer.findUnique({
      where: { email },
    });

    if (!viewer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, viewer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token with the viewer's id and email
    const token = generateToken(viewer);

    // Return the viewer id along with other details
    res.status(200).json({
      message: "Login successful",
      token,
      viewer: {
        id: viewer.id,  // Ensure you include the viewer's id
        email: viewer.email,
        firstName: viewer.firstName,
        lastName: viewer.lastName,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
