<template>
  <div class="hello">

    <p align="center" >TOEICの問題に挑戦してみよう！</p>
    <!-- ここから一覧 -->
    <v-list two-line>
      <!-- v-for とかくと、questionsの数だけ、繰り返してくれる。 -->
      <template v-for="question in questions">
        <!-- 問題の数だけ、問題を表示するのを繰り返す keyは気にしなくてok。-->
        <v-list-item
          :key="question.question_no" 
          @click="showquiz(question)">
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
    <v-simple-table v-show="isCompleted">
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
        <v-card-title class="headline" align="start">{{showing_question.question_no}}</v-card-title>
        <v-card-text class="text-left">{{showing_question.question_text}}</v-card-text>
        <v-radio-group v-model="radios" :mandatory="false" class="ma-3">
          <v-radio :label="showing_question.choices.a" :value="showing_question.choices.a"></v-radio>
          <v-radio :label="showing_question.choices.b" :value="showing_question.choices.b"></v-radio>
          <v-radio :label="showing_question.choices.c" :value="showing_question.choices.c"></v-radio>
          <v-radio :label="showing_question.choices.d" :value="showing_question.choices.d"></v-radio>
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
            @click="answer(showing_question, radios)"
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
  data() {
    return {
      questions: [],
      dialog: false,
      isQuiz: false,
      radios: '',
      isCompleted: false,
      usersChoice: {},
      showing_question: {
        choices: {
          a: '',
          b: '',
          c: '',
          d: '',
        }
      },

      // ユーザー情報系
      name:'',
      email:'',
      photoUrl:'',
      emailVerified:'',
      uid:'',
    }
  },
  methods: {
    signOut() {
      firebase.auth().signOut().then(() => {
        this.$router.push('/signin')
      })
    }
    ,showquiz(question) {
      this.radios = ''
      this.isQuiz = true;
      this.showing_question = question
      console.log(this.showing_question.choices.a)
      
    },
    answer(question, radio){
      this.isQuiz = false
      this.usersChoice[question.question_no] = radio

      // firestoreにデータ書き込み
      const data = {
        doc_id: question.doc_id,
        question_no: question.question_no,
        question_text: question.question_text,
        choices: question.choices,
        answer: question.answer,
        user_choice: radio,
        result: radio==question.answer,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      firestore.collection('users').doc(this.uid).collection('userAnswers').add(data)
      
    }

  },
  created() {
    const user = firebase.auth().currentUser;
    if (user != null) {
      this.name = user.displayName;
      this.email = user.email;
      this.photoUrl = user.photoURL;
      this.emailVerified = user.emailVerified;
      this.uid = user.uid;
    }
    const questions = firestore.collection('questions').orderBy('question_no');
    questions.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data()
          data.doc_id = doc.id;
          this.questions.push(data)
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
