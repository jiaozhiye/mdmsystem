/**
 * @Author: jzy
 * @Date: 2018/1/19
 * @Last Modified by: jzy
 * @Last Modified time: 2018/1/19
 */
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './routes'
import './routes/route-guards'
import _ from 'lodash'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'assets/js/validate'

Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
