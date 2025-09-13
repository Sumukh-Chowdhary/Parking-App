<template>
  <div class="manage-page">
    <!-- Add Lot Button -->
    <button class="add-lot-btn" @click="showForm = true">+ Add Lot</button>

    <!-- Search Box -->
    <input
      v-model="searchQuery"
      type="text"
      class="search-box"
      placeholder="Search by lot name or pincode..."
    />

    <!-- Lots Grid -->
    <div class="lots-grid">
      <div v-for="lot in filteredLots" :key="lot._id" class="lot-card">
        <h3>{{ lot.parking_lot_name }}</h3>
        <p class="address">{{ lot.address }}</p>
        <div class="meta">
          <span>Pincode: {{ lot.pincode }}</span>
          <span>₹{{ lot.price }}/hr</span>
        </div>
        <button class="view-btn" @click="viewLot(lot._id)">View Lot</button>
      </div>
    </div>

    <!-- No Results -->
    <p v-if="filteredLots.length === 0" class="no-results">No matching lots found.</p>

    <!-- Overlay Form Modal -->
    <div v-if="showForm" class="overlay">
      <div class="form-modal">
        <h2>Add Parking Lot</h2>

        <div v-if="showError" class="floating-alert alert alert-danger">{{ errorMessage }}</div>

        <form @submit.prevent="createLot">
          <input v-model="parking_lot_name" type="text" placeholder="Lot Name" required />
          <input v-model="address" type="text" placeholder="Address" required />
          <input v-model="pincode" type="number" placeholder="Pincode" required />
          <input v-model="price" type="number" placeholder="Price per hour" required />
          <input v-model="number_of_spots" type="number" placeholder="Number of Spots" required />

          <div class="form-actions">
            <button type="submit">Create</button>
            <button type="button" class="cancel" @click="closeForm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const parking_lot_name = ref('')
const address = ref('')
const pincode = ref('')
const price = ref('')
const number_of_spots = ref('')
const lots = ref([])

const showForm = ref(false)
const errorMessage = ref('')
const showError = ref(false)

const searchQuery = ref('')

const createLot = async () => {
  try {
    const response = await api.post('/admin/lots/addLot', {
      parking_lot_name: parking_lot_name.value,
      address: address.value,
      pincode: pincode.value,
      price: price.value,
      number_of_spots: number_of_spots.value
    })
    lots.value.push(response.data.lot)
    closeForm()
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Something went wrong.'
    showError.value = true
    setTimeout(() => (showError.value = false), 3000)
  }
}

const fetchLots = async () => {
  try {
    const response = await api.get('/admin/lots/getLot')
    lots.value = response.data.lots
  } catch (err) {
    console.error(err)
  }
}

const filteredLots = computed(() =>
  lots.value.filter(
    (lot) =>
      lot.parking_lot_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      lot.pincode.toString().includes(searchQuery.value)
  )
)

function viewLot(id) {
  router.push(`/admin/lots/${id}`)
}

function closeForm() {
  showForm.value = false
  parking_lot_name.value = ''
  address.value = ''
  pincode.value = ''
  price.value = ''
  number_of_spots.value = ''
}

onMounted(fetchLots)
</script>

<style scoped>
.manage-page {
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  padding: 3rem 2rem;
}

.add-lot-btn {
  display: block;
  margin: 0 auto 2rem;
  background-color: #1e7e34;
  color: #fff;
  padding: 0.9rem 2rem;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}
.add-lot-btn:hover {
  background-color: #145723;
}

/* Search Box */
.search-box {
  display: block;
  margin: 0 auto 2rem;
  padding: 0.75rem 1rem;
  width: 60%;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
}

.lots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.lot-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease;
}
.lot-card:hover {
  transform: translateY(-4px);
}

.lot-card h3 {
  margin-bottom: 0.5rem;
  color: #2b2b2b;
}

.lot-card .address {
  color: #555;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #444;
}

.view-btn {
  align-self: flex-start;
  padding: 0.6rem 1.2rem;
  background-color: #1e7e34;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.view-btn:hover {
  background-color: #145723;
}

.no-results {
  text-align: center;
  margin-top: 2rem;
  color: #666;
  font-size: 1.1rem;
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* Modal Form */
.form-modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  max-width: 450px;
  width: 100%;
  text-align: center;
}

.form-modal h2 {
  margin-bottom: 1rem;
  color: #2b2b2b;
}

.form-modal input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.form-actions button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background-color: #1e7e34;
}
.form-actions .cancel {
  background-color: #6c757d;
}

.floating-alert {
  background-color: #f05658;
  color: black;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  margin-bottom: 1rem;
}
</style>
