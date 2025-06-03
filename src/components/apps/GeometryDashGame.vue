<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Game state
const score = ref(0);
const highScore = ref(0);
const gameActive = ref(true);
const isJumping = ref(false);
const isDead = ref(false);
const obstacles = ref([]);
const gameSpeed = ref(5); // Base speed of the game
const obstacleSpawnRate = ref(1500); // Time in ms between obstacle spawns
let gameLoop = null;
let spawnInterval = null;
let jumpTimeout = null;

// Character position
const characterPosition = ref({
  x: 100, // Fixed x position
  y: 0,   // y position (0 = ground, negative = in the air)
  width: 30,
  height: 30
});

// Load saved high score from localStorage on component mount
onMounted(() => {
  const savedHighScore = localStorage.getItem('geometryDashHighScore');
  if (savedHighScore) {
    highScore.value = parseInt(savedHighScore);
  }

  startGame();

  // Add event listeners for controls
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('click', handleClick);
});

// Clean up intervals and event listeners when component is unmounted
onUnmounted(() => {
  stopGame();
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('click', handleClick);
});

// Handle keyboard controls
function handleKeyDown(event) {
  if ((event.code === 'Space' || event.code === 'ArrowUp') && gameActive.value && !isDead.value) {
    jump();
    event.preventDefault();
  } else if (event.code === 'KeyR' && isDead.value) {
    resetGame();
  }
}

// Handle mouse click
function handleClick(event) {
  // Check if the click is within the game container
  const gameContainer = document.querySelector('.geometry-dash-container');
  if (gameContainer && gameContainer.contains(event.target)) {
    if (gameActive.value && !isDead.value) {
      jump();
    } else if (isDead.value) {
      resetGame();
    }
    event.stopPropagation(); // Prevent event from bubbling up
  }
}

// Start the game
function startGame() {
  if (gameActive.value) {
    // Reset character position
    characterPosition.value.y = 0;

    // Start spawning obstacles
    spawnInterval = setInterval(spawnObstacle, obstacleSpawnRate.value);

    // Start game loop
    gameLoop = setInterval(updateGame, 16); // ~60fps
  }
}

// Stop the game
function stopGame() {
  clearInterval(gameLoop);
  clearInterval(spawnInterval);
  clearTimeout(jumpTimeout);
}

// Reset the game after death
function resetGame() {
  isDead.value = false;
  score.value = 0;
  obstacles.value = [];
  characterPosition.value.y = 0;
  isJumping.value = false;
  startGame();
}

// Make the character jump
function jump() {
  if (!isJumping.value) {
    isJumping.value = true;

    // Jump animation using setTimeout
    let jumpHeight = 0;
    const jumpUp = () => {
      jumpHeight += 5;
      characterPosition.value.y = -jumpHeight;

      if (jumpHeight < 150) { // Maximum jump height
        jumpTimeout = setTimeout(jumpUp, 16);
      } else {
        // Start falling
        const fallDown = () => {
          jumpHeight -= 5;
          characterPosition.value.y = -jumpHeight;

          if (jumpHeight > 0) {
            jumpTimeout = setTimeout(fallDown, 16);
          } else {
            // Landed
            characterPosition.value.y = 0;
            isJumping.value = false;
          }
        };
        jumpTimeout = setTimeout(fallDown, 16);
      }
    };

    jumpTimeout = setTimeout(jumpUp, 16);
  }
}

// Spawn a new obstacle
function spawnObstacle() {
  const gameContainer = document.querySelector('.geometry-dash-container');

  if (gameContainer) {
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;
    const groundY = containerHeight - 50; // Ground position

    // Random obstacle height (small, medium, large)
    const heights = [30, 50, 70];
    const height = heights[Math.floor(Math.random() * heights.length)];

    obstacles.value.push({
      id: Date.now() + Math.random(),
      x: containerWidth, // Start from the right edge
      y: groundY - height, // Position on the ground
      width: 30,
      height: height
    });
  }
}

// Update game state
function updateGame() {
  if (isDead.value) return;

  // Increase score
  score.value += 1;

  // Update obstacles position
  obstacles.value.forEach((obstacle, index) => {
    obstacle.x -= gameSpeed.value;

    // Remove obstacles that are off-screen
    if (obstacle.x < -50) {
      obstacles.value.splice(index, 1);
    }

    // Check collision
    if (checkCollision(characterPosition.value, obstacle)) {
      handleDeath();
    }
  });
}

// Check collision between character and obstacle
function checkCollision(character, obstacle) {
  const gameContainer = document.querySelector('.geometry-dash-container');
  if (!gameContainer) return false;

  const containerHeight = gameContainer.clientHeight;
  const groundY = containerHeight - 50; // Ground position

  // Character position adjusted for the ground with reduced hitbox (80% of original size)
  const hitboxReduction = 0.2; // 20% reduction
  const charWidth = character.width * (1 - hitboxReduction);
  const charHeight = character.height * (1 - hitboxReduction);
  const charX = character.x + (character.width - charWidth) / 2; // Center the reduced hitbox
  const charY = groundY + character.y + (character.height - charHeight) / 2; // character.y is negative when jumping
  const charRight = charX + charWidth;
  const charBottom = charY + charHeight;

  // Obstacle position
  const obsX = obstacle.x;
  const obsY = obstacle.y;
  const obsRight = obsX + obstacle.width;
  const obsBottom = obsY + obstacle.height;

  // Check for overlap
  return (
    charRight > obsX &&
    charX < obsRight &&
    charBottom > obsY &&
    charY < obsBottom
  );
}

// Handle character death
function handleDeath() {
  isDead.value = true;
  stopGame();

  // Update high score if needed
  if (score.value > highScore.value) {
    highScore.value = score.value;
    localStorage.setItem('geometryDashHighScore', highScore.value.toString());
  }
}
</script>

<template>
  <div class="geometry-dash-game">
    <div class="game-header">
      <div class="score-container">
        <span class="score-label">Score:</span>
        <span class="score-value">{{ score }}</span>
      </div>
      <div class="high-score-container">
        <span class="high-score-label">High Score:</span>
        <span class="high-score-value">{{ highScore }}</span>
      </div>
    </div>

    <div class="geometry-dash-container">
      <!-- Character -->
      <div 
        class="character"
        :class="{ 'jumping': isJumping, 'dead': isDead }"
        :style="{ 
          bottom: `calc(50px - ${characterPosition.y}px)`,
          width: `${characterPosition.width}px`,
          height: `${characterPosition.height}px`
        }"
      ></div>

      <!-- Ground -->
      <div class="ground"></div>

      <!-- Obstacles -->
      <div 
        v-for="obstacle in obstacles" 
        :key="obstacle.id" 
        class="obstacle"
        :style="{ 
          left: `${obstacle.x}px`, 
          bottom: '50px',
          width: `${obstacle.width}px`,
          height: `${obstacle.height}px`
        }"
      ></div>

      <!-- Game over message -->
      <div v-if="isDead" class="game-over">
        <h2>Game Over</h2>
        <p>Score: {{ score }}</p>
        <p>High Score: {{ highScore }}</p>
        <button @click="resetGame">Play Again</button>
      </div>
    </div>

    <div class="game-instructions">
      <p>Click or press Space/Up Arrow to jump. Avoid obstacles!</p>
      <p>Press R to restart after game over.</p>
    </div>
  </div>
</template>

<style scoped>
.geometry-dash-game {
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

.score-container, .high-score-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-label, .high-score-label {
  font-weight: bold;
}

.score-value, .high-score-value {
  font-size: 20px;
  font-weight: bold;
}

.geometry-dash-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom, #87CEEB, #E0F7FA);
}


.character {
  position: absolute;
  left: 100px;
  width: 30px;
  height: 30px;
  background-color: var(--color-2);
  border-radius: 4px;
  transition: transform 0.1s;
}

.character.jumping {
  animation: pulse 0.5s infinite alternate;
}

.character.dead {
  background-color: #ff0000;
  transform: rotate(180deg);
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.ground {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: #8B4513;
  background-image: linear-gradient(45deg, #8B4513 25%, #A0522D 25%, #A0522D 50%, #8B4513 50%, #8B4513 75%, #A0522D 75%, #A0522D 100%);
  background-size: 20px 20px;
}

.obstacle {
  position: absolute;
  background-color: #FF5722;
  border-radius: 4px;
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  z-index: 10;
}

.game-over h2 {
  margin-top: 0;
  color: #FF5722;
}

.game-over button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: var(--color-2);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.game-over button:hover {
  background-color: var(--color-3);
}

.game-instructions {
  padding: 10px 20px;
  background-color: #e0e0e0;
  text-align: center;
  font-size: 14px;
  color: #333;
}
</style>
