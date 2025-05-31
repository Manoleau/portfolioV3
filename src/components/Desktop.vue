<script setup>
import DesktopIcon from './DesktopIcon.vue';
import AppWindow from './AppWindow.vue';
import ProjectsApp from './apps/ProjectsApp.vue';
import SkillsApp from './apps/SkillsApp.vue';
import ExperiencesApp from './apps/ExperiencesApp.vue';
import EducationApp from './apps/EducationApp.vue';
import HobbiesApp from './apps/HobbiesApp.vue';
import MusicApp from './apps/MusicApp.vue';
import VideoGamesApp from './apps/VideoGamesApp.vue';
import { ref, onMounted, onUnmounted } from 'vue';

// Application windows state
const openWindows = ref([]);
const nextZIndex = ref(1);

// Start menu state
const isStartMenuOpen = ref(false);

// Social links
const socialLinks = [
  {
    name: "GitHub",
    icon: "/icons/github.svg",
    url: "https://github.com/Manoleau"
  },
  {
    name: "LinkedIn",
    icon: "/icons/linkedin.svg",
    url: "https://www.linkedin.com/in/emmanuel-ardoin-819217251/"
  }
];

// Toggle start menu
function toggleStartMenu() {
  isStartMenuOpen.value = !isStartMenuOpen.value;
}

// Close start menu when clicking outside
function handleClickOutside(event) {
  if (isStartMenuOpen.value) {
    // Check if click is outside the start menu and not on the start button
    const startMenu = document.querySelector('.start-menu');
    const startButton = document.querySelector('.start-button');

    if (startMenu && startButton) {
      if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
        isStartMenuOpen.value = false;
      }
    }
  }
}

// Add and remove event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Function to open an application window
function openApp(appName) {
  // Check if the app is already open
  const existingAppIndex = openWindows.value.findIndex(window => window.name === appName);

  if (existingAppIndex !== -1) {
    // If app is already open, bring it to front
    const app = openWindows.value[existingAppIndex];
    app.zIndex = nextZIndex.value++;
    return;
  }

  // Add new window
  openWindows.value.push({
    name: appName,
    zIndex: nextZIndex.value++
  });
}

// Function to close an application window
function closeApp(appName) {
  const index = openWindows.value.findIndex(window => window.name === appName);
  if (index !== -1) {
    openWindows.value.splice(index, 1);
  }
}

// Desktop icons configuration
const desktopIcons = [
  {
    category: "Applications",
    items: [
      {
        name: "Projets",
        icon: "/icons/portfolio.svg",
        onClick: () => openApp("Projets")
      },
      {
        name: "Compétences",
        icon: "/icons/html-css.svg",
        onClick: () => openApp("Compétences")
      },
      {
        name: "Expériences",
        icon: "/icons/ecommerce.svg",
        onClick: () => openApp("Expériences")
      },
      {
        name: "Formation",
        icon: "/icons/blog.svg",
        onClick: () => openApp("Formation")
      },
      {
        name: "Loisirs",
        icon: "/icons/photography.svg",
        onClick: () => openApp("Loisirs")
      },
      {
        name: "Musique",
        icon: "/icons/music.svg",
        onClick: () => openApp("Musique")
      },
      {
        name: "Jeux Vidéo",
        icon: "/icons/games.svg",
        onClick: () => openApp("Jeux Vidéo")
      }
    ]
  }
];
</script>

<template>
  <div id="desktop">
    <!-- Desktop Icons -->
    <div class="desktop-icons-container">
      <div v-for="(category, categoryIndex) in desktopIcons" :key="categoryIndex" class="icon-category">
        <h2 class="category-title">{{ category.category }}</h2>
        <div class="icon-grid">
          <div v-for="(item, itemIndex) in category.items" :key="itemIndex">
            <DesktopIcon 
              :name="item.name" 
              :icon="item.icon" 
              :onClick="item.onClick" 
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Application Windows -->
    <AppWindow 
      v-for="window in openWindows" 
      :key="window.name"
      :title="window.name"
      :isOpen="true"
      :zIndex="window.zIndex"
      @close="closeApp(window.name)"
    >
      <!-- Dynamic component based on window type -->
      <ProjectsApp v-if="window.name === 'Projets'" />
      <SkillsApp v-else-if="window.name === 'Compétences'" />
      <ExperiencesApp v-else-if="window.name === 'Expériences'" />
      <EducationApp v-else-if="window.name === 'Formation'" />
      <HobbiesApp v-else-if="window.name === 'Loisirs'" />
      <MusicApp v-else-if="window.name === 'Musique'" />
      <VideoGamesApp v-else-if="window.name === 'Jeux Vidéo'" />
      <div v-else class="placeholder-content">
        {{ window.name }} contenu à venir...
      </div>
    </AppWindow>

    <!-- Taskbar -->
    <div class="taskbar">
      <div class="start-button" @click="toggleStartMenu">
        <img src="/icons/start.svg" alt="Démarrer" />
        <span>Démarrer</span>
      </div>
    </div>

    <!-- Start Menu -->
    <div v-if="isStartMenuOpen" class="start-menu">
      <div class="start-menu-header">
        <img src="/icons/start.svg" alt="Démarrer" class="start-menu-logo" />
        <span>Menu Portfolio</span>
      </div>

      <div class="start-menu-content">
        <!-- Social Links Section -->
        <div class="start-menu-section">
          <h3 class="section-title">Liens Sociaux</h3>
          <div class="menu-items">
            <a v-for="link in socialLinks" :key="link.name" :href="link.url" target="_blank" class="menu-item">
              <img :src="link.icon" :alt="link.name" class="menu-item-icon" />
              <span class="menu-item-name">{{ link.name }}</span>
            </a>
          </div>
        </div>

        <!-- Applications Section -->
        <div class="start-menu-section">
          <h3 class="section-title">Applications</h3>
          <div class="menu-items">
            <div v-for="item in desktopIcons[0].items" :key="item.name" class="menu-item" @click="item.onClick(); toggleStartMenu()">
              <img :src="item.icon" :alt="item.name" class="menu-item-icon" />
              <span class="menu-item-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#desktop {
  background-color: #000;
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background-image: url('/images/wallpaper.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#desktop::after {
  content: "";
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.25) 50%,
      transparent 100%
  );
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  transform: skewX(-20deg);
  animation: lightSweep 8s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes lightSweep {
  0%, 100% { left: -150%; }
  50% { left: 150%; }
}


.desktop-icons-container {
  display: flex;
  padding: 20px;
  flex-wrap: wrap;
  padding-bottom: 60px; /* Make room for taskbar */
}

.icon-category {
  margin-right: 40px;
  margin-bottom: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.category-title {
  color: white;
  font-size: 18px;
  margin-bottom: 15px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid var(--color-4);
  padding-bottom: 5px;
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.placeholder-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  color: #666;
  font-style: italic;
}

/* Taskbar Styles */
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: linear-gradient(to bottom, var(--color-2), var(--color-1));
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.start-button {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.start-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.start-button img {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  filter: invert(1);
}

.start-button span {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

/* Start Menu Styles */
.start-menu {
  position: fixed;
  bottom: 40px;
  left: 0;
  width: 300px;
  background-color: rgba(40, 40, 40, 0.95);
  border-radius: 0 8px 0 0;
  box-shadow: 2px -2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  overflow: hidden;
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.start-menu-header {
  display: flex;
  align-items: center;
  padding: 15px;
  background: linear-gradient(to right, var(--color-1), var(--color-2));
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.start-menu-logo {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  filter: invert(1);
}

.start-menu-header span {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.start-menu-content {
  padding: 10px;
  max-height: 500px;
  overflow-y: auto;
}

.start-menu-section {
  margin-bottom: 20px;
}

.section-title {
  color: white;
  font-size: 14px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  filter: invert(1);
}

.menu-item-name {
  color: white;
  font-size: 14px;
}
</style>
