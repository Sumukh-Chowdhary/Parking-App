<template>
  <div class="select-spot-page">
    <header class="header">
      <button class="back" @click="goBack">← Back to Lots</button>
      <h2>{{ lot?.parking_lot_name || 'Loading lot...' }}</h2>
    </header>

    <p v-if="lot" class="lot-meta">
      {{ lot.address }} • Pincode: {{ lot.pincode }} • ₹{{ lot.price }}/hr • Spots: {{ lot.number_of_spots }}
    </p>

    <div class="legend">
      <span class="legend-item"><span class="dot vacant-dot"></span> Vacant</span>
      <span class="legend-item"><span class="dot occupied-dot"></span> Occupied</span>
    </div>

    <div v-if="loading" class="loading">Loading spots…</div>
    <div v-if="!loading && spots.length === 0" class="empty">No spots found for this lot.</div>

    <div class="spots-grid" v-if="!loading && spots.length">
      <div
        v-for="(spot, idx) in spots"
        :key="spot._id"
        class="spot-card"
        :class="{ vacant: spot.status === 'V', occupied: spot.status === 'O' }"
      >
        <div class="spot-top">
          <div class="spot-number">#{{ idx + 1 }}</div>
          <div class="spot-status">{{ spot.status }}</div>
        </div>

        <div class="spot-body">
          <div class="spot-id">{{ shortId(spot._id) }}</div>
          <div class="spot-actions">
            <button
              class="select-btn"
              :disabled="spot.status !== 'V'"
              @click="selectSpot(spot)"
            >
              Select
            </button>
            <button class="view-btn" @click="viewSpot(spot)">View</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="message.text" :class="['floating-alert', message.type]">{{ message.text }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api.js'

const route = useRoute()
const router = useRouter()
const lotId = route.params.lotId

const lot = ref(null)
const spots = ref([])
const loading = ref(false)
const message = ref({ text: '', type: '' })

const fetchLot = async () => {
  try {
    const res = await api.get('/user/lots', { params: { search: '' } })
    lot.value = res.data.lots.find(l => l._id === lotId) || null
  } catch (err) {
    console.error(err)
    flash('Failed to load lot details', 'error')
  }
}

const fetchSpots = async () => {
  loading.value = true
  try {
    const res = await api.get(`/user/lots/${lotId}/spots`)
    spots.value = res.data.spots || []
  } catch (err) {
    console.error(err)
    flash('Failed to load spots', 'error')
    spots.value = []
  } finally {
    loading.value = false
  }
}

const selectSpot = (spot) => {
  if (spot.status !== 'V') {
    flash('This spot is occupied', 'error')
    return
  }
  router.push(`/user/book/${lotId}/${spot._id}`)
}

const viewSpot = (spot) => {
  // Optional: page to view spot details — for now navigate to the same booking page
  router.push(`/user/book/${lotId}/${spot._id}`)
}

const goBack = () => {
  router.push('/user/book') // goes back to lots list
}

const shortId = (id) => id?.slice(-6)

const flash = (text, type = 'error') => {
  message.value = { text, type }
  setTimeout(() => (message.value = { text: '', type: '' }), 3000)
}

onMounted(() => {
  fetchLot()
  fetchSpots()
})
</script>

<style scoped>
.select-spot-page {
  font-family: 'Poppins', sans-serif;
  padding: 1.75rem;
  max-width: 1100px;
  margin: 0 auto;
}

.header {
  display:flex;
  align-items:center;
  gap:1rem;
  margin-bottom:0.5rem;
}

.header h2 {
  margin:0;
  font-size:1.4rem;
  font-weight:700;
}

.back {
  background:transparent;
  border:none;
  color:#2b2b2b;
  cursor:pointer;
  font-size:0.95rem;
  padding:0.25rem 0.5rem;
}

.lot-meta {
  color:#555;
  margin-bottom:1rem;
}

.legend {
  display:flex;
  gap:1rem;
  margin-bottom:1rem;
  align-items:center;
}

.legend-item {
  display:flex;
  align-items:center;
  gap:.5rem;
  color:#444;
  font-size:0.95rem;
}

.dot {
  display:inline-block;
  width:12px;
  height:12px;
  border-radius:50%;
  border:1px solid rgba(0,0,0,0.06);
}

.vacant-dot { background:#d4edda; border-color:#28a745; }
.occupied-dot { background:#f8d7da; border-color:#e74c3c; }

.loading, .empty {
  text-align:center;
  color:#666;
  margin:2rem 0;
}

/* Grid */
.spots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 14px;
}

/* Card */
.spot-card {
  background:#fff;
  border-radius:10px;
  padding:0.8rem;
  box-shadow: 0 6px 14px rgba(0,0,0,0.05);
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  min-height:100px;
  transition: transform .12s ease;
}
.spot-card:hover { transform: translateY(-4px); }

.spot-card.vacant { border: 2px solid rgba(40,167,69,0.14); }
.spot-card.occupied { border: 2px solid rgba(231,76,60,0.08); opacity:0.95; }

.spot-top {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:0.6rem;
}

.spot-number {
  font-weight:700;
  color:#2b2b2b;
}

.spot-status {
  font-weight:700;
  padding:4px 8px;
  border-radius:6px;
  font-size:0.9rem;
  color:#fff;
}
.spot-card.vacant .spot-status { background:#28a745; color:#fff; }
.spot-card.occupied .spot-status { background:#e74c3c; color:#fff; }

.spot-body { display:flex; flex-direction:column; gap:0.6rem; align-items:flex-start; }

.spot-id {
  font-size:0.85rem;
  color:#666;
  word-break:break-all;
}

/* buttons */
.spot-actions {
  display:flex;
  gap:0.6rem;
  width:100%;
}

.select-btn, .view-btn {
  flex:1;
  padding:0.45rem 0.6rem;
  border-radius:8px;
  border:none;
  cursor:pointer;
  font-weight:600;
  font-size:0.92rem;
}

.select-btn {
  background:#28a745;
  color:white;
}
.select-btn:disabled {
  background:#bdbdbd;
  cursor:not-allowed;
}
.view-btn {
  background:transparent;
  border:1px solid #ddd;
  color:#333;
}

/* Floating alert */
.floating-alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  padding: 0.8rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
}
.floating-alert.success { background:#28a745; color:#fff; }
.floating-alert.error { background:#f05658; color:#fff; }

/* responsive tweaks */
@media (max-width: 600px) {
  .spots-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .spot-card { min-height:90px; }
}
</style>
