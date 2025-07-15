const { Favorite, Category, Comment } = require('../models');

const addFavorite = async (userId, trackData) => {
  const { spotifyTrackId, trackName, artistName, albumImageUrl } = trackData;

  const existingFavorite = await Favorite.findOne({
    user: userId,
    spotifyTrackId: spotifyTrackId
  });

  if (existingFavorite) {
    throw new Error('Track already in favorites');
  }

  const favorite = new Favorite({
    user: userId,
    spotifyTrackId,
    trackName,
    artistName,
    albumImageUrl
  });

  await favorite.save();
  await favorite.populate('user', 'displayName email');

  return {
    id: favorite._id,
    spotifyTrackId: favorite.spotifyTrackId,
    trackName: favorite.trackName,
    artistName: favorite.artistName,
    albumImageUrl: favorite.albumImageUrl,
    createdAt: favorite.createdAt,
    user: favorite.user
  };
};

const removeFavorite = async (userId, spotifyTrackId) => {
  const result = await Favorite.findOneAndDelete({
    user: userId,
    spotifyTrackId: spotifyTrackId
  });

  return !!result;
};

const getUserFavorites = async (userId, options = {}) => {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const [favorites, total] = await Promise.all([
    Favorite.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'displayName email'),
    Favorite.countDocuments({ user: userId })
  ]);

  const formattedFavorites = favorites.map(favorite => ({
    id: favorite._id,
    spotifyTrackId: favorite.spotifyTrackId,
    trackName: favorite.trackName,
    artistName: favorite.artistName,
    albumImageUrl: favorite.albumImageUrl,
    createdAt: favorite.createdAt,
    user: favorite.user
  }));

  return {
    favorites: formattedFavorites,
    pagination: {
      page: page,
      limit: limit,
      total: total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

const checkIsFavorite = async (userId, spotifyTrackId) => {
  const favorite = await Favorite.findOne({
    user: userId,
    spotifyTrackId: spotifyTrackId
  });

  return !!favorite;
};

const getFavoriteById = async (favoriteId, userId) => {
  const favorite = await Favorite.findOne({
    _id: favoriteId,
    user: userId
  }).populate('user', 'displayName email');

  if (!favorite) {
    return null;
  }

  return {
    id: favorite._id,
    spotifyTrackId: favorite.spotifyTrackId,
    trackName: favorite.trackName,
    artistName: favorite.artistName,
    albumImageUrl: favorite.albumImageUrl,
    createdAt: favorite.createdAt,
    user: favorite.user
  };
};

const createCategory = async (userId, name) => {
  const existingCategory = await Category.findOne({
    user: userId,
    name: name
  });

  if (existingCategory) {
    throw new Error('Category already exists');
  }

  const category = new Category({
    user: userId,
    name: name,
    favorites: []
  });

  await category.save();
  await category.populate('user', 'displayName email');

  return {
    id: category._id,
    name: category.name,
    favoritesCount: category.favorites.length,
    createdAt: category.createdAt,
    user: category.user
  };
};

const updateCategory = async (userId, categoryId, name) => {
  const existingCategory = await Category.findOne({
    user: userId,
    name: name,
    _id: { $ne: categoryId }
  });

  if (existingCategory) {
    throw new Error('Category already exists');
  }

  const category = await Category.findOneAndUpdate(
    { _id: categoryId, user: userId },
    { name: name },
    { new: true }
  ).populate('user', 'displayName email');

  if (!category) {
    return null;
  }

  return {
    id: category._id,
    name: category.name,
    favoritesCount: category.favorites.length,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    user: category.user
  };
};

const deleteCategory = async (userId, categoryId) => {
  const result = await Category.findOneAndDelete({
    _id: categoryId,
    user: userId
  });

  return !!result;
};

const getUserCategories = async (userId, options = {}) => {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    Category.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'displayName email'),
    Category.countDocuments({ user: userId })
  ]);

  const formattedCategories = categories.map(category => ({
    id: category._id,
    name: category.name,
    favoritesCount: category.favorites.length,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    user: category.user
  }));

  return {
    categories: formattedCategories,
    pagination: {
      page: page,
      limit: limit,
      total: total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

const addFavoriteToCategory = async (userId, categoryId, favoriteId) => {
  const [category, favorite] = await Promise.all([
    Category.findOne({ _id: categoryId, user: userId }),
    Favorite.findOne({ _id: favoriteId, user: userId })
  ]);

  if (!category || !favorite) {
    return false;
  }

  if (category.favorites.includes(favoriteId)) {
    throw new Error('Favorite already in category');
  }

  category.favorites.push(favoriteId);
  await category.save();

  return true;
};

const removeFavoriteFromCategory = async (userId, categoryId, favoriteId) => {
  const category = await Category.findOne({ _id: categoryId, user: userId });

  if (!category) {
    return false;
  }

  const favoriteIndex = category.favorites.indexOf(favoriteId);
  if (favoriteIndex === -1) {
    return false;
  }

  category.favorites.splice(favoriteIndex, 1);
  await category.save();

  return true;
};

const getCategoryFavorites = async (userId, categoryId, options = {}) => {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const category = await Category.findOne({ _id: categoryId, user: userId });

  if (!category) {
    return null;
  }

  const [favorites, total] = await Promise.all([
    Favorite.find({ 
      _id: { $in: category.favorites },
      user: userId 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'displayName email'),
    category.favorites.length
  ]);

  const formattedFavorites = favorites.map(favorite => ({
    id: favorite._id,
    spotifyTrackId: favorite.spotifyTrackId,
    trackName: favorite.trackName,
    artistName: favorite.artistName,
    albumImageUrl: favorite.albumImageUrl,
    createdAt: favorite.createdAt,
    user: favorite.user
  }));

  return {
    category: {
      id: category._id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    },
    favorites: formattedFavorites,
    pagination: {
      page: page,
      limit: limit,
      total: total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

const addComment = async (userId, favoriteId, text) => {
  const favorite = await Favorite.findOne({ _id: favoriteId, user: userId });

  if (!favorite) {
    return null;
  }

  const comment = new Comment({
    user: userId,
    favorite: favoriteId,
    text: text
  });

  await comment.save();
  await comment.populate([
    { path: 'user', select: 'displayName email' },
    { path: 'favorite', select: 'spotifyTrackId trackName artistName' }
  ]);

  return {
    id: comment._id,
    text: comment.text,
    createdAt: comment.createdAt,
    user: comment.user,
    favorite: comment.favorite
  };
};

const updateComment = async (userId, commentId, text) => {
  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, user: userId },
    { text: text },
    { new: true }
  ).populate([
    { path: 'user', select: 'displayName email' },
    { path: 'favorite', select: 'spotifyTrackId trackName artistName' }
  ]);

  if (!comment) {
    return null;
  }

  return {
    id: comment._id,
    text: comment.text,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    user: comment.user,
    favorite: comment.favorite
  };
};

const deleteComment = async (userId, commentId) => {
  const result = await Comment.findOneAndDelete({
    _id: commentId,
    user: userId
  });

  return !!result;
};

const getFavoriteComments = async (userId, favoriteId, options = {}) => {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const favorite = await Favorite.findOne({ _id: favoriteId, user: userId });

  if (!favorite) {
    return null;
  }

  const [comments, total] = await Promise.all([
    Comment.find({ favorite: favoriteId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate([
        { path: 'user', select: 'displayName email' },
        { path: 'favorite', select: 'spotifyTrackId trackName artistName' }
      ]),
    Comment.countDocuments({ favorite: favoriteId })
  ]);

  const formattedComments = comments.map(comment => ({
    id: comment._id,
    text: comment.text,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    user: comment.user,
    favorite: comment.favorite
  }));

  return {
    favorite: {
      id: favorite._id,
      spotifyTrackId: favorite.spotifyTrackId,
      trackName: favorite.trackName,
      artistName: favorite.artistName,
      albumImageUrl: favorite.albumImageUrl
    },
    comments: formattedComments,
    pagination: {
      page: page,
      limit: limit,
      total: total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkIsFavorite,
  getFavoriteById,
  createCategory,
  updateCategory,
  deleteCategory,
  getUserCategories,
  addFavoriteToCategory,
  removeFavoriteFromCategory,
  getCategoryFavorites,
  addComment,
  updateComment,
  deleteComment,
  getFavoriteComments
};
