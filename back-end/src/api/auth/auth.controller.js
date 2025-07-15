const authService = require('../../services/auth.service');
const { User } = require('../../models');

const getAuthUrl = async (req, res) => {
  try {
    const authUrl = authService.generateSpotifyAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ 
      error: 'Failed to generate authentication URL',
      message: error.message 
    });
  }
};

const spotifyCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?error=${error}`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?error=missing_code`);
    }

    const result = await authService.handleSpotifyCallback(code);
    
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${result.token}`);
  } catch (error) {
    console.error('Spotify callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?error=callback_failed`);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-accessToken -refreshToken');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        spotifyId: user.spotifyId,
        displayName: user.displayName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user data',
      message: error.message 
    });
  }
};

module.exports = {
  getAuthUrl,
  spotifyCallback,
  getMe
};
