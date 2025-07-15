const express = require('express');
const { 
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
} = require('./curation.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/favorites', authMiddleware.protect, addFavorite);
router.delete('/favorites/:spotifyTrackId', authMiddleware.protect, removeFavorite);
router.get('/favorites', authMiddleware.protect, getUserFavorites);
router.get('/favorites/check/:spotifyTrackId', authMiddleware.protect, checkIsFavorite);

router.post('/categories', authMiddleware.protect, createCategory);
router.put('/categories/:categoryId', authMiddleware.protect, updateCategory);
router.delete('/categories/:categoryId', authMiddleware.protect, deleteCategory);
router.get('/categories', authMiddleware.protect, getUserCategories);
router.post('/categories/:categoryId/favorites/:favoriteId', authMiddleware.protect, addFavoriteToCategory);
router.delete('/categories/:categoryId/favorites/:favoriteId', authMiddleware.protect, removeFavoriteFromCategory);
router.get('/categories/:categoryId/favorites', authMiddleware.protect, getCategoryFavorites);

router.post('/favorites/:favoriteId/comments', authMiddleware.protect, addComment);
router.put('/comments/:commentId', authMiddleware.protect, updateComment);
router.delete('/comments/:commentId', authMiddleware.protect, deleteComment);
router.get('/favorites/:favoriteId/comments', authMiddleware.protect, getFavoriteComments);

module.exports = router;
