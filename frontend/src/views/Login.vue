<template>
  <div class="login-page">
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
    <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import api from '@/api';

const email = ref('');
const password = ref('');
const router=useRouter();
const errorMessage=ref('')

const handleLogin = async () => {
  errorMessage.value='';
  try{
    const response=await api.post('/login',{
        email:email.value,
        password:password.value,
    });
        const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    router.push('/dashboard'); 
  }catch(err){
    if (err.response && err.response.data.message) {
      errorMessage.value = err.response.data.message;
    } else {
      errorMessage.value = 'Something went wrong. Please try again.';
    }
  }
};
</script>

<style scoped>
.error-msg {
  color: red;
  margin-bottom: 10px;
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