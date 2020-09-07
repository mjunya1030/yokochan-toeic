<template>
  <div class="hello">
    <v-list two-line>
      <template v-for="question in questions">
        <v-list-item
          :key="question.question_no"
          @click.stop="">
          <v-list-item-content>
            <v-list-item-title align="start" v-text="question.question_no"></v-list-item-title>
            <v-list-item-subtitle v-text="question.question_text"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </template>
    </v-list>
    <v-btn color="#CE3772" dark depressed rounded>採点する！</v-btn>

  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
export default {
  name: 'HelloWorld',
  data () {
    return {
      question_no: '',
      questions: []
    }
  },
  created() {


    const questions = firestore.collection('questions');

    questions.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.data())
          this.question_no = (doc.id, '=>', doc.data().question_no)
          this.questions.push(doc.data())
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
