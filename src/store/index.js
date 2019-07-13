import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import common from './modules/common'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
		token:'',
		user:{}
	},
  modules: {
    common,
    user
  },
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        // state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key])
      })
    },
    set_token(state, token) {
			state.token = token
			sessionStorage.setItem("token", token);  
		},
		set_user(state, user) {
			state.user = user
			sessionStorage.setItem("username", user.username);  
		},
		del_token(state) {
			state.token = ''
			state.user = {}
			sessionStorage.clear()
		}
  },
  strict: process.env.NODE_ENV !== 'production'
})
