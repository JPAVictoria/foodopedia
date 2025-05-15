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

    // ✅ Always return 200 with array (even if empty)
    return res.json(favorites.map((fav) => fav.content));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return res.status(500).json({ error: "Failed to fetch favorites" });
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

router.delete("/favorite", async (req, res) => {
  const { contentId, viewerId } = req.body;

  if (!contentId || !viewerId) {
    return res.status(400).json({ error: "Missing contentId or viewerId" });
  }

  try {
    const favorite = await prisma.favorite.deleteMany({
      where: {
        contentId,
        viewerId,
      },
    });

    if (favorite.count === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ error: "Failed to remove from favorites" });
  }
});

router.patch("/:id/view", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedContent = await prisma.content.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    res.json({ views: updatedContent.views });
  } catch (error) {
    console.error("Failed to increment views:", error);
    res.status(500).json({ error: "Failed to increment views" });
  }
});





module.exports = router;
