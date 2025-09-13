import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from "@/views/Register.vue"
import manage from "@/views/manage.vue"
import LotDetails from "@/views/LotDetails.vue"
import BookParking from '@/views/BookParking.vue'
import UserLot from '@/views/UserLot.vue'
import Reservation from '@/views/Reservation.vue'
import History from '@/views/History.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/admin/manage', component: manage },
  { path: '/admin/lots/:lotId', component: LotDetails },
  { path: '/user/book', component: UserLot },                                
  { path: '/user/book/:lotId', component: BookParking },
  { path: '/user/reservation', component: Reservation },
  { path :'/user/history', component: History }     
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.path.startsWith('/admin') && !auth.isAdmin) {
    return next('/login')
  }
  if (to.path.startsWith('/dashboard') && !auth.isUser) {
    return next('/login')
  }
  next()
})

export default router
