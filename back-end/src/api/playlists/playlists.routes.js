const express = require('express');
const { 
  getUserPlaylists,
  getPlaylist,
  getPlaylistTracks
} = require('./playlists.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware.protect, getUserPlaylists);
router.get('/:playlistId', authMiddleware.protect, getPlaylist);
router.get('/:playlistId/tracks', authMiddleware.protect, getPlaylistTracks);

module.exports = router;
