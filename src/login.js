/**
 * @Author: jzy
 * @Date: 2018/2/7
 * @Last Modified by: jzy
 * @Last Modified time: 2018/2/7
 */
import Vue from 'vue'
import Login from './Login.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'assets/js/validate'

Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(Login)
})
