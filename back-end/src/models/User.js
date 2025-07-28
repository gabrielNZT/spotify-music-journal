const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  spotifyId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  displayName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  profileImageUrl: { 
    type: String 
  },
  accessToken: { 
    type: String, 
    required: true 
  },
  refreshToken: { 
    type: String, 
    required: true 
  },
  product: {
    type: String,
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
