const express = require('express');
const { spotifyCallback, getAuthUrl, getMe } = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/spotify/url', getAuthUrl);
router.get('/spotify/callback', spotifyCallback);
router.get('/me', authMiddleware.protect, getMe);

module.exports = router;
