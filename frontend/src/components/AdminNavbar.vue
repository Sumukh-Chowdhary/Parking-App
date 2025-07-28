<template>
  <nav class="navbar bg-white shadow-sm px-4">
    <a class="navbar-brand text-dark font-weight-bold" href="/">ParkMate</a>
    <div class="ml-auto d-flex align-items-center gap-buttons">
      <router-link to="/admin/dashboard" class="nav-link">Dashboard</router-link>
      <router-link to="/admin/manage" class="nav-link">Manage</router-link>
      <button @click="logout" class="btn btn-danger">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function logout() {
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid #e0e0e0;
  font-family: 'Poppins', sans-serif;
}

.nav-link {
  margin-right: 1rem;
  color: #333;
  text-decoration: none;
}

.nav-link:hover {
  text-decoration: underline;
}

.gap-buttons > *:not(:last-child) {
  margin-right: 1rem;
}
</style>
