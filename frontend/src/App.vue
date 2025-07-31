<template>
  <div id="app">
      <DynamicNavbar />
      <router-view />
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
  /*mounted() {
    setTimeout(() => {
      this.showApp = true
    }, 5000)
  }*/
}
</script>

<style scoped>
#app {
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
}

html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
