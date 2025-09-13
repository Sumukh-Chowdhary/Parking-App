<template>
  <div class="reservations-page">
    <h2>Your Current Reservations</h2>
    <table>
      <thead>
        <tr>
          <th>Lot Name</th>
          <th>Spot</th>
          <th>Date</th>
          <th>Start Hour</th>
          <th>End Hour</th>
          <th>Cost</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="res in reservations" :key="res._id">
          <td>{{ res.lot_id.parking_lot_name }}</td>
          <td>{{ res.spot_id._id }}</td>
          <td>{{ res.date }}</td>
          <td>{{ res.start_hour }}:00</td>
          <td>{{ res.end_hour }}:00</td>
          <td>{{ res.parking_cost }}</td>
          <td><button @click="leaveSpot(res._id)">Leave</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api.js'

const reservations = ref([])
const user = JSON.parse(localStorage.getItem('user'))

const fetchReservations = async () => {
  if (!user) return
  const res = await api.get('/user/reservations', { params: { user_id: user.id } })
  reservations.value = res.data.reservations
}

const leaveSpot = async (reservationId) => {
  await api.post(`/user/reservations/${reservationId}/leave`)
  await fetchReservations()
}

onMounted(() => {
  fetchReservations()
})
</script>

<style scoped>
table { width:100%; border-collapse: collapse; margin-top:1rem; }
th, td { border:1px solid #ccc; padding:0.5rem; text-align:center; }
th { background:#f5f5f5; }
button { padding:0.3rem 0.6rem; border:none; background:#28a745; color:white; border-radius:4px; cursor:pointer; }
button:hover { background:#218838; }
</style>
