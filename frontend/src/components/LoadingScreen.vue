<template>
  <div class="loading-screen">
    <img src="@/assets/loading-background.png" class="watermark-bg" />
    <p class="loading-text">Loading<span>{{ dots }}</span></p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const dots = ref('')
let count = 0

onMounted(() => {
  setInterval(() => {
    count = (count + 1) % 4
    dots.value = '.'.repeat(count)
  }, 500) // updates every 500ms
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.watermark-bg {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  opacity: 0.15;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

.loading-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  font-family: monospace;
  z-index: 2;
}
</style>
