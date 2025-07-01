<script setup>
import {computed, ref} from 'vue';
import experiencesData from '@/data/experiences.json';

const activeTab = ref('work');
const experiences = ref(experiencesData);
const sortBy = ref('date');

const displayedExperiences = computed(() => {
  let filteredExperiences = [...experiences.value[activeTab.value]];

  return filteredExperiences.sort((a, b) => {
    if (sortBy.value === 'date') {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB - dateA;
    } else {
      const nameA = activeTab.value === 'work' ? a.company : a.organization;
      const nameB = activeTab.value === 'work' ? b.company : b.organization;
      return nameA.localeCompare(nameB);
    }
  });
});

function setActiveTab(tab) {
  activeTab.value = tab;
}

function setSortBy(sort) {
  sortBy.value = sort;
}

function formatDate(dateString) {
  if (dateString === 'Present' || dateString === 'present') return 'Présent';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date: ${dateString}`);
      return 'Date invalide';
    }
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short'
    }).format(date);
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return 'Date invalide';
  }
}

function calculateDuration(startDate, endDate) {
  try {
    if (endDate === 'Présent' || endDate === 'present') {
      endDate = new Date().toISOString().slice(0, 7);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log('Start: ', start);
    console.log('End: ', end);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error(`Invalid date in calculateDuration: startDate=${startDate}, endDate=${endDate}`);
      return 'Durée indéterminée';
    }

    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();

    let years = yearDiff;
    let months = monthDiff;

    if (monthDiff < 0) {
      years--;
      months += 12;
    }

    if (years < 0 || (years === 0 && months < 0)) {
      console.error(`End date is before start date: startDate=${startDate}, endDate=${endDate}`);
      return 'Durée indéterminée';
    }

    let result = '';
    if (years > 0) {
      result += `${years} ${years > 1 ? 'ans' : 'an'}`;
    }

    if (months > 0) {
      if (result) result += ', ';
      result += `${months} mois`;
    }

    return result || 'Moins d\'un mois';
  } catch (error) {
    console.error(`Error calculating duration: startDate=${startDate}, endDate=${endDate}`, error);
    return 'Durée indéterminée';
  }
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
        Professionel
      </button>
    </div>

    <div class="controls">
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
            :class="{ active: sortBy === 'date' }"
            class="sort-button"
            @click="setSortBy('date')"
        >
          Date
        </button>
      </div>
    </div>

    <div class="experiences-container">
      <div v-if="displayedExperiences.length === 0" class="no-experiences">
        Pas d'experiences
      </div>

      <div v-for="experience in displayedExperiences" :key="experience.id" class="experience-card">
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
          <h5>Responsabilités:</h5>
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

.controls {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
  flex-wrap: wrap;
  gap: 10px;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-button {
  padding: 4px 8px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.sort-button:hover {
  background-color: #f0f0f0;
}

.sort-button.active {
  background-color: var(--color-2);
  color: white;
  border-color: var(--color-2);
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
