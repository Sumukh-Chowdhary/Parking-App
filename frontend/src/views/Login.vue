<template>
  <div class="login-page">
    <div v-if="showError" class="floating-alert alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <form class="login-form" @submit.prevent="handleLogin">
      <h2>Login to ParkMate</h2>
      <input type="email" placeholder="Email" v-model="email" required />
      <input type="password" placeholder="Password" v-model="password" required />
      <button type="submit">Login</button>
      <p class="register-link">
        Don't have an account?
        <router-link to="/register">Create one</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

const email = ref('');
const password = ref('');
const router=useRouter();
const errorMessage=ref('');
const showError=ref(false);

const handleLogin = async () => {
  errorMessage.value='';
  showError.value = false;

  try{
    const response=await api.post('/login',{
        email:email.value,
        password:password.value,
    });
    const { token, user } = response.data;
    auth.setUser(user, token);
    router.push(user.role === 'admin' ? '/admin' : '/user');
  }catch(err){
    if (err.response && err.response.data.message) {
      errorMessage.value = err.response.data.message;
    } else {
      errorMessage.value = 'Something went wrong. Please try again.';
    }
    showError.value = true;
    setTimeout(() => showError.value = false, 3000);
  }
};
</script>

<style scoped>
.floating-alert {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  background-color: #f05658;
  color: black;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  min-width: 300px;
  max-width: 500px;
  text-align: center;
  animation: fadeInOut 0.3s ease-in-out;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f6f9fc;
  font-family: 'Poppins', sans-serif;
  background: url('@/assets/home-bg.png') no-repeat;
  background-size: cover;
  background-position: center bottom; 
  background-attachment: fixed;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.login-form h2 {
  margin-bottom: 1.5rem;
  color: #2b2b2b;
}

.login-form input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 1rem;
}

.login-form button {
  width: 100%;
  padding: 0.75rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-form button:hover {
  background-color: #218838;
}

.register-link {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #666;
}

.register-link a {
  color: #28a745;
  font-weight: 500;
  text-decoration: none;
}
</style>