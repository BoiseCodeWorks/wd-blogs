<template>
  <div id="app">
    <img src="./assets/logo.png">
    <button type="button" @click="logout" v-if="user.email">Logout</button>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    methods: {
      logout() {
        this.$store.dispatch('logout')
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>