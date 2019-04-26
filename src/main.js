import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import {store} from './store/store'
import './registerServiceWorker'
import VueLeaflet from 'vueleaflet'

Vue.config.productionTip = false

Vue.use(VueLeaflet.plugin,store);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
