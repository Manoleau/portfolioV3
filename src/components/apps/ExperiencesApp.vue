<script setup>
import {ref} from 'vue';
import experiencesData from '@/data/experiences.json';

const activeTab = ref('work');
const experiences = ref(experiencesData);

function setActiveTab(tab) {
  activeTab.value = tab;
}

function formatDate(dateString) {
  if (dateString === 'Present') return 'Present';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short'
  }).format(date);
}

function calculateDuration(startDate, endDate) {
  if (endDate === 'Present') {
    endDate = new Date().toISOString().slice(0, 7);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();

  let years = yearDiff;
  let months = monthDiff;

  if (monthDiff < 0) {
    years--;
    months += 12;
  }

  let result = '';
  if (years > 0) {
    result += `${years} year${years > 1 ? 's' : ''}`;
  }

  if (months > 0) {
    if (result) result += ', ';
    result += `${months} month${months > 1 ? 's' : ''}`;
  }

  return result || 'Less than a month';
}
</script>

<template>
  <div class="experiences-app">
    <div class="tabs">
      <button
          :class="{ active: activeTab === 'work' }"
          class="tab-button"
          @click="setActiveTab('work')"
      >
        Work Experience
      </button>
      <button
          :class="{ active: activeTab === 'volunteer' }"
          class="tab-button"
          @click="setActiveTab('volunteer')"
      >
        Volunteer Experience
      </button>
    </div>

    <div class="experiences-container">
      <div v-if="experiences[activeTab].length === 0" class="no-experiences">
        No experiences to display.
      </div>

      <div v-for="experience in experiences[activeTab]" :key="experience.id" class="experience-card">
        <div class="experience-header">
          <div class="experience-title">
            <h3 class="position">{{ experience.position }}</h3>
            <h4 class="company">{{ activeTab === 'work' ? experience.company : experience.organization }}</h4>
          </div>
          <div class="experience-period">
            <div class="dates">
              {{ formatDate(experience.startDate) }} - {{ formatDate(experience.endDate) }}
            </div>
            <div class="duration">
              {{ calculateDuration(experience.startDate, experience.endDate) }}
            </div>
            <div class="location">{{ experience.location }}</div>
          </div>
        </div>

        <p class="experience-description">{{ experience.description }}</p>

        <div class="experience-responsibilities">
          <h5>Responsibilities:</h5>
          <ul>
            <li v-for="(responsibility, index) in experience.responsibilities" :key="index">
              {{ responsibility }}
            </li>
          </ul>
        </div>

        <div class="experience-technologies">
          <span v-for="(tech, index) in experience.technologies" :key="index" class="tech-tag">
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.experiences-app {
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

.experiences-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 0; /* Force container to respect flex: 1 */
}

.experience-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 20px;
  min-width: 0;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.experience-title {
  flex: 1;
}

.position {
  margin: 0 0 4px 0;
  color: var(--color-1);
  font-size: 18px;
}

.company {
  margin: 0;
  color: var(--color-2);
  font-size: 16px;
  font-weight: normal;
}

.experience-period {
  text-align: right;
  color: #666;
  font-size: 14px;
}

.dates {
  font-weight: bold;
}

.duration {
  font-style: italic;
  margin-top: 4px;
}

.location {
  margin-top: 4px;
}

.experience-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.experience-responsibilities h5 {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #444;
}

.experience-responsibilities ul {
  margin: 0 0 16px 0;
  padding-left: 20px;
}

.experience-responsibilities li {
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

.experience-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  background-color: var(--color-3);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.no-experiences {
  text-align: center;
  padding: 32px;
  color: #777;
  font-style: italic;
}
</style>
