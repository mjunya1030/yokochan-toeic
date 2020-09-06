<template>
  <div class="hello">
    <h1>{{ question_no }}</h1>
    <h1>{{ questions.question_no }}</h1>
  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      question_no: '',
      questions: {}
    }
  },
  created() {


    let questions = firestore.collection('questions');

    let setQuestion = questions.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.question_no = (doc.id, '=>', doc.data().question_no)
          this.questions = (doc.id, '=>', doc.data())
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
