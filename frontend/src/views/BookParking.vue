<template>
  <div>
    <h2>Book Spot</h2>

    <input type="date" v-model="selectedDate" @change="fetchSlots" />

    <div v-if="selectedDate" class="slots">
      <div v-for="hour in 24" :key="hour"
           :class="['slot', isBooked(hour) ? 'booked' : 'free']"
           @click="selectHour(hour)">
        {{ hour }}:00
      </div>
    </div>

    <div v-if="selectedStart !== null">
      <label>Duration (hours):</label>
      <input type="number" v-model="duration" min="1" max="24" />
      <button @click="bookSlot">Book</button>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      selectedDate: '',
      reservations: [],
      selectedStart: null,
      duration: 1
    }
  },
  methods: {
    async fetchSlots() {
      const spotId = this.$route.params.spot_id
      const { data } = await api.get(`/user/reservations/${spotId}/${this.selectedDate}`)
      this.reservations = data
    },
    isBooked(hour) {
      return this.reservations.some(r => hour >= r.start_hour && hour < r.end_hour)
    },
    selectHour(hour) {
      this.selectedStart = hour
    },
    async bookSlot() {
      const end = this.selectedStart + this.duration
      const spot_id = this.$route.params.spot_id
      const user_id = this.$store.state.user._id

      try {
        await api.post('/user/reservations', {
          spot_id, user_id,
          date: this.selectedDate,
          start_hour: this.selectedStart,
          end_hour: end
        })
        alert('Booked!')
        this.fetchSlots()
      } catch (err) {
        alert(err.response?.data?.error || 'Booking failed')
      }
    }
  }
}
</script>

<style>
.slots {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-top: 1rem;
}
.slot {
  padding: 10px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
}
.slot.free { background: #c8f7c5; }
.slot.booked { background: #f7c5c5; pointer-events: none; }
</style>
