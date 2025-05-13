const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  const { category } = req.query;

  try {
    const categoryEnum = category ? category.toUpperCase() : undefined;  

    const contents = await prisma.content.findMany({
      where: {
        deleted: false,
        status: "PUBLISHED",
        ...(categoryEnum && { category: categoryEnum }), 
      },
      select: {
        id: true,
        title: true,
        shortDesc: true,
        imageURL: true,
        admin: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(contents);
  } catch (error) {
    console.error("Error fetching contents:", error);
    res.status(500).json({ error: "Failed to fetch contents" });
  }
});




router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const content = await prisma.content.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        shortDesc: true,
        imageURL: true,
        admin: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        recipes: true,
        instructions: true,
      },
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});




module.exports = router;