require('dotenv').config();

const express = require('express');
const connectDB = require('./src/config/database');
const corsConfig = require('./src/config/cors');
const { globalErrorHandler } = require('./src/middlewares/error.middleware');
const logger = require('./src/utils/logger');

const authRoutes = require('./src/api/auth/auth.routes');
const curationRoutes = require('./src/api/curation/curation.routes');
const playlistRoutes = require('./src/api/playlists/playlists.routes');
const trackRoutes = require('./src/api/tracks/tracks.routes');
const playerRoutes = require('./src/api/player');

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/curation', curationRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/player', playerRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Spotify Music Journal API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

app.use(globalErrorHandler);

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info('Server accepting connections on all interfaces (0.0.0.0)');
});
