// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// 引入公共模块
import Lib from '@/lib'
import App from './index.vue'
import router from './router'

/* eslint-disable no-new */
new Lib.Vue({
  el: '#app',
  store: Lib.store,
  router,
  template: '<App/>',
  components: { App }
})
