/**
 * @Author: jzy
 * @Date: 2018/1/19
 * @Last Modified by: jzy
 * @Last Modified time: 2018/1/19
 */
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueRouter from 'vue-router'
import routes from './routes'
import _ from 'lodash'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'common/js/validate'

Vue.use(VueRouter)
const router = new VueRouter(routes)

Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
