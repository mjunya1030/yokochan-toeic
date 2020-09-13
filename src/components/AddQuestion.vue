<template>
  <div class="signin">
    <h2>オリジナル問題を登録する</h2>
    <v-form v-model=valid class="mt-10">
      <v-text-field outlined label="問題番号" v-model="question_no" :rules="[rules.required]"></v-text-field>
      <v-textarea outlined type="textfield" label="問題文" v-model="question_text" :rules="[rules.required]"></v-textarea>
      <v-text-field outlined label="選択肢:a" v-model="choice_a" :rules="[rules.required]"></v-text-field>
      <v-text-field outlined label="選択肢:b" v-model="choice_b" :rules="[rules.required]"></v-text-field>
      <v-text-field outlined label="選択肢:c" v-model="choice_c" :rules="[rules.required]"></v-text-field>
      <v-text-field outlined label="選択肢:d" v-model="choice_d" :rules="[rules.required]"></v-text-field>
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            color="primary"
            v-bind="attrs"
            v-on="on"
            label="正解を選んでください"
            outlined
            v-model="answer"
            :rules="[rules.required]"
          >
            
          </v-text-field>
        </template>

        <v-list>
          <v-list-item
            v-for="(choice, index) in choices"
            :key="index"
            @click="setAnswer(choice)"
          >
            <v-list-item-title>{{ choice }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-textarea outlined type="textfield" label="解説" v-model="explanation"></v-textarea>
      <v-btn
        @click="confirm"
        color="accent"
        depressed 
        rounded
        :disabled="!valid">確認する
      </v-btn>
    </v-form>

    <!-- ダイアログの中身 -->
    <v-dialog
      v-model="isConfirm"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline" align="start">これで問題を登録します</v-card-title>
        <v-card-text class="text-left">問題番号:{{question_no}}</v-card-text>
        <v-card-text class="text-left">問題文:{{question_text}}</v-card-text>
        <v-card outlined class="ma-2">
          <v-card-text class="text-left">選択肢A: {{choice_a}}</v-card-text>
          <v-card-text class="text-left">選択肢B: {{choice_b}}</v-card-text>
          <v-card-text class="text-left">選択肢C: {{choice_c}}</v-card-text>
          <v-card-text class="text-left">選択肢D: {{choice_d}}</v-card-text>
        </v-card>
        <v-card-text class="text-left">正解:{{answer}}</v-card-text>
        <v-card-text class="text-left">解説:{{explanation}}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="isConfirm = false"
          >
            やめる
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="register"
            :loading="loading"
            :disabled="loading||completed"
          >
            {{ registBtnName }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  
</template>

<script>
import firebase from 'firebase'
import firestore from '@/firebase/firestore'

export default {
  name: 'Signin',
  data: function () {
    return {
      valid: true,
      question_no: '',
      question_text: '',
      choice_a: '',
      choice_b: '',
      choice_c: '',
      choice_d: '',
      answer: '',
      explanation: '',
      loading: false,
      rules: {
        required: value => !!value || '必須項目です',
      },
      registBtnName: "登録する",
      isConfirm: false,
      completed: false,
    }
  },
  computed: {
    choices() {
      return [
        this.choice_a,
        this.choice_b,
        this.choice_c,
        this.choice_d,
      ]
    }
  },
  methods: {
    confirm() {
      console.log(this.valid)
      if(!this.valid){return}
      console.log(this.rules)
      this.isConfirm = true
    },
    async register() {
      this.loading = true
      const user = firebase.auth().currentUser;
      const data = {
        question_no: this.question_no,
        question_text: this.question_text,
        choices: {
          a: this.choice_a,
          b: this.choice_b,
          c: this.choice_c,
          d: this.choice_d
        },
        answer: this.answer,
        explanation: this.explanation,
      };
      firestore.collection('users').doc(user.uid).collection('questions').add(data).then(
        rst=>{
          this.loading = false
          this.completed = true
          this.registBtnName = "登録しました！"
        },
        err=>{
          console.log(err)
        }
      )
    },
    setAnswer(answer){
      this.answer = answer
    }
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
  border: 1px #42b983 !important;
}
textarea {
  margin: 10px 0;
  padding: 10px;
  border: 1px #42b983 !important;
}
</style>