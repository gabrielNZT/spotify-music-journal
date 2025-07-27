const spotifyService = require('../../services/spotify.service');
const { query, param, validationResult } = require('express-validator');

const searchTracks = async (req, res) => {
  try {
    await query('q').isString().notEmpty().isLength({ min: 1, max: 100 }).run(req);
    await query('limit').optional().isInt({ min: 1, max: 50 }).run(req);
    await query('offset').optional().isInt({ min: 0 }).run(req);
    await query('market').optional().isString().isLength({ min: 2, max: 2 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { q, limit = 20, offset = 0, market = 'US' } = req.query;

    const data = await spotifyService.searchTracks(userId, q, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      market
    });

    const formattedTracks = data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      durationMs: track.duration_ms,
      explicit: track.explicit,
      popularity: track.popularity,
      previewUrl: track.preview_url,
      trackNumber: track.track_number,
      artists: track.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        externalUrls: artist.external_urls
      })),
      album: {
        id: track.album.id,
        name: track.album.name,
        releaseDate: track.album.release_date,
        images: track.album.images,
        totalTracks: track.album.total_tracks
      },
      externalUrls: track.external_urls
    }));

    res.json({
      tracks: formattedTracks,
      pagination: {
        limit: data.tracks.limit,
        offset: data.tracks.offset,
        total: data.tracks.total,
        hasNext: data.tracks.next !== null,
        hasPrev: data.tracks.previous !== null
      }
    });
  } catch (error) {
    console.error('Search tracks error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to search tracks',
      message: error.message
    });
  }
};

const searchArtists = async (req, res) => {
  try {
    await query('q').isString().notEmpty().isLength({ min: 1, max: 100 }).run(req);
    await query('limit').optional().isInt({ min: 1, max: 50 }).run(req);
    await query('offset').optional().isInt({ min: 0 }).run(req);
    await query('market').optional().isString().isLength({ min: 2, max: 2 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { q, limit = 20, offset = 0, market = 'US' } = req.query;

    const data = await spotifyService.searchArtists(userId, q, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      market
    });

    const formattedArtists = data.artists.items.map(artist => ({
      id: artist.id,
      name: artist.name,
      popularity: artist.popularity,
      followers: artist.followers.total,
      genres: artist.genres,
      images: artist.images,
      externalUrls: artist.external_urls
    }));

    res.json({
      artists: formattedArtists,
      pagination: {
        limit: data.artists.limit,
        offset: data.artists.offset,
        total: data.artists.total,
        hasNext: data.artists.next !== null,
        hasPrev: data.artists.previous !== null
      }
    });
  } catch (error) {
    console.error('Search artists error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to search artists',
      message: error.message
    });
  }
};

const searchAlbums = async (req, res) => {
  try {
    await query('q').isString().notEmpty().isLength({ min: 1, max: 100 }).run(req);
    await query('limit').optional().isInt({ min: 1, max: 50 }).run(req);
    await query('offset').optional().isInt({ min: 0 }).run(req);
    await query('market').optional().isString().isLength({ min: 2, max: 2 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { q, limit = 20, offset = 0, market = 'US' } = req.query;

    const data = await spotifyService.searchAlbums(userId, q, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      market
    });

    const formattedAlbums = data.albums.items.map(album => ({
      id: album.id,
      name: album.name,
      albumType: album.album_type,
      releaseDate: album.release_date,
      releaseDatePrecision: album.release_date_precision,
      totalTracks: album.total_tracks,
      images: album.images,
      artists: album.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        externalUrls: artist.external_urls
      })),
      externalUrls: album.external_urls
    }));

    res.json({
      albums: formattedAlbums,
      pagination: {
        limit: data.albums.limit,
        offset: data.albums.offset,
        total: data.albums.total,
        hasNext: data.albums.next !== null,
        hasPrev: data.albums.previous !== null
      }
    });
  } catch (error) {
    console.error('Search albums error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to search albums',
      message: error.message
    });
  }
};

const getTrack = async (req, res) => {
  try {
    await param('trackId').isString().notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { trackId } = req.params;

    const track = await spotifyService.getTrack(userId, trackId);

    const formattedTrack = {
      id: track.id,
      name: track.name,
      durationMs: track.duration_ms,
      explicit: track.explicit,
      popularity: track.popularity,
      previewUrl: track.preview_url,
      trackNumber: track.track_number,
      artists: track.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        externalUrls: artist.external_urls
      })),
      album: {
        id: track.album.id,
        name: track.album.name,
        releaseDate: track.album.release_date,
        images: track.album.images,
        totalTracks: track.album.total_tracks
      },
      externalUrls: track.external_urls
    };

    res.json({
      track: formattedTrack
    });
  } catch (error) {
    console.error('Get track error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch track',
      message: error.message
    });
  }
};

const getTracks = async (req, res) => {
  try {
    await query('ids').isString().notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { ids } = req.query;

    const data = await spotifyService.getTracks(userId, ids);

    const formattedTracks = data.tracks
      .filter(track => track !== null)
      .map(track => ({
        id: track.id,
        name: track.name,
        durationMs: track.duration_ms,
        explicit: track.explicit,
        popularity: track.popularity,
        previewUrl: track.preview_url,
        trackNumber: track.track_number,
        artists: track.artists.map(artist => ({
          id: artist.id,
          name: artist.name,
          externalUrls: artist.external_urls
        })),
        album: {
          id: track.album.id,
          name: track.album.name,
          releaseDate: track.album.release_date,
          images: track.album.images,
          totalTracks: track.album.total_tracks
        },
        externalUrls: track.external_urls
      }));

    res.json({
      tracks: formattedTracks
    });
  } catch (error) {
    console.error('Get tracks error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch tracks',
      message: error.message
    });
  }
};

const getArtist = async (req, res) => {
  try {
    await param('artistId').isString().notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { artistId } = req.params;

    const artist = await spotifyService.getArtist(userId, artistId);

    const formattedArtist = {
      id: artist.id,
      name: artist.name,
      popularity: artist.popularity,
      followers: artist.followers.total,
      genres: artist.genres,
      images: artist.images,
      externalUrls: artist.external_urls
    };

    res.json({
      artist: formattedArtist
    });
  } catch (error) {
    console.error('Get artist error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch artist',
      message: error.message
    });
  }
};

const getArtistTopTracks = async (req, res) => {
  try {
    await param('artistId').isString().notEmpty().run(req);
    await query('market').optional().isString().isLength({ min: 2, max: 2 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { artistId } = req.params;
    const { market = 'US' } = req.query;

    const data = await spotifyService.getArtistTopTracks(userId, artistId, market);

    const formattedTracks = data.tracks.map(track => ({
      id: track.id,
      name: track.name,
      durationMs: track.duration_ms,
      explicit: track.explicit,
      popularity: track.popularity,
      previewUrl: track.preview_url,
      trackNumber: track.track_number,
      artists: track.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        externalUrls: artist.external_urls
      })),
      album: {
        id: track.album.id,
        name: track.album.name,
        releaseDate: track.album.release_date,
        images: track.album.images,
        totalTracks: track.album.total_tracks
      },
      externalUrls: track.external_urls
    }));

    res.json({
      tracks: formattedTracks
    });
  } catch (error) {
    console.error('Get artist top tracks error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch artist top tracks',
      message: error.message
    });
  }
};

const getAlbum = async (req, res) => {
  try {
    await param('albumId').isString().notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { albumId } = req.params;

    const album = await spotifyService.getAlbum(userId, albumId);

    const formattedAlbum = {
      id: album.id,
      name: album.name,
      albumType: album.album_type,
      releaseDate: album.release_date,
      releaseDatePrecision: album.release_date_precision,
      totalTracks: album.total_tracks,
      popularity: album.popularity,
      genres: album.genres,
      images: album.images,
      artists: album.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        externalUrls: artist.external_urls
      })),
      externalUrls: album.external_urls
    };

    res.json({
      album: formattedAlbum
    });
  } catch (error) {
    console.error('Get album error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch album',
      message: error.message
    });
  }
};

const getAlbumTracks = async (req, res) => {
  try {
    await param('albumId').isString().notEmpty().run(req);
    await query('limit').optional().isInt({ min: 1, max: 50 }).run(req);
    await query('offset').optional().isInt({ min: 0 }).run(req);
    await query('market').optional().isString().isLength({ min: 2, max: 2 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { albumId } = req.params;
    const { limit = 50, offset = 0, market = 'US' } = req.query;

    const data = await spotifyService.getAlbumTracks(userId, albumId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      market
    });

    const formattedTracks = data.items.map(track => ({
      id: track.id,
      name: track.name,
      durationMs: track.duration_ms,
      explicit: track.explicit,
      previewUrl: track.preview_url,
      trackNumber: track.track_number,
      artists: track.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        externalUrls: artist.external_urls
      })),
      externalUrls: track.external_urls
    }));

    res.json({
      tracks: formattedTracks,
      pagination: {
        limit: data.limit,
        offset: data.offset,
        total: data.total,
        hasNext: data.next !== null,
        hasPrev: data.previous !== null
      }
    });
  } catch (error) {
    console.error('Get album tracks error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch album tracks',
      message: error.message
    });
  }
};

const getCurrentlyPlaying = async (req, res) => {
  try {
    const userId = req.userId;

    const data = await spotifyService.getCurrentlyPlaying(userId);

    if (!data || !data.item) {
      return res.json({
        isPlaying: false,
        currentTrack: null
      });
    }

    const formattedTrack = {
      id: data.item.id,
      name: data.item.name,
      durationMs: data.item.duration_ms,
      explicit: data.item.explicit,
      popularity: data.item.popularity,
      previewUrl: data.item.preview_url,
      artists: data.item.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        externalUrls: artist.external_urls
      })),
      album: {
        id: data.item.album.id,
        name: data.item.album.name,
        images: data.item.album.images
      },
      externalUrls: data.item.external_urls
    };

    res.json({
      isPlaying: data.is_playing,
      currentTrack: formattedTrack,
      progressMs: data.progress_ms,
      timestamp: data.timestamp
    });
  } catch (error) {
    console.error('Get currently playing error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      if (error.status === 204) {
        return res.json({
          isPlaying: false,
          currentTrack: null
        });
      }
      
      if (error.status === 401 || error.status === 403) {
        return res.json({
          isPlaying: false,
          currentTrack: null,
          error: 'premium_required',
          message: 'Spotify Premium é necessário para usar os controles do player'
        });
      }
      
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch currently playing track',
      message: error.message
    });
  }
};

const getRecentlyPlayed = async (req, res) => {
  try {
    await query('limit').optional().isInt({ min: 1, max: 50 }).run(req);
    await query('after').optional().isInt().run(req);
    await query('before').optional().isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { limit = 20, after, before } = req.query;

    const data = await spotifyService.getRecentlyPlayed(userId, {
      limit: parseInt(limit),
      after: after ? parseInt(after) : undefined,
      before: before ? parseInt(before) : undefined
    });

    const formattedTracks = data.items.map(item => ({
      playedAt: item.played_at,
      track: {
        id: item.track.id,
        name: item.track.name,
        durationMs: item.track.duration_ms,
        explicit: item.track.explicit,
        popularity: item.track.popularity,
        previewUrl: item.track.preview_url,
        artists: item.track.artists.map(artist => ({
          id: artist.id,
          name: artist.name,
          externalUrls: artist.external_urls
        })),
        album: {
          id: item.track.album.id,
          name: item.track.album.name,
          images: item.track.album.images
        },
        externalUrls: item.track.external_urls
      }
    }));

    res.json({
      tracks: formattedTracks,
      cursors: data.cursors
    });
  } catch (error) {
    console.error('Get recently played error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch recently played tracks',
      message: error.message
    });
  }
};

const getUserTopTracks = async (req, res) => {
  try {
    await query('time_range').optional().isIn(['short_term', 'medium_term', 'long_term']).run(req);
    await query('limit').optional().isInt({ min: 1, max: 50 }).run(req);
    await query('offset').optional().isInt({ min: 0 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { time_range = 'medium_term', limit = 20, offset = 0 } = req.query;

    const data = await spotifyService.getUserTopTracks(userId, {
      time_range,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formattedTracks = data.items.map(track => ({
      id: track.id,
      name: track.name,
      durationMs: track.duration_ms,
      explicit: track.explicit,
      popularity: track.popularity,
      previewUrl: track.preview_url,
      artists: track.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        externalUrls: artist.external_urls
      })),
      album: {
        id: track.album.id,
        name: track.album.name,
        images: track.album.images
      },
      externalUrls: track.external_urls
    }));

    res.json({
      tracks: formattedTracks,
      pagination: {
        limit: data.limit,
        offset: data.offset,
        total: data.total,
        hasNext: data.next !== null,
        hasPrev: data.previous !== null
      }
    });
  } catch (error) {
    console.error('Get user top tracks error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch top tracks',
      message: error.message
    });
  }
};

const getUserTopArtists = async (req, res) => {
  try {
    await query('time_range').optional().isIn(['short_term', 'medium_term', 'long_term']).run(req);
    await query('limit').optional().isInt({ min: 1, max: 50 }).run(req);
    await query('offset').optional().isInt({ min: 0 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { time_range = 'medium_term', limit = 20, offset = 0 } = req.query;

    const data = await spotifyService.getUserTopArtists(userId, {
      time_range,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formattedArtists = data.items.map(artist => ({
      id: artist.id,
      name: artist.name,
      popularity: artist.popularity,
      followers: artist.followers.total,
      genres: artist.genres,
      images: artist.images,
      externalUrls: artist.external_urls
    }));

    res.json({
      artists: formattedArtists,
      pagination: {
        limit: data.limit,
        offset: data.offset,
        total: data.total,
        hasNext: data.next !== null,
        hasPrev: data.previous !== null
      }
    });
  } catch (error) {
    console.error('Get user top artists error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch top artists',
      message: error.message
    });
  }
};

module.exports = {
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
};
