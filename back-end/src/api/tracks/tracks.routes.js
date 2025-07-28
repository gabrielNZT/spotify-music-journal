const express = require('express');
const { 
  searchTracks,
  searchArtists,
  searchAlbums,
  getTrack,
  getTracks,
  getArtist,
  getArtistTopTracks,
  getAlbum,
  getAlbumTracks,
  getCurrentlyPlaying,
  getRecentlyPlayed,
  getUserTopTracks,
  getUserTopArtists
} = require('./tracks.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/tracks/search/tracks:
 *   get:
 *     summary: Search for tracks on Spotify
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for tracks
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Maximum number of tracks to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Index of the first track to return
 *     responses:
 *       200:
 *         description: Tracks found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tracks:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Track'
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *       400:
 *         description: Bad request - Missing search query
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
 */
router.get('/search/tracks', authMiddleware.protect, searchTracks);

/**
 * @swagger
 * /api/tracks/search/artists:
 *   get:
 *     summary: Search for artists on Spotify
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for artists
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Maximum number of artists to return
 *     responses:
 *       200:
 *         description: Artists found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 artists:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *       400:
 *         description: Bad request - Missing search query
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/search/artists', authMiddleware.protect, searchArtists);

/**
 * @swagger
 * /api/tracks/search/albums:
 *   get:
 *     summary: Search for albums on Spotify
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for albums
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Maximum number of albums to return
 *     responses:
 *       200:
 *         description: Albums found successfully
 *       400:
 *         description: Bad request - Missing search query
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/search/albums', authMiddleware.protect, searchAlbums);

/**
 * @swagger
 * /api/tracks/track/{trackId}:
 *   get:
 *     summary: Get specific track details
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *         description: Spotify track ID
 *     responses:
 *       200:
 *         description: Track details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Track'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Track not found
 */
router.get('/track/:trackId', authMiddleware.protect, getTrack);

/**
 * @swagger
 * /api/tracks/tracks:
 *   get:
 *     summary: Get multiple tracks by IDs
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of Spotify track IDs
 *     responses:
 *       200:
 *         description: Tracks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tracks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Track'
 *       400:
 *         description: Bad request - Missing track IDs
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/tracks', authMiddleware.protect, getTracks);

/**
 * @swagger
 * /api/tracks/artist/{artistId}:
 *   get:
 *     summary: Get artist details
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: Spotify artist ID
 *     responses:
 *       200:
 *         description: Artist details retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Artist not found
 */
router.get('/artist/:artistId', authMiddleware.protect, getArtist);

/**
 * @swagger
 * /api/tracks/artist/{artistId}/top-tracks:
 *   get:
 *     summary: Get artist's top tracks
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: Spotify artist ID
 *     responses:
 *       200:
 *         description: Artist's top tracks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tracks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Track'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Artist not found
 */
router.get('/artist/:artistId/top-tracks', authMiddleware.protect, getArtistTopTracks);

/**
 * @swagger
 * /api/tracks/album/{albumId}:
 *   get:
 *     summary: Get album details
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Spotify album ID
 *     responses:
 *       200:
 *         description: Album details retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Album not found
 */
router.get('/album/:albumId', authMiddleware.protect, getAlbum);

/**
 * @swagger
 * /api/tracks/album/{albumId}/tracks:
 *   get:
 *     summary: Get tracks from an album
 *     tags: [Tracks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Spotify album ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Maximum number of tracks to return
 *     responses:
 *       200:
 *         description: Album tracks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Track'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Album not found
 */
router.get('/album/:albumId/tracks', authMiddleware.protect, getAlbumTracks);

/**
 * @swagger
 * /api/tracks/player/currently-playing:
 *   get:
 *     summary: Get user's currently playing track
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Currently playing track retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   $ref: '#/components/schemas/Track'
 *                 is_playing:
 *                   type: boolean
 *                 progress_ms:
 *                   type: integer
 *       204:
 *         description: No track currently playing
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required
 */
router.get('/player/currently-playing', authMiddleware.protect, getCurrentlyPlaying);

/**
 * @swagger
 * /api/tracks/player/recently-played:
 *   get:
 *     summary: Get user's recently played tracks
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Maximum number of tracks to return
 *     responses:
 *       200:
 *         description: Recently played tracks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       track:
 *                         $ref: '#/components/schemas/Track'
 *                       played_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/player/recently-played', authMiddleware.protect, getRecentlyPlayed);

/**
 * @swagger
 * /api/tracks/me/top/tracks:
 *   get:
 *     summary: Get user's top tracks
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: time_range
 *         schema:
 *           type: string
 *           enum: [short_term, medium_term, long_term]
 *           default: medium_term
 *         description: Time range for top tracks
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Maximum number of tracks to return
 *     responses:
 *       200:
 *         description: Top tracks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Track'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/me/top/tracks', authMiddleware.protect, getUserTopTracks);

/**
 * @swagger
 * /api/tracks/me/top/artists:
 *   get:
 *     summary: Get user's top artists
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: time_range
 *         schema:
 *           type: string
 *           enum: [short_term, medium_term, long_term]
 *           default: medium_term
 *         description: Time range for top artists
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Maximum number of artists to return
 *     responses:
 *       200:
 *         description: Top artists retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/me/top/artists', authMiddleware.protect, getUserTopArtists);

module.exports = router;
