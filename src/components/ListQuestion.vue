<template>
  <div class="hello">
    <div v-show="questions.length==0&&isLoading==false">この人が作った問題はまだないようです…。</div>
    <div v-if="questions.length!=0">
      <p class="text-center">問題に挑戦してみよう！</p>
      <!-- ここから一覧 -->
      <v-list two-line>
        <!-- v-for とかくと、questionsの数だけ、繰り返してくれる。 -->
        
        <template v-for="(question, key) in questions">
          <!-- 問題の数だけ、問題を表示するのを繰り返す keyは気にしなくてok。-->
          <v-list-item
            :key="`first-${key}`"
            @click="showquiz(question)">
            <v-list-item-content>
              <!-- ここが数字 ちな、align=startは、文字列を左寄せしてねっていう意味。-->
              <v-list-item-title align="center" v-text="question.question_no"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="`second-${key}`" ></v-divider>
        </template>
      </v-list>
      <!-- ここで一覧終わり -->
      <v-btn
        color="primary"
        depressed
        rounded
        :disabled="isFinished"
        @click="finish"
      > 
      採点する
    </v-btn>
    </div>

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
  name: 'listQuestion',
  data() {
    return {
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

      // テスト情報系
      questions: [],
      test_owner_id: [],
      test_doc_id: [],
      test_reaction_path: "",

      // ユーザー情報系
      name:'',
      email:'',
      photoUrl:'',
      emailVerified:'',
      uid:'',

      //システム系
      isLoading:true,
      isFinished:false,
      timestart: "",
      timelastanswered:"",

    }
  },
  methods: {
    showquiz(question) {
      this.radios = ''
      this.isQuiz = true;
      this.showing_question = question
    },
    answer(question, radio){
      this.isQuiz = false
      this.usersChoice[question.question_no] = radio

      // firestoreにデータ書き込み
      // TODO テスト経過時間を測って飛ばす。      
      const spenttime = Date.now()-this.timelastanswered
      this.timelastanswered = Date.now()
      const spenttimerounded = Math.round(spenttime/1000)
      const data = {
        doc_id: question.doc_id,
        question_no: question.question_no,
        question_text: question.question_text,
        choices: question.choices,
        answer: question.answer,
        user_choice: radio,
        result: radio==question.answer,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        spent_time: firebase.firestore.FieldValue.increment(spenttimerounded) // <--- 固定で15秒を入れてる。
        
      };
      // 自分の回答履歴を記録
      firestore.collection('users').doc(this.uid).collection('userAnswers').add(data)

      // 試験答案を作成者に送信
      // 更新できるなら更新する。
      firestore.doc(this.test_reaction_path).collection('questionReactions')
        .doc(question.doc_id).update(data)
        .then((rst) => {
        })
        .catch((err) => {
          // 更新できなければ新規作成する
          firestore.doc(this.test_reaction_path).collection('questionReactions')
            .doc(question.doc_id).set(data)
        });
    },
    finish() {
      this.timelastanswered= Date.now()
      const finishedtime= this.timelastanswered-this.timestart
      const finishedtimerounded = Math.round(finishedtime/1000)
      let score = 0
      // 得点を計算
      this.questions.forEach(question => {
        if(question.answer == this.usersChoice[question.question_no]){
          score = score + 1
        }
      })
      // テスト終了を打刻
      // TODO テストの経過時間を測って飛ばす。
      const finishTestData = {
        end_time: firebase.firestore.FieldValue.serverTimestamp(),
        score: score,
        spent_time: firebase.firestore.FieldValue.increment(finishedtimerounded)
      }
      firestore.doc(this.test_reaction_path).set(finishTestData, { merge: true })
        .then((rst) => {
          this.$router.push({name:'Result', query:{test_reaction_path: this.test_reaction_path}})
        })
        .catch((err) => {
          console.log('Error getting documents', err);
        });
      this.isFinished = true
    }
  },
  created() {
    this.timestart=Date.now()
    this.timelastanswered=Date.now()
    console.log(this.timestart)
    this.isLoading=true

    // ユーザー情報を取得
    const user = firebase.auth().currentUser;
    if (user != null) {
      this.name = user.displayName;
      this.email = user.email;
      this.photoUrl = user.photoURL;
      this.emailVerified = user.emailVerified;
      this.uid = user.uid;
    }

    // テストに関する情報を取得
    this.test_owner_id = this.$route.query.test_path.split('/')[1]
    this.test_doc_id = this.$route.query.test_path.split('/')[3]
    const questions = firestore.doc(this.$route.query.test_path).collection('questions').orderBy('question_no');
    questions.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data()
          data.doc_id = doc.id;
          this.questions.push(data)
        });
        this.isLoading=false
      })
      .catch((err) => {
        console.log('Error getting documents', err);
        this.isLoading=false
      });
    
    // テスト開始を宣言
    const initTestData = {
      test_doc_id: this.test_doc_id,
      start_time: firebase.firestore.FieldValue.serverTimestamp()
    }
    firestore.collection('users').doc(this.test_owner_id).collection('testReactions').add(initTestData)
      .then((rst) => {
        this.test_reaction_path=rst.path
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
