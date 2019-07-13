import Vue from 'vue';
import App from '@/App';
import router from '@/router';
import store  from '@/store';
import VueCookie from 'vue-cookie'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/scss/index.scss'
import loading from '@/utils/loading'
import message from '@/utils/message'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios

import  '@/icons' 
import { isAuth } from '@/utils'
Vue.config.productionTip = false;
Vue.use(VueCookie);
Vue.use(ElementUI);


Vue.prototype.$loading = loading
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法
Vue.prototype.$store = store
Vue.prototype.$msg = message
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
