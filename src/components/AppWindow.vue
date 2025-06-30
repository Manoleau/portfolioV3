<script setup>
import {onMounted, onUnmounted, ref, computed} from 'vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  zIndex: {
    type: Number,
    default: 1
  }
});
const emit = defineEmits(['close']);

const appWindow = ref(null);
const isDragging = ref(false);
const dragOffset = ref({x: 0, y: 0});
const position = ref({x: 50, y: 50});
const isMobile = ref(false);

// Responsive window size based on screen width
const windowSize = computed(() => {
  if (isMobile.value) {
    return {
      width: Math.min(window.innerWidth - 20, 800),
      height: Math.min(window.innerHeight - 80, 600)
    };
  }
  return { width: 800, height: 600 };
});

// Check if device is mobile
function checkMobile() {
  isMobile.value = window.innerWidth <= 768;
}

// Ensure window stays within viewport
function constrainPosition() {
  const maxX = window.innerWidth - windowSize.value.width;
  const maxY = window.innerHeight - windowSize.value.height;

  position.value.x = Math.max(0, Math.min(position.value.x, maxX));
  position.value.y = Math.max(0, Math.min(position.value.y, maxY));
}

function startDrag(event) {
  if (event.target.closest('.window-content')) return;

  isDragging.value = true;

  // Handle both mouse and touch events
  const clientX = event.clientX || (event.touches && event.touches[0].clientX);
  const clientY = event.clientY || (event.touches && event.touches[0].clientY);

  dragOffset.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  };

  // Add both mouse and touch event listeners
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('touchmove', onDrag, { passive: false });
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);

  // Prevent default touch behavior to avoid scrolling while dragging
  if (event.type === 'touchstart') {
    event.preventDefault();
  }
}

function onDrag(event) {
  if (!isDragging.value) return;

  // Handle both mouse and touch events
  const clientX = event.clientX || (event.touches && event.touches[0].clientX);
  const clientY = event.clientY || (event.touches && event.touches[0].clientY);

  position.value = {
    x: clientX - dragOffset.value.x,
    y: clientY - dragOffset.value.y
  };

  // Ensure window stays within viewport
  constrainPosition();

  // Prevent default to stop scrolling on mobile
  if (event.type === 'touchmove') {
    event.preventDefault();
  }
}

function stopDrag() {
  isDragging.value = false;

  // Remove both mouse and touch event listeners
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
}

function closeWindow() {
  emit('close');
}

// Handle window resize
function handleResize() {
  checkMobile();
  constrainPosition();

  // Center window if it's bigger than the screen
  if (window.innerWidth > windowSize.value.width) {
    position.value.x = (window.innerWidth - windowSize.value.width) / 2;
  }
  if (window.innerHeight > windowSize.value.height) {
    position.value.y = (window.innerHeight - windowSize.value.height) / 2;
  }
}

onMounted(() => {
  // Initial checks
  checkMobile();
  handleResize();

  // Add resize event listener
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // Clean up all event listeners
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div v-if="isOpen"
       ref="appWindow"
       :style="{
         left: `${position.x}px`,
         top: `${position.y}px`,
         width: `${windowSize.width}px`,
         height: `${windowSize.height}px`,
         zIndex: zIndex
       }"
       :class="['app-window', { 'mobile': isMobile }]">
    <div class="window-title-bar" 
         @mousedown="startDrag"
         @touchstart="startDrag">
      <div class="window-title">{{ title }}</div>
      <div class="window-controls">
        <button class="window-close" @click="closeWindow">×</button>
      </div>
    </div>
    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.app-window {
  position: fixed;
  background-color: #f0f0f0;
  border: 1px solid #999;
  border-radius: 3px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s, height 0.3s;
}

/* Mobile-specific styles */
.app-window.mobile {
  max-width: 100vw;
  max-height: calc(100vh - 40px); /* Account for taskbar */
  width: 100% !important; /* Override inline style */
  height: auto !important; /* Let content determine height */
  top: 0 !important; /* Position at top */
  left: 0 !important; /* Position at left */
  border-radius: 0;
  border-left: none;
  border-right: none;
}

.window-title-bar {
  background: linear-gradient(to bottom, var(--color-2), var(--color-1));
  color: white;
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
  height: 28px;
  touch-action: none; /* Prevent browser handling of touch events */
}

/* Larger touch target for mobile */
.app-window.mobile .window-title-bar {
  height: 40px;
  padding: 8px 12px;
}

.window-title {
  font-weight: bold;
  font-size: 14px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-window.mobile .window-title {
  font-size: 16px;
}

.window-controls {
  display: flex;
}

.window-close {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 18px;
  line-height: 18px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
}

/* Larger close button for mobile */
.app-window.mobile .window-close {
  width: 32px;
  height: 32px;
  font-size: 24px;
}

.window-close:hover {
  background-color: #e81123;
}

.window-content {
  flex: 1;
  overflow: auto;
  padding: 10px;
  background-color: white;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

.app-window.mobile .window-content {
  padding: 15px;
  max-height: calc(100vh - 80px); /* Account for taskbar and title bar */
}
</style>
