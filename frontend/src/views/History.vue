<template>
  <div class="history-page">
    <h2>Your Reservation History</h2>
    <table>
      <thead>
        <tr>
          <th>Lot Name</th>
          <th>Spot</th>
          <th>Date</th>
          <th>Start Hour</th>
          <th>End Hour</th>
          <th>Amount Paid</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="h in history" :key="h._id">
          <td>{{ h.lot_id.parking_lot_name }}</td>
          <td>{{ h.spot_id._id }}</td>
          <td>{{ new Date(h.used_on).toISOString().split('T')[0] }}</td>
          <td>{{ new Date(h.start_time).getHours() }}:00</td>
          <td>{{ new Date(h.end_time).getHours() }}:00</td>
          <td>{{ h.amount_paid }}</td>
          <td>{{ h.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api.js'

const history = ref([])
const user = JSON.parse(localStorage.getItem('user'))

const fetchHistory = async () => {
  if (!user) return
  const res = await api.get('/user/history', { params: { user_id: user.id } })
  history.value = res.data.histories
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
table { width:100%; border-collapse: collapse; margin-top:1rem; }
th, td { border:1px solid #ccc; padding:0.5rem; text-align:center; }
th { background:#f5f5f5; }
</style>
