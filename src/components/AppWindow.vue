<script setup>
import {computed, onMounted, onUnmounted, ref, nextTick} from 'vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  iconColor: {
    type: String,
    default: 'white'
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
const emit = defineEmits(['close', 'window-ready']);

const appWindow = ref(null);
const isDragging = ref(false);
const dragOffset = ref({x: 0, y: 0});
const position = ref({x: 50, y: 50});
const isMobile = ref(false);
const isClosing = ref(false);
const isActive = ref(true);

const windowSize = computed(() => {
  if (isMobile.value) {
    return {
      width: Math.min(window.innerWidth - 20, 800),
      height: Math.min(window.innerHeight - 80, 600)
    };
  }
  return {width: 800, height: 600};
});

function checkMobile() {
  isMobile.value = window.innerWidth <= 768;
}

function constrainPosition() {
  const maxX = window.innerWidth - windowSize.value.width;
  const maxY = window.innerHeight - windowSize.value.height;

  position.value.x = Math.max(0, Math.min(position.value.x, maxX));
  position.value.y = Math.max(0, Math.min(position.value.y, maxY));
}

function startDrag(event) {
  if (event.target.closest('.window-content')) return;

  isDragging.value = true;
  isActive.value = true;

  const clientX = event.clientX || (event.touches && event.touches[0].clientX);
  const clientY = event.clientY || (event.touches && event.touches[0].clientY);

  dragOffset.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  };

  document.body.classList.add('dragging-window');

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('touchmove', onDrag, {passive: false});
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);

  if (event.type === 'touchstart') {
    event.preventDefault();
  }
}

function onDrag(event) {
  if (!isDragging.value) return;

  const clientX = event.clientX || (event.touches && event.touches[0].clientX);
  const clientY = event.clientY || (event.touches && event.touches[0].clientY);

  position.value = {
    x: clientX - dragOffset.value.x,
    y: clientY - dragOffset.value.y
  };

  constrainPosition();

  if (event.type === 'touchmove') {
    event.preventDefault();
  }
}

function stopDrag() {
  isDragging.value = false;
  document.body.classList.remove('dragging-window');

  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
}

function closeWindow(event) {
  if (event) {
    event.stopPropagation();
  }

  isClosing.value = true;

  setTimeout(() => {
    if (event && event.type === 'touchend') {
      event.preventDefault();
      setTimeout(() => {
        emit('close');
      }, 50);
    } else {
      emit('close');
    }
  }, 300);
}

function handleResize() {
  checkMobile();
  constrainPosition();

  if (window.innerWidth > windowSize.value.width) {
    position.value.x = (window.innerWidth - windowSize.value.width) / 2;
  }
  if (window.innerHeight > windowSize.value.height) {
    position.value.y = (window.innerHeight - windowSize.value.height) / 2;
  }
}

function activateWindow() {
  isActive.value = true;
}

onMounted(() => {
  checkMobile();
  handleResize();

  window.addEventListener('resize', handleResize);

  // Make the window visible immediately
  appWindow.value?.classList.add('visible');

  // Emit window-ready event immediately
  emit('window-ready');

  // Fallback in case the class wasn't added immediately
  nextTick(() => {
    if (appWindow.value && !appWindow.value.classList.contains('visible')) {
      appWindow.value.classList.add('visible');
      console.log('NextTick visibility applied to window');
    }
  });

  // Additional fallback with a delay
  setTimeout(() => {
    if (appWindow.value && !appWindow.value.classList.contains('visible')) {
      appWindow.value.classList.add('visible');
      console.log('Fallback visibility applied to window');
    }
  }, 100);
});

onUnmounted(() => {
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
       :class="['app-window', { 
         'mobile': isMobile, 
         'dragging': isDragging, 
         'closing': isClosing,
         'active': isActive
       }]"
       :style="{
         left: `${position.x}px`,
         top: `${position.y}px`,
         width: `${windowSize.width}px`,
         height: `${windowSize.height}px`,
         zIndex: zIndex
       }"
       @mousedown="activateWindow"
       @touchstart="activateWindow">
    <div class="window-title-bar"
         @mousedown="startDrag"
         @touchstart="startDrag">
      <div class="window-title">
        <i v-if="icon" :class="icon" class="window-title-icon" :style="{ color: iconColor }"></i>
        {{ title }}
      </div>
      <div class="window-controls">
        <button class="window-close" @click="closeWindow" @touchend.prevent="closeWindow">×</button>
      </div>
    </div>
    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
@keyframes windowOpen {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes windowClose {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
}

.app-window {
  position: fixed;
  background-color: #f0f0f0;
  border: 1px solid #999;
  border-radius: 3px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s, height 0.3s, box-shadow 0.3s, transform 0.3s;
  transform: scale(0.9) translateY(20px);
  transform-origin: center;
  will-change: opacity, transform;
}

.app-window.visible {
  animation: windowOpen 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.app-window.closing {
  animation: windowClose 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
  pointer-events: none;
}

.app-window.active {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.app-window.dragging {
  transition: none;
  opacity: 0.95;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  cursor: grabbing;
}

.app-window.mobile {
  max-width: 100vw;
  max-height: calc(100vh - 40px);
  width: 100% !important;
  height: auto !important;
  top: 0 !important;
  left: 0 !important;
  border-radius: 0;
  border-left: none;
  border-right: none;
  animation: none;
  transform: none;
  opacity: 1;
}

.app-window.mobile.visible {
  animation: slideInFromBottom 0.3s ease-out forwards;
}

.app-window.mobile.closing {
  animation: slideOutToBottom 0.3s ease-in forwards;
}

@keyframes slideInFromBottom {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideOutToBottom {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
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
  touch-action: none;
  transition: background 0.3s;
}

.app-window.active .window-title-bar {
  background: linear-gradient(to bottom, 
    color-mix(in srgb, var(--color-2) 80%, white), 
    color-mix(in srgb, var(--color-1) 80%, white));
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
  display: flex;
  align-items: center;
}

.window-title-icon {
  font-size: 16px;
  margin-right: 8px;
  transition: transform 0.3s;
}

.app-window.active .window-title-icon {
  transform: scale(1.1);
}

.app-window.mobile .window-title {
  font-size: 16px;
}

.app-window.mobile .window-title-icon {
  font-size: 18px;
  margin-right: 10px;
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
  transition: background-color 0.2s, transform 0.2s;
}

.window-close:hover {
  background-color: #e81123;
  transform: scale(1.1);
}

.window-close:active {
  transform: scale(0.95);
}

/* Larger close button for mobile */
.app-window.mobile .window-close {
  width: 44px;
  height: 44px;
  font-size: 24px;
  padding: 10px;
  margin-right: -10px; /* Compensate for padding */
  touch-action: manipulation; /* Improve touch responsiveness */
}

.window-content {
  flex: 1;
  overflow: auto;
  padding: 10px;
  background-color: white;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  opacity: 0;
  animation: fadeIn 0.3s ease-out 0.1s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.app-window.mobile .window-content {
  padding: 15px;
  max-height: calc(100vh - 80px); /* Account for taskbar and title bar */
  opacity: 1;
  animation: none;
}

/* Add a subtle pulsing effect to the active window */
@keyframes subtle-pulse {
  0% {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  }
  50% {
    box-shadow: 0 8px 30px rgba(var(--color-1-rgb), 0.5);
  }
  100% {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  }
}

.app-window.active:not(.dragging):not(.closing) {
  animation: subtle-pulse 3s infinite;
}
</style>
