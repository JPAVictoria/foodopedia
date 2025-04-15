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

// CREATE Route
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
        deleted: false,  // Default to not deleted
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


router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const content = await prisma.content.findUnique({
      where: {
        id,
      },
      include: {
        media: true,
        admin: {
          select: { firstName: true, lastName: true, email: true },
        },
        recipes: true,
        instructions: true,
      },
    });

    if (!content || content.deleted) {
      return res.status(404).json({ message: "Content not found or has been deleted" });
    }

    res.json(content);
  } catch (err) {
    console.error("Get by ID error:", err);
    res.status(500).json({ message: "Failed to retrieve content" });
  }
});


router.put("/:id", upload.array('media', 3), async (req, res) => {
  const { id } = req.params;
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
  } catch (err) {
    console.error("Token error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const { title, shortDesc, category, ingredients, instructions, status } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: "Title is required and must be a string." });
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  try {
    const content = await prisma.content.findUnique({
      where: { id },
    });

    if (!content || content.deleted) {
      return res.status(404).json({ message: "Content not found or has been deleted" });
    }

    const mediaUrls = req.files?.map(file => `/uploads/${file.filename}`) || [];
    const updatedMedia = await prisma.media.update({
      where: { contentId: content.id },
      data: {
        image1Url: mediaUrls[0] || content.media?.image1Url,
        image2Url: mediaUrls[1] || content.media?.image2Url,
        videoUrl: mediaUrls[2] || content.media?.videoUrl,
      },
    });

    const updatedContent = await prisma.content.update({
      where: { id },
      data: {
        title,
        slug,
        shortDesc,
        category,
        status: status || content.status,
        mediaId: updatedMedia.id,
      },
    });

    const savedIngredients = ingredients?.map(ingredient => ({
      ingredient,
      contentId: updatedContent.id,
    })) || [];

    const savedInstructions = instructions?.map((instruction, index) => ({
      instruction,
      stepNumber: index + 1,
      contentId: updatedContent.id,
    })) || [];

    await prisma.recipe.upsert({
      where: { contentId: updatedContent.id },
      update: { ingredient: savedIngredients.map(i => i.ingredient) },
      create: savedIngredients,
    });

    await prisma.recipeInstruction.upsert({
      where: { contentId: updatedContent.id },
      update: { instruction: savedInstructions.map(i => i.instruction) },
      create: savedInstructions,
    });

    res.status(200).json(updatedContent);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/softDelete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the content by ID
    const content = await prisma.content.update({
      where: { id },
      data: { deleted: true },  // Soft delete by setting deleted to true
    });

    res.status(200).json({ message: "Content soft deleted successfully", content });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to soft delete content" });
  }
});


router.get("/", async (req, res) => {
  try {
    const contents = await prisma.content.findMany({
      where: {
        deleted: false,  // Filter out deleted content
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
