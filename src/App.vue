<template>
  <!-- <MusicSearchPlayer /> -->
  <APlayerWrapper />
</template>

<script>
// import MusicSearchPlayer from './components/PlayMusic.vue'
import APlayerWrapper from './components/APlayerWrapper.vue'
export default {
  name: 'App',
  components: {
    // MusicSearchPlayer,
    APlayerWrapper
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


</style>
