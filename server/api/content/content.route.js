const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const prisma = new PrismaClient();
const router = express.Router();

const SECRET = process.env.JWT_SECRET || "foodopedia"; // Use your actual secret in prod

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate a unique filename
  },
});
const upload = multer({ storage });

/**
 * POST /admin/content/create
 * Create new content (with optional image/video upload)
 */
router.post("/create", upload.array('media', 3), async (req, res) => {
  // ✅ Inline JWT token verification
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
  } catch (err) {
    console.error("Token error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Extract body content (including ingredients and instructions)
  const { title, shortDesc, category, ingredients, instructions } = req.body;

  // Validate title
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: "Title is required and must be a string." });
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  const adminId = req.user?.id;
  if (!adminId) return res.status(401).json({ message: "Unauthorized" });

  try {
    // Handle file URLs (media file names)
    const mediaUrls = req.files?.map(file => `/uploads/${file.filename}`) || [];

    // Save media URLs in the DB
    const media = await prisma.media.create({
      data: {
        image1Url: mediaUrls[0] || null,
        image2Url: mediaUrls[1] || null,
        videoUrl: mediaUrls[2] || null,
      },
    });

    // Create content
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

    // Save recipe ingredients
    const savedIngredients = ingredients?.map(ingredient => ({
      ingredient,
      contentId: newContent.id,
    })) || [];

    const savedInstructions = instructions?.map((instruction, index) => ({
      instruction,
      stepNumber: index + 1, // Ensure steps are ordered
      contentId: newContent.id,
    })) || [];

    // Create recipes and instructions in the DB
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

/**
 * GET /admin/content
 * Get all content (excluding soft-deleted)
 */
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
