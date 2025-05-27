<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
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
const dragOffset = ref({ x: 0, y: 0 });
const position = ref({ x: 50, y: 50 });
const windowSize = ref({ width: 800, height: 600 });

function startDrag(event) {
  if (event.target.closest('.window-content')) return;

  isDragging.value = true;
  dragOffset.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y
  };

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(event) {
  if (!isDragging.value) return;

  position.value = {
    x: event.clientX - dragOffset.value.x,
    y: event.clientY - dragOffset.value.y
  };
}

function stopDrag() {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

function closeWindow() {
  emit('close');
}

onMounted(() => {
  // Center the window on the screen
  if (window.innerWidth > windowSize.value.width) {
    position.value.x = (window.innerWidth - windowSize.value.width) / 2;
  }
  if (window.innerHeight > windowSize.value.height) {
    position.value.y = (window.innerHeight - windowSize.value.height) / 2;
  }
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<template>
  <div v-if="isOpen" 
       class="app-window" 
       ref="appWindow"
       :style="{
         left: `${position.x}px`,
         top: `${position.y}px`,
         width: `${windowSize.width}px`,
         height: `${windowSize.height}px`,
         zIndex: zIndex
       }">
    <div class="window-title-bar" @mousedown="startDrag">
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
}

.window-title {
  font-weight: bold;
  font-size: 14px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
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

.window-close:hover {
  background-color: #e81123;
}

.window-content {
  flex: 1;
  overflow: auto;
  padding: 10px;
  background-color: white;
}
</style>
