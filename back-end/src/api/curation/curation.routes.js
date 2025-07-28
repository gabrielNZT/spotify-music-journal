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

/**
 * @swagger
 * /api/curation/favorites:
 *   post:
 *     summary: Add a track to user's favorites
 *     tags: [Curation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - spotifyTrackId
 *               - trackName
 *               - artistName
 *             properties:
 *               spotifyTrackId:
 *                 type: string
 *                 description: Spotify track ID
 *               trackName:
 *                 type: string
 *                 description: Track name
 *               artistName:
 *                 type: string
 *                 description: Artist name
 *               albumName:
 *                 type: string
 *                 description: Album name
 *               imageUrl:
 *                 type: string
 *                 description: Track/album image URL
 *               previewUrl:
 *                 type: string
 *                 description: Track preview URL
 *     responses:
 *       201:
 *         description: Track added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Bad request - Track already in favorites or missing required fields
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
 *   get:
 *     summary: Get user's favorite tracks
 *     tags: [Curation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Maximum number of favorites to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of favorites to skip
 *     responses:
 *       200:
 *         description: Favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favorites:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Favorite'
 *                 total:
 *                   type: integer
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.post('/favorites', authMiddleware.protect, addFavorite);
router.get('/favorites', authMiddleware.protect, getUserFavorites);

/**
 * @swagger
 * /api/curation/favorites/{spotifyTrackId}:
 *   delete:
 *     summary: Remove a track from user's favorites
 *     tags: [Curation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spotifyTrackId
 *         required: true
 *         schema:
 *           type: string
 *         description: Spotify track ID to remove from favorites
 *     responses:
 *       200:
 *         description: Track removed from favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Track removed from favorites"
 *       404:
 *         description: Track not found in favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.delete('/favorites/:spotifyTrackId', authMiddleware.protect, removeFavorite);

/**
 * @swagger
 * /api/curation/favorites/check/{spotifyTrackId}:
 *   get:
 *     summary: Check if a track is in user's favorites
 *     tags: [Curation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spotifyTrackId
 *         required: true
 *         schema:
 *           type: string
 *         description: Spotify track ID to check
 *     responses:
 *       200:
 *         description: Favorite status checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorite:
 *                   type: boolean
 *                 favorite:
 *                   $ref: '#/components/schemas/Favorite'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/favorites/check/:spotifyTrackId', authMiddleware.protect, checkIsFavorite);

/**
 * @swagger
 * /api/curation/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               description:
 *                 type: string
 *                 description: Category description
 *               color:
 *                 type: string
 *                 description: Category color (hex code)
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Bad request - Missing category name or category already exists
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *   get:
 *     summary: Get user's categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   color:
 *                     type: string
 *                   favoritesCount:
 *                     type: integer
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.post('/categories', authMiddleware.protect, createCategory);
router.get('/categories', authMiddleware.protect, getUserCategories);

/**
 * @swagger
 * /api/curation/categories/{categoryId}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.put('/categories/:categoryId', authMiddleware.protect, updateCategory);
router.delete('/categories/:categoryId', authMiddleware.protect, deleteCategory);

/**
 * @swagger
 * /api/curation/categories/{categoryId}/favorites/{favoriteId}:
 *   post:
 *     summary: Add a favorite to a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: path
 *         name: favoriteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Favorite ID to add to category
 *     responses:
 *       200:
 *         description: Favorite added to category successfully
 *       404:
 *         description: Category or favorite not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *   delete:
 *     summary: Remove a favorite from a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: path
 *         name: favoriteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Favorite ID to remove from category
 *     responses:
 *       200:
 *         description: Favorite removed from category successfully
 *       404:
 *         description: Category or favorite not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.post('/categories/:categoryId/favorites/:favoriteId', authMiddleware.protect, addFavoriteToCategory);
router.delete('/categories/:categoryId/favorites/:favoriteId', authMiddleware.protect, removeFavoriteFromCategory);

/**
 * @swagger
 * /api/curation/categories/{categoryId}/favorites:
 *   get:
 *     summary: Get favorites in a specific category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Maximum number of favorites to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of favorites to skip
 *     responses:
 *       200:
 *         description: Category favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favorites:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Favorite'
 *                 total:
 *                   type: integer
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/categories/:categoryId/favorites', authMiddleware.protect, getCategoryFavorites);

/**
 * @swagger
 * /api/curation/favorites/{favoriteId}/comments:
 *   post:
 *     summary: Add a comment to a favorite
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: favoriteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Favorite ID to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Comment content
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       404:
 *         description: Favorite not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *   get:
 *     summary: Get comments for a favorite
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: favoriteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Favorite ID
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Favorite not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.post('/favorites/:favoriteId/comments', authMiddleware.protect, addComment);
router.get('/favorites/:favoriteId/comments', authMiddleware.protect, getFavoriteComments);

/**
 * @swagger
 * /api/curation/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated comment content
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       404:
 *         description: Comment not found
 *       403:
 *         description: Not authorized to update this comment
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       403:
 *         description: Not authorized to delete this comment
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.put('/comments/:commentId', authMiddleware.protect, updateComment);
router.delete('/comments/:commentId', authMiddleware.protect, deleteComment);

module.exports = router;
