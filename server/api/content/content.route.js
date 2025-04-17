const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { format } = require('date-fns');

const prisma = new PrismaClient();
const router = express.Router();

const SECRET = process.env.JWT_SECRET || "foodopedia";

router.post("/create", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  const { title, shortDesc, category } = req.body;

  const existing = await prisma.content.findFirst({
    where: {
      title: { equals: title.trim(), mode: 'insensitive' },
      deleted: false
    }
  });

  if (existing) {
    return res.status(409).json({ 
      message: `A recipe named "${title}" already exists` 
    });
  }

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
        adminId,
        status: validatedStatus,
        deleted: false,
      },
    });

    
    const savedIngredients = ingredients?.map(ingredient => ({
      ingredient: typeof ingredient === 'object' ? ingredient.ingredient : ingredient,
      contentId: newContent.id,
    })).filter(i => i.ingredient) || []; 

    
    const savedInstructions = instructions?.map((instruction, index) => ({
      instruction: typeof instruction === 'object' ? instruction.instruction : instruction,
      stepNumber: index + 1,
      contentId: newContent.id,
    })).filter(i => i.instruction) || []; 

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

router.put("/:id", async (req, res) => {
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

  const existing = await prisma.content.findFirst({
    where: {
      title: { equals: title.trim(), mode: 'insensitive' },
      deleted: false,
      NOT: { id } 
    }
  });

  if (existing) {
    return res.status(409).json({ 
      message: `A recipe named "${title}" already exists` 
    });
  }
  
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

    
    const newIngredients = ingredients?.map(ingredient => ({
      ingredient: typeof ingredient === 'object' ? ingredient.ingredient : ingredient,
      contentId: id,
    })).filter(i => i.ingredient) || [];

    
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


router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
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

router.get("/", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const adminId = decoded?.id;
  if (!adminId) {
    return res.status(403).json({ message: "Unauthorized or invalid admin" });
  }

  try {
    const contents = await prisma.content.findMany({
      where: {
        deleted: false,
        adminId, 
      },
      include: {
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
    console.error("Error fetching admin-specific content:", err);
    res.status(500).json({
      message: "Failed to retrieve content",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;