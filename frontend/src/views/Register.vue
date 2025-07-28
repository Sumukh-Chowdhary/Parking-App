<template>
  <div class="register-container">
    <div v-if="showError" class="floating-alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <div v-if="showSuccess" class="floating-alert alert-success" role="alert">
      {{ successMessage }}
    </div>
    <form class="register-form" @submit.prevent="handleRegister">
      <h2>Create Your ParkMate Account</h2>
      <input type="text" placeholder="Username" v-model="username" required />
      <input type="email" placeholder="Email" v-model="email" required />
      <input type="password" placeholder="Password" v-model="password" required />
      <input type="tel" placeholder="Mobile Number" v-model="mobile" required />
      <button type="submit">Register</button>
      <p class="login-link">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/api';

  const username = ref('');
  const password = ref('');
  const email = ref('');
  const mobile = ref('');
  const router = useRouter();
  const errorMessage = ref('');
  const showError = ref(false);
  const successMessage = ref('');
  const showSuccess = ref(false);

  const handleRegister = async () => {
    errorMessage.value = '';
    showError.value = false;
    successMessage.value = '';
    showSuccess.value = false;

    try {
      const response = await api.post('/register', {
        username: username.value,
        password: password.value,
        email: email.value,
        mobile: mobile.value,
      });
      successMessage.value = 'Registration successful! Redirecting to login...';
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
        router.push('/login');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data.message) {
        errorMessage.value = err.response.data.message;
      } else {
        errorMessage.value = 'Something went wrong. Please try again.';
      }
      showError.value = true;
      setTimeout(() => showError.value = false, 4000);
    }
  }
</script>

<style scoped>
.floating-alert {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  padding: 1.2rem 2.5rem;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  min-width: 320px;
  max-width: 550px;
  text-align: center;
  animation: slideInFadeIn 0.5s ease-out forwards;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.floating-alert.alert-danger {
  background-color: rgba(255, 193, 7, 0.8); 
  color: #343a40;
}

.floating-alert.alert-success {
  background-color: rgba(144, 238, 144, 0.8); 
  color: #1a5a1a;
}

@keyframes slideInFadeIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.register-container {
  min-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f6f9fc;
  font-family: 'Poppins', sans-serif;
  background: url('@/assets/home-bg.png') no-repeat;
  background-size: cover;
  background-position: center bottom;
  position: relative;
}

.register-container::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
}

.register-form {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  max-width: 450px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 2;
}

.register-form h2 {
  margin-bottom: 1.8rem;
  color: #2b2b2b;
  font-size: 1.8rem;
}

.register-form input {
  width: 100%;
  padding: 0.85rem;
  margin-bottom: 1.2rem;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.register-form button {
  width: 100%;
  padding: 0.85rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.5rem;
}

.register-form button:hover {
  background-color: #218838;
}

.login-link {
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #666;
}

.login-link a {
  color: #28a745;
  font-weight: 500;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
