const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const SPOTIFY_USER_ID = import.meta.env.VITE_SPOTIFY_USER_ID;

export default {
  async getAccessToken() {
    try {
      const response = await fetch(SPOTIFY_AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials'
        }).toString()
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  },

  async getUserProfile(accessToken) {
    try {
      const response = await fetch(`${SPOTIFY_API_BASE_URL}/users/${SPOTIFY_USER_ID}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get user profile: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  async getTopTracks(accessToken) {
    try {
      const playlistsResponse = await fetch(`${SPOTIFY_API_BASE_URL}/users/${SPOTIFY_USER_ID}/playlists?limit=5`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!playlistsResponse.ok) {
        throw new Error(`Failed to get user playlists: ${playlistsResponse.status} ${playlistsResponse.statusText}`);
      }

      const playlistsData = await playlistsResponse.json();

      if (!playlistsData.items || playlistsData.items.length === 0) {
        return { items: [] };
      }

      const firstPlaylist = playlistsData.items[0];
      const tracksResponse = await fetch(firstPlaylist.tracks.href, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!tracksResponse.ok) {
        throw new Error(`Failed to get playlist tracks: ${tracksResponse.status} ${tracksResponse.statusText}`);
      }

      const tracksData = await tracksResponse.json();

      const tracks = tracksData.items
        .filter(item => item.track)
        .map(item => item.track)
        .slice(0, 10);

      return { items: tracks };
    } catch (error) {
      console.error('Error getting top tracks:', error);
      throw error;
    }
  },

  async getAllPlaylists(accessToken) {
    try {
      const response = await fetch(`${SPOTIFY_API_BASE_URL}/users/${SPOTIFY_USER_ID}/playlists?limit=50`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get user playlists: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting all playlists:', error);
      throw error;
    }
  },

  async getPlaylistTracks(accessToken, playlistId) {
    try {
      const response = await fetch(`${SPOTIFY_API_BASE_URL}/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get playlist tracks: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting playlist tracks:', error);
      throw error;
    }
  },

  async getAudioFeatures(accessToken, trackIds) {
    try {
      const chunks = [];
      for (let i = 0; i < trackIds.length; i += 100) {
        chunks.push(trackIds.slice(i, i + 100));
      }

      const results = [];
      for (const chunk of chunks) {
        console.log(`${SPOTIFY_API_BASE_URL}/tracks?ids=${chunk.join(',')}`)
        try {
          const response = await fetch(`${SPOTIFY_API_BASE_URL}/tracks?ids=${chunk.join(',')}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          if (!response.ok) {
            console.warn(`Failed to get track information: ${response.status} ${response.statusText}`);
            continue;
          }

          const data = await response.json();

          if (data.tracks && data.tracks.length > 0) {
            console.log(data.tracks);
            const simplifiedFeatures = data.tracks.map(track => ({
              id: track.id,
              danceability: 0.5,
              energy: track.popularity ? track.popularity / 100 : 0.5,
              loudness: -10,
              speechiness: 0.1,
              acousticness: 0.5,
              instrumentalness: 0.1,
              liveness: 0.1,
              valence: 0.5,
              tempo: 120
            }));

            results.push(...simplifiedFeatures);
          }
        } catch (trackError) {
          console.error('Error getting track information:', trackError);
        }
      }

      return results;
    } catch (error) {
      console.error('Error getting audio features:', error);
      return [];
    }
  },

  async getUserStats(accessToken) {
    try {
      const playlistsData = await this.getAllPlaylists(accessToken);

      if (!playlistsData.items || playlistsData.items.length === 0) {
        return {
          totalPlaylists: 0,
          totalTracks: 0,
          artists: [],
          genres: [],
          audioFeatures: {}
        };
      }

      let allTracks = [];
      for (const playlist of playlistsData.items) {
        const tracksData = await this.getPlaylistTracks(accessToken, playlist.id);
        if (tracksData.items) {
          allTracks.push(...tracksData.items.filter(item => item.track));
        }
      }

      const artistsMap = new Map();
      allTracks.forEach(item => {
        if (item.track && item.track.artists) {
          item.track.artists.forEach(artist => {
            if (!artistsMap.has(artist.id)) {
              artistsMap.set(artist.id, {
                id: artist.id,
                name: artist.name,
                count: 1
              });
            } else {
              artistsMap.get(artist.id).count++;
            }
          });
        }
      });

      const artists = Array.from(artistsMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const trackIds = allTracks
        .filter(item => item.track && item.track.id)
        .map(item => item.track.id);

      let audioFeatures = {};
      if (trackIds.length > 0) {
        const featuresData = await this.getAudioFeatures(accessToken, trackIds);

        if (featuresData && featuresData.length > 0) {
          const features = [
            'danceability', 'energy', 'loudness', 'speechiness',
            'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo'
          ];

          audioFeatures = features.reduce((acc, feature) => {
            const values = featuresData
              .filter(item => item && item[feature] !== undefined)
              .map(item => item[feature]);

            if (values.length > 0) {
              const sum = values.reduce((a, b) => a + b, 0);
              acc[feature] = sum / values.length;
            } else {
              acc[feature] = 0;
            }

            return acc;
          }, {});
        }
      }

      return {
        totalPlaylists: playlistsData.items.length,
        totalTracks: allTracks.length,
        artists,
        audioFeatures
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  },
};
