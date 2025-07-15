const axios = require('axios');
const crypto = require('crypto');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_USER_PROFILE_URL = 'https://api.spotify.com/v1/me';

const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

const encryptToken = (token) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.JWT_SECRET, 'salt', 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}:${encrypted}`;
};

const decryptToken = (encryptedToken) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.JWT_SECRET, 'salt', 32);
  
  const [ivHex, encryptedData] = encryptedToken.split(':');
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

const generateSpotifyAuthUrl = () => {
  const state = generateRandomString(16);
  const scope = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-modify-playback-state'
  ].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state: state
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};

const exchangeCodeForTokens = async (code) => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET
  });

  const response = await axios.post(SPOTIFY_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data;
};

const getSpotifyUserProfile = async (accessToken) => {
  const response = await axios.get(SPOTIFY_USER_PROFILE_URL, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return response.data;
};

const createOrUpdateUser = async (spotifyUser, accessToken, refreshToken) => {
  const encryptedAccessToken = encryptToken(accessToken);
  const encryptedRefreshToken = encryptToken(refreshToken);

  const userData = {
    spotifyId: spotifyUser.id,
    displayName: spotifyUser.display_name,
    email: spotifyUser.email,
    profileImageUrl: spotifyUser.images?.[0]?.url || null,
    accessToken: encryptedAccessToken,
    refreshToken: encryptedRefreshToken
  };

  const user = await User.findOneAndUpdate(
    { spotifyId: spotifyUser.id },
    userData,
    { upsert: true, new: true }
  );

  return user;
};

const handleSpotifyCallback = async (code) => {
  const tokenData = await exchangeCodeForTokens(code);
  const spotifyUser = await getSpotifyUserProfile(tokenData.access_token);
  
  const user = await createOrUpdateUser(
    spotifyUser,
    tokenData.access_token,
    tokenData.refresh_token
  );

  const jwtToken = generateToken(user._id);

  return {
    token: jwtToken,
    user: {
      id: user._id,
      spotifyId: user.spotifyId,
      displayName: user.displayName,
      email: user.email,
      profileImageUrl: user.profileImageUrl
    }
  };
};

module.exports = {
  generateSpotifyAuthUrl,
  handleSpotifyCallback,
  encryptToken,
  decryptToken
};
