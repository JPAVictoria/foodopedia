const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/:adminId', async (req, res) => {
  const adminId = req.params.adminId;

  try {
    const products = await prisma.content.findMany({
      where: {
        adminId,
        status: 'PUBLISHED',
        deleted: false,
      },
      select: {
        id: true,
        title: true,
        views: true,
      },
      orderBy: {
        views: 'desc',
      },
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
