<script setup>
import { ref } from 'vue';
import musicData from '@/data/music.json';

const activeTab = ref('favorites');
const music = ref(musicData);
const activeArtist = ref(music.value.favorites.artists[0]);
const activePlaylist = ref(music.value.playlists[0]);

function setActiveTab(tab) {
  activeTab.value = tab;
}

function setActiveArtist(artist) {
  activeArtist.value = artist;
}

function setActivePlaylist(playlist) {
  activePlaylist.value = playlist;
}

function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
}
</script>

<template>
  <div class="music-app">
    <div class="tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'favorites' }" 
        @click="setActiveTab('favorites')"
      >
        Favorites
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'playlists' }" 
        @click="setActiveTab('playlists')"
      >
        Playlists
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'instruments' }" 
        @click="setActiveTab('instruments')"
      >
        Instruments
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'concerts' }" 
        @click="setActiveTab('concerts')"
      >
        Concerts
      </button>
    </div>

    <div class="music-content">
      <!-- Favorites Tab -->
      <div v-if="activeTab === 'favorites'" class="favorites-container">
        <div class="artists-sidebar">
          <div 
            v-for="artist in music.favorites.artists" 
            :key="artist.name" 
            class="artist-item"
            :class="{ active: activeArtist.name === artist.name }"
            @click="setActiveArtist(artist)"
          >
            <div class="artist-name">{{ artist.name }}</div>
            <div class="artist-genre">{{ artist.genre }}</div>
          </div>
        </div>

        <div class="artist-details">
          <div class="artist-header">
            <div class="artist-image">
              <img :src="activeArtist.image" :alt="activeArtist.name" onerror="this.src='/icons/music.svg'">
            </div>
            <div class="artist-info">
              <h2 class="artist-title">{{ activeArtist.name }}</h2>
              <div class="artist-genre-tag">{{ activeArtist.genre }}</div>
              <p class="artist-bio">{{ activeArtist.bio }}</p>
            </div>
          </div>

          <div class="artist-favorites">
            <div class="favorite-albums">
              <h3>Favorite Albums</h3>
              <ul>
                <li v-for="(album, index) in activeArtist.favoriteAlbums" :key="index">
                  {{ album }}
                </li>
              </ul>
            </div>

            <div class="favorite-songs">
              <h3>Favorite Songs</h3>
              <ul>
                <li v-for="(song, index) in activeArtist.favoriteSongs" :key="index">
                  {{ song }}
                </li>
              </ul>
            </div>
          </div>

          <div class="favorite-genres">
            <h3>Favorite Genres</h3>
            <div class="genre-tags">
              <span v-for="(genre, index) in music.favorites.genres" :key="index" class="genre-tag">
                {{ genre }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Playlists Tab -->
      <div v-if="activeTab === 'playlists'" class="playlists-container">
        <div class="playlists-sidebar">
          <div 
            v-for="playlist in music.playlists" 
            :key="playlist.name" 
            class="playlist-item"
            :class="{ active: activePlaylist.name === playlist.name }"
            @click="setActivePlaylist(playlist)"
          >
            <div class="playlist-image">
              <img :src="playlist.image" :alt="playlist.name" onerror="this.src='/icons/music.svg'">
            </div>
            <div class="playlist-name">{{ playlist.name }}</div>
          </div>
        </div>

        <div class="playlist-details">
          <div class="playlist-header">
            <h2 class="playlist-title">{{ activePlaylist.name }}</h2>
            <p class="playlist-description">{{ activePlaylist.description }}</p>
          </div>

          <div class="playlist-songs">
            <table class="songs-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(song, index) in activePlaylist.songs" :key="index">
                  <td class="song-number">{{ index + 1 }}</td>
                  <td class="song-title">{{ song.title }}</td>
                  <td class="song-artist">{{ song.artist }}</td>
                  <td class="song-duration">{{ song.duration }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Instruments Tab -->
      <div v-if="activeTab === 'instruments'" class="instruments-container">
        <div v-for="instrument in music.instruments" :key="instrument.name" class="instrument-card">
          <div class="instrument-image">
            <img :src="instrument.image" :alt="instrument.name" onerror="this.src='/icons/music.svg'">
          </div>
          <div class="instrument-details">
            <h3 class="instrument-name">{{ instrument.name }}</h3>
            <div class="instrument-meta">
              <span class="instrument-type">{{ instrument.type }}</span>
              <span class="instrument-experience">{{ instrument.experience }}</span>
              <span class="instrument-years">{{ instrument.yearsPlaying }} {{ instrument.yearsPlaying === 1 ? 'year' : 'years' }}</span>
            </div>
            <p class="instrument-description">{{ instrument.description }}</p>
            <div class="instrument-styles">
              <h4>Favorite Styles</h4>
              <div class="style-tags">
                <span v-for="(style, index) in instrument.favoriteStyles" :key="index" class="style-tag">
                  {{ style }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Concerts Tab -->
      <div v-if="activeTab === 'concerts'" class="concerts-container">
        <div v-for="concert in music.concerts" :key="concert.artist + concert.date" class="concert-card">
          <div class="concert-header">
            <h3 class="concert-artist">{{ concert.artist }}</h3>
            <div class="concert-date">{{ formatDate(concert.date) }}</div>
          </div>
          <div class="concert-venue">
            <div class="venue-name">{{ concert.venue }}</div>
            <div class="venue-location">{{ concert.location }}</div>
          </div>
          <div class="concert-highlights">
            <h4>Highlights</h4>
            <ul>
              <li v-for="(highlight, index) in concert.highlights" :key="index">
                {{ highlight }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.music-app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

.tab-button {
  padding: 8px 16px;
  background-color: transparent;
  border: none;
  border-right: 1px solid #ddd;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.tab-button:hover {
  background-color: #e0e0e0;
}

.tab-button.active {
  background-color: white;
  border-bottom: 2px solid var(--color-2);
  font-weight: bold;
}

.music-content {
  flex: 1;
  overflow-y: auto;
}

/* Favorites Tab */
.favorites-container {
  display: flex;
  height: 100%;
}

.artists-sidebar {
  width: 160px;
  min-width: 160px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.artist-item {
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.artist-item:hover {
  background-color: #e9e9e9;
}

.artist-item.active {
  background-color: var(--color-3);
  color: white;
}

.artist-name {
  font-weight: bold;
  font-size: 14px;
}

.artist-genre {
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.8;
}

.artist-details {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.artist-header {
  display: flex;
  margin-bottom: 24px;
}

.artist-image {
  width: 150px;
  height: 150px;
  margin-right: 20px;
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
}

.artist-title {
  margin: 0 0 8px 0;
  color: var(--color-1);
  font-size: 24px;
}

.artist-genre-tag {
  display: inline-block;
  background-color: var(--color-2);
  color: white;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  margin-bottom: 12px;
}

.artist-bio {
  margin: 0;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
}

.artist-favorites {
  display: flex;
  margin-bottom: 24px;
}

.favorite-albums, .favorite-songs {
  flex: 1;
}

.artist-favorites h3, .favorite-genres h3 {
  margin: 0 0 12px 0;
  color: var(--color-1);
  font-size: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.artist-favorites ul {
  margin: 0;
  padding-left: 20px;
}

.artist-favorites li {
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.genre-tag {
  background-color: var(--color-3);
  color: white;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
}

/* Playlists Tab */
.playlists-container {
  display: flex;
  height: 100%;
}

.playlists-sidebar {
  width: 160px;
  min-width: 160px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  padding: 12px;
}

.playlist-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.playlist-item:hover {
  transform: scale(1.05);
}

.playlist-item.active .playlist-name {
  color: var(--color-2);
  font-weight: bold;
}

.playlist-image {
  width: 120px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.playlist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-name {
  font-size: 14px;
  text-align: center;
}

.playlist-details {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.playlist-header {
  margin-bottom: 24px;
}

.playlist-title {
  margin: 0 0 8px 0;
  color: var(--color-1);
  font-size: 24px;
}

.playlist-description {
  margin: 0;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
}

.songs-table {
  width: 100%;
  border-collapse: collapse;
}

.songs-table th {
  text-align: left;
  padding: 12px 8px;
  border-bottom: 2px solid #ddd;
  color: #333;
  font-size: 14px;
}

.songs-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
  color: #555;
  font-size: 14px;
}

.song-number {
  width: 40px;
  color: #999;
  text-align: center;
}

.song-duration {
  text-align: right;
  color: #999;
}

/* Instruments Tab */
.instruments-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.instrument-card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 0;
  width: 100%;
}

.instrument-image {
  width: 200px;
  height: 200px;
}

.instrument-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.instrument-details {
  flex: 1;
  padding: 20px;
}

.instrument-name {
  margin: 0 0 8px 0;
  color: var(--color-1);
  font-size: 20px;
}

.instrument-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.instrument-type, .instrument-experience, .instrument-years {
  font-size: 14px;
  color: #666;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.instrument-description {
  margin: 0 0 16px 0;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
}

.instrument-styles h4 {
  margin: 0 0 8px 0;
  color: #444;
  font-size: 16px;
}

.style-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.style-tag {
  background-color: var(--color-3);
  color: white;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
}

/* Concerts Tab */
.concerts-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.concert-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  min-width: 0;
  width: 100%;
}

.concert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.concert-artist {
  margin: 0;
  color: var(--color-1);
  font-size: 20px;
}

.concert-date {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}

.concert-venue {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.venue-name {
  font-size: 16px;
  color: var(--color-2);
  font-weight: bold;
}

.venue-location {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.concert-highlights h4 {
  margin: 0 0 8px 0;
  color: #444;
  font-size: 16px;
}

.concert-highlights ul {
  margin: 0;
  padding-left: 20px;
}

.concert-highlights li {
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}
</style>
