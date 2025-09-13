<template>
  <div class="booking-page">
    <div v-if="message.text" :class="['floating-alert', message.type]">{{ message.text }}</div>

    <h2>{{ lot?.parking_lot_name }} - Spots</h2>
    <button class="book-btn" @click="showForm = true">Book Spot</button>
    <button class="cancel-btn" @click="goBack">Back</button>

    <div class="spots-grid">
      <div 
        v-for="spot in spots" 
        :key="spot._id" 
        class="spot" 
        :class="{ vacant: spot.status==='V', occupied: spot.status==='O' }"
      >
        {{ spot.status }}
        <div v-if="spot.reservation" class="reservation-info">
          {{ spot.reservation.start_hour }}:00 - {{ spot.reservation.end_hour }}:00
        </div>
      </div>
    </div>

    <div v-if="showForm" class="overlay">
      <div class="form-modal">
        <h3>Book Spot</h3>
        <form @submit.prevent="bookSpot">
          <label>Date:</label>
          <input type="date" v-model="parkingDate" required />

          <label>Start Hour (0-23):</label>
          <input type="number" v-model.number="startHour" min="0" max="23" required />

          <label>End Hour (0-23):</label>
          <input type="number" v-model.number="endHour" min="0" max="23" required />

          <div class="form-actions">
            <button type="submit">Confirm Booking</button>
            <button type="button" @click="showForm=false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api.js'

const router = useRouter()
const route = useRoute()

const lotId = route.params.lotId
const lot = ref(null)
const spots = ref([])
const showForm = ref(false)
const parkingDate = ref('')
const startHour = ref(null)
const endHour = ref(null)
const message = ref({ text:'', type:'' })

const fetchLot = async () => {
  try {
    const res = await api.get('/user/lots', { params: { search:'' } })
    lot.value = res.data.lots.find(l=>l._id===lotId)
  } catch {
    flash('Failed to load lot', 'error')
  }
}

const fetchSpots = async () => {
  try {
    const res = await api.get(`/user/lots/${lotId}/spots`)
    spots.value = await Promise.all(res.data.spots.map(async (spot) => {
      if (spot.status === 'O') {
        const reservationRes = await api.get(`/user/spots/${spot._id}/latest-reservation`)
        spot.reservation = reservationRes.data.reservation
      }
      return spot
    }))
  } catch {
    flash('Failed to load spots', 'error')
  }
}

const bookSpot = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) return flash('Please login first', 'error')

    if (endHour.value <= startHour.value)
      return flash('End hour must be after start hour', 'error')

    const res = await api.post(`/user/lots/${lotId}/book`, {
      user_id: user.id,
      date: parkingDate.value,   
      start_hour: startHour.value,
      end_hour: endHour.value
    })

    flash(res.data.message, 'success')
    showForm.value = false
    fetchSpots()
  } catch (err) {
    flash(err.response?.data?.message || 'Booking failed', 'error')
  }
}

const flash = (text, type) => {
  message.value = { text, type }
  setTimeout(() => message.value = { text:'', type:'' }, 3000)
}

const goBack = () => {
  router.push('/user/book')
}

onMounted(() => {
  fetchLot()
  fetchSpots()
})
</script>

<style scoped>
.booking-page { font-family: 'Poppins', sans-serif; padding: 2rem; }
.spots-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(80px,1fr)); gap:15px; margin-top:1rem; }
.spot { height:80px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-weight:bold; border:2px solid #ccc; border-radius:12px; cursor:default; }
.spot.vacant { background:#f0f9ff; border-color:#5bc0de; }
.spot.occupied { background:#ffe6e6; border-color:#e74c3c; }
.reservation-info { font-size:0.8rem; color:#555; margin-top:4px; }

.book-btn, .cancel-btn { padding:0.6rem 1rem; margin:0.5rem; border:none; border-radius:8px; font-weight:600; cursor:pointer; }
.book-btn { background:#28a745; color:#fff; }
.cancel-btn { background:#6c757d; color:#fff; }

.overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:999; }
.form-modal { background:#fff; padding:2rem; border-radius:12px; width:400px; text-align:center; }
.form-modal input { width:100%; padding:0.6rem; margin:0.5rem 0; border:1px solid #ccc; border-radius:6px; }
.form-actions { display:flex; justify-content:space-between; gap:1rem; }

.floating-alert { position: fixed; top: 20px; left:50%; transform:translateX(-50%); z-index:1000; padding:1rem 2rem; border-radius:8px; font-weight:500; box-shadow:0 6px 15px rgba(0,0,0,0.2); }
.floating-alert.success { background:#28a745;color:#fff; }
.floating-alert.error { background:#f05658;color:#fff; }
</style>
