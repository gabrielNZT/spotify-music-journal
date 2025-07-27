const express = require('express');
const router = express.Router();
const discoveryService = require('../../services/discovery.service');
const authMiddleware = require('../../middlewares/auth.middleware');

// Aplicar middleware de autenticação para todas as rotas

// POST /api/discovery/generate
// Gerar nova recomendação baseada no input do usuário
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

// GET /api/discovery/:id
// Buscar recomendação específica
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

// POST /api/discovery/:id/rate
// Avaliar satisfação com a recomendação
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
