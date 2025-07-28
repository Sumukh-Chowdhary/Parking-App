import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '@/stores/auth'

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from "@/views/Register.vue";

const routes=[
    { path:'/', component: Home },
    { path:'/login', component: Login},
    { path:'/register', component: Register},
]

const router=createRouter({
    history:createWebHistory(),
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


export default router;