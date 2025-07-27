const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userInput: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  userFavorites: [{
    spotifyTrackId: String,
    trackName: String,
    artistName: String
  }],
  geminiPrompt: {
    type: String,
    required: true
  },
  geminiResponse: {
    type: String,
    required: true
  },
  spotifyRecommendations: [{
    spotifyTrackId: { type: String, required: true },
    trackName: { type: String, required: true },
    artistName: { type: String, required: true },
    albumName: String,
    albumImageUrl: String,
    previewUrl: String,
    spotifyUrl: String,
    durationMs: Number,
    popularity: Number,
    explicit: Boolean
  }],
  satisfactionRating: {
    type: Number,
    min: 1,
    max: 5
  }
}, { 
  timestamps: true 
});

recommendationSchema.index({ user: 1, createdAt: -1 });
recommendationSchema.index({ user: 1, satisfactionRating: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
