const axios = require('axios');
const { User } = require('../models');
const { decryptToken } = require('./auth.service');

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

class SpotifyAPIError extends Error {
  constructor(message, status, spotifyError) {
    super(message);
    this.name = 'SpotifyAPIError';
    this.status = status;
    this.spotifyError = spotifyError;
  }
}

const getValidAccessToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  try {
    const accessToken = decryptToken(user.accessToken);
    return accessToken;
  } catch (error) {
    throw new Error('Failed to decrypt access token');
  }
};

const makeSpotifyRequest = async (userId, endpoint, options = {}) => {
  const { method = 'GET', params = {}, data = null } = options;

  try {
    const accessToken = await getValidAccessToken(userId);

    const config = {
      method,
      url: `${SPOTIFY_BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params,
      data
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      throw new SpotifyAPIError(
        data.error?.message || 'Spotify API error',
        status,
        data.error
      );
    }
    throw error;
  }
};

const getUserProfile = async (userId) => {
  return await makeSpotifyRequest(userId, '/me');
};

const getUserPlaylists = async (userId, options = {}) => {
  const { limit = 20, offset = 0 } = options;
  return await makeSpotifyRequest(userId, '/me/playlists', {
    params: { limit, offset }
  });
};

const getPlaylist = async (userId, playlistId) => {
  return await makeSpotifyRequest(userId, `/playlists/${playlistId}`);
};

const getPlaylistTracks = async (userId, playlistId, options = {}) => {
  const { limit = 50, offset = 0, fields } = options;
  const params = { limit, offset };
  if (fields) params.fields = fields;

  return await makeSpotifyRequest(userId, `/playlists/${playlistId}/tracks`, {
    params
  });
};

const searchTracks = async (userId, query, options = {}) => {
  const { limit = 20, offset = 0, market = 'US' } = options;
  return await makeSpotifyRequest(userId, '/search', {
    params: {
      q: query,
      type: 'track',
      limit,
      offset,
      market
    }
  });
};

const searchArtists = async (userId, query, options = {}) => {
  const { limit = 20, offset = 0, market = 'US' } = options;
  return await makeSpotifyRequest(userId, '/search', {
    params: {
      q: query,
      type: 'artist',
      limit,
      offset,
      market
    }
  });
};

const searchAlbums = async (userId, query, options = {}) => {
  const { limit = 20, offset = 0, market = 'US' } = options;
  return await makeSpotifyRequest(userId, '/search', {
    params: {
      q: query,
      type: 'album',
      limit,
      offset,
      market
    }
  });
};

const getTrack = async (userId, trackId) => {
  return await makeSpotifyRequest(userId, `/tracks/${trackId}`);
};

const getTracks = async (userId, trackIds) => {
  const ids = Array.isArray(trackIds) ? trackIds.join(',') : trackIds;
  return await makeSpotifyRequest(userId, '/tracks', {
    params: { ids }
  });
};

const getArtist = async (userId, artistId) => {
  return await makeSpotifyRequest(userId, `/artists/${artistId}`);
};

const getArtistTopTracks = async (userId, artistId, market = 'US') => {
  return await makeSpotifyRequest(userId, `/artists/${artistId}/top-tracks`, {
    params: { market }
  });
};

const getAlbum = async (userId, albumId) => {
  return await makeSpotifyRequest(userId, `/albums/${albumId}`);
};

const getAlbumTracks = async (userId, albumId, options = {}) => {
  const { limit = 50, offset = 0, market = 'US' } = options;
  return await makeSpotifyRequest(userId, `/albums/${albumId}/tracks`, {
    params: { limit, offset, market }
  });
};

const getCurrentlyPlaying = async (userId) => {
  return await makeSpotifyRequest(userId, '/me/player/currently-playing');
};

const getRecentlyPlayed = async (userId, options = {}) => {
  const { limit = 20, after, before } = options;
  const params = { limit };
  if (after) params.after = after;
  if (before) params.before = before;

  return await makeSpotifyRequest(userId, '/me/player/recently-played', {
    params
  });
};

const getUserTopTracks = async (userId, options = {}) => {
  const { time_range = 'medium_term', limit = 20, offset = 0 } = options;
  return await makeSpotifyRequest(userId, '/me/top/tracks', {
    params: { time_range, limit, offset }
  });
};

const getUserTopArtists = async (userId, options = {}) => {
  const { time_range = 'medium_term', limit = 20, offset = 0 } = options;
  return await makeSpotifyRequest(userId, '/me/top/artists', {
    params: { time_range, limit, offset }
  });
};

const pausePlayback = async (userId) => {
  return await makeSpotifyRequest(userId, '/me/player/pause', {
    method: 'PUT'
  });
};

const resumePlayback = async (userId) => {
  return await makeSpotifyRequest(userId, '/me/player/play', {
    method: 'PUT'
  });
};

const skipToNext = async (userId) => {
  return await makeSpotifyRequest(userId, '/me/player/next', {
    method: 'POST'
  });
};

const skipToPrevious = async (userId) => {
  return await makeSpotifyRequest(userId, '/me/player/previous', {
    method: 'POST'
  });
};

const setVolume = async (userId, volumePercent) => {
  return await makeSpotifyRequest(userId, '/me/player/volume', {
    method: 'PUT',
    params: { volume_percent: volumePercent }
  });
};

const seekToPosition = async (userId, positionMs) => {
  return await makeSpotifyRequest(userId, '/me/player/seek', {
    method: 'PUT',
    params: { position_ms: positionMs }
  });
};

const setShuffle = async (userId, state) => {
  return await makeSpotifyRequest(userId, '/me/player/shuffle', {
    method: 'PUT',
    params: { state }
  });
};

const setRepeat = async (userId, state) => {
  return await makeSpotifyRequest(userId, '/me/player/repeat', {
    method: 'PUT',
    params: { state }
  });
};

const startPlayback = async (userId, options = {}) => {
  const { context_uri, uris, offset } = options;
  const data = {};
  
  if (context_uri) data.context_uri = context_uri;
  if (uris) data.uris = uris;
  if (offset) data.offset = offset;

  return await makeSpotifyRequest(userId, '/me/player/play', {
    method: 'PUT',
    data: Object.keys(data).length > 0 ? data : undefined
  });
};

const getAvailableDevices = async (userId) => {
  return await makeSpotifyRequest(userId, '/me/player/devices');
};

const transferPlayback = async (userId, deviceIds, play = false) => {
  return await makeSpotifyRequest(userId, '/me/player', {
    method: 'PUT',
    data: {
      device_ids: Array.isArray(deviceIds) ? deviceIds : [deviceIds],
      play
    }
  });
};

module.exports = {
  SpotifyAPIError,
  getUserProfile,
  getUserPlaylists,
  getPlaylist,
  getPlaylistTracks,
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
  getUserTopArtists,
  pausePlayback,
  resumePlayback,
  skipToNext,
  skipToPrevious,
  setVolume,
  seekToPosition,
  setShuffle,
  setRepeat,
  startPlayback,
  getAvailableDevices,
  transferPlayback
};
