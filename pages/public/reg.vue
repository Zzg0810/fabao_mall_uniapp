<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 設置白色背景防止軟鍵盤把下部絕對定位元素頂上來蓋住輸入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">註冊</view>
			<view class="welcome">歡迎回來！</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">地區</text>
					<div style="display: flex; ">
					<picker @change="bindPickerChange" :value="index" :range="countrycodelist" class="country-picker">
					     <view class="uni-input" v-model="country">{{countrycodelist[index]}}</view>
					 </picker>
					</div>
				</view>
				<view class="input-item">
					<text class="tit">手機號碼</text>
					<div style="display: flex; ">
					
					<input type="number" v-model="phone" placeholder="請輸入手機號碼" style="margin-left: 20upx;"/>
					</div>
				</view>
				<view class="input-item">
					<text class="tit">驗證碼</text>
					<view class="cont">
						<input type="number" placeholder="請輸入驗證碼" v-model="code" @confirm="reg" />
						<text class="getCode" @click="getCode">{{codeMsg}}</text>
					</view>
				</view>
				<view class="input-item">
					<text class="tit">密碼</text>
					<input type="password" placeholder="請輸入密碼" v-model="password" @confirm="reg" />
				</view>
				<view class="input-item">
					<text class="tit">確認密碼</text>
					<input type="password" placeholder="請輸入確認密碼" v-model="confimpassword" @confirm="reg" />
				</view>
				<view class="input-item" v-if="false">
                	<text class="tit">邀請碼</text>
                	<input type="number" v-model="invitecode" placeholder="請輸入邀請碼" />
               </view>
			</view>
			<button class="confirm-btn" @click="reg" :disabled="logining">註冊</button>
			<view class="forget-section" @click="toForget">忘記密碼?</view>
		</view>
		<view class="register-section">
			已經有賬號?
			<text @click="toRegist">馬上登錄</text>
		</view>
		
	</view>

</template>

<script>
import { mapMutations } from 'vuex';
import Api from '@/common/api';
const phoneReg = /^1[1-9][0-9]\d{8}$/;
export default {
components: {
		
	},
	data() {
		return {
			invitecode:'',
			country: '86',
			phone: '',
			code: '',
			password: '',
			confimpassword: '',
			logining: false,
			countrycodelist: ['86','852'],
			index: 0,
			coutryList:[],
			codeMsg: '獲取驗證碼',
			isSend: false,
			timers: null
			
		};
	},
	onLoad() {
		this.getcountry();
	},
	methods: {
		async getCode () {
			const {phone, country} = this
			if (!country) {
				this.$api.msg('請選擇地區');
				return
			}
			if (!phone) {
				this.$api.msg('請輸入手機號');
				return
			}
			console.log(country);
			if (country==86 && !phoneReg.test(phone)) {
				this.$api.msg('請輸入正確的手機號');
				return
			}
			let params = {}
			params = {
				country,
				phone,
				type: 'reg'
			}
			const  data = await Api.apiCall('post', Api.index.sendCodes, params);
			if (data.key) {
				this.$api.msg('發送成功')
				this.animation()
			}
		},
		animation () {
			if (this.isSend) {
				this.$api.msg('已發送')
				return
			}
			this.isSend = true
			let count = 180, str = ''
			this.timers = setInterval(() => {
				count--
				this.codeMsg = count+'s'
				if (count<=0) {
					clearInterval(this.timers)
					this.timers = null
					this.codeMsg = '獲取驗證碼'
					this.isSend =false
				}
			}, 1000)
		},
		inputChange(e) {
			const key = e.currentTarget.dataset.key;
			this[key] = e.detail.value;
		},
		navBack() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		toForget(){
        				uni.navigateTo({
        						url: '../../pagesU/user/forget'
        				})
        			},
		toRegist() {
			uni.navigateTo({
				url: '/pages/public/login'
			});
		},
		async reg() {
			
			try {
				if (this.country == '') {
					throw '請填寫國別區號';
				}
				if (this.phone == '') {
					throw '請填寫手機號';
				}
				console.log(this.country);
				if (this.country=='86' && !phoneReg.test(this.phone)) {
					throw '手機號格式有誤';
				}
				if (this.password == '') {
					throw '請填寫密碼';
				}
			} catch (err) {
				this.$api.msg(err);
				return;
			}

			let params ;
			
			//有推薦碼的話，帶上
			var invitecode = uni.getStorageSync('invitecode')
			// 
			if (invitecode) {
				data.invitecode = invitecode
				params = { 
					country: this.country, 
					phone: this.phone, 
					code: this.code,
					password: this.password, 
					confimpassword: this.confimpassword ,
					source:3,
					invitecode:invitecode};
			}else {
				params = { 
					country: this.country, 
					phone: this.phone, 
					code: this.code,
					password: this.password, 
					confimpassword: this.confimpassword ,
					source:3,
					invitecode:this.invitecode,
				};
			}
			let data = await Api.apiCall('post', Api.index.simpleReg, params);
			this.$api.msg('註冊成功')
			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},1000)
		},
		async getcountry(){
		  let params = {}
		  let data = await Api.apiCall('get', Api.index.coutryList, params);
		  let code = []
		  for (var value of data) {
			code.push(value.country)
		  }
		  this.countrycodelist = code;
		  this.coutryList = data || []
		},
		bindPickerChange: function(e) {
			console.log('picker發送選擇改變，攜帶值為', e.target.value)
			this.index = e.target.value
			this.country = this.coutryList[this.index].code
		},
	}
};
</script>

<style lang="scss" scoped>
page {
	background: #fff;
}
.container {
	padding-top: 115px;
	position: relative;
	width: 100vw;
	height: 120vh;
	overflow: hidden;
	background: #fff;
}
.wrapper {
	position: relative;
	z-index: 90;
	background: #fff;
	padding-bottom: 30upx;
}
.back-btn {
	position: absolute;
	left: 40upx;
	z-index: 9999;
	padding-top: var(--status-bar-height);
	top: 40upx;
	font-size: 40upx;
	color: $font-color-dark;
}
.left-top-sign {
	font-size: 120upx;
	color: $page-color-base;
	position: relative;
	left: -16upx;
}
.right-top-sign {
	position: absolute;
	top: 80upx;
	right: -30upx;
	z-index: 95;
	&:before,
	&:after {
		display: block;
		content: '';
		width: 400upx;
		height: 80upx;
		background: #b4f3e2;
	}
	&:before {
		transform: rotate(50deg);
		border-radius: 0 50px 0 0;
	}
	&:after {
		position: absolute;
		right: -198upx;
		top: 0;
		transform: rotate(-50deg);
		border-radius: 50px 0 0 0;
		/* background: pink; */
	}
}
.left-bottom-sign {
	position: absolute;
	left: -270upx;
	bottom: -320upx;
	border: 100upx solid #d0d1fd;
	border-radius: 50%;
	padding: 180upx;
}
.welcome {
	position: relative;
	left: 50upx;
	top: -90upx;
	font-size: 46upx;
	color: #555;
	text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}
.input-content {
	padding: 0 60upx;
}
.input-item {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding: 0 30upx;
	background: $page-color-light;
	height: 120upx;
	border-radius: 4px;
	margin-bottom: 50upx;
	&:last-child {
		margin-bottom: 0;
	}
	.tit {
		height: 50upx;
		line-height: 56upx;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
	}
	input {
		height: 60upx;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		width: 100%;
	}
}

.confirm-btn {
	width: 630upx;
	height: 76upx;
	line-height: 76upx;
	border-radius: 50px;
	margin-top: 70upx;
	background: $uni-color-primary;
	color: #fff;
	font-size: $font-lg;
	&:after {
		border-radius: 100px;
	}
}
.forget-section {
	font-size: $font-sm + 2upx;
	color: $font-color-spec;
	text-align: center;
	margin-top: 40upx;
}
.register-section {
	position: absolute;
	left: 0;
	bottom: 40upx;
	width: 100%;
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	text-align: center;
	text {
		color: $font-color-spec;
		margin-left: 10upx;
	}
}
.country-picker{font-size: 30upx;margin-top: 9upx;color: #1482D1; font-weight: 700;}
.cont {
	display:flex;
	align-items: center;
	height: 60upx;
	width: 100%;
	justify-content: space-between;
	uni-input {
		width: 60%;
	}
	.getCode {
		padding: 6rpx 8rpx;
		font-size: 26rpx;
		background: #007AFF;
		color: #fff;
		width: 150rpx;
		text-align: center;
		border-radius: 4rpx;
	}
}
</style>
