<script setup>
import {ref} from 'vue';
import voyageData from '@/data/voyage.json';

const destinations = ref(voyageData);
</script>

<template>
  <div class="voyage-app">
    <div class="voyage-container">
      <div v-if="destinations.length === 0" class="no-destinations">
        Aucune destination à afficher.
      </div>

      <div v-for="destination in destinations" :key="destination.id" class="destination-card">
        <div class="destination-image">
          <img :alt="destination.name" :src="destination.image" onerror="this.src='/icons/travel.svg'">
        </div>
        <div class="destination-details">
          <h3 class="destination-name">{{ destination.name }}</h3>
          <p class="destination-description">{{ destination.description }}</p>
          <p v-if="destination.visited" class="destination-visited">Visité en : {{ destination.visited }}</p>
          <div class="destination-attractions">
            <h4>Attractions:</h4>
            <p>
              {{ destination.attractions.join(' / ') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.voyage-app {
  display: flex;
  flex-direction: column;
}

.voyage-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 0; /* Force container to respect flex: 1 */
}

.destination-card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  min-width: 0;
}

.destination-image {
  height: 150px;
  width: 150px;
  overflow: hidden;
}

.destination-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.destination-details {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.destination-name {
  margin: 0 0 8px 0;
  color: var(--color-1);
}

.destination-visited {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.destination-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #555;
}

.destination-attractions {
  margin-top: auto;
}

.destination-attractions p {
  font-size: 13px;
  padding-left: 20px;
}

.destination-attractions h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--color-2);
}

.no-destinations {
  text-align: center;
  padding: 32px;
  color: #777;
  font-style: italic;
}
</style>