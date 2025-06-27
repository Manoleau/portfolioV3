<script setup>
import {computed, ref} from 'vue';
import skillsData from '@/data/skills.json';

const activeTab = ref('technique');
const skills = ref(skillsData);
const sortBy = ref('name'); // Default sort by name
const activeType = ref('all'); // For filtering technique skills by type

// Get unique types from technical skills
const skillTypes = computed(() => {
  const types = skills.value.technique.map(skill => skill.type);
  return ['all', ...new Set(types)];
});

// Sorted and filtered skills
const displayedSkills = computed(() => {
  let filteredSkills = [...skills.value[activeTab.value]];

  // Filter by type if we're on the technique tab
  if (activeTab.value === 'technique' && activeType.value !== 'all') {
    filteredSkills = filteredSkills.filter(skill => skill.type === activeType.value);
  }

  // Sort skills
  return filteredSkills.sort((a, b) => {
    if (sortBy.value === 'level') {
      // Sort by level (Confirmé > Moyen > Débutant)
      const levelOrder = {'Confirmé': 3, 'Moyen': 2, 'Débutant': 1};
      return levelOrder[b.level] - levelOrder[a.level];
    } else {
      // Sort by name alphabetically
      return a.name.localeCompare(b.name);
    }
  });
});

function setActiveTab(tab) {
  activeTab.value = tab;
  // Reset type filter when changing tabs
  activeType.value = 'all';
}

function setActiveType(type) {
  activeType.value = type;
}

function setSortBy(sort) {
  sortBy.value = sort;
}

function getLevelPercentage(level) {
  switch (level) {
    case 'Débutant':
      return 33;
    case 'Moyen':
      return 66;
    case 'Confirmé':
      return 100;
    default:
      return 0;
  }
}
</script>

<template>
  <div class="skills-app">
    <div class="tabs">
      <button
          :class="{ active: activeTab === 'technique' }"
          class="tab-button"
          @click="setActiveTab('technique')"
      >
        Compétences Techniques
      </button>
      <button
          :class="{ active: activeTab === 'competences' }"
          class="tab-button"
          @click="setActiveTab('competences')"
      >
        Compétences Générales
      </button>
      <button
          :class="{ active: activeTab === 'langues' }"
          class="tab-button"
          @click="setActiveTab('langues')"
      >
        Langues
      </button>
    </div>

    <div class="controls">
      <!-- Type filter for technical skills -->
      <div v-if="activeTab === 'technique'" class="type-filter">
        <span>Type:</span>
        <button
            v-for="type in skillTypes"
            :key="type"
            :class="{ active: activeType === type }"
            class="filter-button"
            @click="setActiveType(type)"
        >
          {{ type === 'all' ? 'Tous' : type }}
        </button>
      </div>

      <!-- Sort controls for all tabs -->
      <div class="sort-controls">
        <span>Trier par:</span>
        <button
            :class="{ active: sortBy === 'name' }"
            class="sort-button"
            @click="setSortBy('name')"
        >
          Nom
        </button>
        <button
            :class="{ active: sortBy === 'level' }"
            class="sort-button"
            @click="setSortBy('level')"
        >
          Niveau
        </button>
      </div>
    </div>

    <div class="skills-container">
      <div v-if="displayedSkills.length === 0" class="no-skills">
        Aucune compétence à afficher.
      </div>

      <div v-for="skill in displayedSkills" :key="skill.name" class="skill-card">
        <div v-if="skill.icon" class="skill-icon">
          <img :alt="skill.name" :src="skill.icon">
        </div>
        <div class="skill-details">
          <div class="skill-header">
            <h3 class="skill-name">{{ skill.name }}</h3>
            <div class="skill-info">
              <span v-if="activeTab === 'technique'" class="skill-type">{{ skill.type }}</span>
              <span class="skill-level">{{ skill.level }}</span>
            </div>
          </div>
          <div class="skill-progress-container">
            <div class="skill-progress-bar">
              <div :style="{ width: `${getLevelPercentage(skill.level)}%` }" class="skill-progress"></div>
            </div>
          </div>
          <p class="skill-description">{{ skill.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skills-app {
  width: 100%;
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

.skills-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 0; /* Force container to respect flex: 1 */
}

.skill-card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 16px;
  min-width: 0;
}

.skill-icon {
  width: 48px;
  height: 48px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-icon img {
  max-width: 100%;
  max-height: 100%;
}

.skill-details {
  flex: 1;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.skill-name {
  margin: 0;
  color: var(--color-1);
}

.skill-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.skill-type {
  font-size: 12px;
  color: white;
  background-color: var(--color-1);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: normal;
}

.skill-level {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}

.skill-progress-container {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.skill-progress-bar {
  flex: 1;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 8px;
}

.skill-progress {
  height: 100%;
  background-color: var(--color-2);
  border-radius: 4px;
}

.skill-description {
  margin: 0;
  font-size: 14px;
  color: #555;
}

.controls {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
  flex-wrap: wrap;
  gap: 10px;
}

.type-filter, .sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-button, .sort-button {
  padding: 4px 8px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.filter-button:hover, .sort-button:hover {
  background-color: #f0f0f0;
}

.filter-button.active, .sort-button.active {
  background-color: var(--color-2);
  color: white;
  border-color: var(--color-2);
}

.no-skills {
  text-align: center;
  padding: 32px;
  color: #777;
  font-style: italic;
}
</style>
