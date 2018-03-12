// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import store from './store'
import Vuex from 'Vuex'
import { AjaxPlugin, md5, ToastPlugin } from 'vux'
import VueSocketIo from 'vue-socket.io'

Vue.prototype.$md5 = md5
Vue.use(VueSocketIo, 'http://0.0.0.0:3000')
Vue.use(AjaxPlugin)
Vue.use(ToastPlugin)
Vue.use(Vuex)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app-box',
  router,
  store,
  render: h => h(App)
})
