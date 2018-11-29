import Vue from 'vue'
// import Icon from 'vue-svg-icon/Icon.vue'
import store from '@/store'  // store模块
import DataCacheObject from '@/store/dataObject'  // 数据缓存对象模板 

//import 'amfe-flexible'
import 'lib-flexible'
// 引入调试模块 
//import eruda from 'eruda'
// 打开调试工具
//eruda.init()
import '@/sw'

// js功能扩展
import '@/lib/JS-Extend'

// 引入util
import util from '@/lib/util'
import service from '@/lib/service'
import CONSTANT from '@/lib/Constant'

Vue.config.productionTip = false

import axios from '@/lib/axios-hk'
// 挂在工具组件
Vue.prototype.$axios = axios
Vue.prototype.$util = util
Vue.prototype.$service = service
Vue.prototype.$const = CONSTANT

// 缓存数据对象模板，用于重置缓存数据
Vue.prototype.$dataCacheObject = DataCacheObject.data 

export default{
	Vue: Vue,
	store: store
}
