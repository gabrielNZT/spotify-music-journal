const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateMusicRecommendation(userInput, userFavorites = []) {
    try {
      // Construir contexto baseado nos favoritos do usuário
      const favoritesContext = userFavorites.length > 0
        ? `\n\nAlgumas músicas que o usuário gosta: ${userFavorites.map(fav => `"${fav.trackName}" by ${fav.artistName}`).join(', ')}`
        : '';

      const prompt = `Você é um especialista em música que ajuda pessoas a descobrir novas músicas.

Entrada do usuário: "${userInput}"${favoritesContext}

Com base na entrada do usuário e, se disponível, no histórico musical dele, recomende 5 músicas que se encaixem perfeitamente com o que ele está buscando.

Para cada música, forneça:
1. Nome da música
2. Nome do artista
3. Breve explicação de por que essa música se encaixa com o pedido

Formato de resposta (seja preciso com este formato):
MÚSICA 1:
Nome: [nome da música]
Artista: [nome do artista]
Por que: [explicação]

MÚSICA 2:
Nome: [nome da música]
Artista: [nome do artista]
Por que: [explicação]

[continue para todas as 5 músicas]

Seja criativo mas preciso. Considere o humor, energia, gênero musical e contexto emocional do pedido.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return {
        prompt,
        response: response.text()
      };
    } catch (error) {
      console.error('Erro no Gemini Service:', error);
      throw new Error('Falha ao gerar recomendação: ' + error.message);
    }
  }

  parseRecommendations(geminiResponse) {
    const recommendations = [];
    const musicBlocks = geminiResponse.split(/MÚSICA \d+:/);

    // Remove o primeiro elemento vazio
    musicBlocks.shift();

    musicBlocks.forEach(block => {
      const lines = block.trim().split('\n');
      const recommendation = {};

      lines.forEach(line => {
        if (line.startsWith('Nome:')) {
          recommendation.trackName = line.replace('Nome:', '').trim();
        } else if (line.startsWith('Artista:')) {
          recommendation.artistName = line.replace('Artista:', '').trim();
        } else if (line.startsWith('Por que:')) {
          recommendation.explanation = line.replace('Por que:', '').trim();
        }
      });

      if (recommendation.trackName && recommendation.artistName) {
        recommendations.push(recommendation);
      }
    });

    return recommendations;
  }
}

module.exports = new GeminiService();
