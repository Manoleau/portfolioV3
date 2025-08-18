<script setup>
import Desktop from "@/components/Desktop.vue";
import TaskBar from "@/components/TaskBar.vue";
</script>

<template>
  <div style="height: 100vh; overflow: hidden; position: relative;">
    <Desktop />
    <TaskBar style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3vh;"/>
  </div>
</template>

<style scoped>

</style>
