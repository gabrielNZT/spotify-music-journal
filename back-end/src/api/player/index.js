const express = require('express');
const router = express.Router();
const playerController = require('./player.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/player/current:
 *   get:
 *     summary: Get currently playing track
 *     tags: [Player Control]
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
 *                 device:
 *                   type: object
 *       204:
 *         description: No track currently playing
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required
 */
router.get('/current', playerController.getCurrentlyPlaying);

/**
 * @swagger
 * /api/player/state:
 *   get:
 *     summary: Get current player state
 *     tags: [Player Control]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Player state retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 device:
 *                   type: object
 *                 repeat_state:
 *                   type: string
 *                   enum: [off, track, context]
 *                 shuffle_state:
 *                   type: boolean
 *                 context:
 *                   type: object
 *                 timestamp:
 *                   type: integer
 *                 progress_ms:
 *                   type: integer
 *                 is_playing:
 *                   type: boolean
 *                 item:
 *                   $ref: '#/components/schemas/Track'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required
 */
router.get('/state', playerController.getPlayerState);

/**
 * @swagger
 * /api/player/devices:
 *   get:
 *     summary: Get available playback devices
 *     tags: [Player Control]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Available devices retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 devices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       is_active:
 *                         type: boolean
 *                       is_private_session:
 *                         type: boolean
 *                       is_restricted:
 *                         type: boolean
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       volume_percent:
 *                         type: integer
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required
 */
router.get('/devices', playerController.getAvailableDevices);

/**
 * @swagger
 * /api/player/pause:
 *   put:
 *     summary: Pause playback
 *     tags: [Player Control]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: device_id
 *         schema:
 *           type: string
 *         description: Target device ID (optional)
 *     responses:
 *       204:
 *         description: Playback paused successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required or playback not available
 */
router.put('/pause', playerController.pausePlayback);

/**
 * @swagger
 * /api/player/play:
 *   put:
 *     summary: Resume playback
 *     tags: [Player Control]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: device_id
 *         schema:
 *           type: string
 *         description: Target device ID (optional)
 *     responses:
 *       204:
 *         description: Playback resumed successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required or playback not available
 *   post:
 *     summary: Start playback with specific content
 *     tags: [Player Control]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               context_uri:
 *                 type: string
 *                 description: Spotify URI of the context to play
 *               uris:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of Spotify URIs to play
 *               offset:
 *                 type: object
 *                 description: Indicates from where in the context playback should start
 *               position_ms:
 *                 type: integer
 *                 description: Position in milliseconds to seek to
 *     parameters:
 *       - in: query
 *         name: device_id
 *         schema:
 *           type: string
 *         description: Target device ID (optional)
 *     responses:
 *       204:
 *         description: Playback started successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required or playback not available
 */
router.put('/play', playerController.resumePlayback);
router.post('/play', playerController.startPlayback);

/**
 * @swagger
 * /api/player/next:
 *   post:
 *     summary: Skip to next track
 *     tags: [Player Control]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: device_id
 *         schema:
 *           type: string
 *         description: Target device ID (optional)
 *     responses:
 *       204:
 *         description: Skipped to next track successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required or playback not available
 */
router.post('/next', playerController.skipToNext);

/**
 * @swagger
 * /api/player/previous:
 *   post:
 *     summary: Skip to previous track
 *     tags: [Player Control]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: device_id
 *         schema:
 *           type: string
 *         description: Target device ID (optional)
 *     responses:
 *       204:
 *         description: Skipped to previous track successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required or playback not available
 */
router.post('/previous', playerController.skipToPrevious);

/**
 * @swagger
 * /api/player/volume:
 *   put:
 *     summary: Set playback volume
 *     tags: [Player Control]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: volume_percent
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *         description: Volume level (0-100)
 *       - in: query
 *         name: device_id
 *         schema:
 *           type: string
 *         description: Target device ID (optional)
 *     responses:
 *       204:
 *         description: Volume set successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required or playback not available
 */
router.put('/volume', playerController.setVolume);

/**
 * @swagger
 * /api/player/seek:
 *   put:
 *     summary: Seek to position in current track
 *     tags: [Player Control]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: position_ms
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Position in milliseconds to seek to
 *       - in: query
 *         name: device_id
 *         schema:
 *           type: string
 *         description: Target device ID (optional)
 *     responses:
 *       204:
 *         description: Seek operation completed successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required or playback not available
 */
router.put('/seek', playerController.seekToPosition);

/**
 * @swagger
 * /api/player/shuffle:
 *   put:
 *     summary: Toggle shuffle mode
 *     tags: [Player Control]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: boolean
 *         description: Shuffle state (true/false)
 *       - in: query
 *         name: device_id
 *         schema:
 *           type: string
 *         description: Target device ID (optional)
 *     responses:
 *       204:
 *         description: Shuffle state set successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required or playback not available
 */
router.put('/shuffle', playerController.setShuffle);

/**
 * @swagger
 * /api/player/repeat:
 *   put:
 *     summary: Set repeat mode
 *     tags: [Player Control]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *           enum: [track, context, off]
 *         description: Repeat state
 *       - in: query
 *         name: device_id
 *         schema:
 *           type: string
 *         description: Target device ID (optional)
 *     responses:
 *       204:
 *         description: Repeat state set successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required or playback not available
 */
router.put('/repeat', playerController.setRepeat);

/**
 * @swagger
 * /api/player/transfer:
 *   put:
 *     summary: Transfer playback to different device
 *     tags: [Player Control]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - device_ids
 *             properties:
 *               device_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array containing a single device ID
 *               play:
 *                 type: boolean
 *                 description: Whether to start playing on the new device
 *     responses:
 *       204:
 *         description: Playback transferred successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Spotify Premium required or device not available
 */
router.put('/transfer', playerController.transferPlayback);

module.exports = router;
