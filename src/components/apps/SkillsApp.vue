<script setup>
import {computed, ref, onMounted, watch} from 'vue';
import skillsData from '@/data/skills.json';

const props = defineProps({
  isReady: {
    type: Boolean,
    default: false
  }
});

const activeTab = ref('technique');
const skills = ref(skillsData);
const sortBy = ref('name');
const activeType = ref('all');
const isInitialLoad = ref(true);
const animateProgressBars = ref(false);
const transitionKey = ref(0); // Add a key to force transition-group re-render

const skillTypes = computed(() => {
  const types = skills.value.technique.map(skill => skill.type);
  return ['all', ...new Set(types)];
});

const displayedSkills = computed(() => {
  let filteredSkills = [...skills.value[activeTab.value]];

  if (activeTab.value === 'technique' && activeType.value !== 'all') {
    filteredSkills = filteredSkills.filter(skill => skill.type === activeType.value);
  }

  return filteredSkills.sort((a, b) => {
    if (sortBy.value === 'level') {
      const levelOrder = {'Confirmé': 3, 'Moyen': 2, 'Débutant': 1};
      return levelOrder[b.level] - levelOrder[a.level];
    } else {
      return a.name.localeCompare(b.name);
    }
  });
});

function setActiveTab(tab) {
  if (tab === activeTab.value) return;

  isInitialLoad.value = false;
  animateProgressBars.value = false;

  // Increment transition key to force complete re-render
  transitionKey.value++;

  // Change tab immediately for better responsiveness
  activeTab.value = tab;
  activeType.value = 'all';

  // Trigger progress bar animations with minimal delay
  requestAnimationFrame(() => {
    animateProgressBars.value = true;
  });
}

function setActiveType(type) {
  if (type === activeType.value) return;

  isInitialLoad.value = false;
  animateProgressBars.value = false;

  // Increment transition key to force complete re-render
  transitionKey.value++;

  // Change type immediately for better responsiveness
  activeType.value = type;

  // Trigger progress bar animations with minimal delay
  requestAnimationFrame(() => {
    animateProgressBars.value = true;
  });
}

function setSortBy(sort) {
  if (sort === sortBy.value) return;

  isInitialLoad.value = false;

  // Increment transition key to force complete re-render
  transitionKey.value++;

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

function startAnimations() {
  requestAnimationFrame(() => {
    animateProgressBars.value = true;
  });
}

onMounted(() => {
  if (props.isReady) {
    startAnimations();
  }
});

watch(() => props.isReady, (newValue) => {
  if (newValue === true) {
    startAnimations();
  }
});

watch(displayedSkills, () => {
  if (!isInitialLoad.value) {
    animateProgressBars.value = true;
  }
});
</script>

<template>
  <div class="skills-app">
    <div class="tabs">
      <button
          :class="{ active: activeTab === 'technique' }"
          class="tab-button"
          @click="setActiveTab('technique')"
      >
        <span class="tab-text">Compétences Techniques</span>
      </button>
      <button
          :class="{ active: activeTab === 'competences' }"
          class="tab-button"
          @click="setActiveTab('competences')"
      >
        <span class="tab-text">Compétences Générales</span>
      </button>
      <button
          :class="{ active: activeTab === 'langues' }"
          class="tab-button"
          @click="setActiveTab('langues')"
      >
        <span class="tab-text">Langues</span>
      </button>
    </div>

    <div class="controls">
      <transition name="fade-slide">
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
      </transition>

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

    <transition-group 
      name="skill-list" 
      tag="div" 
      class="skills-container"
      :key="transitionKey"
    >
      <div v-if="displayedSkills.length === 0" key="no-skills" class="no-skills">
        Aucune compétence à afficher.
      </div>

      <div 
        v-for="(skill, index) in displayedSkills" 
        :key="skill.name" 
        class="skill-card"
      >
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
          <div v-if="activeTab === 'technique'" class="skill-progress-container">
            <div class="skill-progress-bar">
              <div 
                :class="{ 'animate-progress': animateProgressBars }" 
                :data-percentage="getLevelPercentage(skill.level)"
                class="skill-progress"
                :style="{ '--width': getLevelPercentage(skill.level) + '%' }"
              ></div>
            </div>
          </div>
          <p class="skill-description">{{ skill.description }}</p>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
/* Base Styles */
.skills-app {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Tab Styles with Animation */
.tabs {
  display: flex;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
  position: relative;
}

.tab-button {
  padding: 8px 16px;
  background-color: transparent;
  border: none;
  border-right: 1px solid #ddd;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.tab-text {
  position: relative;
  z-index: 2;
  transition: transform 0.3s, color 0.3s;
}

.tab-button:hover .tab-text {
  transform: translateY(-2px);
}

.tab-button:active .tab-text {
  transform: translateY(1px);
}

.tab-button:hover {
  background-color: #e0e0e0;
}

.tab-button.active {
  background-color: white;
  font-weight: bold;
  color: var(--color-2);
}

/* Skills Container with Animation */
.skills-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 0; /* Force container to respect flex: 1 */
  position: relative; /* For absolute positioning during transitions */
}

/* Skill Card Animation */
.skill-card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 16px;
  min-width: 0;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.skill-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.skill-icon {
  width: 48px;
  height: 48px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.skill-card:hover .skill-icon {
  transform: scale(1.1) rotate(5deg);
}

.skill-icon img {
  max-width: 100%;
  max-height: 100%;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s;
}

.skill-card:hover .skill-icon img {
  filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.2));
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
  transition: color 0.3s;
}

.skill-card:hover .skill-name {
  color: var(--color-2);
}

.skill-info {
  overflow: hidden;
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
  transition: background-color 0.3s, transform 0.3s;
}

.skill-card:hover .skill-type {
  background-color: var(--color-2);
  transform: scale(1.05);
}

.skill-level {
  font-size: 14px;
  color: #666;
  font-weight: bold;
  transition: color 0.3s;
}

.skill-card:hover .skill-level {
  color: var(--color-2);
}

/* Progress Bar Animation */
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
  position: relative;
}

.skill-progress {
  height: 100%;
  background-color: var(--color-2);
  border-radius: 4px;
  width: 0;
  transition: width 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.skill-progress.animate-progress {
  width: attr(data-percentage %);
  animation: progressFill 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}

@keyframes progressFill {
  from {
    width: 0;
  }
  to {
    width: var(--width);
  }
}

.skill-progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transform: translateX(-100%);
  animation: progressShine 2s infinite;
  opacity: 0;
}

.skill-card:hover .skill-progress-bar::after {
  opacity: 1;
}

@keyframes progressShine {
  100% {
    transform: translateX(100%);
  }
}

.skill-description {
  margin: 0;
  font-size: 14px;
  color: #555;
  transition: color 0.3s;
}

.skill-card:hover .skill-description {
  color: #333;
}

/* Controls Animation */
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
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.filter-button::after, .sort-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.filter-button:focus:not(:active)::after, .sort-button:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

.filter-button:hover, .sort-button:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.filter-button:active, .sort-button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.filter-button.active, .sort-button.active {
  background-color: var(--color-2);
  color: white;
  border-color: var(--color-2);
  box-shadow: 0 2px 5px rgba(var(--color-2-rgb), 0.3);
}

/* Transition Animations */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Skill List Transitions */
.skill-list-enter-active {
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.skill-list-leave-active {
  transition: all 0.15s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: absolute;
  width: 100%;
}

.skill-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.skill-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.skill-list-move {
  transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.no-skills {
  text-align: center;
  padding: 32px;
  color: #777;
  font-style: italic;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
