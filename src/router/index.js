import Vue from 'vue'
import Router from 'vue-router'
import ListQuestion from '@/components/ListQuestion'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ListQuestion',
      component: ListQuestion
    }
  ],
  mode: 'history'
})
