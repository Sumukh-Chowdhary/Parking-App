<template>
  <div class="booking-page">
    <div v-if="message.text" :class="['floating-alert', message.type]">{{ message.text }}</div>

    <h2>Parking Lots</h2>
    <input type="text" v-model="search" placeholder="Search lots..." @input="fetchLots" class="search-bar"/>

    <div class="lots-grid">
      <div v-for="lot in lots" :key="lot._id" class="lot-card">
        <h3>{{ lot.parking_lot_name }}</h3>
        <p>{{ lot.address }}</p>
        <p>₹{{ lot.price }}/hr</p>
        <button @click="goToBook(lot._id)">Book Now</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api.js'

const lots = ref([])
const search = ref('')
const message = ref({ text: '', type: '' })
const router = useRouter()

const fetchLots = async () => {
  try {
    const res = await api.get('/user/lots', { params: { search: search.value } })
    lots.value = res.data.lots
  } catch {
    flashMessage('Failed to load lots', 'error')
  }
}

const goToBook = (lotId) => {
  router.push(`/user/book/${lotId}`)
}

const flashMessage = (text, type) => {
  message.value = { text, type }
  setTimeout(() => message.value = { text: '', type: '' }, 3000)
}

onMounted(fetchLots)
</script>

<style scoped>
.booking-page { font-family: 'Poppins', sans-serif; padding: 2rem; }
.search-bar { width: 100%; padding:0.8rem; margin-bottom:1.5rem; border-radius:8px; border:1px solid #ccc; font-size:1rem; }
.lots-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.lot-card { background:#fff; padding:1rem; border-radius:12px; box-shadow:0 6px 12px rgba(0,0,0,0.05); text-align:center; }
.lot-card button { margin-top:1rem; background-color:#28a745; color:#fff; padding:0.6rem 1.2rem; border:none; border-radius:8px; cursor:pointer; }
.lot-card button:hover { background-color:#218838; }
.floating-alert { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000; padding: 1rem 2rem; border-radius: 8px; font-weight: 500; box-shadow: 0 6px 15px rgba(0,0,0,0.2); }
.floating-alert.success { background:#28a745; color:#fff; }
.floating-alert.error { background:#f05658; color:#fff; }
</style>
