<script setup>
import { ref } from 'vue';
import videogamesData from '@/data/videogames.json';

const videogames = ref(videogamesData);
</script>

<template>
  <div class="videogames-app">

    <div class="videogames-container">
      <div v-if="videogames.length === 0" class="no-games">
        Aucun jeu à afficher.
      </div>

      <div v-for="game in videogames" :key="game.id" class="game-card">
        <div class="game-image">
          <img :src="game.image" :alt="game.name" onerror="this.src='/icons/games.svg'">
        </div>
        <div class="game-details">
          <h3 class="game-name">{{ game.name }}</h3>
          <p class="game-description">{{ game.description }}</p>
          <p v-if="game.pseudo" class="game-pseudo">Pseudo : {{game.pseudo}}</p>
          <div class="game-achievements">
            <h4>Réalisations:</h4>
            <p>
              {{ game.achievements.join(' / ') }}
            </p>
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
  width: 150px;
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
.game-achievements p {
  font-size: 13px;
  padding-left: 20px;
}

.game-achievements h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--color-2);
}

.no-games {
  text-align: center;
  padding: 32px;
  color: #777;
  font-style: italic;
}
</style>
