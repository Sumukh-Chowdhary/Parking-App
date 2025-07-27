<template>
  <nav class="navbar bg-white shadow-sm px-4">
    <a class="navbar-brand text-dark font-weight-bold" href="/">ParkMate</a>
    <div class="ml-auto d-flex gap-buttons">
      <router-link to="/login" class="btn btn-outline-success">Login</router-link>
      <router-link to="/register" class="btn btn-success text-white">Register</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid #e0e0e0;
  font-family: 'Poppins', sans-serif;
}

.gap-buttons > *:not(:last-child) {
  margin-right: 1rem;
}
</style>