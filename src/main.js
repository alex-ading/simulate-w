import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

let options = {
  fullscreenEl: false //关闭全屏按钮
}

Vue.use(preview, options)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
