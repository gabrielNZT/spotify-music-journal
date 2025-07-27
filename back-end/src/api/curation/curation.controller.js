const curationService = require('../../services/curation.service');
const { body, param, validationResult } = require('express-validator');

const addFavorite = async (req, res) => {
  try {
    await body('spotifyTrackId').isString().notEmpty().run(req);
    await body('trackName').optional().isString().run(req);
    await body('artistName').optional().isString().run(req);
    await body('albumImageUrl').optional().isURL().run(req);
    await body('albumName').optional().isString().run(req);
    await body('duration').optional().isString().run(req);
    await body('durationMs').optional().isInt().run(req);
    await body('playlistId').isString().notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { spotifyTrackId, trackName, artistName, albumImageUrl, albumName, duration, durationMs, playlistId } = req.body;
    const userId = req.userId;

    const favorite = await curationService.addFavorite(userId, {
      spotifyTrackId,
      trackName,
      artistName,
      albumImageUrl,
      albumName,
      duration,
      durationMs,
      playlistId
    });

    res.status(201).json({
      message: 'Track added to favorites',
      favorite
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    
    if (error.message === 'Track already in favorites') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Track is already in your favorites'
      });
    }

    res.status(500).json({
      error: 'Failed to add favorite',
      message: error.message
    });
  }
};

const removeFavorite = async (req, res) => {
  try {
    await param('spotifyTrackId').isString().notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { spotifyTrackId } = req.params;
    const userId = req.userId;

    const removed = await curationService.removeFavorite(userId, spotifyTrackId);

    if (!removed) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Track not found in favorites'
      });
    }

    res.json({
      message: 'Track removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      error: 'Failed to remove favorite',
      message: error.message
    });
  }
};

const getUserFavorites = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20, playlistId } = req.query;

    let result;
    if (playlistId) {
      // Novo: busca favoritos apenas dessa playlist
      result = await curationService.getFavoritesByPlaylist(userId, playlistId, {
        page: parseInt(page),
        limit: parseInt(limit)
      });
    } else {
      result = await curationService.getUserFavorites(userId, {
        page: parseInt(page),
        limit: parseInt(limit)
      });
    }
    res.json(result);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      error: 'Failed to fetch favorites',
      message: error.message
    });
  }
};

const checkIsFavorite = async (req, res) => {
  try {
    await param('spotifyTrackId').isString().notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { spotifyTrackId } = req.params;
    const userId = req.userId;

    const isFavorite = await curationService.checkIsFavorite(userId, spotifyTrackId);

    res.json({
      isFavorite
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      error: 'Failed to check favorite status',
      message: error.message
    });
  }
};

const createCategory = async (req, res) => {
  try {
    await body('name').isString().notEmpty().isLength({ min: 1, max: 50 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name } = req.body;
    const userId = req.userId;

    const category = await curationService.createCategory(userId, name);

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.message === 'Category already exists') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Category with this name already exists'
      });
    }

    res.status(500).json({
      error: 'Failed to create category',
      message: error.message
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    await param('categoryId').isMongoId().run(req);
    await body('name').isString().notEmpty().isLength({ min: 1, max: 50 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { categoryId } = req.params;
    const { name } = req.body;
    const userId = req.userId;

    const category = await curationService.updateCategory(userId, categoryId, name);

    if (!category) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Category not found'
      });
    }

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    
    if (error.message === 'Category already exists') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Category with this name already exists'
      });
    }

    res.status(500).json({
      error: 'Failed to update category',
      message: error.message
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await param('categoryId').isMongoId().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { categoryId } = req.params;
    const userId = req.userId;

    const deleted = await curationService.deleteCategory(userId, categoryId);

    if (!deleted) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Category not found'
      });
    }

    res.json({
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      error: 'Failed to delete category',
      message: error.message
    });
  }
};

const getUserCategories = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    const result = await curationService.getUserCategories(userId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json(result);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
};

const addFavoriteToCategory = async (req, res) => {
  try {
    await param('categoryId').isMongoId().run(req);
    await param('favoriteId').isMongoId().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { categoryId, favoriteId } = req.params;
    const userId = req.userId;

    const result = await curationService.addFavoriteToCategory(userId, categoryId, favoriteId);

    if (!result) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Category or favorite not found'
      });
    }

    res.json({
      message: 'Favorite added to category successfully'
    });
  } catch (error) {
    console.error('Add favorite to category error:', error);
    
    if (error.message === 'Favorite already in category') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Favorite is already in this category'
      });
    }

    res.status(500).json({
      error: 'Failed to add favorite to category',
      message: error.message
    });
  }
};

const removeFavoriteFromCategory = async (req, res) => {
  try {
    await param('categoryId').isMongoId().run(req);
    await param('favoriteId').isMongoId().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { categoryId, favoriteId } = req.params;
    const userId = req.userId;

    const result = await curationService.removeFavoriteFromCategory(userId, categoryId, favoriteId);

    if (!result) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Category, favorite not found or favorite not in category'
      });
    }

    res.json({
      message: 'Favorite removed from category successfully'
    });
  } catch (error) {
    console.error('Remove favorite from category error:', error);
    res.status(500).json({
      error: 'Failed to remove favorite from category',
      message: error.message
    });
  }
};

const getCategoryFavorites = async (req, res) => {
  try {
    await param('categoryId').isMongoId().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { categoryId } = req.params;
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    const result = await curationService.getCategoryFavorites(userId, categoryId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    if (!result) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Category not found'
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Get category favorites error:', error);
    res.status(500).json({
      error: 'Failed to fetch category favorites',
      message: error.message
    });
  }
};

const addComment = async (req, res) => {
  try {
    await param('favoriteId').isMongoId().run(req);
    await body('text').isString().notEmpty().isLength({ min: 1, max: 500 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { favoriteId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    const comment = await curationService.addComment(userId, favoriteId, text);

    if (!comment) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Favorite not found'
      });
    }

    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      error: 'Failed to add comment',
      message: error.message
    });
  }
};

const updateComment = async (req, res) => {
  try {
    await param('commentId').isMongoId().run(req);
    await body('text').isString().notEmpty().isLength({ min: 1, max: 500 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    const comment = await curationService.updateComment(userId, commentId, text);

    if (!comment) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Comment not found'
      });
    }

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      error: 'Failed to update comment',
      message: error.message
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    await param('commentId').isMongoId().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { commentId } = req.params;
    const userId = req.userId;

    const deleted = await curationService.deleteComment(userId, commentId);

    if (!deleted) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Comment not found'
      });
    }

    res.json({
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      error: 'Failed to delete comment',
      message: error.message
    });
  }
};

const getFavoriteComments = async (req, res) => {
  try {
    await param('favoriteId').isMongoId().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { favoriteId } = req.params;
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    const result = await curationService.getFavoriteComments(userId, favoriteId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    if (!result) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Favorite not found'
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Get favorite comments error:', error);
    res.status(500).json({
      error: 'Failed to fetch comments',
      message: error.message
    });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkIsFavorite,
  createCategory,
  updateCategory,
  deleteCategory,
  getUserCategories,
  addFavoriteToCategory,
  removeFavoriteFromCategory,
  getCategoryFavorites,
  addComment,
  updateComment,
  deleteComment,
  getFavoriteComments
};
