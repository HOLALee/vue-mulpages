import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/page2/sub-pages/main'
import Page2Sub from '@/pages/page2/sub-pages/sub'

Vue.use(Router)

let r = new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      meta: {
        title:'Page2主要页面'
      }
    },
    {
      path: '/page2sub',
      name: 'Page2Sub',
      component: Page2Sub,
      meta: {
        title:'Page2子页面'
      }
    },
  ]
})

export default r
