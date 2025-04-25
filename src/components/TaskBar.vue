<script setup>
</script>

<template>
  <div id="taskbar">
    <button id="taskbar-start">
      Start
    </button>
  </div>
</template>

<style scoped>
* {
  color: white;
}
#taskbar {
  background-color: var(--color-1);
  border-top: gray solid 2px;
}
#taskbar-start {
  background-color: var(--color-2);
  text-decoration: none;
  border: none;
  margin: 3px;
  border-radius: 3px;
  width: 10%;
  height: 75%;
}
#taskbar-start:hover {
  background-color: var(--color-3);
}
#taskbar-start:active {
  background-color: var(--color-4);
  color: black;
}
</style>
