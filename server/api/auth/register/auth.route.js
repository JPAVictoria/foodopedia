const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../../../utils/hash.js");
const { validateAdmin } = require("../../../middlewares/validateAdmin.js"); 

const prisma = new PrismaClient();
const router = Router();


router.post("/signup", validateAdmin, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    
    const hashedPassword = await hashPassword(password);

    
    const admin = await prisma.admin.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    
    res.status(201).json(admin);
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;  
