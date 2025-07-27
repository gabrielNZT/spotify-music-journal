const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  spotifyTrackId: { 
    type: String, 
    required: true 
  },
  playlistId: {
    type: String, 
    required: true 
  },
  trackName: { 
    type: String 
  },
  artistName: { 
    type: String 
  },
  albumImageUrl: { 
    type: String 
  },
  albumName: {
    type: String
  },
  duration: {
    type: String
  },
  durationMs: {
    type: Number
  }
}, { 
  timestamps: true 
});

favoriteSchema.index({ user: 1, spotifyTrackId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
