const geminiService = require('./gemini.service');
const spotifyService = require('./spotify.service');
const { Recommendation, Favorite } = require('../models');

class DiscoveryService {
  async generateRecommendation(userId, userInput) {
    try {
      const userFavorites = await Favorite.find({ user: userId })
        .limit(10)
        .sort({ createdAt: -1 })
        .select('spotifyTrackId trackName artistName');

      const { prompt, response } = await geminiService.generateMusicRecommendation(
        userInput, 
        userFavorites
      );

      const geminiRecommendations = geminiService.parseRecommendations(response);
      const spotifyRecommendations = [];
      
      for (const rec of geminiRecommendations) {
        try {
          const searchQuery = `musica:"${rec.trackName}" artista:"${rec.artistName}"`;
          const spotifyResults = await spotifyService.searchTracks(userId, searchQuery, { limit: 5 });
          
          if (spotifyResults.tracks.items.length > 0) {
            const track = spotifyResults.tracks.items[0];
            spotifyRecommendations.push({
              spotifyTrackId: track.id,
              trackName: track.name,
              artistName: track.artists[0].name,
              albumName: track.album.name,
              albumImageUrl: track.album.images[0]?.url,
              previewUrl: track.preview_url,
              spotifyUrl: track.external_urls.spotify,
              durationMs: track.duration_ms,
              popularity: track.popularity,
              explicit: track.explicit,
              explanation: rec.explanation
            });
          }
        } catch (error) {
          console.error(`Erro ao buscar música "${rec.trackName}" no Spotify:`, error);
        }
      }

      // 5. Salvar recomendação no banco
      const recommendation = new Recommendation({
        user: userId,
        userInput,
        userFavorites: userFavorites.map(fav => ({
          spotifyTrackId: fav.spotifyTrackId,
          trackName: fav.trackName,
          artistName: fav.artistName
        })),
        geminiPrompt: prompt,
        geminiResponse: response,
        spotifyRecommendations
      });

      await recommendation.save();

      return {
        id: recommendation._id,
        userInput,
        recommendations: spotifyRecommendations,
        createdAt: recommendation.createdAt
      };

    } catch (error) {
      console.error('Erro no Discovery Service:', error);
      throw new Error('Falha ao gerar descoberta: ' + error.message);
    }
  }

  async getRecommendationHistory(userId, limit = 10) {
    try {
      const recommendations = await Recommendation.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('userInput spotifyRecommendations createdAt satisfactionRating');

      return recommendations.map(rec => ({
        id: rec._id,
        userInput: rec.userInput,
        recommendationsCount: rec.spotifyRecommendations.length,
        createdAt: rec.createdAt,
        satisfactionRating: rec.satisfactionRating
      }));
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw new Error('Falha ao buscar histórico de descobertas');
    }
  }

  async getRecommendationById(userId, recommendationId) {
    try {
      const recommendation = await Recommendation.findOne({
        _id: recommendationId,
        user: userId
      });

      if (!recommendation) {
        throw new Error('Recomendação não encontrada');
      }

      return {
        id: recommendation._id,
        userInput: recommendation.userInput,
        recommendations: recommendation.spotifyRecommendations,
        createdAt: recommendation.createdAt,
        satisfactionRating: recommendation.satisfactionRating
      };
    } catch (error) {
      console.error('Erro ao buscar recomendação:', error);
      throw new Error('Falha ao buscar recomendação');
    }
  }

  async rateSatisfaction(userId, recommendationId, rating) {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating deve ser entre 1 e 5');
      }

      const recommendation = await Recommendation.findOneAndUpdate(
        { _id: recommendationId, user: userId },
        { satisfactionRating: rating },
        { new: true }
      );

      if (!recommendation) {
        throw new Error('Recomendação não encontrada');
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao avaliar recomendação:', error);
      throw new Error('Falha ao avaliar recomendação');
    }
  }
}

module.exports = new DiscoveryService();
