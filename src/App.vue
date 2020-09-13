<template>
  <v-app id="app">

    <!-- 上のとこ -->
    <v-app-bar app dense flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-img
        :src="require('@/assets/logo.png')"
        height="40"
        contain
      ></v-img>
    </v-app-bar>

    <!-- 左から出るやつ -->
    <v-navigation-drawer
      app
      v-model="drawer"
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <router-link to="/">みんなの問題に挑戦</router-link>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <router-link to="/mypage">マイページ</router-link>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- メインどこ -->
    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () =>({
    drawer: false,
  })
}
</script>

<style>
#app {
  font-family: "M Plus 1p" !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.v-application {
   font-family: "M Plus 1p" !important;
 }

.v-application--wrap {
  min-height: 10px !important;
}
</style>
