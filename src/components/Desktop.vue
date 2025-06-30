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
import {onMounted, onUnmounted, ref, computed} from 'vue';

// Application windows state
const openWindows = ref([]);
const nextZIndex = ref(3);

// Start menu state
const isStartMenuOpen = ref(false);

// Responsive state
const isMobile = ref(false);

// Check if device is mobile
function checkMobile() {
  isMobile.value = window.innerWidth <= 768;
}

// Handle window resize
function handleResize() {
  checkMobile();
}

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
  },
  {
    name: "Discord",
    icon: "/icons/discord.svg",
    url: "https://discord.com/users/334695006663344151"
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

  // Initialize mobile detection
  checkMobile();

  // Add resize event listener
  window.addEventListener('resize', handleResize);
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
    zIndex: nextZIndex.value++
  });
}

function closeApp(appName) {
  const index = openWindows.value.findIndex(window => window.name === appName);
  if (index !== -1) {
    openWindows.value.splice(index, 1);
  }
}

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
        name: "Jeux Vidéo",
        icon: "/icons/games.svg",
        onClick: () => openApp("Jeux Vidéo")
      },
      {
        name: "Spotify",
        icon: "/icons/spotify.svg",
        onClick: () => openApp("Spotify")
      }
    ]
  }
];
</script>

<template>
  <div id="desktop" :class="{ 'mobile': isMobile }">
    <div class="desktop-game-container" v-if="!isMobile">
      <IconShooterGame/>
    </div>

    <div class="desktop-icons-container" :class="{ 'mobile': isMobile }">
      <div v-for="(category, categoryIndex) in desktopIcons" :key="categoryIndex" class="icon-category">
        <h2 class="category-title">{{ category.category }}</h2>
        <div class="icon-grid">
          <div v-for="(item, itemIndex) in category.items" :key="itemIndex">
            <DesktopIcon
                :icon="item.icon"
                :name="item.name"
                :onClick="item.onClick"
                :isMobile="isMobile"
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
        :zIndex="window.zIndex"
        @close="closeApp(window.name)"
    >
      <ProjectsApp v-if="window.name === 'Projets'"/>
      <SkillsApp v-else-if="window.name === 'Compétences'"/>
      <ExperiencesApp v-else-if="window.name === 'Expériences'"/>
      <EducationApp v-else-if="window.name === 'Formation'"/>
      <VideoGamesApp v-else-if="window.name === 'Jeux Vidéo'"/>
      <SpotifyApp v-else-if="window.name === 'Spotify'"/>
      <div v-else class="placeholder-content">
        {{ window.name }} contenu à venir...
      </div>
    </AppWindow>

    <div class="taskbar" :class="{ 'mobile': isMobile }">
      <div class="start-button" @click="toggleStartMenu" :class="{ 'mobile': isMobile }">
        <img alt="Démarrer" src="/icons/start.svg"/>
        <span v-if="!isMobile">Démarrer</span>
      </div>

      <!-- Quick app buttons for mobile -->
      <div v-if="isMobile" class="mobile-quick-apps">
        <div v-for="item in desktopIcons[0].items.slice(0, 4)" :key="item.name" 
             class="mobile-app-button" @click="item.onClick()">
          <img :alt="item.name" :src="item.icon" />
        </div>
      </div>
    </div>

    <div v-if="isStartMenuOpen" class="start-menu" :class="{ 'mobile': isMobile }">
      <div class="start-menu-header">
        <img alt="Démarrer" class="start-menu-logo" src="/icons/start.svg"/>
        <span>Emmanuel ARDOIN</span>
        <button v-if="isMobile" class="start-menu-close" @click="toggleStartMenu">×</button>
      </div>

      <div class="start-menu-content">
        <div class="start-menu-section">
          <h3 class="section-title">Liens Sociaux</h3>
          <div class="menu-items">
            <a v-for="link in socialLinks" :key="link.name" :href="link.url" class="menu-item" 
               :class="{ 'mobile': isMobile }" target="_blank">
              <img :alt="link.name" :src="link.icon" class="menu-item-icon"/>
              <span class="menu-item-name">{{ link.name }}</span>
            </a>
          </div>
        </div>

        <div class="start-menu-section">
          <h3 class="section-title">Applications</h3>
          <div class="menu-items">
            <div v-for="item in desktopIcons[0].items" :key="item.name" class="menu-item"
                 :class="{ 'mobile': isMobile }" @click="item.onClick(); toggleStartMenu()">
              <img :alt="item.name" :src="item.icon" class="menu-item-icon"/>
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

/* Desktop Game Container */
.desktop-game-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none; /* Allow clicks to pass through to desktop icons */
  overflow: hidden;
}

/* Make all game elements clickable */
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
  z-index: 2; /* Higher than the game container's z-index */
  width: auto;
}

/* Mobile desktop icons container */
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

/* Mobile icon category */
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

/* Mobile icon grid */
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

/* Mobile taskbar */
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

/* Mobile start button */
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

.start-button img {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  filter: invert(1);
}

/* Mobile start button icon */
.start-button.mobile img {
  margin-right: 0;
}

.start-button span {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

/* Mobile quick apps */
.mobile-quick-apps {
  display: flex;
  gap: 10px;
}

.mobile-app-button {
  width: 36px;
  height: 36px;
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
  width: 20px;
  height: 20px;
  filter: invert(1);
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

/* Mobile start menu */
.start-menu.mobile {
  bottom: 50px;
  width: 100%;
  height: calc(100% - 50px);
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

/* Mobile start menu header */
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

.start-menu-header span {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

/* Start menu close button for mobile */
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

/* Mobile start menu content */
.start-menu.mobile .start-menu-content {
  padding: 15px;
  max-height: none;
  height: auto;
}

.start-menu-section {
  margin-bottom: 20px;
}

/* Mobile start menu section */
.start-menu.mobile .start-menu-section {
  margin-bottom: 30px;
}

.section-title {
  color: white;
  font-size: 14px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* Mobile section title */
.start-menu.mobile .section-title {
  font-size: 16px;
  margin-bottom: 15px;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* Mobile menu items */
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

/* Mobile menu item */
.menu-item.mobile {
  padding: 12px;
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

/* Mobile menu item icon */
.menu-item.mobile .menu-item-icon {
  width: 24px;
  height: 24px;
  margin-right: 15px;
}

.menu-item-name {
  color: white;
  font-size: 14px;
}

/* Mobile menu item name */
.menu-item.mobile .menu-item-name {
  font-size: 16px;
}
</style>
