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
    <p class="mt-7 mb-0" color="#3b5998">または…</p>
    <v-btn
      color="#3b5998"
      outlined
      @click="signInFacebook()"
      :loading="facebookloading"
      :disabled="facebookloading"
      rounded>Facebookでログイン</v-btn>
    <v-alert
      dense
      outlined
      type="info"
      class="mt-3"
      v-show="facebookloading">リダイレクトしています...
    </v-alert>
    <br/>
    <v-divider></v-divider>
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
      msgError: '',
      facebookloading: false,
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
    },
    signInFacebook() {
      this.facebookloading = true
      var provider = new firebase.auth.FacebookAuthProvider();
      provider.setCustomParameters({
        'display': 'popup'
      });
      firebase.auth().signInWithRedirect(provider).then();
      this.facebookloading = false
    }
  },
  created() {
    // if
    this.facebookloading = true
    firebase.auth().getRedirectResult().then(
      result => {
        this.facebookloading = true
        if (result.credential) {
          this.$router.push('/')
        }
        this.facebookloading = false
      },
      err => {
        console.log(error)
      }
    );
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