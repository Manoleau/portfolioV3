<script setup>
import {ref} from 'vue';
import projectsData from '@/data/projects.json';

const activeTab = ref('personal');
const projects = ref(projectsData);

function setActiveTab(tab) {
  activeTab.value = tab;
}
</script>

<template>
  <div class="projects-app">
    <div class="tabs">
      <button
          :class="{ active: activeTab === 'personal' }"
          class="tab-button"
          @click="setActiveTab('personal')"
      >
        Projets Personnels
      </button>
      <button
          :class="{ active: activeTab === 'academic' }"
          class="tab-button"
          @click="setActiveTab('academic')"
      >
        Projets Académiques
      </button>
    </div>

    <div class="projects-container">
      <div v-if="projects[activeTab].length === 0" class="no-projects">
        No projects to display.
      </div>

      <div v-for="project in projects[activeTab]" :key="project.id" class="project-card">
        <div class="project-image">
          <img :alt="project.name" :src="project.image" onerror="this.src='/icons/portfolio.svg'">
        </div>
        <div class="project-details">
          <h2 class="project-name">{{ project.name }}</h2>
          <small v-if="project.school">{{ project.school }}</small>
          <small v-if="project.note">Note : {{ project.note }}</small>
          <small v-if="project.classement">Classement : {{ project.classement }} <img
              v-if="project.classement === 'Toute la classe est ensemble (20 personnes)'"
              alt="ggez"
              src="/images/projects/clown-face.svg"
              width="10"/></small>
          <p class="project-description" v-html="project.description"></p>
          <div class="project-technologies">
            <span v-for="(tech, index) in project.technologies" :key="index" class="tech-tag">
              {{ tech }}
            </span>
          </div>
          <div class="project-links">
            <a v-if="project.link" :href="project.link" class="project-link" target="_blank">Voir le projet</a>
            <a v-if="project.github" :href="project.github" class="project-link" target="_blank">GitHub</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-app {
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

.projects-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  min-width: 0;
}

.project-image {
  width: 200px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-details {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.project-name {
  margin: 0 0 8px 0;
  color: var(--color-1);
}

.project-description {
  margin: 5px 0 12px 0;
  font-size: 14px;
  color: #555;
  flex: 1;
}

.project-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tech-tag {
  background-color: var(--color-3);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.project-links {
  display: flex;
  gap: 12px;
}

.project-link {
  text-decoration: none;
  color: var(--color-2);
  font-weight: bold;
  font-size: 14px;
}

.project-link:hover {
  text-decoration: underline;
}

.no-projects {
  text-align: center;
  padding: 32px;
  color: #777;
  font-style: italic;
}
</style>
