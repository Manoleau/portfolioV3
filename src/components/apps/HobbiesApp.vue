<script setup>
import { ref } from 'vue';
import hobbiesData from '@/data/hobbies.json';

const hobbies = ref(hobbiesData.categories);
const activeHobby = ref(hobbiesData.categories[0]);

function setActiveHobby(hobby) {
  activeHobby.value = hobby;
}
</script>

<template>
  <div class="hobbies-app">
    <div class="hobbies-sidebar">
      <div 
        v-for="hobby in hobbies" 
        :key="hobby.name" 
        class="hobby-item"
        :class="{ active: activeHobby.name === hobby.name }"
        @click="setActiveHobby(hobby)"
      >
        <div class="hobby-icon">
          <img :src="hobby.icon" :alt="hobby.name">
        </div>
        <div class="hobby-name">{{ hobby.name }}</div>
      </div>
    </div>

    <div class="hobby-content">
      <div class="hobby-header">
        <h2 class="hobby-title">{{ activeHobby.name }}</h2>
        <p class="hobby-description">{{ activeHobby.description }}</p>
      </div>

      <div class="hobby-details">
        <div v-for="(detail, index) in activeHobby.details" :key="index" class="detail-card">
          <div class="detail-image">
            <img :src="detail.image" :alt="detail.title" onerror="this.src='/icons/photography.svg'">
            <div v-if="detail.favorite" class="favorite-badge">❤ Favorite</div>
          </div>
          <div class="detail-info">
            <h3 class="detail-title">{{ detail.title }}</h3>
            <p class="detail-description">{{ detail.description }}</p>
          </div>
        </div>
      </div>

      <div class="hobby-extras">
        <div v-if="activeHobby.equipment" class="equipment">
          <h3>Equipment</h3>
          <ul>
            <li v-for="(item, index) in activeHobby.equipment" :key="index">{{ item }}</li>
          </ul>
        </div>

        <div v-if="activeHobby.visitedCountries" class="countries">
          <h3>Visited Countries</h3>
          <div class="tag-container">
            <span v-for="(country, index) in activeHobby.visitedCountries" :key="index" class="country-tag">
              {{ country }}
            </span>
          </div>
        </div>

        <div v-if="activeHobby.favoriteArtists" class="artists">
          <h3>Favorite Artists</h3>
          <div class="tag-container">
            <span v-for="(artist, index) in activeHobby.favoriteArtists" :key="index" class="artist-tag">
              {{ artist }}
            </span>
          </div>
        </div>

        <div v-if="activeHobby.specialties" class="specialties">
          <h3>Specialties</h3>
          <div class="tag-container">
            <span v-for="(specialty, index) in activeHobby.specialties" :key="index" class="specialty-tag">
              {{ specialty }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hobbies-app {
  height: 100%;
  display: flex;
}

.hobbies-sidebar {
  width: 160px;
  min-width: 160px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.hobby-item {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.hobby-item:hover {
  background-color: #e9e9e9;
}

.hobby-item.active {
  background-color: var(--color-3);
  color: white;
}

.hobby-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

.hobby-icon img {
  width: 100%;
  height: 100%;
}

.hobby-name {
  font-size: 14px;
  font-weight: 500;
}

.hobby-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hobby-header {
  margin-bottom: 16px;
}

.hobby-title {
  margin: 0 0 8px 0;
  color: var(--color-1);
  font-size: 24px;
}

.hobby-description {
  margin: 0;
  color: #555;
  font-size: 16px;
  line-height: 1.5;
}

.hobby-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 0;
  width: 100%;
}

.detail-image {
  width: 200px;
  height: 150px;
  position: relative;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.detail-info {
  flex: 1;
  padding: 16px;
}

.detail-title {
  margin: 0 0 8px 0;
  color: var(--color-2);
  font-size: 18px;
}

.detail-description {
  margin: 0;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
}

.hobby-extras {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
}

.hobby-extras h3 {
  margin: 0 0 12px 0;
  color: var(--color-1);
  font-size: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.hobby-extras ul {
  margin: 0;
  padding-left: 20px;
}

.hobby-extras li {
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.country-tag, .artist-tag, .specialty-tag {
  background-color: var(--color-3);
  color: white;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  display: inline-block;
}

.artist-tag {
  background-color: var(--color-2);
}

.specialty-tag {
  background-color: var(--color-1);
}
</style>
