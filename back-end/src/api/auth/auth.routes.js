const express = require('express');
const { spotifyCallback, getAuthUrl, getMe } = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/auth/spotify/url:
 *   get:
 *     summary: Get Spotify authorization URL
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Spotify authorization URL returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authUrl:
 *                   type: string
 *                   example: "https://accounts.spotify.com/authorize?..."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/spotify/url', getAuthUrl);

/**
 * @swagger
 * /api/auth/spotify/callback:
 *   get:
 *     summary: Handle Spotify OAuth callback
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Spotify
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: State parameter for security
 *     responses:
 *       302:
 *         description: Redirect to frontend with token
 *       400:
 *         description: Authorization code missing or invalid
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
router.get('/spotify/callback', spotifyCallback);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
router.get('/me', authMiddleware.protect, getMe);

module.exports = router;
