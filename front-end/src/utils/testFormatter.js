

import { formatPlaylistData } from './spotifyDataFormatter.js'


const realBackendData = {
    "id": "4MB8V20WBUcYFPa8jobC8I",
    "name": "☀️ Thiss iss my vibes ☀️",
    "description": "",
    "public": true,
    "collaborative": false,
    "tracksTotal": 22,
    "images": [
        {
            "height": null,
            "url": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da849acf1bfc9354386444a80794",
            "width": null
        }
    ],
    "owner": {
        "id": "22o7uifpt7nb7jiq5jrw6ftva",
        "displayName": "Vitorgabriel Nunes"
    },
    "followers": 0,
    "externalUrls": {
        "spotify": "https://open.spotify.com/playlist/4MB8V20WBUcYFPa8jobC8I"
    }
}


console.log('=== TESTE DO FORMATADOR DE PLAYLIST ===')
console.log('Dados originais:', realBackendData)

const formattedData = formatPlaylistData(realBackendData)
console.log('Dados formatados:', formattedData)


console.log('\n=== VERIFICAÇÕES ===')
console.log('✅ ID:', formattedData.id === "4MB8V20WBUcYFPa8jobC8I")
console.log('✅ Nome:', formattedData.name === "☀️ Thiss iss my vibes ☀️")
console.log('✅ Descrição vazia tratada:', formattedData.description === "")
console.log('✅ Público:', formattedData.public === true)
console.log('✅ Colaborativa:', formattedData.collaborative === false)
console.log('✅ Total de faixas:', formattedData.totalTracks === 22)
console.log('✅ Imagem:', formattedData.image === "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da849acf1bfc9354386444a80794")
console.log('✅ Owner ID:', formattedData.owner.id === "22o7uifpt7nb7jiq5jrw6ftva")
console.log('✅ Owner Nome:', formattedData.owner.displayName === "Vitorgabriel Nunes")
console.log('✅ Seguidores:', formattedData.followers === 0)
console.log('✅ URLs externas:', formattedData.externalUrls.spotify === "https://open.spotify.com/playlist/4MB8V20WBUcYFPa8jobC8I")

export { realBackendData, formattedData }
