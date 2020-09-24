<template>
  <div class="result">
    <h2>結果</h2>
    <v-card flat outlined class="pa-2 mt-5 mb-10">
      <v-card-title>テストサマリー</v-card-title>
      <tr>
        <td class="text-left pa-2">得点</td>
        <td class="text-left pa-2">{{ testResult.score }}点/5点</td>
      </tr>
      <tr>
        <td class="text-left pa-2">このテストの平均点</td>
        <td class="text-left pa-2">{{ testInfo.average_score }}点/5点</td>
      </tr>
      <tr>
        <td class="text-left pa-2">テストにかかった時間</td>
        <td class="text-left pa-2">{{ testResult.spent_time }}秒</td>
      </tr>
      <tr>
        <td class="text-left pa-2">このテストの目標時間</td>
        <td class="text-left pa-2">{{ testInfo.target_time }}秒</td>
      </tr>
    </v-card>


    <v-simple-table>
      <template>
        <thead>
          <tr>
            <th class="text-center" id="no">No.</th>
            <th class="text-center" id="res">正否</th>
            <th class="text-center" id="res">かかった時間</th>
            <th class="text-center" id="res">目標回答時間</th>
            <th class="text-center" id="res">みんなの正答率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(question, key) in questionsInfo" :key="key">
            <td class="text-left">{{ question.question_no }}</td>
            <td>
              <v-chip color="accent" v-show="question.result&&question.spent_time" small>正解！</v-chip>
              <v-chip color="error" v-show="!question.result&&question.spent_time" small>不正解…</v-chip>
              <v-chip color="secondary" v-show="!question.spent_time" small>未回答</v-chip>
              
            </td>
            <td v-show="question.spent_time">{{ question.spent_time }}秒</td><td v-show="!question.spent_time">-</td>
            <td>{{ question.target_time }}秒</td>
            <td>{{ question.rate_collect_answer * 100}}%</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-divider class="my-10"></v-divider>

    <h2>解説</h2>
    <template v-for="(question, key) in questionsInfo">
      <v-card :key="key" flat outlined class="my-2">
        <v-card-title  class="text-left">{{ question.question_no }}</v-card-title>
        <v-card-subtitle class="text-left">問題文</v-card-subtitle>
        <v-card-text class="text-left">{{ question.question_text }}</v-card-text>
        <v-card-subtitle class="text-left">選択肢</v-card-subtitle>
        <v-list>
          <v-list-item dense>{{ question.choices.a }}<v-chip color="accent" v-show="question.choices.a == question.answer"  class="ml-5">正解</v-chip><v-chip color="primary" v-show="question.choices.a == question.user_choice"  class="ml-5">あなたの回答</v-chip></v-list-item>
          <v-list-item dense>{{ question.choices.b }}<v-chip color="accent" v-show="question.choices.b == question.answer"  class="ml-5">正解</v-chip><v-chip color="primary" v-show="question.choices.b == question.user_choice"  class="ml-5">あなたの回答</v-chip></v-list-item>
          <v-list-item dense>{{ question.choices.c }}<v-chip color="accent" v-show="question.choices.c == question.answer"  class="ml-5">正解</v-chip><v-chip color="primary" v-show="question.choices.c == question.user_choice"  class="ml-5">あなたの回答</v-chip></v-list-item>
          <v-list-item dense>{{ question.choices.d }}<v-chip color="accent" v-show="question.choices.d == question.answer"  class="ml-5">正解</v-chip><v-chip color="primary" v-show="question.choices.d == question.user_choice"  class="ml-5">あなたの回答</v-chip></v-list-item>
        </v-list>
        <v-card-subtitle class="text-left">解説</v-card-subtitle>
        <v-card-text v-show="question.explanation">{{ question.explanation }}</v-card-text>
        <v-card-text v-show="!question.explanation">この問題にはまだ解説はありません。</v-card-text>
      </v-card>
    </template>




  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
import firebase from 'firebase'

export default {
  name: 'Result',
  data: function () {
    return {
      questionResult: [],
      testResult: {},
      test_owner_id: '',
      questionsInfo: [],
      testInfo: {},
      test: ""
    }
  },
  methods: {
    async getTestDataAsync() {
      // ユーザのテスト回答情報を取得
      const resultDb = firestore.doc(this.$route.query.test_reaction_path)
      const testResult = await resultDb.get()
      this.testResult = testResult.data()

      // ユーザの問題情報を取得
      const questionResult = await resultDb.collection('questionReactions').get()
      questionResult.forEach((doc) => {
        this.questionResult.push(doc.data())
      });

      // テスト作成者によるテスト情報を取得
      const testDb = firestore.collection('users').doc(this.test_owner_id).collection('tests').doc(this.testResult.test_doc_id)
      const testInfo = await testDb.get()
      this.testInfo = testInfo.data()

      // テスト作成者による問題情報を取得
      const questionsInfo = await testDb.collection('questions').orderBy('question_no').get()
      questionsInfo.forEach((doc) => {
        this.questionsInfo.push(doc.data())
      });

      this.questionResult.forEach((question_r) => {
        this.questionsInfo.forEach((question_i) => {
          if(question_r.question_no == question_i.question_no){
            question_i["spent_time"] = question_r.spent_time
            question_i["result"] = question_r.result
            question_i["user_choice"] = question_r.user_choice
          }
        });
      });
    }
    
  },
  created() {
    // テストに関する情報を取得
    this.test_owner_id = this.$route.query.test_reaction_path.split('/')[1]
    // const testResult = firestore.doc(this.$route.query.test_reaction_path)
    this.getTestDataAsync();
    this.$ga.page('/result');
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
.signin {
  margin-top: 20px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center
}
input {
  margin: 10px 0;
  padding: 10px;
}
</style>