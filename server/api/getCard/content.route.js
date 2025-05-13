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

router.post("/favorite", async (req, res) => {
  const { contentId, viewerId } = req.body;

  if (!contentId || !viewerId) {
    return res.status(400).json({ error: "Missing contentId or viewerId" });
  }

  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        viewerId_contentId: {
          viewerId,
          contentId,
        },
      },
    });

    if (existingFavorite) {
      return res.status(400).json({ error: "This content is already favorited by the viewer" });
    }

    const favorite = await prisma.favorite.create({
      data: {
        contentId,
        viewerId,
      },
    });

    res.json(favorite);
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ error: "Failed to add to favorites" });
  }
});


router.get("/favorites", async (req, res) => {
  const { viewerId } = req.query; 

  if (!viewerId) {
    return res.status(400).json({ error: "Missing viewerId" });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { viewerId },
      include: {
        content: {
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
        },
      },
    });

    if (favorites.length === 0) {
      return res.status(404).json({ message: "No favorites found for this viewer" });
    }

    res.json(favorites.map((fav) => fav.content));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

module.exports = router;
