<template>
  <div class="hello">
    <div v-show="questions.length==0&&isLoading==false">この人が作った問題はまだないようです…。</div>
    <div v-if="questions.length!=0">
      <p class="text-center">問題に挑戦してみよう！</p>


      <!-- ここから一覧 -->
      <v-stepper v-model="e1">
        <v-stepper-items  v-for="(question, key) in questions" :key="`second-${key}`">
          <v-stepper-content :step="question.question_no">
            <v-card
              outlined
              flat
              height="200px"
            >
              <v-card-title>{{ question.question_no }}</v-card-title>
              <v-card-text>{{ question.question_text }}</v-card-text>
            </v-card>
            <v-radio-group v-model="radios" :mandatory="false" class="ma-3">
              <v-radio :label="question.choices.a" :value="question.choices.a"></v-radio>
              <v-radio :label="question.choices.b" :value="question.choices.b"></v-radio>
              <v-radio :label="question.choices.c" :value="question.choices.c"></v-radio>
              <v-radio :label="question.choices.d" :value="question.choices.d"></v-radio>
            </v-radio-group>
            
            <!-- 回答ボタン -->
            <v-row class="py-5" no-gutters>
              <v-btn
                color="primary"
                @click="answer(question, radios)"
                deprresed
                block
              >
                回答する
              </v-btn>
            </v-row>
            <v-divider></v-divider>

            <!-- 正解を表示 -->
            <v-row class="py-5" no-gutters v-show="isAnswered"
              justify="space-between">
              <v-col cols=12>
                <v-chip flat color="light-green" v-show="question.answer==usersChoice[question.question_no]" >正解！</v-chip>
                <v-chip flat color="light-gray" v-show="question.answer!==usersChoice[question.question_no]" >不正解</v-chip>
              </v-col>
              <v-col cols=12>
                <v-simple-table>
                  <template>
                    <tbody>
                      <tr class="text-left" >
                        <td>答え:</td>
                        <td>{{question.answer}}</td>
                      </tr>
                      <tr class="text-left" >
                        <td>正答率:</td>
                        <td>{{ question.rate_collect_answer * 100}}%</td>
                      </tr>
                      <tr class="text-left" >
                        <td>平均回答時間:</td>
                        <td>{{question.ave_time}}秒</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-btn
                color="secondary"
                @click="openComments(question.doc_id)"
                deprresed
                fab
                align-self="end"
                outlined
                small
              >
               <v-icon>mdi-chat-processing-outline</v-icon>
              </v-btn>
            </v-row>

            <v-divider></v-divider>

            <!-- 前の問題と次の問題 -->
            <v-row class="py-5" no-gutters justify="space-between">
              <v-btn
                color="primary"
                @click="goBack"
                v-show="e1>101"
                text
              >
                前の問題
              </v-btn>
              
              <v-btn
                color="primary"
                @click="goOn"
                class="align-self-end"
                deprresed
              >
                次の問題
              </v-btn>
            </v-row>




            
          </v-stepper-content>
          
        </v-stepper-items>
        <v-stepper-content step = "106">
            <v-card
              class="mb-12"
              height="200px"
              flat

            >
            お疲れ様でした！次のページでテスト結果を振り返りましょう。
            </v-card>
            <v-btn
              color="primary"
              @click="e1 = e1 - 1"
              deprresed
            >
              戻る
            </v-btn>
            <v-btn
              color="primary"
              @click="finish"
              deprresed
            >
              結果をみる
            </v-btn>
          </v-stepper-content>
      </v-stepper>

      
      <!-- ここで一覧終わり -->
    </div>

    <v-dialog
      v-model="showComments"
      max-width="290"
    >
      <v-card class="pa-5">
        <v-card v-for="(testComment, key) in testComments" :key="key" class="my-2" flat outlined>
          <v-card-text class="text-left">{{testComment.userName}}</v-card-text>
          <v-card-text class="text-left">{{testComment.content}}</v-card-text>
        </v-card>
        <v-text-field outlined v-model="userComment"></v-text-field>
        <v-btn
          @click="addComment()"
          color="secondary"
          depressed 
          rounded>コメントする
        </v-btn>
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
      testComments: [],
      currentQuestionId: {},

      // ユーザー情報系
      name:'',
      email:'',
      photoUrl:'',
      emailVerified:'',
      uid:'',

      //システム系
      isLoading:true,
      isFinished:false,
      isAnswered:false,
      timestart: "",
      timelastanswered:"",
      e1: 101, //v-stepper
      showComments:false,

      userComment:"",

    }
  },
  methods: {
    showquiz(question) {
      this.radios = ''
      this.isQuiz = true;
      this.showing_question = question
      this.$ga.event('listQuestion', 'showQuiz', question.question_no, 1)
    },
    answer(question, radio){     
      //this.isQuiz = false
      // 今、radioの中身はユーザが選んだ"A:needed"。
      // で、quesiton_noは101。
      // usersChoiceは {} (=中身からっぽ)

      // usersChoice[question.question_no] とすると、 { "101": "(ここはまだ何かわかってない)"" } となる。
      // usersChoice[question.question_no] = radio とすると、{ "101": "<< radioの中身 >>" } が入るので、
      // usersChoiceは  {"101": "A:needed"} が完成！ 

      // 101のユーザの答えが知りたければ、
      // usersChoice[question.question_no]　とすれば、A:needed　が帰ってくるはず、、という事になる。
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
        answerer_id: this.uid,
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
      this.$ga.event('listQuestion', 'answer', spenttimerounded, 1)

      // 回答した後に正解を表示
      this.isAnswered=true
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
      this.$ga.event('listQuestion', 'finish', finishedtimerounded, 1)
    },
    goOn() {
      this.e1 = this.e1 + 1
      this.isAnswered = false
    },
    goBack() {
      this.e1 = this.e1 - 1
      this.isAnswered = false
    },
    fetchComments(questionId) {
      this.testComments = []
      const questions = firestore.doc(this.$route.query.test_path).collection('questions').doc(questionId).collection('comments').orderBy('time');
      questions.get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {

            // this.testComent=doc.data()
            this.testComments.push(doc.data())         
            // 一個めの中身何？
            //var data = doc.data()
            //data.doc_id = doc.id;
            //this.questions.push(data)
          });
          this.isLoading=false
        })
        .catch((err) => {
          console.log('Error getting documents', err);
          this.isLoading=false
        });
    },
    openComments(questionId){
      this.currentQuestionId = questionId
      this.fetchComments(questionId)
      this.showComments=true
    },
    addComment() {
      const commentContent = {
        uid: this.uid,
        content:this.userComment,
        userName:this.name,
        time:firebase.firestore.FieldValue.serverTimestamp(),
      }
      firestore.doc(this.$route.query.test_path).collection('questions').doc(this.currentQuestionId).collection('comments').add(commentContent);
      console.log(this.userComment)
      this.fetchComments(this.currentQuestionId)
    }
    
  },
  created() {
    this.timestart=Date.now()
    this.timelastanswered=Date.now()
    this.isLoading=true

    // ユーザー情報を取得
    const user = firebase.auth().currentUser;
    if (user != null) {
      this.email = user.email;
      this.uid = user.uid;
    }

    firestore.collection('users').doc(this.uid).get()
      .then((doc) => {
        this.name = doc.data().displayName
      })

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
      test_doc_ref: this.$route.query.test_path,
      start_time: firebase.firestore.FieldValue.serverTimestamp(),
      answerer_id: this.uid
    }
    firestore.collection('users').doc(this.test_owner_id).collection('testReactions').add(initTestData)
      .then((rst) => {
        this.test_reaction_path=rst.path
        // 答案にメタデータを追加
        firestore.doc(this.$route.query.test_path).get()
        .then((doc)=>{
          firestore.doc(this.test_reaction_path).set({
            test_reaction_path:this.test_reaction_path,
            test_reaction_id:rst.id,
            title:doc.data().title,
            average_score:doc.data().average_score,
            time_ave:doc.data().time_ave,
            target_time:doc.data().target_time,
            description:doc.data().description,
            comment:doc.data().comment
          }, { merge: true })
        })
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
    this.$ga.page('/listQuestion');
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
