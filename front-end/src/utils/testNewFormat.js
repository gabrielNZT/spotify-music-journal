
import { formatTrackData, formatCompletePlaylistData } from './spotifyDataFormatter.js'

const testTracksResponse = {
  "tracks": [
    {
      "addedAt": "2024-12-05T23:02:55Z",
      "addedBy": "22o7uifpt7nb7jiq5jrw6ftva",
      "track": {
        "id": "4ZEw5uS9RY6M6lEjsu7w8Q",
        "name": "My Home",
        "durationMs": 206250,
        "explicit": false,
        "popularity": 76,
        "previewUrl": null,
        "trackNumber": 1,
        "artists": [
          {
            "id": "3bO19AOone0ubCsfDXDtYt",
            "name": "Myles Smith",
            "externalUrls": {
              "spotify": "https://open.spotify.com/artist/3bO19AOone0ubCsfDXDtYt"
            }
          }
        ],
        "album": {
          "id": "6PXZreuCbDw0VlSBrPJ1ND",
          "name": "My Home",
          "releaseDate": "2023-10-13",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab67616d0000b27385f2ff47877d2b86d341d375",
              "width": 640
            }
          ],
          "totalTracks": 1
        },
        "externalUrls": {
          "spotify": "https://open.spotify.com/track/4ZEw5uS9RY6M6lEjsu7w8Q"
        }
      }
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 22,
    "hasNext": false,
    "hasPrev": false
  }
}

const testPlaylistData = {
  "id": "test-playlist",
  "name": "Test Playlist",
  "description": "Playlist de teste",
  "images": [
    {
      "height": 640,
      "url": "https://test-image.jpg",
      "width": 640
    }
  ],
  "owner": {
    "id": "test-user",
    "displayName": "Test User"
  },
  "tracksTotal": 22,
  "followers": 100,
  "public": true,
  "collaborative": false
}


console.log('=== TESTE DO NOVO FORMATO ===')


const firstTrack = testTracksResponse.tracks[0]
const formattedTrack = formatTrackData(firstTrack)
console.log('Faixa formatada:', formattedTrack)


const completePlaylist = formatCompletePlaylistData(testPlaylistData, testTracksResponse)
console.log('Playlist completa formatada:', completePlaylist)

console.log('=== FIM DO TESTE ===')
