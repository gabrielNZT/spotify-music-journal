const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  favorite: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Favorite', 
    required: true 
  },
  text: { 
    type: String, 
    required: true,
    maxlength: 500
  }
}, { 
  timestamps: true 
});

commentSchema.index({ favorite: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

module.exports = mongoose.model('Comment', commentSchema);
