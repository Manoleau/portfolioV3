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
  },
  iconColor: {
    type: String,
    default: 'white'
  }
});
</script>

<template>
  <div :class="{ 'mobile': isMobile }" class="desktop-icon" @click="onClick">
    <div :class="{ 'mobile': isMobile }" class="icon">
      <img v-if="!icon.includes('fa-')" :src="icon" alt="icon"/>
      <i v-else :class="icon" class="fa-icon" :style="{ color: iconColor }"></i>
    </div>
    <div :class="{ 'mobile': isMobile }" class="name">{{ name }}</div>
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
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  z-index: 1;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile desktop icon */
.desktop-icon.mobile {
  width: 100px;
  height: 110px;
  margin: 5px;
  padding: 10px 5px;
}

.desktop-icon:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 5px;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.desktop-icon:active {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.icon {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
}

.desktop-icon:hover .icon {
  transform: scale(1.1);
}

.desktop-icon:active .icon {
  transform: scale(0.95);
}

/* Mobile icon */
.icon.mobile {
  width: 60px;
  height: 60px;
}

.icon img {
  max-width: 100%;
  max-height: 100%;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
  transition: filter 0.3s ease;
}

.desktop-icon:hover .icon img {
  filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.5));
}

.fa-icon {
  font-size: 30px;
  transition: text-shadow 0.3s ease, transform 0.3s ease;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
}

.desktop-icon:hover .fa-icon {
  text-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
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
  transition: color 0.3s ease;
}

.desktop-icon:hover .name {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

/* Mobile name */
.name.mobile {
  font-size: 14px;
  margin-top: 8px;
  max-width: 90px;
}

/* Mobile Font Awesome icon */
.icon.mobile .fa-icon {
  font-size: 36px;
}
</style>
