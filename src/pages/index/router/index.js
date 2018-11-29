import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/index/sub-pages/main'
import IndexSub from '@/pages/index/sub-pages/indexSub'

Vue.use(Router)

let r = new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      meta: {
        title:'首页主要页面'
      }
    },
    {
      path: '/indexsub',
      name: ' IndexSub',
      component: IndexSub,
      meta: {
        title:'首页子页面'
      }
    },
  ]
})

export default r
