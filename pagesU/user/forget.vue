<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack" v-if="false"></view>
		<view class="right-top-sign"></view>
		<!-- 設置白色背景防止軟鍵盤把下部絕對定位元素頂上來蓋住輸入框等 -->
		<view class="wrapper">
			<view class="left-top-sign" v-if="false">LOGIN</view>
			<view class="welcome"  v-if="false">
				忘記密碼！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">國家地區</text>
					<div style="display: flex; ">
					<picker @change="bindPickerChange" :value="index" :range="countrycodelist" class="country-picker">
					     <view class="uni-input" v-model="country">{{countrycodelist[index]}}</view>
					 </picker>
					</div>
				</view>
				<view class="input-item">
					<text class="tit">手機號碼</text>
					<input type="number" :value="phone" placeholder="請輸入手機號碼" maxlength="11" data-key="phone"
						@input="onKeyInput" />
				</view>
				<view class="input-item">
					<text class="tit">密碼</text>
					<input type="mobile" value="" placeholder="6~16位不含特殊字符的數字、字母組合" placeholder-class="input-empty"
						maxlength="20" password data-key="password" @input="inputChange" />
				</view>
				<view class="input-item">
					<text class="tit">確認密碼</text>
					<input type="mobile" value="" placeholder="6~16位不含特殊字符的數字、字母組合" placeholder-class="input-empty"
						maxlength="20" password data-key="confimpassword" @input="inputChange" />
				</view>
				<view class="verificationBox">
					<view class="verificationCon">
						<text class="verificationLeft">驗證碼</text>
						<input type="text" value="" @input="onKeyverification" placeholder="請輸入驗證碼"
							placeholder-style="font-size:26upx;color:#444444" class="verificationInput" />
					</view>
					<button type="primary" :disabled="getverifSwitch" class="button"
						@click="getverification">{{getConfirms}}</button>
				</view>


			</view>
			<button class="confirm-btn" @click="toRegister" :disabled="logining">重置密碼</button>

		</view>
		<view class="register-section">
			已有賬號?
			<text @click="toLogin">返回登錄</text>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import {
		mapMutations
	} from 'vuex';
	import eonfox from '@/components/eonfox/eonfox.js';
	import fns from '@/components/eonfox/fns.js';
	var ef = new eonfox();
	export default {
		data() {
			return {
				phone: '',
				password: '',
				confimpassword: '', //第二次輸入密碼
				logining: false,
				verifTime: 0, //驗證碼時長
				getConfirms: '獲取驗證碼',
				confirm: '',
				getverifSwitch: false,
				oauthid: '',
				countrycodelist: [],
				country: '86',
				index: 0
			}
		},
		onLoad() {
			this.getStroges();
			this.getcountry()
		},
		methods: {
			...mapMutations(['login']),
			bindPickerChange: function(e) {
				this.index = e.target.value
				this.country = this.coutryList[this.index].code
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
			getStroges() {
				try {
					const value = uni.getStorageSync('oauth_id');
					if (value) {
						console.log(value);
						this.oauthid = value
					}
				} catch (e) {
					console.log(e)
				}
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
			toLogin() {
				uni.redirectTo({
					url: '/pages/public/login'
				})
			},
			async toRegister() {
				var _this = this
				var phone = this.phone,
					password = this.password,
					confimpassword = this.confimpassword;
				if (!this.country) {
					this.$api.msg('請選擇地區')
					return
				}
				if (!phone) {
					uni.showToast({
						title: '請輸入手機號',
						icon: 'none'
					})
					return
				}
				// 只检查内地手机号
				if (this.country== 86 && !/^1\d{10}$/.test(phone)) {
					uni.showToast({
						title: '手機號有誤',
						icon: 'none'
					})
					return
				}
				if (!password) {
					this.$api.msg('請輸入密碼')
					return
				}
				if (!confimpassword) {
					this.$api.msg('請輸入確認密碼')
					return
				}
				if (password.length < 6 || password.length > 16 ) {
					uni.showToast({
						title: '密碼長度為6~16個字符',
						icon: 'none'
					})
					return
				} 
				if (confimpassword.length < 6 || confimpassword.length > 16 ) {
					uni.showToast({
						title: '確認密碼長度為6~16個字符',
						icon: 'none'
					})
				} 
				if (password != confimpassword) {
					uni.showToast({
						title: '兩次輸入的密碼不一致，請檢查修改',
						icon: 'none'
					})
					return
				}
				if (this.confirm == '') {
					uni.showToast({
						title: '驗證碼不能為空',
						icon: 'none'
					});
					return
				}
					var req = {};
					req = {
						phone: this.phone,
						password: this.password,
						confimpassword: this.confimpassword,

						authCode: this.confirm,
						country:this.country

					};

					let data = await Api.apiCall('post', Api.member.resetPassword, req);
					uni.showToast({
						title: '重置成功',
						success() {
							_this.bind()
							setTimeout(function() {
								uni.reLaunch({
									url: '/pages/public/login'
								});
							}, 1000)
						}
					});
			},
			onKeyInput: function(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},

			async getverification() {

				let _this = this;
				// 驗證是否已進行驗證碼操作
				if (this.verifTime == 0) {
					if (!this.country) {
						this.$api.msg('請選擇地區')
						return
					}
					if (!this.phone) {
						this.$api.msg('請輸入手機號')
						return
					}
					// 只检查内地手机号
					if (this.country== 86 && !/^1[1234567890]\d{9}$/.test(this.phone)) {
						uni.showToast({
							title: '電話號碼有誤，請重新輸入',
							icon: 'none'
						});
						return;
					} else {
						let params = {
							phone: this.phone,
							country:this.country,
							type: 'forget'
						};
						let data = await Api.apiCall('post', Api.index.sendCodes, params);
						if (data.key) {
							this.$api.msg('發送成功')
							_this.getverifSwitch = true
							this.verifTime = 180;
							_this.getConfirms = this.verifTime
							//倒計時
							var timeInterval = setInterval(function() {
								_this.verifTime--;
								if (_this.verifTime <= 0) {
									//倒計時結束清除定時器
									clearInterval(timeInterval)
									_this.getConfirms = '重新發送'
									_this.getverifSwitch = false
									return;
								}
								_this.getConfirms = _this.verifTime
							}, 1000)
						}
					}
				} else {
					uni.showToast({
						title: "請勿重復操作",
						icon: 'none'
					});
				}

			},
			onKeyverification: function(event) {
				this.confirm = event.target.value;
			},
			//綁定
			bind() {
				var _this = this
				console.log('oauth');
				uni.getStorage({
					key: 'oauth',
					success(re) {
						if (re.data) {
							_this.bind_()
						}
					}
				})
			},
			bind_() {
				console.log('bind');
				var _this = this
				// #ifdef MP-WEIXIN
				wx.login({
					success(res) {
						wx.getUserInfo({
							success(re) {
								re.code = res.code;
								console.log('re:', re);
								ef.submit({
									request: {
										s: ['USERSELFBINDWEIXIN', ['applet', re]]
									},
									callback(data) {
										console.log(data);
										fns.unionid()
										return
									},
									error(err) {
										fns.err('err', err)
									}
								})
							}
						})
					}
				})
				// #endif
				// #ifdef APP-PLUS
				uni.showToast({
					title: '正在綁定',
					icon: 'loading'
				})
				console.log('oauto star');
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log('loginres:', typeof loginRes);
						if (loginRes.errMsg == 'login:ok') {
							// 獲取用戶信息
							uni.showToast({
								title: '獲取信息',
								icon: 'loading'
							})
							uni.getUserInfo({
								provider: 'weixin',
								success: function(infoRes) {
									uni.showToast({
										title: '獲取成功',
										icon: 'loading'
									})
									ef.submit({
										request: {
											s: ['USERSELFBINDWEIXIN', ['app', infoRes
												.userInfo
											]]
										},
										callback(data) {
											console.log(data);
											console.log(JSON.stringify(data));
											fns.unionid()
										},
										error(err) {
											console.log(err);
										}
									})

								},
								fail(err) {
									console.log(err);
								}
							});
						} else {
							console.log(err);
						}

					},
					fail(err) {
						console.log(err);
					}

				});
				// #endif
			}
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 55px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
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
/* 
		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		} */

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
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
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
			font-size: $font-sm+2upx;
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
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
	.verificationBox  {
		width: 630upx;
		height: 80upx;
		margin: 20upx auto;
		display:flex;
		align-items: center;
		justify-content: center;
		flex-direction:row;
		.verificationCon {
			height: 100%;
			width: 65%;
			background: #f8f6fc;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: row;
			border-radius: 10upx;
			.verificationLeft {
				width: 200upx;
				font-size: 28upx;
				font-weight: 550;
				text-align: center;
				.verificationInput {
					display: inline-block;
					.button {
						height: 100%;
						width: 35%; 
						background: #fa436a; 
						font-size: 24upx;
					}
				}
			}
		}
	}
</style>
