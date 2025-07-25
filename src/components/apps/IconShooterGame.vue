<script setup>
import {onMounted, onUnmounted, ref} from 'vue';

const score = ref(0);
const icons = ref([]);
const gameActive = ref(true);
const gameSpeed = ref(2);
const spawnRate = ref(1500);
let gameLoop = null;
let spawnInterval = null;
let wasActive = true;

onMounted(() => {
  const savedScore = localStorage.getItem('iconShooterScore');
  if (savedScore) {
    score.value = parseInt(savedScore);
  }

  startGame();

  document.addEventListener('mousedown', handleGlobalClick);
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  stopGame();

  document.removeEventListener('mousedown', handleGlobalClick);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});

function handleGlobalClick(event) {
  const iconElement = event.target.closest('.game-icon');
  if (iconElement) {
    const iconId = iconElement.dataset.iconId;
    if (iconId) {
      destroyIcon(parseFloat(iconId));
      event.stopPropagation();
    }
  }

  const resetButton = event.target.closest('.reset-button');
  if (resetButton) {
    resetScore();
    event.stopPropagation();
  }
}

function startGame() {
  if (gameActive.value) {
    spawnInterval = setInterval(spawnIcon, spawnRate.value);

    gameLoop = setInterval(updateGame, 16);
  }
}

function stopGame() {
  clearInterval(gameLoop);
  clearInterval(spawnInterval);
  gameLoop = null;
  spawnInterval = null;
}

function spawnIcon() {
  const iconTypes = [
    '/icons/github.svg',
    '/icons/linkedin.svg',
    '/icons/discord.svg',
    '/icons/html-css.svg',
    '/icons/portfolio.svg',
    '/icons/blog.svg',
    '/icons/games.svg',
    '/icons/ecommerce.svg'
  ];

  const randomIcon = iconTypes[Math.floor(Math.random() * iconTypes.length)];
  const gameContainer = document.querySelector('.game-container');

  if (gameContainer) {
    const containerHeight = gameContainer.clientHeight;

    icons.value.push({
      id: Date.now() + Math.random(),
      icon: randomIcon,
      x: -50,
      y: Math.random() * (containerHeight - 50),
      speed: gameSpeed.value + (Math.random() * 2)
    });
  }
}

function updateGame() {
  icons.value.forEach((icon, index) => {
    icon.x += icon.speed;

    if (icon.x > window.innerWidth) {
      icons.value.splice(index, 1);
    }
  });
}

function destroyIcon(iconId) {
  const iconIndex = icons.value.findIndex(icon => icon.id === iconId);

  if (iconIndex !== -1) {
    icons.value.splice(iconIndex, 1);

    score.value++;

    localStorage.setItem('iconShooterScore', score.value.toString());
  }
}

function resetScore() {
  score.value = 0;
  localStorage.setItem('iconShooterScore', '0');
}

function handleVisibilityChange() {
  if (document.hidden) {
    wasActive = gameActive.value;
    if (gameActive.value) {
      stopGame();
    }
  } else {
    icons.value = [];

    if (wasActive && gameActive.value) {
      startGame();
    }
  }
}
</script>

<template>
  <div class="icon-shooter-game">
    <div class="game-header">
      <div class="score-container">
        <span class="score-label">Score:</span>
        <span class="score-value">{{ score }}</span>
        <button class="reset-button">Reset</button>
      </div>
    </div>

    <div class="game-container">
      <div
          v-for="icon in icons"
          :key="icon.id"
          :data-icon-id="icon.id"
          :style="{ left: icon.x + 'px', top: icon.y + 'px' }"
          class="game-icon"
      >
        <a href="javascript:void(0)">
          <img :src="icon.icon" alt="Game Icon" unselectable="on"/>
        </a>
      </div>
    </div>

  </div>
</template>

<style scoped>
.icon-shooter-game {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #f0f0f0;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: var(--color-1);
  color: white;
}

.game-header h2 {
  margin: 0;
  font-size: 20px;
}

.score-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-label {
  font-weight: bold;
}

.score-value {
  font-size: 20px;
  font-weight: bold;
}

.reset-button {
  padding: 5px 10px;
  background-color: var(--color-2);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: var(--color-3);
}

.game-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #000;
  background-image: url('/images/wallpaper.svg');
  background-size: cover;
  background-position: center;
}

.game-icon {
  position: absolute;
  width: 40px;
  height: 40px;
  transition: transform 0.1s;
}

.game-icon:hover {
  transform: scale(1.1);
}

.game-icon img {
  width: 100%;
  height: 100%;
  filter: invert(1);
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>
