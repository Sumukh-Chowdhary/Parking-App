<template>
  <nav class="navbar bg-white shadow-sm px-4">
    <p class="navbar-brand text-dark font-weight-bold">ParkMate</p>
    <div class="ml-auto d-flex align-items-center gap-buttons">
      <router-link to="/admin" class="nav-link">Home</router-link>
      <router-link to="/admin/manage" class="nav-link">Manage</router-link>
      <button @click="logout" class="btn btn-danger">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const router = useRouter()
const auth =useAuthStore();

function logout() {
  auth.logout()
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
