<template>
  <div id="app">
    <DynamicNavbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import DynamicNavbar from './components/DynamicNavbar.vue'
import Footer from './components/Footer.vue'
import LoadingScreen from './components/LoadingScreen.vue'

export default {
  name: 'App',
  components: {
    DynamicNavbar,
    Footer,
    LoadingScreen,
  },
  data() {
    return {
      showApp: false
    }
  },
}
</script>

<style scoped>
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.main-content {
  flex: 1;
}
</style>
