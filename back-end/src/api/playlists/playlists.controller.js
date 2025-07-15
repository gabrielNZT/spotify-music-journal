const spotifyService = require('../../services/spotify.service');
const { query, param, validationResult } = require('express-validator');

const getUserPlaylists = async (req, res) => {
  try {
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
    const { limit = 20, offset = 0 } = req.query;

    const data = await spotifyService.getUserPlaylists(userId, {
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formattedPlaylists = data.items.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      public: playlist.public,
      collaborative: playlist.collaborative,
      tracksTotal: playlist.tracks.total,
      images: playlist.images,
      owner: {
        id: playlist.owner.id,
        displayName: playlist.owner.display_name
      },
      externalUrls: playlist.external_urls
    }));

    res.json({
      playlists: formattedPlaylists,
      pagination: {
        limit: data.limit,
        offset: data.offset,
        total: data.total,
        hasNext: data.next !== null,
        hasPrev: data.previous !== null
      }
    });
  } catch (error) {
    console.error('Get user playlists error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch playlists',
      message: error.message
    });
  }
};

const getPlaylist = async (req, res) => {
  try {
    await param('playlistId').isString().notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.userId;
    const { playlistId } = req.params;

    const playlist = await spotifyService.getPlaylist(userId, playlistId);

    const formattedPlaylist = {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      public: playlist.public,
      collaborative: playlist.collaborative,
      tracksTotal: playlist.tracks.total,
      images: playlist.images,
      owner: {
        id: playlist.owner.id,
        displayName: playlist.owner.display_name
      },
      followers: playlist.followers.total,
      externalUrls: playlist.external_urls
    };

    res.json({
      playlist: formattedPlaylist
    });
  } catch (error) {
    console.error('Get playlist error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch playlist',
      message: error.message
    });
  }
};

const getPlaylistTracks = async (req, res) => {
  try {
    await param('playlistId').isString().notEmpty().run(req);
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
    const { playlistId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const data = await spotifyService.getPlaylistTracks(userId, playlistId, {
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formattedTracks = data.items
      .filter(item => item.track && item.track.id)
      .map(item => ({
        addedAt: item.added_at,
        addedBy: item.added_by?.id,
        track: {
          id: item.track.id,
          name: item.track.name,
          durationMs: item.track.duration_ms,
          explicit: item.track.explicit,
          popularity: item.track.popularity,
          previewUrl: item.track.preview_url,
          trackNumber: item.track.track_number,
          artists: item.track.artists.map(artist => ({
            id: artist.id,
            name: artist.name,
            externalUrls: artist.external_urls
          })),
          album: {
            id: item.track.album.id,
            name: item.track.album.name,
            releaseDate: item.track.album.release_date,
            images: item.track.album.images,
            totalTracks: item.track.album.total_tracks
          },
          externalUrls: item.track.external_urls
        }
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
    console.error('Get playlist tracks error:', error);
    
    if (error instanceof spotifyService.SpotifyAPIError) {
      return res.status(error.status || 500).json({
        error: 'Spotify API error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to fetch playlist tracks',
      message: error.message
    });
  }
};

module.exports = {
  getUserPlaylists,
  getPlaylist,
  getPlaylistTracks
};
