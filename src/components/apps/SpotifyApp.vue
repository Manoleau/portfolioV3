<script setup>
import {onMounted, ref} from 'vue';
import SpotifyService from '@/services/SpotifyService';

const accessToken = ref(null);
const userProfile = ref(null);
const topTracks = ref([]);
const recentlyPlayed = ref([]);
const userStats = ref(null);
const loading = ref(false);
const error = ref(null);
const activeTab = ref('profile');

onMounted(() => {
  initializeApp();
});

async function ensureValidToken() {
  const storedToken = localStorage.getItem('spotify_access_token');
  const tokenExpiry = localStorage.getItem('spotify_token_expiry');

  if (!storedToken || Date.now() > parseInt(tokenExpiry || 0)) {
    try {
      const tokenResponse = await SpotifyService.getAccessToken();
      accessToken.value = tokenResponse.access_token;

      localStorage.setItem('spotify_access_token', tokenResponse.access_token);
      localStorage.setItem('spotify_token_expiry', Date.now() + (tokenResponse.expires_in * 1000));

      return true;
    } catch (err) {
      console.error('Token acquisition error:', err);
      return false;
    }
  } else {
    accessToken.value = storedToken;
    return true;
  }
}

async function loadUserData() {
  loading.value = true;
  error.value = null;
  try {
    userProfile.value = await SpotifyService.getUserProfile(localStorage.getItem('spotify_access_token'));

    // Get top tracks from the user's playlists
    const topTracksResponse = await SpotifyService.getTopTracks(localStorage.getItem('spotify_access_token'));
    topTracks.value = topTracksResponse.items;

    // Get user stats
    userStats.value = await SpotifyService.getUserStats(localStorage.getItem('spotify_access_token'));

    recentlyPlayed.value = [];

  } catch (err) {
    error.value = `Failed to load data: ${err.message}`;
    console.error('Data loading error:', err);
  } finally {
    loading.value = false;
  }
}

async function initializeApp() {
  loading.value = true;

  const isValid = await ensureValidToken();

  if (isValid) {
    await loadUserData();
  }

  loading.value = false;
}

function setActiveTab(tab) {
  activeTab.value = tab;
}

// Helper functions for audio features
function formatFeatureName(feature) {
  const names = {
    danceability: 'Dansabilité',
    energy: 'Énergie',
    loudness: 'Volume',
    speechiness: 'Voix',
    acousticness: 'Acoustique',
    instrumentalness: 'Instrumental',
    liveness: 'Live',
    valence: 'Positivité',
    tempo: 'Tempo'
  };
  return names[feature] || feature;
}

function getFeatureDescription(feature) {
  const descriptions = {
    danceability: 'À quel point le morceau est adapté à la danse (0.0 = pas dansable, 1.0 = très dansable)',
    energy: 'Mesure de l\'intensité et de l\'activité (0.0 = calme, 1.0 = énergique)',
    loudness: 'Volume global du morceau en décibels (dB), généralement entre -60 et 0',
    speechiness: 'Présence de mots parlés (0.0 = instrumental, 1.0 = uniquement des paroles)',
    acousticness: 'Mesure de l\'acoustique du morceau (0.0 = électronique, 1.0 = acoustique)',
    instrumentalness: 'Prédiction de l\'absence de voix (0.0 = vocal, 1.0 = instrumental)',
    liveness: 'Détecte la présence d\'un public (0.0 = studio, 1.0 = live)',
    valence: 'Positivité musicale (0.0 = négatif/triste, 1.0 = positif/joyeux)',
    tempo: 'Tempo estimé en battements par minute (BPM)'
  };
  return descriptions[feature] || '';
}

function getFeatureWidth(feature, value) {
  // For most features, the range is 0-1, so we multiply by 100
  if (feature === 'loudness') {
    // Loudness is typically between -60 and 0 dB
    return Math.min(100, Math.max(0, (value + 60) * (100 / 60)));
  } else if (feature === 'tempo') {
    // Tempo is typically between 50 and 200 BPM
    return Math.min(100, Math.max(0, (value - 50) * (100 / 150)));
  } else {
    return value * 100;
  }
}

function formatFeatureValue(feature, value) {
  if (feature === 'loudness') {
    return value.toFixed(1) + ' dB';
  } else if (feature === 'tempo') {
    return value.toFixed(0) + ' BPM';
  } else {
    return value.toFixed(2);
  }
}

</script>

<template>
  <div class="spotify-app">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Chargement...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <h3>Erreur</h3>
      <p>{{ error }}</p>
      <button @click="initializeApp" class="retry-button">Réessayer</button>
    </div>

    <div v-else class="spotify-content">
      <div class="tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'profile' }"
          @click="setActiveTab('profile')"
        >
          Profil
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'top-tracks' }"
          @click="setActiveTab('top-tracks')"
        >
          Morceaux des Playlists
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'stats' }"
          @click="setActiveTab('stats')"
        >
          Statistiques
        </button>
      </div>

      <div v-if="activeTab === 'profile'" class="profile-container">
        <div v-if="userProfile" class="user-profile">
          <div class="profile-header">
            <div class="profile-image" v-if="userProfile.images && userProfile.images.length > 0">
              <img :src="userProfile.images[0].url" alt="Profile Picture" />
            </div>
            <div class="profile-info">
              <h2>{{ userProfile.display_name }}</h2>
              <p v-if="userProfile.email">Email: {{ userProfile.email }}</p>
              <p>Followers: {{ userProfile.followers?.total || 0 }}</p>
              <p v-if="userProfile.country">Country: {{ userProfile.country }}</p>
              <a :href="userProfile.external_urls?.spotify" target="_blank" class="spotify-link">
                Voir sur Spotify
              </a>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <p>Les données de profil utilisateur ne sont pas disponibles avec l'authentification client_credentials.</p>
          <p>Cette méthode d'authentification ne permet pas d'accéder aux données spécifiques à un utilisateur.</p>
        </div>
      </div>

      <!-- Top Tracks Tab -->
      <div v-if="activeTab === 'top-tracks'" class="tracks-container">
        <h3>Top morceaux des playlists</h3>
        <div v-if="topTracks.length > 0" class="tracks-list">
          <div v-for="(track, index) in topTracks" :key="track.id" class="track-item">
            <div class="track-number">{{ index + 1 }}</div>
            <div class="track-image" v-if="track.album.images && track.album.images.length > 0">
              <img :src="track.album.images[track.album.images.length - 1].url" alt="Album Cover" />
            </div>
            <div class="track-info">
              <div class="track-name">{{ track.name }}</div>
              <div class="track-artist">{{ track.artists.map(artist => artist.name).join(', ') }}</div>
            </div>
            <div class="track-album">{{ track.album.name }}</div>
            <a :href="track.external_urls.spotify" target="_blank" class="track-link">
              <span class="play-icon">▶</span>
            </a>
          </div>
        </div>
        <div v-else class="no-data">
          <p>Aucun morceau trouvé dans les playlists de l'utilisateur.</p>
          <p>Essayez de rafraîchir la page ou vérifiez que l'utilisateur a des playlists publiques.</p>
        </div>
      </div>

      <!-- Stats Tab -->
      <div v-if="activeTab === 'stats'" class="stats-container">
        <h3>Statistiques de l'utilisateur</h3>
        <div v-if="userStats" class="stats-content">
          <!-- General Stats -->
          <div class="stats-section">
            <h4>Statistiques générales</h4>
            <div class="stats-cards">
              <div class="stats-card">
                <div class="stats-card-value">{{ userStats.totalPlaylists }}</div>
                <div class="stats-card-label">Playlists</div>
              </div>
              <div class="stats-card">
                <div class="stats-card-value">{{ userStats.totalTracks }}</div>
                <div class="stats-card-label">Morceaux</div>
              </div>
            </div>
          </div>

          <!-- Top Artists -->
          <div class="stats-section">
            <h4>Artistes les plus écoutés</h4>
            <div v-if="userStats.artists && userStats.artists.length > 0" class="artists-list">
              <div v-for="(artist, index) in userStats.artists" :key="artist.id" class="artist-item">
                <div class="artist-rank">{{ index + 1 }}</div>
                <div class="artist-info">
                  <div class="artist-name">{{ artist.name }}</div>
                  <div class="artist-count">{{ artist.count }} morceaux</div>
                </div>
              </div>
            </div>
            <div v-else class="no-data">
              <p>Aucun artiste trouvé dans les playlists de l'utilisateur.</p>
            </div>
          </div>

          <!-- Audio Features -->
          <div class="stats-section">
            <h4>Caractéristiques audio moyennes</h4>
            <p class="audio-features-note">Note: Certaines valeurs sont estimées en raison des limitations de l'API Spotify avec l'authentification client_credentials.</p>
            <div v-if="userStats.audioFeatures && Object.keys(userStats.audioFeatures).length > 0" class="audio-features">
              <div class="feature-item" v-for="(value, feature) in userStats.audioFeatures" :key="feature">
                <div class="feature-label">
                  {{ formatFeatureName(feature) }}
                  <span class="feature-tooltip">{{ getFeatureDescription(feature) }}</span>
                </div>
                <div class="feature-bar-container">
                  <div class="feature-bar" :style="{ width: getFeatureWidth(feature, value) + '%' }"></div>
                  <div class="feature-value">{{ formatFeatureValue(feature, value) }}</div>
                </div>
              </div>
            </div>
            <div v-else class="no-data">
              <p>Aucune caractéristique audio disponible pour les morceaux de l'utilisateur.</p>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <p>Les statistiques ne sont pas disponibles pour le moment.</p>
          <p>Essayez de rafraîchir la page ou vérifiez que l'utilisateur a des playlists publiques.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.spotify-app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  color: white;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #1DB954;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
}

.retry-button {
  background-color: #1DB954;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #1ed760;
}

.spotify-logo img {
  width: 100%;
  height: 100%;
}

.spotify-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.tabs {
  display: flex;
  background-color: #282828;
  border-bottom: 1px solid #333;
}

.tab-button {
  padding: 12px 24px;
  background-color: transparent;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
}

.tab-button:hover {
  color: white;
}

.tab-button.active {
  color: white;
  border-bottom: 2px solid #1DB954;
  font-weight: bold;
}

.profile-container, .tracks-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.user-profile {
  background-color: #282828;
  border-radius: 8px;
  padding: 24px;
}

.profile-header {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 24px;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info h2 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 28px;
}

.profile-info p {
  margin: 8px 0;
  color: #b3b3b3;
}

.spotify-link {
  display: inline-block;
  color: white;
  background-color: #1DB954;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  margin-top: 16px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.spotify-link:hover {
  background-color: #1ed760;
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.track-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #282828;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.track-item:hover {
  background-color: #333;
}

.track-number {
  width: 24px;
  text-align: center;
  color: #b3b3b3;
  font-size: 14px;
}

.track-image {
  width: 40px;
  height: 40px;
  margin: 0 16px;
}

.track-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.track-info {
  flex: 1;
  min-width: 0;
}

.track-name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  font-size: 14px;
  color: #b3b3b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-album {
  width: 200px;
  font-size: 14px;
  color: #b3b3b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 16px;
}

.track-link {
  color: #b3b3b3;
  text-decoration: none;
  transition: color 0.2s;
}

.track-link:hover {
  color: #1DB954;
}

.play-icon {
  font-size: 20px;
}

.no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #b3b3b3;
  font-style: italic;
  text-align: center;
}

/* Stats styles */
.stats-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.stats-section {
  background-color: #282828;
  border-radius: 8px;
  padding: 24px;
}

.stats-section h4 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: white;
}

.stats-cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stats-card {
  background-color: #181818;
  border-radius: 8px;
  padding: 16px;
  min-width: 120px;
  text-align: center;
}

.stats-card-value {
  font-size: 32px;
  font-weight: bold;
  color: #1DB954;
  margin-bottom: 8px;
}

.stats-card-label {
  font-size: 14px;
  color: #b3b3b3;
}

.artists-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.artist-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #181818;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.artist-item:hover {
  background-color: #333;
}

.artist-rank {
  width: 24px;
  text-align: center;
  color: #b3b3b3;
  font-size: 14px;
  font-weight: bold;
}

.artist-info {
  flex: 1;
  margin-left: 16px;
}

.artist-name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-count {
  font-size: 14px;
  color: #b3b3b3;
}

.audio-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feature-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: white;
  position: relative;
}

.feature-tooltip {
  visibility: hidden;
  width: 300px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px;
  font-weight: normal;
}

.feature-label:hover .feature-tooltip {
  visibility: visible;
  opacity: 1;
}

.feature-bar-container {
  height: 8px;
  background-color: #181818;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.feature-bar {
  height: 100%;
  background-color: #1DB954;
  border-radius: 4px;
}

.feature-value {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 12px;
  color: #b3b3b3;
}

.audio-features-note {
  font-size: 12px;
  color: #b3b3b3;
  font-style: italic;
  margin-top: 0;
  margin-bottom: 16px;
}

</style>
