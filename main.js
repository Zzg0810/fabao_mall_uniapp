import Vue from 'vue'
import store from './store'
import App from './App'
import * as otherApi from './config/api.js'

import $mConstDataConfig from '@/common/constData.config.js';
import $mSettingConfig from '@/common/setting.config.js';
import * as Common from './config/common.js'
import * as Db from './config/db.js'
import '@/config/langChange.js'
import Json from './Json' //测试用数据
/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type=>{
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
    // #ifdef H5
    return prePage;
    // #endif

	return prePage.$vm;
}
const moment = times => {
	return {
		format (type = false) {
			let ds = ''
			ds = new Date(times)
			let y,m,d,h,mm,s
			y =ds.getFullYear()
			m = ds.getMonth() + 1
			d = ds.getDate()
			h = ds.getHours()
			mm = ds.getMinutes()
			s  = ds.getSeconds()
			m = m < 10 ? '0'+m : m
			d = d < 10 ? '0'+d : d
			h = h < 10 ? '0'+h : h
			mm = mm < 10 ? '0'+mm : mm
			s = s < 10 ? '0'+s : s
			return !type ? (y + "-"+ m +"-"+d) : (y + "-"+ m +"-"+d+ " "+h+':'+m+':'+s)
		}
	}
}
const loading = (status = true) => {
	status ? uni.showLoading() : uni.hideLoading()
}
Vue.prototype.$otherApi = otherApi;
Vue.prototype.$common = Common;
Vue.prototype.$db = Db;
Vue.prototype.$mConstDataConfig = $mConstDataConfig;
Vue.prototype.$mSettingConfig = $mSettingConfig;
Vue.prototype.$moment = moment
Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {msg, json, prePage};
Vue.prototype.$loading = loading
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
