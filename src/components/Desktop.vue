<script setup>
import DesktopIcon from './DesktopIcon.vue';
import AppWindow from './AppWindow.vue';
import ProjectsApp from './apps/ProjectsApp.vue';
import SkillsApp from './apps/SkillsApp.vue';
import ExperiencesApp from './apps/ExperiencesApp.vue';
import EducationApp from './apps/EducationApp.vue';
import HobbiesApp from './apps/HobbiesApp.vue';
import MusicApp from './apps/MusicApp.vue';
import { ref } from 'vue';

// Application windows state
const openWindows = ref([]);
const nextZIndex = ref(1);

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
        name: "Projects",
        icon: "/icons/portfolio.svg",
        onClick: () => openApp("Projects")
      },
      {
        name: "Skills",
        icon: "/icons/html-css.svg",
        onClick: () => openApp("Skills")
      },
      {
        name: "Experiences",
        icon: "/icons/ecommerce.svg",
        onClick: () => openApp("Experiences")
      },
      {
        name: "Education",
        icon: "/icons/blog.svg",
        onClick: () => openApp("Education")
      },
      {
        name: "Hobbies",
        icon: "/icons/photography.svg",
        onClick: () => openApp("Hobbies")
      },
      {
        name: "Music",
        icon: "/icons/music.svg",
        onClick: () => openApp("Music")
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
      <ProjectsApp v-if="window.name === 'Projects'" />
      <SkillsApp v-else-if="window.name === 'Skills'" />
      <ExperiencesApp v-else-if="window.name === 'Experiences'" />
      <EducationApp v-else-if="window.name === 'Education'" />
      <HobbiesApp v-else-if="window.name === 'Hobbies'" />
      <MusicApp v-else-if="window.name === 'Music'" />
      <div v-else class="placeholder-content">
        {{ window.name }} content coming soon...
      </div>
    </AppWindow>
  </div>
</template>

<style scoped>
#desktop {
  background-color: var(--color-3);
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-image: url('/images/wallpaper.svg');
  background-size: cover;
  background-position: center;
}

.desktop-icons-container {
  display: flex;
  padding: 20px;
  flex-wrap: wrap;
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
</style>
