const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const prisma = new PrismaClient();
const router = express.Router();

const SECRET = process.env.JWT_SECRET || "foodopedia"; // Use your actual secret in production

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate a unique filename
  },
});

const upload = multer({ storage });


router.post("/create", upload.array('media', 3), async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
  } catch (err) {
    console.error("Token error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const { title, shortDesc, category, ingredients, instructions } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: "Title is required and must be a string." });
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  const adminId = req.user?.id;
  if (!adminId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const mediaUrls = req.files?.map(file => `/uploads/${file.filename}`) || [];

    const media = await prisma.media.create({
      data: {
        image1Url: mediaUrls[0] || null,
        image2Url: mediaUrls[1] || null,
        videoUrl: mediaUrls[2] || null,
      },
    });

    const newContent = await prisma.content.create({
      data: {
        title,
        slug,
        shortDesc,
        category,
        mediaId: media.id,
        adminId,
      },
    });

    const savedIngredients = ingredients?.map(ingredient => ({
      ingredient,
      contentId: newContent.id,
    })) || [];

    const savedInstructions = instructions?.map((instruction, index) => ({
      instruction,
      stepNumber: index + 1, 
      contentId: newContent.id,
    })) || [];

    await prisma.recipe.createMany({
      data: savedIngredients,
    });

    await prisma.recipeInstruction.createMany({
      data: savedInstructions,
    });

    res.status(201).json(newContent);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const contents = await prisma.content.findMany({
      where: {
        status: {
          not: "DELETED",
        },
      },
      include: {
        media: true,
        admin: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(contents);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to retrieve content" });
  }
});

module.exports = router;
