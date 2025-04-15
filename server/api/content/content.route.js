const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const prisma = new PrismaClient();
const router = express.Router();

const SECRET = process.env.JWT_SECRET || "foodopedia";

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// CREATE
router.post("/create", upload.array('media', 3), async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const { title, shortDesc, category, ingredients, instructions } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: "Title is required and must be a string." });
  }

  let slug = title.toLowerCase().replace(/\s+/g, "-");

  // Check if slug exists and make it unique
  let slugExists = await prisma.content.findFirst({ where: { slug } });
  if (slugExists) {
    slug = `${slug}-${Date.now()}`;
  }

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
        deleted: false,
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

    if (savedIngredients.length) {
      await prisma.recipe.createMany({ data: savedIngredients });
    }

    if (savedInstructions.length) {
      await prisma.recipeInstruction.createMany({ data: savedInstructions });
    }

    res.status(201).json(newContent);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET BY ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        media: true,
        admin: { select: { firstName: true, lastName: true, email: true } },
        recipes: true,
        instructions: true,
      },
    });

    if (!content || content.deleted) {
      return res.status(404).json({ message: "Content not found or has been deleted" });
    }

    res.json(content);
  } catch (err) {
    console.error("Error retrieving content:", err); // Log the entire error
    res.status(500).json({ message: "Failed to retrieve content", error: err.message });
  }
});


// UPDATE
router.put("/:id", upload.array('media', 3), async (req, res) => {
  const { id } = req.params;
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const { title, shortDesc, category, ingredients, instructions, status } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: "Title is required and must be a string." });
  }

  let slug = title.toLowerCase().replace(/\s+/g, "-");

  // Check if slug exists and make it unique
  let slugExists = await prisma.content.findFirst({ where: { slug } });
  if (slugExists) {
    slug = `${slug}-${Date.now()}`;
  }

  try {
    const content = await prisma.content.findUnique({ where: { id } });
    if (!content || content.deleted) {
      return res.status(404).json({ message: "Content not found or has been deleted" });
    }

    // Check for duplicate title/slug in *other* records
    const duplicate = await prisma.content.findFirst({
      where: {
        id: { not: id },
        OR: [{ title }, { slug }],
      },
    });
    if (duplicate) {
      return res.status(409).json({ message: "Another content with this title or slug exists." });
    }

    const mediaUrls = req.files?.map(file => `/uploads/${file.filename}`) || [];
    await prisma.media.update({
      where: { id: content.mediaId },
      data: {
        image1Url: mediaUrls[0] || undefined,
        image2Url: mediaUrls[1] || undefined,
        videoUrl: mediaUrls[2] || undefined,
      },
    });

    const updatedContent = await prisma.content.update({
      where: { id },
      data: {
        title,
        slug,
        shortDesc,
        category,
        status: status ? status.toUpperCase() : content.status,
      },
    });

    // Cleanup old ingredients & instructions
    await prisma.recipe.deleteMany({ where: { contentId: id } });
    await prisma.recipeInstruction.deleteMany({ where: { contentId: id } });

    // Reinsert updated ones
    const newIngredients = ingredients?.map(ingredient => ({
      ingredient,
      contentId: id,
    })) || [];

    const newInstructions = instructions?.map((instruction, index) => ({
      instruction,
      stepNumber: index + 1,
      contentId: id,
    })) || [];

    if (newIngredients.length) {
      await prisma.recipe.createMany({ data: newIngredients });
    }

    if (newInstructions.length) {
      await prisma.recipeInstruction.createMany({ data: newInstructions });
    }

    res.status(200).json(updatedContent);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// SOFT DELETE
router.put("/softDelete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const content = await prisma.content.update({
      where: { id },
      data: { deleted: true },
    });

    res.status(200).json({ message: "Content soft deleted successfully", content });
  } catch (err) {
    res.status(500).json({ message: "Failed to soft delete content" });
  }
});

// GET ALL
router.get("/", async (req, res) => {
  try {
    const contents = await prisma.content.findMany({
      where: { deleted: false },
      include: {
        media: true,
        admin: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(contents);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve content" });
  }
});

module.exports = router;
