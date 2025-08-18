<script setup>
import DesktopIcon from './DesktopIcon.vue';
import AppWindow from './AppWindow.vue';
import ProjectsApp from './apps/ProjectsApp.vue';
import SkillsApp from './apps/SkillsApp.vue';
import ExperiencesApp from './apps/ExperiencesApp.vue';
import EducationApp from './apps/EducationApp.vue';
import VideoGamesApp from './apps/VideoGamesApp.vue';
import IconShooterGame from './apps/IconShooterGame.vue';
import SpotifyApp from './apps/SpotifyApp.vue';
import VoyageApp from './apps/VoyageApp.vue';
import CompetenciesApp from './apps/CompetenciesApp.vue';
import {onMounted, onUnmounted, ref, computed} from 'vue';

const openWindows = ref([]);
const nextZIndex = ref(2000);

const allTaskbarWindows = computed(() => {
  return openWindows.value.map(window => ({
    name: window.name,
    icon: getIconForApp(window.name),
    iconColor: getIconColorForApp(window.name),
    zIndex: window.zIndex
  }));
});

const isStartMenuOpen = ref(false);
const startMenuPage = ref(0);
const itemsPerPage = 6;

const isMobile = ref(false);

const isLoading = ref(true);
const loadingProgress = ref(0);

function checkMobile() {
  isMobile.value = window.innerWidth <= 768;
}

function handleResize() {
  checkMobile();
}

const socialLinks = [
  {
    name: "GitHub",
    icon: "fa-brands fa-github",
    url: "https://github.com/Manoleau"
  },
  {
    name: "LinkedIn",
    icon: "fa-brands fa-linkedin",
    url: "https://www.linkedin.com/in/emmanuel-ardoin-819217251/"
  },
  {
    name: "Discord",
    icon: "fa-brands fa-discord",
    url: "https://discord.com/users/334695006663344151"
  }
];

function toggleStartMenu() {
  isStartMenuOpen.value = !isStartMenuOpen.value;
  if (isStartMenuOpen.value) {
    startMenuPage.value = 0;
  }
}

function nextStartMenuPage() {
  const totalPages = Math.ceil(desktopIcons[0].items.length / itemsPerPage);
  if (startMenuPage.value < totalPages - 1) {
    startMenuPage.value++;
  }
}

function prevStartMenuPage() {
  if (startMenuPage.value > 0) {
    startMenuPage.value--;
  }
}

function getVisibleMenuItems() {
  const start = startMenuPage.value * itemsPerPage;
  const end = start + itemsPerPage;
  return desktopIcons[0].items.slice(start, end);
}

function handleClickOutside(event) {
  if (isStartMenuOpen.value) {
    const startMenu = document.querySelector('.start-menu');
    const startButton = document.querySelector('.start-button');

    if (startMenu && startButton) {
      if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
        isStartMenuOpen.value = false;
      }
    }
  }
}

function simulateLoading() {
  const randomIncrement = () => Math.random() * 15 + 5;
  const interval = setInterval(() => {
    if (loadingProgress.value < 100) {
      const remaining = 100 - loadingProgress.value;
      const increment = Math.min(randomIncrement(), remaining);
      loadingProgress.value += increment;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    }
  }, 400);
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  checkMobile();

  window.addEventListener('resize', handleResize);
  simulateLoading();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});

function openApp(appName) {
  const existingAppIndex = openWindows.value.findIndex(window => window.name === appName);

  if (existingAppIndex !== -1) {
    const app = openWindows.value[existingAppIndex];
    app.zIndex = nextZIndex.value++;
    return;
  }

  openWindows.value.push({
    name: appName,
    zIndex: nextZIndex.value++,
    isReady: false
  });
}


function focusApp(appName) {
  const index = openWindows.value.findIndex(window => window.name === appName);

  if (index !== -1) {
    openWindows.value[index].zIndex = nextZIndex.value++;
  }
}

function closeApp(appName) {
  const index = openWindows.value.findIndex(window => window.name === appName);
  if (index !== -1) {
    openWindows.value.splice(index, 1);
  }
}

function getIconForApp(appName) {
  const app = desktopIcons[0].items.find(item => item.name === appName);
  return app ? app.icon : '';
}

function getIconColorForApp(appName) {
  const app = desktopIcons[0].items.find(item => item.name === appName);
  return app ? app.iconColor : 'white';
}

const desktopIcons = [
  {
    category: "Applications",
    items: [
      {
        name: "Projets",
        icon: "fa-solid fa-folder-open",
        onClick: () => openApp("Projets"),
        iconColor: "#ffc107" // Yellow
      },
      {
        name: "Compétences",
        icon: "fa-solid fa-code",
        onClick: () => openApp("Compétences"),
        iconColor: "#4caf50" // Green
      },
      {
        name: "Compétence BUT Informatique",
        icon: "fa-solid fa-code",
        onClick: () => openApp("Compétence BUT Informatique"),
        iconColor: "#ff5722" // Deep Orange
      },
      {
        name: "Expériences",
        icon: "fa-solid fa-briefcase",
        onClick: () => openApp("Expériences"),
        iconColor: "#2196f3" // Blue
      },
      {
        name: "Formation",
        icon: "fa-solid fa-graduation-cap",
        onClick: () => openApp("Formation"),
        iconColor: "#9c27b0" // Purple
      },
      {
        name: "Jeux Vidéo",
        icon: "fa-solid fa-gamepad",
        onClick: () => openApp("Jeux Vidéo"),
        iconColor: "#e91e63" // Pink
      },
      {
        name: "Spotify",
        icon: "fa-brands fa-spotify",
        onClick: () => openApp("Spotify"),
        iconColor: "#1db954" // Spotify Green
      },
      {
        name: "Voyage",
        icon: "fa-solid fa-plane",
        onClick: () => openApp("Voyage"),
        iconColor: "#03a9f4" // Light Blue
      }
    ]
  }
];
</script>

<template>
  <div v-if="isLoading" class="loading-screen">
    <div class="loading-content">
      <h2>Chargement...</h2>
      <div class="loading-bar-container">
        <div class="loading-bar" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
      <div class="loading-percentage">{{ Math.floor(loadingProgress) }}%</div>
    </div>
  </div>

  <div id="desktop" :class="{ 'mobile': isMobile }" v-show="!isLoading">
    <div v-if="!isMobile" class="desktop-game-container">
      <IconShooterGame/>
    </div>

    <div :class="{ 'mobile': isMobile }" class="desktop-icons-container">
      <div v-for="(category, categoryIndex) in desktopIcons" :key="categoryIndex" class="icon-category">
        <h2 class="category-title">{{ category.category }}</h2>
        <div class="icon-grid">
          <div v-for="(item, itemIndex) in category.items" :key="itemIndex">
            <DesktopIcon
                :icon="item.icon"
                :isMobile="isMobile"
                :name="item.name"
                :onClick="item.onClick"
                :iconColor="item.iconColor"
            />
          </div>
        </div>
      </div>
    </div>

    <AppWindow
        v-for="window in openWindows"
        :key="window.name"
        :isOpen="true"
        :title="window.name"
        :icon="getIconForApp(window.name)"
        :iconColor="getIconColorForApp(window.name)"
        :zIndex="window.zIndex"
        @close="closeApp(window.name)"
        @window-ready="window.isReady = true"
    >
      <ProjectsApp v-if="window.name === 'Projets'"/>
      <SkillsApp v-else-if="window.name === 'Compétences'" :isReady="window.isReady"/>
      <ExperiencesApp v-else-if="window.name === 'Expériences'"/>
      <EducationApp v-else-if="window.name === 'Formation'"/>
      <CompetenciesApp v-else-if="window.name === 'Compétence BUT Informatique'" :isReady="window.isReady"/>
      <VoyageApp v-else-if="window.name === 'Voyage'"/>
      <VideoGamesApp v-else-if="window.name === 'Jeux Vidéo'"/>
      <SpotifyApp v-else-if="window.name === 'Spotify'"/>
      <div v-else class="placeholder-content">
        {{ window.name }} contenu à venir...
      </div>
    </AppWindow>

    <div :class="{ 'mobile': isMobile }" class="taskbar">
      <div :class="{ 'mobile': isMobile }" class="start-button" @click="toggleStartMenu">
        <i class="fa-brands fa-windows"></i>
        <span v-if="!isMobile">Démarrer</span>
      </div>

      <div class="taskbar-apps">
        <div v-for="app in allTaskbarWindows" :key="app.name" 
             class="taskbar-app taskbar-app-active" 
             @click="focusApp(app.name)" 
             :title="app.name">
          <i v-if="app.icon" :class="app.icon" :style="{ color: app.iconColor }"></i>
          <span v-if="!isMobile" class="taskbar-app-name">{{ app.name }}</span>
        </div>
      </div>

      <div v-if="!isMobile" class="taskbar-right">
        <span class="taskbar-copyright">© 2025 Emmanuel Ardoin</span>
      </div>

      <div v-if="isMobile" class="mobile-quick-apps">
        <div v-for="item in desktopIcons[0].items.slice(0, 4)" :key="item.name"
             class="mobile-app-button" @click="item.onClick()">
          <img v-if="!item.icon.includes('fa-')" :alt="item.name" :src="item.icon"/>
          <i v-else :class="item.icon" class="fa-icon"></i>
        </div>
      </div>
    </div>

    <div v-if="isStartMenuOpen" :class="{ 'mobile': isMobile }" class="start-menu">
      <div class="start-menu-header">
        <i class="fa-brands fa-windows start-menu-logo"></i>
        <span>Emmanuel ARDOIN</span>
        <button v-if="isMobile" class="start-menu-close" @click="toggleStartMenu">×</button>
      </div>

      <div class="start-menu-content">
        <div class="start-menu-section">
          <div class="section-header">
            <h3 class="section-title">Liens Sociaux</h3>
          </div>
          <div class="menu-items">
            <a v-for="link in socialLinks" :key="link.name" :class="{ 'mobile': isMobile }" :href="link.url"
               class="menu-item" target="_blank">
              <img v-if="!link.icon.includes('fa-')" :alt="link.name" :src="link.icon" class="menu-item-icon"/>
              <i v-else :class="link.icon" class="menu-item-icon fa-icon"></i>
              <span class="menu-item-name">{{ link.name }}</span>
            </a>
          </div>
        </div>

        <div class="start-menu-section">
          <div class="section-header">
            <h3 class="section-title">Applications</h3>
            <div class="navigation-controls">
              <button class="nav-button" @click="prevStartMenuPage" :disabled="startMenuPage === 0">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <span class="page-indicator">{{ startMenuPage + 1 }}</span>
              <button class="nav-button" @click="nextStartMenuPage" 
                      :disabled="startMenuPage >= Math.ceil(desktopIcons[0].items.length / itemsPerPage) - 1">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div class="menu-items">
            <div v-for="item in getVisibleMenuItems()" :key="item.name" :class="{ 'mobile': isMobile }"
                 class="menu-item" @click="item.onClick(); toggleStartMenu()">
              <img v-if="!item.icon.includes('fa-')" :alt="item.name" :src="item.icon" class="menu-item-icon"/>
              <i v-else :class="item.icon" class="menu-item-icon fa-icon" :style="{ color: item.iconColor }"></i>
              <span class="menu-item-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background-image: url('/images/wallpaper.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.loading-content {
  background-color: rgba(40, 40, 40, 0.9);
  border-radius: 8px;
  padding: 30px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  text-align: center;
  border: 1px solid var(--color-4);
}

.loading-content h2 {
  color: white;
  margin-bottom: 20px;
  font-size: 24px;
  text-shadow: 0 0 10px var(--color-4);
}

.loading-bar-container {
  height: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
}

.loading-bar {
  height: 100%;
  background: linear-gradient(to right, var(--color-1), var(--color-4));
  border-radius: 10px;
  transition: width 0.4s ease-out;
  box-shadow: 0 0 10px var(--color-4);
}

.loading-percentage {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

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

.desktop-game-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.desktop-game-container * {
  pointer-events: auto !important;
}

@keyframes lightSweep {
  0%, 100% {
    left: -150%;
  }
  50% {
    left: 150%;
  }
}


.desktop-icons-container {
  display: inline-flex;
  margin-top: 60px;
  padding-left: 20px;
  position: relative;
  z-index: 2;
  width: auto;
}

.desktop-icons-container.mobile {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
}

.icon-category {
  margin-right: 40px;
  margin-bottom: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.desktop-icons-container.mobile .icon-category {
  margin-right: 0;
  width: 100%;
  box-sizing: border-box;
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

.desktop-icons-container.mobile .icon-grid {
  justify-content: space-between;
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

.taskbar.mobile {
  height: 50px;
  justify-content: space-between;
  padding: 0 5px;
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

.start-button.mobile {
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  justify-content: center;
}

.start-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.start-button img, .start-button i {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  filter: invert(1);
}

.start-button i {
  font-size: 20px;
  color: white;
  filter: none;
}

.start-button.mobile img, .start-button.mobile i {
  margin-right: 0;
}

.start-button.mobile i {
  font-size: 24px;
}

.start-button span {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.taskbar-apps {
  display: flex;
  flex: 1;
  margin: 0 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.taskbar-apps::-webkit-scrollbar {
  display: none;
}

.taskbar-app {
  display: flex;
  align-items: center;
  padding: 3px 15px;
  height: 100%;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  margin-right: 8px;
  border-radius: 5px;
  transition: background-color 0.2s;
  min-width: 70px;
  justify-content: center;
}

.taskbar-app:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.taskbar-app-active {
  background-color: rgba(255, 255, 255, 0.25);
  border-bottom: 4px solid var(--color-4);
}

.taskbar-app i {
  font-size: 20px;
  margin-right: 8px;
}

.taskbar-app-name {
  font-size: 14px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.taskbar-right {
  margin-right: 10px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 12px;
  opacity: 0.8;
}

.taskbar-right .taskbar-copyright {
  white-space: nowrap;
}

.mobile-quick-apps {
  display: flex;
  gap: 10px;
}

.mobile-app-button {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.mobile-app-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.mobile-app-button img {
  width: 24px;
  height: 24px;
  filter: invert(1);
}

.mobile-app-button .fa-icon {
  font-size: 24px;
  color: white;
}

.start-menu {
  position: fixed;
  bottom: 50px;
  left: 0;
  width: 300px;
  background-color: rgba(40, 40, 40, 0.95);
  border-radius: 0 8px 0 0;
  box-shadow: 2px -2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  overflow: hidden;
  animation: slideUp 0.2s ease-out;
}

.start-menu.mobile {
  bottom: 70px;
  width: 100%;
  height: calc(100% - 70px);
  border-radius: 0;
  overflow-y: auto;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.start-menu-header {
  display: flex;
  align-items: center;
  padding: 15px;
  background: linear-gradient(to right, var(--color-1), var(--color-2));
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.start-menu.mobile .start-menu-header {
  justify-content: space-between;
  padding: 15px 20px;
}

.start-menu-logo {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  filter: invert(1);
}

i.start-menu-logo {
  font-size: 24px;
  color: white;
  filter: none;
}

.start-menu-header span {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.start-menu-close {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 24px;
  line-height: 24px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.start-menu-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.start-menu-content {
  padding: 10px;
  max-height: 500px;
  overflow-y: auto;
}

.start-menu.mobile .start-menu-content {
  padding: 15px;
  max-height: none;
  height: auto;
}

.start-menu-section {
  margin-bottom: 20px;
}

.start-menu.mobile .start-menu-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
  color: white;
  font-size: 14px;
  margin: 0;
}

.navigation-controls {
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
}

.nav-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-indicator {
  color: white;
  font-size: 12px;
  min-width: 16px;
  text-align: center;
}

.start-menu.mobile .section-header {
  margin-bottom: 15px;
}

.start-menu.mobile .section-title {
  font-size: 16px;
}

.start-menu.mobile .navigation-controls {
  gap: 8px;
}

.start-menu.mobile .nav-button {
  width: 30px;
  height: 30px;
  font-size: 14px;
}

.start-menu.mobile .page-indicator {
  font-size: 14px;
  min-width: 20px;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.start-menu.mobile .menu-items {
  gap: 10px;
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

.menu-item.mobile {
  padding: 12px;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item-icon {
  height: 18px;
  margin-right: 10px;
  filter: invert(1);
  overflow: hidden;
}

.menu-item-icon.fa-icon {
  font-size: 18px;
  color: white;
  filter: none;
}

.menu-item.mobile .menu-item-icon {
  width: 20px;
  height: 20px;
  margin-right: 15px;
}

.menu-item.mobile .menu-item-icon.fa-icon {
  font-size: 20px;
}

.menu-item-name {
  color: white;
  font-size: 14px;
}

.menu-item.mobile .menu-item-name {
  font-size: 16px;
}
</style>
