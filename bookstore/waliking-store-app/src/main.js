import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式
import './assets/css/index.scss'
// 弹框插件
import 'vue-layer-mobile/need/layer.css'
import layer from 'vue-layer-mobile'
Vue.use(layer)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
