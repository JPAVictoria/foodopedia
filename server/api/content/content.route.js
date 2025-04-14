const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Create Content
router.post("/create", async (req, res) => {
  const { title, shortDesc, body, category, image1Url, image2Url, videoUrl } = req.body;
  const adminId = req.user?.id;

  if (!adminId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const media = await prisma.media.create({
      data: { image1Url, image2Url, videoUrl },
    });

    const newContent = await prisma.content.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        shortDesc,
        body,
        category,
        mediaId: media.id,
        adminId,
      },
    });

    res.status(201).json(newContent);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get All Contents (optionally filter by status)
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

// Get Single Content by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const content = await prisma.content.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!content) return res.status(404).json({ message: "Content not found" });

    res.json(content);
  } catch (err) {
    console.error("Get error:", err);
    res.status(500).json({ message: "Error fetching content" });
  }
});

// Update Content
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, shortDesc, body, category, image1Url, image2Url, videoUrl } = req.body;

  try {
    const content = await prisma.content.findUnique({ where: { id } });
    if (!content) return res.status(404).json({ message: "Content not found" });

    // Update media first
    if (content.mediaId) {
      await prisma.media.update({
        where: { id: content.mediaId },
        data: { image1Url, image2Url, videoUrl },
      });
    }

    // Update content
    const updated = await prisma.content.update({
      where: { id },
      data: {
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        shortDesc,
        body,
        category,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Error updating content" });
  }
});

// Soft Delete Content (PUT)
router.put("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const content = await prisma.content.update({
      where: { id },
      data: {
        status: "DELETED",
      },
    });

    res.json({ message: "Content marked as deleted", content });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Error deleting content" });
  }
});

module.exports = router;
