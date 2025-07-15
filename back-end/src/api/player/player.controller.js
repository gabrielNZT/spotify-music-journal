const spotifyService = require('../../services/spotify.service');

const getCurrentlyPlaying = async (req, res) => {
  try {
    const currentTrack = await spotifyService.getCurrentlyPlaying(req.user.id);
    
    if (!currentTrack) {
      return res.status(204).json({ message: 'No track currently playing' });
    }

    res.json({
      success: true,
      data: currentTrack
    });
  } catch (error) {
    console.error('Error getting currently playing track:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get currently playing track',
      error: error.message
    });
  }
};

const getPlayerState = async (req, res) => {
  try {
    const playerState = await spotifyService.getCurrentlyPlaying(req.user.id);
    
    res.json({
      success: true,
      data: playerState
    });
  } catch (error) {
    console.error('Error getting player state:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get player state',
      error: error.message
    });
  }
};

const getAvailableDevices = async (req, res) => {
  try {
    const devices = await spotifyService.getAvailableDevices(req.user.id);
    
    res.json({
      success: true,
      data: devices
    });
  } catch (error) {
    console.error('Error getting available devices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available devices',
      error: error.message
    });
  }
};

const pausePlayback = async (req, res) => {
  try {
    await spotifyService.pausePlayback(req.user.id);
    
    res.json({
      success: true,
      message: 'Playback paused successfully'
    });
  } catch (error) {
    console.error('Error pausing playback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to pause playback',
      error: error.message
    });
  }
};

const resumePlayback = async (req, res) => {
  try {
    await spotifyService.resumePlayback(req.user.id);
    
    res.json({
      success: true,
      message: 'Playback resumed successfully'
    });
  } catch (error) {
    console.error('Error resuming playback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resume playback',
      error: error.message
    });
  }
};

const skipToNext = async (req, res) => {
  try {
    await spotifyService.skipToNext(req.user.id);
    
    res.json({
      success: true,
      message: 'Skipped to next track successfully'
    });
  } catch (error) {
    console.error('Error skipping to next track:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to skip to next track',
      error: error.message
    });
  }
};

const skipToPrevious = async (req, res) => {
  try {
    await spotifyService.skipToPrevious(req.user.id);
    
    res.json({
      success: true,
      message: 'Skipped to previous track successfully'
    });
  } catch (error) {
    console.error('Error skipping to previous track:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to skip to previous track',
      error: error.message
    });
  }
};

const setVolume = async (req, res) => {
  try {
    const { volume } = req.body;
    
    if (typeof volume !== 'number' || volume < 0 || volume > 100) {
      return res.status(400).json({
        success: false,
        message: 'Volume must be a number between 0 and 100'
      });
    }

    await spotifyService.setVolume(req.user.id, volume);
    
    res.json({
      success: true,
      message: 'Volume set successfully'
    });
  } catch (error) {
    console.error('Error setting volume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set volume',
      error: error.message
    });
  }
};

const seekToPosition = async (req, res) => {
  try {
    const { position } = req.body;
    
    if (typeof position !== 'number' || position < 0) {
      return res.status(400).json({
        success: false,
        message: 'Position must be a non-negative number (in milliseconds)'
      });
    }

    await spotifyService.seekToPosition(req.user.id, position);
    
    res.json({
      success: true,
      message: 'Seek position set successfully'
    });
  } catch (error) {
    console.error('Error seeking to position:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seek to position',
      error: error.message
    });
  }
};

const setShuffle = async (req, res) => {
  try {
    const { state } = req.body;
    
    if (typeof state !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Shuffle state must be a boolean value'
      });
    }

    await spotifyService.setShuffle(req.user.id, state);
    
    res.json({
      success: true,
      message: `Shuffle ${state ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('Error setting shuffle:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set shuffle state',
      error: error.message
    });
  }
};

const setRepeat = async (req, res) => {
  try {
    const { state } = req.body;
    
    if (!['track', 'context', 'off'].includes(state)) {
      return res.status(400).json({
        success: false,
        message: 'Repeat state must be "track", "context", or "off"'
      });
    }

    await spotifyService.setRepeat(req.user.id, state);
    
    res.json({
      success: true,
      message: `Repeat mode set to ${state} successfully`
    });
  } catch (error) {
    console.error('Error setting repeat mode:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set repeat mode',
      error: error.message
    });
  }
};

const startPlayback = async (req, res) => {
  try {
    const { context_uri, uris, offset } = req.body;
    
    const options = {};
    if (context_uri) options.context_uri = context_uri;
    if (uris) options.uris = uris;
    if (offset) options.offset = offset;

    await spotifyService.startPlayback(req.user.id, options);
    
    res.json({
      success: true,
      message: 'Playback started successfully'
    });
  } catch (error) {
    console.error('Error starting playback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start playback',
      error: error.message
    });
  }
};

const transferPlayback = async (req, res) => {
  try {
    const { device_id, play } = req.body;
    
    if (!device_id) {
      return res.status(400).json({
        success: false,
        message: 'Device ID is required'
      });
    }

    await spotifyService.transferPlayback(req.user.id, device_id, play || false);
    
    res.json({
      success: true,
      message: 'Playback transferred successfully'
    });
  } catch (error) {
    console.error('Error transferring playback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to transfer playback',
      error: error.message
    });
  }
};

module.exports = {
  getCurrentlyPlaying,
  getPlayerState,
  getAvailableDevices,
  pausePlayback,
  resumePlayback,
  skipToNext,
  skipToPrevious,
  setVolume,
  seekToPosition,
  setShuffle,
  setRepeat,
  startPlayback,
  transferPlayback
};
