<template>
  <div class="landing-page">
    <div class="content">
      <h1>Challenge Your Knowledge!</h1>
      <p class="lead">Take fun and engaging quizzes to test your skills.</p>
      <div class="btn-group">
        <router-link to="/login" class="btn btn-outline-light">Take a Quiz</router-link>
        <router-link to="/register" class="btn btn-light text-dark">Create an Account</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.landing-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
}

.content {
  max-width: 700px;
}

.btn-group {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
</style>
