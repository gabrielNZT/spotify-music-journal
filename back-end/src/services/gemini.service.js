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
      const favoritesContext = userFavorites.length > 0
        ? `\n\nAlgumas músicas que o usuário gosta: ${userFavorites.map(fav => `"${fav.trackName}" by ${fav.artistName}`).join(', ')}`
        : '';

      const prompt = `Você é um avançado sistema de recomendação musical com profundo conhecimento em teoria musical, 
      história e tendências. Sua principal tarefa é interpretar a intenção do usuário e fornecer sugestões precisas.
      ### Pedido do Usuário (Comando Principal)
      "${userInput}"

      ### Contexto de Gostos do Usuário (Use para refinar, SE APLICÁVEL)
      ${favoritesContext}

      ### Regras de Prioridade
      1.  **Prioridade Máxima ao Pedido Específico:** Se o "Pedido do Usuário" mencionar um artista, álbum, gênero ou critério muito específico (ex: "músicas do OneRepublic", "rock dos anos 80", "músicas com piano"), suas recomendações DEVEM se ater estritamente a esse pedido. Neste caso, o "Contexto de Gostos do Usuário" deve ser usado apenas para escolher as músicas mais adequadas *dentro* do escopo solicitado, ou ser completamente ignorado se não for relevante. Você NÃO DEVE sugerir outros artistas se um artista específico foi solicitado.

      2.  **Use o Contexto para Pedidos Abertos:** Se o "Pedido do Usuário" for aberto, subjetivo ou baseado em humor (ex: "músicas para relaxar", "algo novo para ouvir", "uma vibe parecida com a que eu gosto"), então use o "Contexto de Gostos do Usuário" como sua principal inspiração para encontrar músicas que combinem com o perfil dele.

      ### Tarefa
      Agora, siga rigorosamente as "Regras de Prioridade" e analise as informações acima para recomendar 5 músicas.

      Para cada música, forneça (no formato exato abaixo):
      MÚSICA 1:
      Nome: [nome da música]
      Artista: [nome do artista]
      Por que: [explicação concisa]

      MÚSICA 2:
      Nome: [nome da música]
      Artista: [nome do artista]
      Por que: [explicação concisa]

      [continue para todas as 5 músicas]`;

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
