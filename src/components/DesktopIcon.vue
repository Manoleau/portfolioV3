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
  },
  isMobile: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="desktop-icon" :class="{ 'mobile': isMobile }" @click="onClick">
    <div class="icon" :class="{ 'mobile': isMobile }">
      <img :src="icon" alt="icon"/>
    </div>
    <div class="name" :class="{ 'mobile': isMobile }">{{ name }}</div>
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
  transition: background-color 0.2s;
}

/* Mobile desktop icon */
.desktop-icon.mobile {
  width: 100px;
  height: 110px;
  margin: 5px;
  padding: 10px 5px;
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

/* Mobile icon */
.icon.mobile {
  width: 60px;
  height: 60px;
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

/* Mobile name */
.name.mobile {
  font-size: 14px;
  margin-top: 8px;
  max-width: 90px;
}
</style>
