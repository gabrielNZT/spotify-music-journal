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

router.get('/search/tracks', authMiddleware.protect, searchTracks);
router.get('/search/artists', authMiddleware.protect, searchArtists);
router.get('/search/albums', authMiddleware.protect, searchAlbums);

router.get('/track/:trackId', authMiddleware.protect, getTrack);
router.get('/tracks', authMiddleware.protect, getTracks);

router.get('/artist/:artistId', authMiddleware.protect, getArtist);
router.get('/artist/:artistId/top-tracks', authMiddleware.protect, getArtistTopTracks);

router.get('/album/:albumId', authMiddleware.protect, getAlbum);
router.get('/album/:albumId/tracks', authMiddleware.protect, getAlbumTracks);

router.get('/player/currently-playing', authMiddleware.protect, getCurrentlyPlaying);
router.get('/player/recently-played', authMiddleware.protect, getRecentlyPlayed);

router.get('/me/top/tracks', authMiddleware.protect, getUserTopTracks);
router.get('/me/top/artists', authMiddleware.protect, getUserTopArtists);

module.exports = router;
