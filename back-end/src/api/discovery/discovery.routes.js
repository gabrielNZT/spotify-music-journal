const express = require('express');
const router = express.Router();
const discoveryService = require('../../services/discovery.service');
const authMiddleware = require('../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/discovery/generate:
 *   post:
 *     summary: Generate AI-powered music recommendations
 *     tags: [Discovery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userInput
 *             properties:
 *               userInput:
 *                 type: string
 *                 maxLength: 500
 *                 description: User's mood, preference, or description for music recommendations
 *                 example: "I'm feeling nostalgic and want some indie folk music"
 *     responses:
 *       201:
 *         description: Recommendation generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Recommendation'
 *       400:
 *         description: Bad request - Invalid or missing user input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/generate', authMiddleware.protect, async (req, res) => {
  try {
    const { userInput } = req.body;
    const userId = req.user.id;

    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({
        error: 'Descrição do seu humor ou preferência é obrigatória'
      });
    }

    if (userInput.length > 500) {
      return res.status(400).json({
        error: 'Descrição muito longa. Máximo 500 caracteres.'
      });
    }

    const result = await discoveryService.generateRecommendation(userId, userInput.trim());

    res.status(201).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erro ao gerar descoberta:', error);
    res.status(500).json({
      error: 'Erro interno do servidor ao gerar descoberta'
    });
  }
});

/**
 * @swagger
 * /api/discovery/history:
 *   get:
 *     summary: Get user's recommendation history
 *     tags: [Discovery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Maximum number of recommendations to return
 *     responses:
 *       200:
 *         description: Recommendation history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recommendation'
 *       400:
 *         description: Bad request - Invalid limit parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/history', authMiddleware.protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    if (limit > 50) {
      return res.status(400).json({
        error: 'Limite máximo de 50 itens por página'
      });
    }

    const history = await discoveryService.getRecommendationHistory(userId, limit);

    res.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      error: 'Erro interno do servidor ao buscar histórico'
    });
  }
});

/**
 * @swagger
 * /api/discovery/{id}:
 *   get:
 *     summary: Get specific recommendation by ID
 *     tags: [Discovery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the recommendation
 *     responses:
 *       200:
 *         description: Recommendation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Recommendation'
 *       400:
 *         description: Bad request - Invalid recommendation ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recommendation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authMiddleware.protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'ID de recomendação inválido'
      });
    }

    const recommendation = await discoveryService.getRecommendationById(userId, id);

    res.json({
      success: true,
      data: recommendation
    });

  } catch (error) {
    if (error.message.includes('não encontrada')) {
      return res.status(404).json({
        error: error.message
      });
    }

    console.error('Erro ao buscar recomendação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor ao buscar recomendação'
    });
  }
});

/**
 * @swagger
 * /api/discovery/{id}/rate:
 *   post:
 *     summary: Rate satisfaction with a recommendation
 *     tags: [Discovery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the recommendation to rate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: User satisfaction rating (1-5 stars)
 *                 example: 4
 *     responses:
 *       200:
 *         description: Rating registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Avaliação registrada com sucesso"
 *       400:
 *         description: Bad request - Invalid rating or recommendation ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recommendation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/rate', authMiddleware.protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { rating } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'ID de recomendação inválido'
      });
    }

    if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating deve ser um número inteiro entre 1 e 5'
      });
    }

    await discoveryService.rateSatisfaction(userId, id, rating);

    res.json({
      success: true,
      message: 'Avaliação registrada com sucesso'
    });

  } catch (error) {
    if (error.message.includes('não encontrada')) {
      return res.status(404).json({
        error: error.message
      });
    }

    console.error('Erro ao avaliar recomendação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor ao avaliar recomendação'
    });
  }
});

module.exports = router;
