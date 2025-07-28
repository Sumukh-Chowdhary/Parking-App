<template>
  <div id="app">
    <DynamicNavbar></DynamicNavbar>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
import DynamicNavbar from './components/DynamicNavbar.vue'
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    DynamicNavbar,
    Footer,
  }
}
</script>


<style scoped>
#app {
  font-family:'Poppins', sans-serif;
  padding: 2rem;
}
html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style global>
</style>

