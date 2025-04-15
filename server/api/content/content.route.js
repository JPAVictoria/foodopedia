const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { format } = require('date-fns');

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

  const { title, shortDesc, category } = req.body;
  
  let ingredients = [];
  let instructions = [];
  
  try {
    ingredients = JSON.parse(req.body.ingredients || "[]");
  } catch (err) {
    return res.status(400).json({ message: "Invalid JSON for ingredients." });
  }

  try {
    instructions = JSON.parse(req.body.instructions || "[]");
  } catch (err) {
    return res.status(400).json({ message: "Invalid JSON for instructions." });
  }

  const rawStatus = req.body.status;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: "Title is required and must be a string." });
  }

  let slug = title.toLowerCase().replace(/\s+/g, "-");
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

    const allowedStatuses = ['DRAFT', 'PUBLISHED'];
    let validatedStatus = 'DRAFT';
    if (rawStatus && typeof rawStatus === 'string') {
      const s = rawStatus.toString().trim().toUpperCase();
      if (allowedStatuses.includes(s)) {
        validatedStatus = s;
      }
    }

    const newContent = await prisma.content.create({
      data: {
        title,
        slug,
        shortDesc,
        category,
        mediaId: media.id,
        adminId,
        status: validatedStatus,
        deleted: false,
      },
    });

    // FIXED: Proper ingredient format
    const savedIngredients = ingredients?.map(ingredient => ({
      ingredient: typeof ingredient === 'object' ? ingredient.ingredient : ingredient,
      contentId: newContent.id,
    })).filter(i => i.ingredient) || []; // Filter out empty ingredients

    // FIXED: Proper instructions format
    const savedInstructions = instructions?.map((instruction, index) => ({
      instruction: typeof instruction === 'object' ? instruction.instruction : instruction,
      stepNumber: index + 1,
      contentId: newContent.id,
    })).filter(i => i.instruction) || []; // Filter out empty instructions

    if (savedIngredients.length) {
      await prisma.recipe.createMany({ 
        data: savedIngredients 
      });
    }

    if (savedInstructions.length) {
      await prisma.recipeInstruction.createMany({ 
        data: savedInstructions 
      });
    }

    res.status(201).json(newContent);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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
        instructions: { orderBy: { stepNumber: 'asc' } },
      },
    });

    if (!content || content.deleted) {
      return res.status(404).json({ message: "Content not found or has been deleted" });
    }

    res.json(content);
  } catch (err) {
    console.error("Error retrieving content:", err);
    res.status(500).json({ 
      message: "Failed to retrieve content",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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

  const { title, shortDesc, category } = req.body;
  
  let ingredients = [];
  let instructions = [];
  
  try {
    ingredients = JSON.parse(req.body.ingredients || "[]");
  } catch (err) {
    return res.status(400).json({ message: "Invalid JSON for ingredients." });
  }

  try {
    instructions = JSON.parse(req.body.instructions || "[]");
  } catch (err) {
    return res.status(400).json({ message: "Invalid JSON for instructions." });
  }

  const rawStatus = req.body.status;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: "Title is required and must be a string." });
  }

  let slug = title.toLowerCase().replace(/\s+/g, "-");
  let slugExists = await prisma.content.findFirst({ where: { slug, id: { not: id } } });
  if (slugExists) {
    slug = `${slug}-${Date.now()}`;
  }

  try {
    const content = await prisma.content.findUnique({ where: { id } });
    if (!content || content.deleted) {
      return res.status(404).json({ message: "Content not found or has been deleted" });
    }

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
    if (content.mediaId) {
      await prisma.media.update({
        where: { id: content.mediaId },
        data: {
          image1Url: mediaUrls[0] || undefined,
          image2Url: mediaUrls[1] || undefined,
          videoUrl: mediaUrls[2] || undefined,
        },
      });
    }

    const allowedStatuses = ['DRAFT', 'PUBLISHED'];
    let validatedStatus = content.status;
    if (rawStatus && typeof rawStatus === 'string') {
      const s = rawStatus.toString().trim().toUpperCase();
      if (allowedStatuses.includes(s)) {
        validatedStatus = s;
      }
    }

    const updatedContent = await prisma.content.update({
      where: { id },
      data: {
        title,
        slug,
        shortDesc,
        category,
        status: validatedStatus,
      },
    });

    await prisma.recipe.deleteMany({ where: { contentId: id } });
    await prisma.recipeInstruction.deleteMany({ where: { contentId: id } });

    // FIXED: Proper ingredient format
    const newIngredients = ingredients?.map(ingredient => ({
      ingredient: typeof ingredient === 'object' ? ingredient.ingredient : ingredient,
      contentId: id,
    })).filter(i => i.ingredient) || [];

    // FIXED: Proper instructions format
    const newInstructions = instructions?.map((instruction, index) => ({
      instruction: typeof instruction === 'object' ? instruction.instruction : instruction,
      stepNumber: index + 1,
      contentId: id,
    })).filter(i => i.instruction) || [];

    if (newIngredients.length) {
      await prisma.recipe.createMany({ 
        data: newIngredients 
      });
    }

    if (newInstructions.length) {
      await prisma.recipeInstruction.createMany({ 
        data: newInstructions 
      });
    }

    res.status(200).json(updatedContent);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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
    res.status(500).json({ 
      message: "Failed to soft delete content",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

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

    const formattedContents = contents.map(content => ({
      ...content,
      createdAt: format(new Date(content.createdAt), 'MMMM dd, yyyy HH:mm:ss'),
    }));

    res.json(formattedContents);
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to retrieve content",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


module.exports = router;