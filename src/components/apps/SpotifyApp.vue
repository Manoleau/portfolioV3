<script setup>
import {onMounted, ref} from 'vue';
import SpotifyService from '@/services/SpotifyService';

const userProfile = ref(null);
const topTracks = ref([]);
const topArtists = ref([]);
const favoriteGenres = ref([]);
const loading = ref(false);
const error = ref(null);
const activeTab = ref('profile');

onMounted(() => {
  loadData();
});

async function loadData() {
  loading.value = true;
  error.value = null;
  try {
    userProfile.value = await SpotifyService.getUserInfo();

    topTracks.value = await SpotifyService.getTopTracks();

    topArtists.value = await SpotifyService.getTopArtists();

    favoriteGenres.value = await SpotifyService.getFavoriteGenres();

  } catch (err) {
    error.value = `Failed to load data: ${err.message}`;
  } finally {
    loading.value = false;
  }
}

function setActiveTab(tab) {
  activeTab.value = tab;
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
      <button class="retry-button" @click="initializeApp">Réessayer</button>
    </div>

    <div v-else class="spotify-content">
      <div class="tabs">
        <button
            :class="{ active: activeTab === 'profile' }"
            class="tab-button"
            @click="setActiveTab('profile')"
        >
          Profil
        </button>
        <button
            :class="{ active: activeTab === 'top-tracks' }"
            class="tab-button"
            @click="setActiveTab('top-tracks')"
        >
          Top musique
        </button>
        <button
            :class="{ active: activeTab === 'top-artists' }"
            class="tab-button"
            @click="setActiveTab('top-artists')"
        >
          Top artiste
        </button>
        <button
            :class="{ active: activeTab === 'favorite-genres' }"
            class="tab-button"
            @click="setActiveTab('favorite-genres')"
        >
          Genres préférés
        </button>
      </div>

      <div v-if="activeTab === 'profile'" class="profile-container">
        <div v-if="userProfile" class="user-profile">
          <div class="profile-header">
            <div v-if="userProfile.profile_image" class="profile-image">
              <img :src="userProfile.profile_image" alt="Profile Picture"/>
            </div>
            <div class="profile-info">
              <h2>{{ userProfile.display_name }}</h2>
              <a v-if="userProfile.uri" :href="userProfile.uri" class="spotify-link" target="_blank">
                Voir sur Spotify
              </a>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <p>Les données de profil utilisateur ne sont pas disponibles.</p>
          <p>Veuillez réessayer plus tard.</p>
        </div>
      </div>

      <div v-if="activeTab === 'top-tracks'" class="tracks-container">
        <div v-if="topTracks.length > 0" class="tracks-list">
          <div v-for="(track, index) in topTracks" :key="track.id" class="track-item">
            <div class="track-number">{{ index + 1 }}</div>
            <div v-if="track.image" class="track-image">
              <img :src="track.image" alt="Track Cover"/>
            </div>
            <div class="track-info">
              <div class="track-name">{{ track.name }}</div>
              <div class="track-artist">{{ track.artist }}</div>
            </div>
            <div class="track-album">{{ track.album }}</div>
            <div class="track-duration">{{
                Math.floor(track.duration_ms / 60000)
              }}:{{ String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0') }}
            </div>
            <a v-if="track.uri" :href="track.uri" class="track-link" target="_blank">
              <span class="play-icon">▶</span>
            </a>
            <a v-if="track.preview_url" :href="track.preview_url" class="preview-link" target="_blank">
              <span class="preview-icon">🔊</span>
            </a>
          </div>
        </div>
        <div v-else class="no-data">
          <p>Aucun morceau trouvé.</p>
          <p>Essayez de rafraîchir la page.</p>
        </div>
      </div>

      <div v-if="activeTab === 'top-artists'" class="stats-container">
        <div v-if="topArtists && topArtists.length > 0" class="artists-list">
          <div v-for="(artist, index) in topArtists" :key="artist.id" class="artist-item">
            <div class="artist-rank">{{ index + 1 }}</div>
            <div v-if="artist.image" class="artist-image">
              <img :src="artist.image" alt="Artist Image"/>
            </div>
            <div class="artist-info">
              <div class="artist-name">{{ artist.name }}</div>
              <div class="artist-details">
                <span v-if="artist.followers">Followers: {{ artist.followers }}</span>
              </div>
            </div>
            <a v-if="artist.uri" :href="artist.uri" class="artist-link" target="_blank">
              <span class="play-icon">▶</span>
            </a>
          </div>
        </div>
        <div v-else class="no-data">
          <p>Aucun artiste trouvé.</p>
        </div>
      </div>
      <div v-if="activeTab === 'favorite-genres'" class="stats-container">
        <div v-if="favoriteGenres && favoriteGenres.length > 0" class="genres-list">
          <div v-for="(genre, index) in favoriteGenres" :key="index" class="genre-item">
            <div class="genre-rank">{{ index + 1 }}</div>
            <div class="genre-info">
              <div class="genre-name">{{ genre.name }}</div>
              <div class="genre-count">{{ genre.count }} morceaux</div>
            </div>
            <div class="genre-bar-container">
              <div :style="{ width: (genre.count / favoriteGenres[0].count * 100) + '%' }" class="genre-bar"></div>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <p>Aucun genre trouvé.</p>
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
  to {
    transform: rotate(360deg);
  }
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
  margin-right: 12px;
  border-radius: 4px;
  overflow: hidden;
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

.track-link:hover, .preview-link:hover, .artist-link:hover {
  color: #1DB954;
}

.play-icon, .preview-icon {
  font-size: 20px;
}

.track-popularity, .track-duration {
  font-size: 14px;
  color: #b3b3b3;
  margin: 0 8px;
}

.preview-link {
  color: #b3b3b3;
  text-decoration: none;
  transition: color 0.2s;
  margin-left: 8px;
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

.stats-section h4 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: white;
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

.artist-image {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 4px;
  overflow: hidden;
}

.artist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.artist-details {
  display: flex;
  gap: 12px;
}

.artist-link {
  color: #b3b3b3;
  text-decoration: none;
  transition: color 0.2s;
  margin-left: auto;
}

.genres-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.genre-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #181818;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.genre-item:hover {
  background-color: #333;
}

.genre-rank {
  width: 24px;
  text-align: center;
  color: #b3b3b3;
  font-size: 14px;
  font-weight: bold;
}

.genre-info {
  flex: 0 0 200px;
  margin-left: 16px;
}

.genre-name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.genre-count {
  font-size: 14px;
  color: #b3b3b3;
}

.genre-bar-container {
  flex: 1;
  height: 8px;
  background-color: #333;
  border-radius: 4px;
  overflow: hidden;
  margin-left: 16px;
}

.genre-bar {
  height: 100%;
  background-color: #1DB954;
  border-radius: 4px;
}

</style>
