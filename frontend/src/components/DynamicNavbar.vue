<script setup>
import { useAuthStore } from '@/stores/auth'
import AdminNavbar from './AdminNavbar.vue'
import UserNavbar from './UserNavbar.vue'
import Navbar from './Navbar.vue'

const auth = useAuthStore()
</script>

<template>
  <AdminNavbar v-if="auth.isAdmin" />
  <UserNavbar v-else-if="auth.isUser" />
  <Navbar v-else />
</template>
