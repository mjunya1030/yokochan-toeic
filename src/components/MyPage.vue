<template>
  <div>
    <v-row>
      <v-col>
        <h3>プロフィール</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2" class="text-left" align-self="center">
        <v-avatar
          class="profile"
          color="accent"
          size="50"
        >
          <v-img v-if="photoUrl" :src="photoUrl"></v-img>
          {{ email.slice(0, 1).toUpperCase() }}
        </v-avatar>
      </v-col>
      <v-col cols="10" class="text-left" align-self="center" align="center">
        <p>メールアドレス: {{ email }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3 class="mt-10">最近解いた問題</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table>
          <template>
            <thead>
              <tr>
                <th class="text-center">No.</th>
                <th class="text-center">問題文</th>
                <th class="text-center">結果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="question in answeredQuestions">
                <td class="text-left"> {{ question.question_no }}</td>
                <td class="text-left"> {{ question.question_text }}</td>
                <td>
                  <v-chip color="accent" v-show="question.result">正解！</v-chip>
                  <v-chip color="error" v-show="!question.result">不正解</v-chip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <router-link to="/mypage">もっと見る</router-link>

    <v-row>
      <v-col>
        <h3 class="mt-10">あなたが作った問題</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table>
          <template>
            <thead>
              <tr>
                <th class="text-center">No.</th>
                <th class="text-center">問題文</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="question in myQuestions">
                <td class="text-left"> {{ question.question_no }}</td>
                <td class="text-left"> {{ question.question_text }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <router-link to="/mypage">もっと見る</router-link>
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
      answeredQuestions: [],
    }
  },
  methods: {
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

    // 自分が作った問題を取得
    const myQuestions = firestore.collection('users').doc(this.uid).collection('questions').orderBy('question_no').limit(5)
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
    const answeredQuestions = firestore.collection('users').doc(this.uid).collection('userAnswers').orderBy('timestamp').limit(5)
    answeredQuestions.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.answeredQuestions.push(doc.data())
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