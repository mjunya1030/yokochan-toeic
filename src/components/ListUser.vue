<template>
  <div class="hello">
    <p class="text-center">みんなの問題に挑戦してみよう！</p>
    <!-- ここから一覧 -->
    <template v-for="(user, key) in users">
      <v-card :key="key" flat outlined class="ma-4">
        <v-card-title>{{user.displayName}}</v-card-title>
        <v-card-text  class="text-left">{{user.comment}}</v-card-text>
        <v-card-actions><v-btn text color=accent @click="$router.push({name:'ListQuestion', query:{uid: user.doc_id}})">この人の問題に挑戦</v-btn></v-card-actions>
      </v-card>
    </template>
    <!-- ここで一覧終わり -->
  </div>
</template>

<script>
import firestore from '@/firebase/firestore'

export default {
  name: 'HelloWorld',
  data() {
    return {
      users: []
    }
  },
  methods: {
  },
  created() {
    const users = firestore.collection('users');
    users.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data()
          
          data.doc_id = doc.id;
          this.users.push(data)
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
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
</style>
