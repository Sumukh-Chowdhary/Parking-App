<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AdminNavbar from './AdminNavbar.vue'
import UserNavbar from './UserNavbar.vue'
import Navbar from './Navbar.vue'

const auth = useAuthStore()

const role = computed(() => auth.user?.role)
</script>

<template>
  <AdminNavbar v-if="role === 'admin'" />
  <UserNavbar v-else-if="role === 'user'" />
  <Navbar v-else />
</template>
