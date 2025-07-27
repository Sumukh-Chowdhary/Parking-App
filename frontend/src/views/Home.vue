<template>
  <div class="landing-page">
    <div class="content text-center">
      <h1 class="display-4 text-dark font-weight-bold">Find your Perfect Spot</h1>
      <p class="lead text-muted">Book parking with ease. Anytime. Anywhere.</p>
      <div class="btn-group">
        <router-link to="/login" class="btn btn-outline-success">Book Now</router-link>
        <router-link to="/register" class="btn btn-success text-white">Create an Account</router-link>
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
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: url('@/assets/home-bg.png') no-repeat;
  background-size: cover;
  background-position: center bottom; 
  background-attachment: fixed;
  background-color: #f6f9fc;
}

.content {
  max-width: 700px;
  font-family: 'Poppins', sans-serif;
  position: relative;
  z-index: 2;
  color: #333;
}

.landing-page::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
}

.btn-group {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
</style>