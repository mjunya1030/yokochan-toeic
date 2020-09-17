<template>
  <div>
    <v-row>
      <v-col>
        <h3>プロフィール</h3>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-card flat outlined class="ma-4">
        <v-avatar
          class="profile"
          color="accent"
          size="50"
        >
          {{ user.email.slice(0, 1).toUpperCase() }}
        </v-avatar>
        <v-card-title>{{user.displayName}}</v-card-title>
        <v-card-text  class="text-left">メールアドレス: {{ user.email }}</v-card-text>
        <v-card-actions><v-btn color=primary @click="$router.push({name:'AddQuestion'})">問題をつくる</v-btn></v-card-actions>
      </v-card>
    </v-row>


    <v-row>
      <v-col>
        <h3 class="mt-10">あなたが最近解いた問題</h3>
      </v-col>
    </v-row>
    <div v-show="userTestResults.length!=0">
      <v-row align="center" justify="center" v-for="(testResult, key) in userTestResults" :key="key">
        <v-card
          class="my-3"
          flat
          outlined
          @click="$router.push({name:'Result', query: { test_reaction_path: testResult.test_doc_ref }})">
          <v-card-title>{{ testResult.start_time }}</v-card-title>
          <v-card-text>{{ testResult.score }}点/5点</v-card-text>
          <v-card-text>{{ testResult.spent_time }}秒</v-card-text>
        </v-card>
      </v-row>
      <!-- <router-link to="/mypage">もっと見る</router-link> -->
    </div>
    <div v-show="userTestResults.length==0">
      <p>答案履歴がありません…。どんどん問題を解いて、苦手を無くしましょう！</p>
    </div>



    <v-row>
      <v-col>
        <h3 class="mt-10">あなたが作った問題</h3>
      </v-col>
    </v-row>
    <div v-show="myQuestions.length!=0">
      <v-row>
        <v-col>
          <v-simple-table>
            <template>
              <thead>
                <tr>
                  <th class="text-center" id="your_no">No.</th>
                  <th class="text-center" id="your_text">問題文</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(question, key) in myQuestions" :key="key">
                  <td class="text-left"> {{ question.question_no }}</td>
                  <td class="text-left"> {{ question.question_text }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <router-link :to="{ name: 'ListQuestion', query: { uid: this.user.uid }}">もっと見る</router-link>
    </div>
    <div v-show="myQuestions.length==0">
      <p>まだ問題がありません…早速作ってみてましょう！</p>
      <v-btn color=primary @click="$router.push({name:'AddQuestion'})">問題をつくる</v-btn>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import firestore from '@/firebase/firestore'

export default {
  name: 'MyPage',
  data () {
    return {
      name:'',
      email:'',
      photoUrl:'',
      emailVerified:'',
      uid:'',
      myQuestions: [],
      userTestResults: [],
      user:{},
      reactions :[],
    }
  },
  methods: {
  },
  created() {
    const user = firebase.auth().currentUser;
    if (user != null) {
      this.user = user;
    }

    // 自分が作った問題を取得
    const myQuestions = firestore.collection('users').doc(this.user.uid).collection('questions').orderBy('question_no').limit(5)
    myQuestions.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.myQuestions.push(doc.data())
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
    
    // 過去に解いた問題を取得
    const userTestResults = firestore.collection('users').doc(this.user.uid).collection('userTestResults').orderBy('start_time', 'desc').limit(5)
    userTestResults.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.userTestResults.push(doc.data())
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
    
    // 自分が作った問題に対する回答を取得
    const reactions = firestore.collection('users').doc(this.user.uid).collection('reactions').orderBy('timestamp', 'desc').limit(5)
    reactions.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.reactions.push(doc.data())
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
</style>