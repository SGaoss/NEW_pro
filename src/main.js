import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 下面这个样式文件中已经包含重置样式和图标样式
import '@/styles/index.less'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入路由模块
import router from '@/router.js'
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
// 路由请求都会经过这个导航守卫，是个中间件
router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('itcast_pro_token')
  console.log(to, from, next)
  if (token || to.path === '/login') {
    next()
  } else {
    next({ name: 'Login' })
  }
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
