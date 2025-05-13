const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { route } = require('../content/content.route');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contents = await prisma.content.findMany({
      where: {
        deleted: false, 
        status: 'PUBLISHED', 
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
        createdAt: 'desc',
      },
    });

    res.json(contents);
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).json({ error: 'Failed to fetch contents' });
  }
});

module.exports = router;