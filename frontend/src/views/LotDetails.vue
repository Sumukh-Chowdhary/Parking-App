<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const spots = ref([])

onMounted(async () => {
  const lotId = route.params.lotId
  const res = await api.get(`/admin/lot/${lotId}/spots/getSpots`)
  spots.value = res.data.spots
})
</script>

<template>
  <div class="spots-grid">
    <div 
      v-for="spot in spots" 
      :key="spot._id"
      class="spot"
      :class="{ vacant: spot.status==='V', occupied: spot.status==='O' }"
    >
      {{ spot.status }}

      <!-- Tooltip -->
      <div class="tooltip">
        <p><strong>ID:</strong> {{ spot._id }}</p>
        <p><strong>Status:</strong> {{ spot.status==='V' ? 'Vacant' : 'Occupied' }}</p>

        <template v-if="spot.reservation">
          <hr />
          <p><strong>User:</strong> {{ spot.reservation.user_id?.name }} ({{ spot.reservation.user_id?.email }})</p>
          <p><strong>From:</strong> {{ new Date(spot.reservation.parking_timestamp).toLocaleString() }}</p>
          <p><strong>To:</strong> {{ new Date(spot.reservation.leaving_timestamp).toLocaleString() }}</p>
          <p><strong>Cost:</strong> ₹{{ spot.reservation.parking_cost }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 15px;
  padding: 20px;
  max-width: 800px;
  margin: auto;
}

.spot {
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  border: 2px solid #ccc;
  border-radius: 12px;
  cursor: pointer;
}

.spot.vacant {
  background-color: #f0f9ff; 
  border-color: #5bc0de;
}

.spot.occupied {
  background-color: #ffe6e6; 
  border-color: #e74c3c;
}

/* Tooltip styling */
.tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: #333;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  z-index: 10;
  font-size: 12px;
  min-width: 200px;
}

.spot:hover .tooltip {
  display: block;
}
.tooltip hr {
  margin: 5px 0;
  border: none;
  border-top: 1px solid #ddd;
}
</style>
