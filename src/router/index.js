import Vue from 'vue'
import Router from 'vue-router'
import ListQuestion from '@/components/ListQuestion'
import Result from '@/components/Result'
import ListTests from '@/components/ListTests'
import AddQuestion from '@/components/AddQuestion'
import MyPage from '@/components/MyPage'
import Signin from '@/components/Signin'
import Signup from '@/components/Signup'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: 'signin'
    },
    {
      path: '/',
      name: 'listTests',
      component: ListTests,
      meta: { requiresAuth: true }
    },
    {
      path: '/listQuestion/',
      name: 'ListQuestion',
      component: ListQuestion,
      meta: { requiresAuth: true }
    },
    {
      path: '/result/',
      name: 'Result',
      component: Result,
      meta: { requiresAuth: true }
    },
    {
      path: '/addQuestion',
      name: 'AddQuestion',
      component: AddQuestion,
      meta: { requiresAuth: true }
    },
    {
      path: '/mypage',
      name: 'MyPage',
      component: MyPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        next()
      } else {
        next({
          path: '/signin',
          query: { redirect: to.fullPath }
        })
      }
    })
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})


export default router