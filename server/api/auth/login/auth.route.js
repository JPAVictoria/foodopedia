const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const router = Router();

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin.id, email: admin.email },
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
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(admin);

    // Set HTTP-only cookie instead of sending token in response
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour to match JWT expiration
    });

    res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin.id, 
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
