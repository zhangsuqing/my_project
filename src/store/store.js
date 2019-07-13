import Vue from 'vue'
import Vuex from 'vuex'
 
 
Vue.use(Vuex)
 
export default new Vuex.Store({
	state:{
		token:'',
		user:{}
	},	
	mutations:{
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
	}
})