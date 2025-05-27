<script setup>
import { ref } from 'vue';
import skillsData from '@/data/skills.json';

const activeTab = ref('technical');
const skills = ref(skillsData);

function setActiveTab(tab) {
  activeTab.value = tab;
}
</script>

<template>
  <div class="skills-app">
    <div class="tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'technical' }" 
        @click="setActiveTab('technical')"
      >
        Technical Skills
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'soft' }" 
        @click="setActiveTab('soft')"
      >
        Soft Skills
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'languages' }" 
        @click="setActiveTab('languages')"
      >
        Languages
      </button>
    </div>

    <div class="skills-container">
      <div v-if="skills[activeTab].length === 0" class="no-skills">
        No skills to display.
      </div>

      <div v-for="skill in skills[activeTab]" :key="skill.name" class="skill-card">
        <div v-if="skill.icon" class="skill-icon">
          <img :src="skill.icon" :alt="skill.name">
        </div>
        <div class="skill-details">
          <div class="skill-header">
            <h3 class="skill-name">{{ skill.name }}</h3>
            <div class="skill-years">{{ skill.years }} years</div>
          </div>
          <div class="skill-progress-container">
            <div class="skill-progress-bar">
              <div class="skill-progress" :style="{ width: `${skill.level}%` }"></div>
            </div>
            <div class="skill-level">{{ skill.level }}%</div>
          </div>
          <p class="skill-description">{{ skill.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skills-app {
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

.skills-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  width: 100%;
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

.skill-years {
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

.skill-level {
  font-size: 14px;
  font-weight: bold;
  color: var(--color-2);
  width: 40px;
  text-align: right;
}

.skill-description {
  margin: 0;
  font-size: 14px;
  color: #555;
}

.no-skills {
  text-align: center;
  padding: 32px;
  color: #777;
  font-style: italic;
}
</style>
