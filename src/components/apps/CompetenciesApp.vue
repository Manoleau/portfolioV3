<script setup>
import { ref, onMounted, watch } from 'vue';
import competenciesData from '@/data/competencies.json';

const props = defineProps({
  isReady: {
    type: Boolean,
    default: false
  }
});

const competencies = ref(competenciesData.competencies.map(comp => ({
  ...comp,
  showDetails: false,
  animated: false
})));

const iconsAnimated = ref(false);

// Map color names to CSS color values
const colorMap = {
  red: '#ff5252',
  orange: '#ff9800',
  yellow: '#ffeb3b',
  green: '#4caf50',
  blue: '#2196f3',
  black: '#333333'
};

// Function to get the text color based on background color
function getTextColor(bgColor) {
  // For yellow and light colors, use dark text
  return bgColor === 'yellow' ? '#333333' : '#ffffff';
}

// Toggle details visibility with animation
function toggleDetails(competency) {
  const wasShowing = competency.showDetails;

  // Close all competencies with animation
  competencies.value.forEach(comp => {
    if (comp.showDetails) {
      comp.animated = false;
      // Small delay before hiding to allow animation to complete
      setTimeout(() => {
        comp.showDetails = false;
      }, 300);
    }
  });

  // If the clicked competency wasn't showing before, show it now with animation
  if (!wasShowing) {
    competency.showDetails = true;
    // Small delay to trigger animation after display
    setTimeout(() => {
      competency.animated = true;
    }, 50);
  }
}

// Get animation delay for staggered animations
function getAnimationDelay(index) {
  return `${index * 0.1}s`;
}

// Function to start animations
function startAnimations() {
  // Trigger icon animations
  setTimeout(() => {
    iconsAnimated.value = true;
  }, 300);
}

onMounted(() => {
  // If window is already ready, start animations
  if (props.isReady) {
    startAnimations();
  }
});

// Watch for changes to isReady prop
watch(() => props.isReady, (newValue) => {
  if (newValue === true) {
    startAnimations();
  }
});
</script>

<template>
  <div class="competencies-app">
    <div class="competencies-header">
      <h2 class="animate-title">Compétences BUT Informatique</h2>
      <p class="subtitle animate-subtitle">Parcours Réalisation d'applications</p>
    </div>

    <div class="competencies-container">
      <div v-if="competencies.length === 0" class="no-items">
        Aucune compétence à afficher.
      </div>

      <div class="competencies-icons">
        <div 
          v-for="(competency, index) in competencies" 
          :key="competency.id" 
          class="competency-icon-wrapper"
          :class="{ 'animated': iconsAnimated }"
          :style="{ animationDelay: getAnimationDelay(index) }"
          @click="toggleDetails(competency)"
        >
          <div 
            class="competency-icon" 
            :style="{ borderColor: colorMap[competency.color] }"
            :class="{ 'pulse': competency.showDetails }"
          >
            <i 
              :class="competency.icon" 
              class="icon-image" 
              :style="{ color: colorMap[competency.color] }"
            ></i>
          </div>
          <div class="competency-icon-title" :style="{ color: colorMap[competency.color] }">
            {{ competency.title.split(' ')[0] }}
          </div>
        </div>
      </div>

      <div 
        v-for="competency in competencies" 
        :key="`card-${competency.id}`" 
        class="competency-card" 
        :class="{ 'animated': competency.animated }"
        :style="{ 
          borderColor: colorMap[competency.color], 
          display: competency.showDetails ? 'flex' : 'none' 
        }"
      >
        <div 
          class="competency-header" 
          :style="{ backgroundColor: colorMap[competency.color], color: getTextColor(competency.color) }"
        >
          <h3 class="competency-title">{{ competency.title }}</h3>
          <button 
            class="close-button" 
            @click="toggleDetails(competency)"
          >×</button>
        </div>

        <div class="competency-content">
          <p class="competency-description">{{ competency.description }}</p>

          <div class="situations-section">
            <h4>Situations professionnelles :</h4>
            <ul class="situations-list">
              <li 
                v-for="(situation, index) in competency.situations" 
                :key="index"
                :style="{ animationDelay: getAnimationDelay(index + 2) }"
                class="situation-item"
              >
                {{ situation }}
              </li>
            </ul>
          </div>

          <div class="levels-section" v-if="competency.levels && competency.levels.length > 0">
            <h4>Niveaux de compétence :</h4>
            <div class="levels-list">
              <div 
                v-for="(level, levelIndex) in competency.levels" 
                :key="level.number" 
                class="level-item"
                :style="{ 
                  borderColor: colorMap[competency.color],
                  animationDelay: getAnimationDelay(levelIndex + competency.situations.length + 2)
                }"
              >
                <div 
                  class="level-header" 
                  :style="{ backgroundColor: colorMap[competency.color], color: getTextColor(competency.color) }"
                >
                  Niveau {{ level.number }}
                  <span v-if="level.acquired" class="level-status">✓ Acquis</span>
                </div>
                <div class="level-description">{{ level.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Base Styles */
.competencies-app {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* Header Animations */
.competencies-header {
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #ddd;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.competencies-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--color-2), transparent);
  transform: translateX(-100%);
  animation: headerLine 2s ease-in-out forwards;
}

@keyframes headerLine {
  to {
    transform: translateX(100%);
  }
}

.animate-title {
  margin: 0 0 8px 0;
  color: var(--color-1);
  font-size: 22px;
  animation: fadeInDown 0.8s ease-out forwards;
  opacity: 0;
}

.animate-subtitle {
  margin: 0;
  color: var(--color-2);
  font-size: 16px;
  font-style: italic;
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Container Layout */
.competencies-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* Competency Icons Animation */
.competencies-icons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.competency-icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 120px;
  margin: 0 10px;
  opacity: 0;
  transform: translateY(20px);
}

.competency-icon-wrapper.animated {
  animation: iconFadeIn 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}

@keyframes iconFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.competency-icon-wrapper:hover {
  transform: scale(1.1) translateY(-5px);
}

.competency-icon {
  width: 70px;
  height: 70px;
  border: 3px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  margin-bottom: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.competency-icon::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.competency-icon-wrapper:hover .competency-icon::after {
  opacity: 1;
}

.competency-icon.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--color-2-rgb), 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--color-2-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--color-2-rgb), 0);
  }
}

.icon-image {
  font-size: 30px;
  color: inherit;
  transition: transform 0.3s ease;
}

.competency-icon-wrapper:hover .icon-image {
  transform: scale(1.2);
}

.competency-icon-title {
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  transition: color 0.3s;
}

.competency-icon-wrapper:hover .competency-icon-title {
  text-shadow: 0 0 5px rgba(var(--color-2-rgb), 0.5);
}

/* Competency Card Animation */
.competency-card {
  display: flex;
  flex-direction: column;
  border: 3px solid;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  opacity: 0;
  transform: scale(0.95);
}

.competency-card.animated {
  animation: cardAppear 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}

@keyframes cardAppear {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.competency-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.competency-header {
  padding: 12px 16px;
  overflow: visible;
  display: flex;
  align-items: center;
  position: relative;
}

.competency-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s ease-out;
}

.competency-card.animated .competency-header::after {
  transform: scaleX(1);
}

.competency-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  opacity: 0;
  transform: translateX(-10px);
  animation: slideInRight 0.5s ease-out 0.2s forwards;
}

@keyframes slideInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.close-button {
  background: none;
  border: none;
  color: inherit;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  margin-left: auto;
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* Content Animations */
.competency-content {
  padding: 16px;
  flex: 1;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);
}

.competency-content::-webkit-scrollbar {
  width: 8px;
}

.competency-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.competency-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.competency-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.competency-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  opacity: 0;
  animation: fadeIn 0.5s ease-out 0.3s forwards;
}

.situations-section h4, .levels-section h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #444;
  opacity: 0;
  animation: fadeIn 0.5s ease-out 0.4s forwards;
  position: relative;
}

.situations-section h4::after, .levels-section h4::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 50px;
  height: 2px;
  background-color: var(--color-2);
  transform: scaleX(0);
  transform-origin: left;
  animation: lineGrow 0.5s ease-out 0.6s forwards;
}

@keyframes lineGrow {
  to {
    transform: scaleX(1);
  }
}

.situations-list {
  margin: 0;
  padding-left: 20px;
}

.situation-item {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  opacity: 0;
  transform: translateX(-10px);
  animation: slideInRight 0.5s ease-out forwards;
}

.levels-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.level-item {
  border: 2px solid;
  border-radius: 6px;
  overflow: hidden;
  background-color: white;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.5s ease-out forwards;
  transition: all 0.3s ease;
}

.level-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.level-header {
  padding: 8px 12px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s;
}

.level-status {
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.level-item:hover .level-status {
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

.level-description {
  padding: 10px 12px;
  font-size: 14px;
  color: #333;
  transition: color 0.3s;
}

.level-item:hover .level-description {
  color: #000;
}

.no-items {
  grid-column: 1 / -1;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .competencies-container {
    grid-template-columns: 1fr;
  }

  .competencies-icons {
    gap: 10px;
  }

  .competency-icon-wrapper {
    width: 80px;
  }

  .competency-icon {
    width: 60px;
    height: 60px;
  }

  .icon-image {
    font-size: 24px;
  }

  .competency-content {
    max-height: 300px;
  }
}
</style>
