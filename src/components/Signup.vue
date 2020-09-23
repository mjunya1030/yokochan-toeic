<template>
  <div class="signup">
    <h2>ユーザ登録</h2>
    <input type="text" placeholder="Email address" v-model="emailAddress">
    <input type="password" placeholder="Password" v-model="password">
    <input type="password" placeholder="Password確認">
    <v-btn
      @click="signUp"
      color="accent"
      class="mt-4"
      depressed
      rounded
      :loading="loading"
      :disabled="loading">登録する</v-btn>
    <br/>
    <v-alert
      dense
      outlined
      type="error"
      v-show="error"
    >{{ msgError }}</v-alert>
    <p>すでにアカウントをお持ちですか？</p>
    <router-link to="/signin" color="accent">ログインはこちら</router-link>
    
    
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Signup',
  data () {
    return {
      emailAddress: '',
      password: '',
      loading: false,
      error: false,
      msgError: ''
    }
  },
  methods: {
    signUp: function () {
      this.loading = true;
      firebase.auth().createUserWithEmailAndPassword(this.emailAddress, this.password)
        .then(user => {
          firebase.auth().currentUser.sendEmailVerification({
            url: 'https://yokochan-86e14.web.app/',
            handleCodeInApp: false,
          }).catch(error => {
            console.log(error.message)
          })
          this.loading = false;
          this.$router.push('/')
        })
        .catch(error => {
          this.msgError = error.message
          this.loading = false;
          this.error = true;
        })
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
.signup {
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