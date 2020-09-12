<template>
  <div class="hello">

    <p align="center" >TOEICの問題に挑戦してみよう！</p>
    <!-- ここから一覧 -->
    <v-list two-line>
      <!-- v-for　とかくと、questionsの数だけ、繰り返してくれる。 -->
      <template v-for="question in questions">
        <!-- 問題の数だけ、問題を表示するのを繰り返す keyは気にしなくてok。-->
        <v-list-item
          :key="question.question_no" 
          @click="showquiz(question.question_no, question.question_text, question.choices)">
          <v-list-item-content>
            <!-- ここが数字 ちな、align=startは、文字列を左寄せしてねっていう意味。-->
            <v-list-item-title align="center" v-text="question.question_no"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </template>
    </v-list>
    <!-- ここで一覧終わり -->
    <v-btn
      color="#CE3772"
      dark
      depressed
      rounded
      @click="isCompleted = true"
    > 
    
      採点する
    </v-btn>


    <!-- ここから答えを出してみよう！ -->
    <v-simple-table　v-show="isCompleted">
      <template>
        <thead>
          <tr>
            <th class="text-center">No.</th>
            <th class="text-center">あなたの答え</th>
            <th class="text-center">正解</th>
            <th class="text-center">判定</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="question in questions">
            <td class="text-left">{{ question.question_no }}</td>
            <td class="text-left">{{ usersChoice[question.question_no] }}</td>
            <td class="text-left">{{ question.answer }}</td>
            <td><v-chip color="green" v-show="usersChoice[question.question_no] == question.answer">正解！</v-chip></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-dialog
      v-model="isQuiz"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline" align="start">{{number}}</v-card-title>
        <v-card-text class="text-left">{{text}}</v-card-text>
        <v-radio-group v-model="radios" :mandatory="false" class="ma-3">
          <v-radio :label="choices.a" :value="choices.a"></v-radio>
          <v-radio :label="choices.b" :value="choices.b"></v-radio>
          <v-radio :label="choices.c" :value="choices.c"></v-radio>
          <v-radio :label="choices.d" :value="choices.d"></v-radio>
        </v-radio-group>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="isQuiz = false"
          >
            やめる
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="answer(number, radios)"
          >
            回答する
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
import firebase from 'firebase'

export default {
  name: 'HelloWorld',
  data () {
    return {
      questions: [],
      dialog: false,
      isQuiz: false,
      number: 101,
      text: "なんでもいいよ",
      choices:"選択肢",
      radios: '',
      isCompleted: false,
      usersChoice: {}
    }
  },
  methods: {
    signOut() {
      firebase.auth().signOut().then(() => {
        this.$router.push('/signin')
      })
    }
    ,showquiz(questionNo, questionText,questionChoices) {
      this.radios = ''
      this.isQuiz = true;
      this.number = questionNo; //this.number = 120;
      this.text = questionText; //this.text = 的s; 
      this.choices = questionChoices; //this.choices=問題;
    },
    answer(number, choice){
      this.isQuiz = false
      this.usersChoice[number] = choice
      console.log(this.usersChoice)
    }

  },
  created() {
    const questions = firestore.collection('questions');
    questions.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.questions.push(doc.data())
          console.log(this.questions)
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
