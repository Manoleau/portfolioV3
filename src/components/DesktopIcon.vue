<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  onClick: {
    type: Function,
    default: () => {
    }
  }
});
</script>

<template>
  <div class="desktop-icon" @click="onClick">
    <div class="icon">
      <img :src="icon" alt="icon"/>
    </div>
    <div class="name">{{ name }}</div>
  </div>
</template>

<style scoped>
.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  height: 90px;
  margin: 10px;
  cursor: pointer;
  user-select: none;
}

.desktop-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.desktop-icon:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.icon {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon img {
  max-width: 100%;
  max-height: 100%;
}

.name {
  margin-top: 5px;
  text-align: center;
  color: white;
  font-size: 12px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>