import Vue from 'vue'
import Vuex from 'vuex'
import {get, set} from '@/config/db'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo:'',
		isChina: get('isChina') || 0,
		unit: get('isChina') == 1 ? '￥' : 'HK$'
	},
	getters:{
		getIsChina (state) {
			return state.isChina
		},
		unit (state) {
			return state.isChina == 1 ? '￥' : 'HK$'
		}
	},
	mutations: {
		login(state, provider) {
		console.log(provider);
			if (provider && provider!=undefined){
                state.hasLogin = true;
				uni.setStorage({//缓存用户登陆状态
					key: 'userInfo',
					data: provider.userInfo
				})
				state.userInfo = provider;
			}
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = '';
			uni.removeStorage({
                key: 'userInfo'
            })
		},
		setChina (state, provider) {
			set('isChina', provider)
			state.isChina = provider
		}
	},
	actions: {
		actionSetChina ({commit}, provider) {
			commit('setChina', provider)
		}
	}
})

export default store
