<script setup>
</script>

<template>
  <div id="taskbar">
    <button id="taskbar-start">
    </button>
  </div>
</template>

<style scoped>
#taskbar {
  background-color: cadetblue;
  border-top: gray solid 2px;
}
#taskbar-start {
  background-color: green;
  text-decoration: none;
  border: none;

  width: 10%;
  height: 100%;
}
#taskbar-start:hover {
  background-color: limegreen;
}
#taskbar-start:active {
  background-color: darkgreen;
}
</style>
