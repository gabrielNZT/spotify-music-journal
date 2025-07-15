const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  favorites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Favorite' 
  }]
}, { 
  timestamps: true 
});

categorySchema.index({ user: 1, name: 1 }, { unique: true });
categorySchema.index({ user: 1 });

module.exports = mongoose.model('Category', categorySchema);
