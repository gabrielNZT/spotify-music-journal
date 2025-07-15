const express = require('express');
const router = express.Router();
const playerController = require('./player.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware.protect);

router.get('/current', playerController.getCurrentlyPlaying);
router.get('/state', playerController.getPlayerState);
router.get('/devices', playerController.getAvailableDevices);

router.put('/pause', playerController.pausePlayback);
router.put('/play', playerController.resumePlayback);
router.post('/play', playerController.startPlayback);
router.post('/next', playerController.skipToNext);
router.post('/previous', playerController.skipToPrevious);

router.put('/volume', playerController.setVolume);
router.put('/seek', playerController.seekToPosition);
router.put('/shuffle', playerController.setShuffle);
router.put('/repeat', playerController.setRepeat);
router.put('/transfer', playerController.transferPlayback);

module.exports = router;
