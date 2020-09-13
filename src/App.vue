<template>
  <v-app id="app">
    <div class="header">
      <v-img
        :src="require('@/assets/logo.png')"
        height="50"
        contain
      ></v-img>
    </div>
      <v-main>
        <v-container fluid>
          <router-view/>
        </v-container>
      </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: "M Plus 1p" !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

.v-application {
   font-family: "M Plus 1p" !important;
 }

.header {
  height: 50px;
}
</style>
