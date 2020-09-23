<template>
  <div>
    <v-row>
      <v-col>
        <h3>プロフィール</h3>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-card flat outlined class="ma-4" width=100%>
        <v-avatar
          class="profile"
          color="accent"
          size="50"
        >
          {{ user.email.slice(0, 1).toUpperCase() }}
        </v-avatar>
        <v-card-title>{{user.displayName}}</v-card-title>
        <v-card-text  class="text-left">メールアドレス: {{ user.email }}</v-card-text>
        <!-- <v-card-actions><v-btn color=primary @click="$router.push({name:'AddQuestion'})">問題をつくる</v-btn></v-card-actions> -->
      </v-card>
    </v-row>


    <v-row>
      <v-col>
        <h3 class="mt-10">あなたが最近解いた問題</h3>
      </v-col>
    </v-row>
    <div v-show="userTestResults.length!=0" class="ma-4">
      <v-row align="center" justify="center" v-for="(testResult, key) in userTestResults" :key="key">
        <v-card
          class="my-3"
          flat
          outlined
          width=100%>
          <v-card-title>{{ testResult.title }}</v-card-title>
          <v-card-text class="text-left py-1">受けた日: {{ testResult.start_time.toDate().getFullYear() + "-" + (testResult.start_time.toDate().getMonth()+1) + "-" + testResult.start_time.toDate().getDate() }}
            {{ testResult.start_time.toDate().getHours() + "時" + testResult.start_time.toDate().getMinutes() + "分" + testResult.start_time.toDate().getSeconds() + "秒"}}</v-card-text>
          <v-card-text class="text-left py-1">平均点: {{ testResult.average_score }}点/5点</v-card-text>
          <v-card-text class="text-left py-1">目標回答時間: {{ testResult.target_time }}秒</v-card-text>
          <v-divider></v-divider>
          <div v-show="testResult.score">
            <v-card-subtitle>あなたの結果</v-card-subtitle>
            <v-card-text class="text-left py-1">得点: {{ testResult.score }}点/5点</v-card-text>
            <v-card-text class="text-left py-1">かかった時間: {{ testResult.spent_time }}秒</v-card-text>
            <v-card-actions class="justify-end"><v-btn text color=accent @click="$router.push({name:'Result', query: { test_reaction_path: testResult.test_reaction_path }})">結果を詳しく見る</v-btn></v-card-actions>
          </div>
          <div v-show="!testResult.score">
            <v-card-text class="text-left">このテストは完了しませんでした</v-card-text>
            <v-card-actions class="justify-end"><v-btn text color=primary @click="$router.push({name:'ListQuestion', query:{test_path: testResult.test_doc_ref}})">もう一度受ける</v-btn></v-card-actions>
          </div>
        </v-card>
      </v-row>
      <!-- <router-link to="/mypage">もっと見る</router-link> -->
    </div>
    <div v-show="userTestResults.length==0">
      <p>答案履歴がありません…。どんどん問題を解いて、苦手を無くしましょう！</p>
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