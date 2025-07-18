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
  trackName: { 
    type: String 
  },
  artistName: { 
    type: String 
  },
  albumImageUrl: { 
    type: String 
  }
}, { 
  timestamps: true 
});

favoriteSchema.index({ user: 1, spotifyTrackId: 1 }, { unique: true });
favoriteSchema.index({ user: 1 });
favoriteSchema.index({ spotifyTrackId: 1 });

module.exports = mongoose.model('Favorite', favoriteSchema);
