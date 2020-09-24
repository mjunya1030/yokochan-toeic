<template>
  <div class="hello">
    <p class="text-center">みんなの問題に挑戦してみよう！</p>
    <!-- ここから一覧 -->
    <template v-for="(test, key) in tests">
      <v-card :key="key" flat outlined class="ma-4">
        <v-card-title>{{test.title}}</v-card-title>
        <v-card-text  class="text-left">{{test.description}}</v-card-text>
        <v-card-actions><v-btn text color=accent @click="$router.push({name:'ListQuestion', query:{test_path: test.ref_path}})">このテストに挑戦</v-btn></v-card-actions>
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
      tests: []
    }
  },
  methods: {
  },
  created() {
    const users = firestore.collectionGroup('tests');
    users.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data()
          data.ref_path = doc.ref.path;
          this.tests.push(data)
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
    this.$ga.page('/');
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
