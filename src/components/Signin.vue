<template>
  <div class="signin">
    <h2>ログイン</h2>
    <input type="text" placeholder="Email address" v-model="emailAddress">
    <input type="password" placeholder="Password" v-model="password">
    <v-btn
      @click="signIn"
      class="mt-4"
      color="#CE3772"
      style="color:white;"
      depressed 
      rounded
      :loading="loading"
      :disabled="loading">ログインする
    </v-btn>
    <v-alert
      dense
      outlined
      type="error"
      v-show="this.error">{{ msgError }}
    </v-alert>
    <br/>
    <p>まだアカウントをお持ちでない方</p>
    <router-link to="/signup">新規登録</router-link>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Signin',
  data: function () {
    return {
      emailAddress: '',
      password: '',
      loading: false,
      error: false,
      msgError: ''
    }
  },
  methods: {
    async signIn() {
      this.loading = true
      firebase.auth().signInWithEmailAndPassword(this.emailAddress, this.password).then(
        user => {     
          this.loading = false     
          this.$router.push('/')
        },
        err => {
          this.error = true;
          this.msgError = err.message
          this.loading = false;
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.signin {
  margin-top: 20px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center
}
input {
  margin: 10px 0;
  padding: 10px;
}
</style>