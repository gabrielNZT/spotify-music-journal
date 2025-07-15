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
  }
}, { 
  timestamps: true 
});

userSchema.index({ spotifyId: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
