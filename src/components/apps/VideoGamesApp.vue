<script setup>
import { ref } from 'vue';
import videogamesData from '@/data/videogames.json';

const activeTab = ref('competitive');
const videogames = ref(videogamesData);

function setActiveTab(tab) {
  activeTab.value = tab;
}
</script>

<template>
  <div class="videogames-app">
    <div class="tabs">
      <button
          class="tab-button"
          :class="{ active: activeTab === 'competitive' }"
          @click="setActiveTab('competitive')"
      >
        Jeux Compétitif
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'action' }" 
        @click="setActiveTab('action')"
      >
        Jeux d'Action
      </button>

    </div>

    <div class="videogames-container">
      <div v-if="videogames[activeTab].length === 0" class="no-games">
        Aucun jeu à afficher.
      </div>

      <div v-for="game in videogames[activeTab]" :key="game.id" class="game-card">
        <div class="game-image">
          <img :src="game.image" :alt="game.name" onerror="this.src='/icons/games.svg'">
        </div>
        <div class="game-details">
          <h3 class="game-name">{{ game.name }}</h3>
          <p class="game-description">{{ game.description }}</p>
          <p v-if="game.pseudo" class="game-pseudo">Pseudo : {{game.pseudo}}</p>
          <div class="game-achievements">
            <h4>Réalisations:</h4>
            <ul>
              <li v-for="(achievement, index) in game.achievements" :key="index">
                {{ achievement }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.videogames-app {
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

.videogames-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 0; /* Force container to respect flex: 1 */
}

.game-card {
  max-height: 150px;
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  min-width: 0;
}

.game-image {
  height: 150px;
  overflow: hidden;
}

.game-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-details {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.game-name {
  margin: 0 0 8px 0;
  color: var(--color-1);
}

.game-pseudo {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.game-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #555;
}

.game-achievements {
  margin-top: auto;
}

.game-achievements h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--color-2);
}

.game-achievements ul {
  margin: 0;
  padding-left: 20px;
}

.game-achievements li {
  font-size: 13px;
  margin-bottom: 4px;
}

.no-games {
  text-align: center;
  padding: 32px;
  color: #777;
  font-style: italic;
}
</style>
