<template>
	<view class="container">
		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<view class="user-info-box">
				<view class="member-top-c">
					<template v-if="userDetailInfo && userDetailInfo.id">
						<view class="" style="display: flex;align-items: center;" >
							<image class="portrait" mode="aspectFill" :src="userDetailInfo.icon||default_avatar" @click="toUserInfo"></image>
							<view class="user-name" style="margin-left: 20upx;color: #FFFFFF;" @click="toUserInfo">  {{ userDetailInfo.nickname || userDetailInfo.username }}</view>
						</view>
					</template>
					<template v-else>
						<view class="" style="display: flex;align-items: center;" >
						<!-- #ifdef H5 || APP-PLUS -->
						<image class="portrait" mode="aspectFill" src="/static/images/icon_mine@2x.png" @click="toLogin"></image>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<image class="portrait" mode="aspectFill" src="/static/images/icon_mine@2x.png" @click="toWeChatLogin"></image>
						<!-- #endif -->
						<!-- #ifdef MP-ALIPAY -->
						<view class="portrait"></view>
						<view><button class="login-btn" open-type="getAuthorize" @click="getALICode" hover-class="btn-hover">授權登錄</button></view>
						<!-- #endif -->
						<view class="user-name" style="margin-left: 20upx;color: #FFFFFF;" @click="toLogin">  登錄/註冊</view>
						</view>
					</template>
				</view>
			</view>
		</view>

		<view
			class="cover-container"
			:style="[
				{
					transform: coverTransform,
					transition: coverTransition
				}
			]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<image class="arc" src="/static/arc.png"></image>

			
			<!-- 訂單 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/order/order?status=0')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-shouye"></text>
					<text>全部訂單</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?status=2')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-daifukuan"></text>
					<text>待發貨</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?status=3')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-yishouhuo"></text>
					<text>待收貨</text>
				</view>

				<view class="order-item"  hover-class="common-hover" :hover-stay-time="50" @click="navTo('/pages/index/projectManagement')">
					<text class="yticon icon-shouye"></text>
					<text>專案辦理</text>
				</view>
			</view>
			<!-- 瀏覽歷史 -->
			<view class="history-section icon">
				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="收貨地址" @eventClick="navTo('../../pagesU/address/address')"></list-cell>
				<!-- <list-cell icon="icon-tuandui" iconColor="#EE82EE" title="個人資料" @eventClick="navTo('../../pagesU/user/profile')"></list-cell> -->
				<list-cell icon="icon-shezhi1" iconColor="#e07472" title="系統設置" border="" @eventClick="navTo('../../pagesU/set/set')"></list-cell>
			</view>
		</view>
		<neil-modal v-if="inputShow" :show="inputShow" @close="cancel" title="編輯" @cancel="cancel" @confirm="confirm">
        				<input v-model="inputContent" style="margin:20upx" placeholder="" />
        			</neil-modal>
        			<!-- 底部分享彈窗 -->
                    		<uni-popup ref="showshare" :type="type">
                    			<!-- #ifdef H5 -->
                                        			<shareByH5 :ifwx="ifwx" :shareType="shareType" :goodsId="userDetailInfo.id" :shareImg="userDetailInfo.icon" :shareTitle="userDetailInfo.nickname"
                                        			 :shareContent="userDetailInfo.city" :shareHref="shareHref" @close="closeShare()"></shareByH5>
                                        			<!-- #endif -->
                                
                                        			<!-- #ifdef MP-WEIXIN -->
                                        			<shareByWx :goodsId="userDetailInfo.id" :shareType="shareType" :shareImg="userDetailInfo.icon" :shareTitle="userDetailInfo.nickname" :shareContent="userDetailInfo.city"
                                        			 :shareHref="shareHref" @close="closeShare()"></shareByWx>
                                        			<!-- #endif -->
                                
                                        			<!-- #ifdef MP-ALIPAY -->
                                        			<shareByAli :goodsId="userDetailInfo.id" :shareImg="userDetailInfo.icon" :shareTitle="userDetailInfo.nickname" :shareContent="userDetailInfo.city"
                                        			 :shareHref="shareHref" @close="closeShare()"></shareByAli>
                                        			<!-- #endif -->
                                
                                        			<!-- #ifdef MP-TOUTIAO -->
                                        			<shareByTt :goodsId="userDetailInfo.id" :shareImg="userDetailInfo.icon" :shareTitle="userDetailInfo.nickname" :shareContent="userDetailInfo.city"
                                        			 :shareHref="shareHref" @close="closeShare()"></shareByTt>
                                        			<!-- #endif -->
                                
                                        			<!-- #ifdef APP-PLUS || APP-PLUS-NVUE -->
                                        			<shareByApp :goodsId="userDetailInfo.id" :shareImg="userDetailInfo.icon" :shareTitle="userDetailInfo.nickname" :shareContent="userDetailInfo.city"
                                        			 :shareHref="shareHref" @close="closeShare()"></shareByApp>
                                        			<!-- #endif -->
                    		</uni-popup>
<mallWeblink></mallWeblink>
	</view>
</template>
<script>
import mallWeblink from '@/components/mall-weblink/mallWeblink.vue';
import Api from '@/common/api';
import listCell from '@/components/mix-list-cell';
import neilModal from '@/components/neil-modal.vue';
import uniPopup from "@/components/uni-popup/uni-popup.vue"
// #ifdef H5
	import shareByH5 from '@/components/share/shareByh5.vue'
	// #endif
	// #ifdef MP-WEIXIN
	import shareByWx from '@/components/share/shareByWx.vue'
	// #endif
	// #ifdef MP-ALIPAY
	import shareByAli from '@/components/share/shareByAli.vue'
	// #endif
	// #ifdef APP-PLUS
	import shareByApp from '@/components/share/shareByApp.vue'
	// #endif
import { mapState,mapMutations } from 'vuex';
let startY = 0,
	moveY = 0,
	pageAtTop = true;
export default {

	components: {
	uniPopup,
    			// #ifdef H5
    			shareByH5,
    			// #endif

    			// #ifdef MP-WEIXIN
    			shareByWx,
    			// #endif

    			// #ifdef MP-ALIPAY
    			shareByAli,
    			// #endif

    			// #ifdef APP-PLUS
    			shareByApp,
    			// #endif
    		mallWeblink,
		listCell,neilModal
	},
	data() {
		return {
		type: '',
			inputShow: false,
			shareType:"2",
        			feild: undefined,
        			inputContent: '',
			coverTransform: 'translateY(0px)',
			coverTransition: '0s',
			moving: false,
			ifwx: false,
			userDetailInfo: {
				blance: 0,
				integration: 0
			},

			couponList: [],
			viewList: [],
			default_avatar: '/static/images/avatar1.png'
		};
	},
// 下拉刷新
		onPullDownRefresh() {

			this.getData()
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 250);

		},
	async onLoad(ops) {
	 if (ops && ops.invitecode) {
    				uni.setStorageSync('invitecode', ops.invitecode);
    			}
	this.ifwx = this.$common.isWeiXinBrowser()
    		this.getData()

    	},
	async onShow() {
		this.getData()

	},
	onShareAppMessage() {
    		    let token = uni.getStorageSync('token');
            			if (token) {
            				let userInfo = uni.getStorageSync('userInfo')
            				return {
            					title: `${userInfo.nickname}`,
            					path: '/pages/index/index?invitecode='+userInfo.id
            				};
            			} else {
            				return {
            					title: `歡迎`,
            					path: '/pages/index/index'
            				};
            			}
            		},

	// #ifndef MP
	onNavigationBarButtonTap(e) {
		const index = e.index;
		if (index === 0) {
			this.navTo('../../pagesU/set/set');
		} else if (index === 1) {
			// #ifdef APP-PLUS
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			uni.navigateTo({
				url: '../../pagesU/notice/notice'
			});
		}
	},
	// #endif

	computed: {
		...mapState([ 'userInfo']),
		// 獲取店鋪聯系人手機號
		kfmobile() {
			return '13146587722' || 0;
		},
		shareHref() {
        				let pages = getCurrentPages()
        				let page = pages[pages.length - 1]
        				// #ifdef H5 || MP-WEIXIN || APP-PLUS || APP-PLUS-NVUE
        				return Api.BASEURI.replace("/api/","") + '/#/pages/public/reg?id=' + this.userDetailInfo.id;
        				// #endif

        				// #ifdef MP-ALIPAY
        				return Api.BASEURI.replace("/api/","") + '/#/pages/public/reg?id=' + this.userDetailInfo.id;
        				// #endif
        			}
	},
	methods: {
	...mapMutations(['logout']),

inputShowModal(feild) {
			this.feild = feild;
			this.inputShow = true;
			this.inputContent = '';
		},
    		cancel() {
            			this.inputShow = false;

            		},

            		confirm() {
            			const that = this;
            			if (!that.inputContent) {
            				that.$api.msg('輸入不能為空');
            				return;
            			}
            			let obj = {	id:this.userDetailInfo.id};
            			obj[that.feild] = that.inputContent;
            			Api.apiCall('post', Api.member.updateMember, obj);
            			that.$api.msg('修改成功');
            			that.userInfos[that.feild] = that.inputContent

            		},
            		togglePopup(type, open) {
                    				switch (type) {
                    					case 'top':
                    						this.content = '頂部彈出 popup'
                    						break

                    					case 'bottom':
                    						this.content = '底部彈出 popup'
                    						break
                    					case 'center':
                    						this.content = '居中彈出 popup'
                    						break
                    				}
                    				this.type = type
                    				this.$nextTick(() => {
                    					this.$refs['show' + open].open()
                    				})
                    			},
                    			closeShare() {
                    				this.$refs.showshare.close();
                    			},
		async getData(){
			this.getuserinfo();
			// this.getHistory();
		},
		// 獲取用戶信息
		async getuserinfo(){
			let params = {  };
			let data1 = await Api.apiCall('get', Api.index.userInfo, params);
			if(!data1.member){
				//未登錄數據處理
				this.userDetailInfo={blance: 0,integration: 0};
				this.couponList = [];
				this.viewList = [];
				this.logout();
			}else{
				uni.setStorageSync('userInfos', data1.member);
				if(data1.member.job==null){
					data1.member.job='無'
				}
				this.userDetailInfo = data1.member;
                console.log(this.userDetailInfo)
                let couponList = data1.histories;
                this.couponList = couponList;
			}
		},
		customerService() {
				uni.navigateTo({
					url:'../../pagesU/help/index'
				})
			},
			//	url:'/pages/point/sign'
			toggleSignPoint: function () {
            			  uni.navigateTo({
            			    url:'../../pagesC/group/index'

            			  })
            			},
		toNav(url){
			uni.navigateTo({
				url: url
			});
		},
		toUserInfo(){
			uni.navigateTo({
				url: '../../pagesU/set/set'
			});
		},

		toWeChatLogin(){
			uni.navigateTo({
				url: '/pages/public/login',
			});
		},

		//詳情頁
		navToDetailPage(item) {
			//測試數據沒有寫id，用title代替
			let id = item.id;
			uni.navigateTo({
				url: `../../pagesA/product/product?id=${id}`
			});
		},
		/**
		 * 統一跳轉接口,攔截未登錄路由
		 * navigator標簽現在默認沒有轉場動畫，所以用view
		 */
		navTo(url) {
			let token = uni.getStorageSync('token') || '';
			if (!token) {
				url = '/pages/public/login';
			}
			uni.navigateTo({
				url: url
			});
		},
        navTo1(url) {

			uni.navigateTo({
				url: url
			});
		},
		/**
		 *  會員卡下拉和回彈
		 *  1.關閉bounce避免ios端下拉沖突
		 *  2.由於touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的時候會有掉幀的感覺
		 *    transition設置0.1秒延遲，讓css來過渡這段空窗期
		 *  3.回彈效果可修改曲線值來調整效果，推薦一個好用的bezier生成工具 http://cubic-bezier.com/
		 */
		coverTouchstart(e) {
			if (pageAtTop === false) {
				return;
			}
			this.coverTransition = 'transform .1s linear';
			startY = e.touches[0].clientY;
		},
		coverTouchmove(e) {
			moveY = e.touches[0].clientY;
			let moveDistance = moveY - startY;
			if (moveDistance < 0) {
				this.moving = false;
				return;
			}
			this.moving = true;
			if (moveDistance >= 80 && moveDistance < 100) {
				moveDistance = 80;
			}

			if (moveDistance > 0 && moveDistance <= 80) {
				this.coverTransform = `translateY(${moveDistance}px)`;
			}
		},
		coverTouchend() {
			if (this.moving === false) {
				return;
			}
			this.moving = false;
			this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
			this.coverTransform = 'translateY(0px)';
		},
		getUserInfo(e) {
			let _this = this;
			//return false;
			console.log('eeeee',e)
			if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
				_this.$common.errorToShow('未授權');
			} else {
				var data = {
					open_id: _this.open_id,
					iv: e.detail.iv,
					edata: e.detail.encryptedData,
					signature: e.detail.signature
				};
				//有推薦碼的話，帶上
				var invitecode = _uni.getStorageSync('invitecode');
				if (invitecode) {
					data.invitecode = invitecode;
				}
				_this.toWxLogin(data);
			}
		},
		getALICode() {
			let that = this;
			uni.login({
				scopes: 'auth_user',
				success: res => {
					if (res.authCode) {
						uni.getUserInfo({
							provider: 'alipay',
							success: function(infoRes) {
								if (infoRes.errMsg == 'getUserInfo:ok') {
									let user_info = {
										nickname: infoRes.nickName,
										avatar: infoRes.avatar
									};
									that.aLiLoginStep1(res.authCode, user_info);
								}
							},
							fail: function(errorRes) {
								this.$common.errorToShow('未取得用戶昵稱頭像信息');
							}
						});
					} else {
						this.$common.errorToShow('未取得code');
					}
				},
				fail: function(res) {
					this.$common.errorToShow('用戶授權失敗my.login');
				}
			});
		},
		getWxCode(e) {
			console.log('-------',e)
			let that = this;
			uni.login({
				provider: 'weixin',
				success: function(res) {
					if (res.code) {
						console.log(res.code)
						that.wxLoginStep1(res.code);
					} else {
						this.$common.errorToShow('未取得code');
					}
				},
				fail: function(res) {
					this.$common.errorToShow('用戶授權失敗wx.login');
				}
			});
		},
		wxLoginStep1(code) {
			var data = {
				code: code
			}
			this.$api.login1(data, res => {
				if (res.status) {
					this.open_id = res.data;

					this.getUserInfo()
				} else {
					this.$common.errorToShow(res.msg, function() {
						uni.navigateBack({
							delta: 1
						});
					});
				}
			});
		},
		aLiLoginStep1(code, user_info) {
			let data = {
				code: code,
				user_info: user_info
			};
			this.$api.alilogin1(data, res => {
				this.alipayNoLogin = false;
				if (res.status) {
					this.open_id = res.data.user_wx_id;
					//判斷是否返回了token，如果沒有，就說明沒有綁定賬號，跳轉到綁定頁面
					if (!res.data.hasOwnProperty('token')) {
						this.$common.redirectTo('/pages/public/index?user_wx_id=' + res.data.user_wx_id);
					} else {
						uni.setStorageSync('userToken', res.data.token);
						this.initData();
					}
				} else {
					this.$common.errorToShow(res.msg);
				}
			});
		},
		toWxLogin(data) {
			console.log('----------data---------', data);
			let _this = this;
			_this.$api.login2(data, function(res) {
				if (res.status) {
					//判斷是否返回了token，如果沒有，就說明沒有綁定賬號，跳轉到綁定頁面
					if (typeof res.data.token == 'undefined') {
						uni.redirectTo({
							url: '/pages/public/index?user_wx_id=' + res.data.user_wx_id
						});
					} else {
						_uni.setStorageSync('userToken', res.data.token);
						_this.initData();
					}
				} else {
					_this.$common.errorToShow('登錄失敗，請重試');
				}
			});
		},
		toLogin() {
			uni.navigateTo({
				url: '/pages/public/login'
			});
		}, //在線客服,只有手機號的，請自己替換為手機號
		showChat() {
			// #ifdef H5
			let _this = this;
			window._AIHECONG('ini', {
				entId: this.config.ent_id,
				button: false,
				appearance: {
					panelMobile: {
						tone: '#FF7159',
						sideMargin: 30,
						ratio: 'part',
						headHeight: 50
					}
				}
			});
			//傳遞客戶信息
			window._AIHECONG('customer', {
				head: _this.userInfo.avatar,
				名稱: _this.userInfo.nickname,
				手機: _this.userInfo.mobile
			});
			window._AIHECONG('showChat');
			// #endif

			// 撥打電話
			// #ifdef APP-PLUS
			if (this.kfmobile) {
				uni.makePhoneCall({
					phoneNumber: '' + this.kfmobile,
					success: () => {
						// console.log("成功撥打電話")
					}
				});
			} else {
				this.$common.errorToShow('商戶未設置客服手機號');
			}
			// #endif
		}
	}
};
</script>
<style lang="scss">
@font-face {
		font-family: cgtt;
		font-weight: normal;
		font-style: normal;
		src: url('//at.alicdn.com/t/font_1475801_5innv59qqcr.ttf') format('truetype'),
	}
page{
	background: #F3F3F3;
}
.cgtt {
		font-family: "cgtt" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-userShare:before {
		content: "\c600";
	}

	.icon-userJoin:before {
		content: "\c601";
	}

%flex-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
%section {
	display: flex;
	justify-content: space-around;
	align-content: center;
	background: #fff;
	border-radius: 10upx;
}
	.sign-point {
	  position: absolute;
	  right: 100rpx;
	  text-align: center;
	  color: #fff;
	}

	.sign-point-text {
	  font-size: 22rpx;
	  margin-top: 4rpx;
	}

	.sign-point .iconfont {
	  color: #fff;
	  background: rgba(0, 0, 0, 0.1);
	  width: 72rpx;
	  height: 72rpx;
	  text-align: center;
	  line-height: 72rpx;
	  border-radius: 50%;
	  display: inline-block;
	}

	.customer-service {
	  position: absolute;
	  right: 0rpx;
	  text-align: center;
	  color: #fff;
	}

	.customer-service-text {
	  font-size: 22rpx;
	  margin-top: 4rpx;
	}

	.customer-service .iconfont {
	  color: #fff;
	  background: rgba(0, 0, 0, 0.1);
	  width: 72rpx;
	  height: 72rpx;
	  text-align: center;
	  line-height: 72rpx;
	  border-radius: 50%;
	  display: inline-block;
	}

.user-section {
	height: 520upx;
	padding: 100upx 30upx 0;
	position: relative;
	.bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		filter: blur(1px);
		// opacity: 0.7;
	}
}
.user-info-box {
	height: 180upx;
	display: flex;
	align-items: center;
	position: relative;
	z-index: 1;
	.portrait {
		width: 130upx;
		height: 130upx;
		border: 5upx solid #fff;
		border-radius: 50%;
	}
	.username {
		font-size: $font-lg + 6upx;
		color: $font-color-dark;
		margin-left: 20upx;
	}
}
.login-btn {
	color: #fff;
	width: 180upx;
	height: 50upx;
	line-height: 50upx;
	border-radius: 25upx;
	background: #ff7159;
	font-size: 12px;
}
.vip-card-box {
	display: flex;
	flex-direction: column;
	color: #f7d680;
	height: 240upx;
	background: linear-gradient(left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
	border-radius: 16upx 16upx 0 0;
	overflow: hidden;
	position: relative;
	padding: 20upx 24upx;
	.card-bg {
		position: absolute;
		top: 20upx;
		right: 0;
		width: 380upx;
		height: 260upx;
	}
	.b-btn {
		position: absolute;
		right: 20upx;
		top: 16upx;
		width: 132upx;
		height: 40upx;
		text-align: center;
		line-height: 40upx;
		font-size: 22upx;
		color: #36343c;
		border-radius: 20px;
		background: linear-gradient(left, #f9e6af, #ffd465);
		z-index: 1;
	}
	.tit {
		font-size: $font-base + 2upx;
		color: #f7d680;
		margin-bottom: 28upx;
		.yticon {
			color: #f6e5a3;
			margin-right: 16upx;
		}
	}
	.e-b {
		font-size: $font-sm;
		color: #d8cba9;
		margin-top: 10upx;
	}
}
.vip-card-box1 {
	display: flex;
	flex-direction: column;
	color: #f7d680;
	height: 60upx;
	width: 160upx;
	background: linear-gradient(left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
	border-radius: 16upx 16upx 0 0;
	overflow: hidden;
	position: relative;
	padding: 20upx 24upx;

	.b-btn {
		position: absolute;
		right: 10upx;
		top: 10upx;
		width: 132upx;
		height: 40upx;
		text-align: center;
		line-height: 40upx;
		font-size: 22upx;
		color: #36343c;
		border-radius: 20px;
		background: linear-gradient(left, #f9e6af, #ffd465);
		z-index: 1;
	}
	.tit {
		font-size: $font-base + 2upx;
		color: #f7d680;
		margin-bottom: 28upx;
		.yticon {
			color: #f6e5a3;
			margin-right: 16upx;
		}
	}
	.e-b {
		font-size: $font-sm;
		color: #d8cba9;
		margin-top: 10upx;
	}
}
.cover-container {
	background: $page-color-base;
	margin-top: -150upx;
	padding: 0 20upx;
	position: relative;
	background: #f5f5f5;
	padding-bottom: 20upx;
	.arc {
		position: absolute;
		left: 0;
		top: -34upx;
		width: 100%;
		height: 36upx;
	}
}
.tj-sction {
	@extend %section;
	.tj-item {
		@extend %flex-center;
		flex-direction: column;
		height: 140upx;
		font-size: $font-sm;
		color: #75787d;
	}
	.num {
		font-size: $font-lg;
		color: $font-color-dark;
		margin-bottom: 8upx;
	}
}
.order-section {
	@extend %section;
	padding: 28upx 0;
	margin-top: 20upx;
	.order-item {
		@extend %flex-center;
		width: 120upx;
		height: 120upx;
		border-radius: 10upx;
		font-size: $font-sm;
		color: $font-color-dark;
	}
	.yticon {
		font-size: 48upx;
		margin-bottom: 18upx;
		color: #fa436a;
	}
	.icon-shouhoutuikuan {
		font-size: 44upx;
	}
}
.history-section {
	padding: 30upx 0 0;
	margin-top: 20upx;
	background: #fff;
	border-radius: 10upx;
	.sec-header {
		display: flex;
		align-items: center;
		font-size: $font-base;
		color: $font-color-dark;
		line-height: 40upx;
		margin-left: 30upx;
		.yticon {
			font-size: 44upx;
			color: #5eba8f;
			margin-right: 16upx;
			line-height: 40upx;
		}
	}
	.h-list {
		white-space: nowrap;
		padding: 30upx 30upx 0;
		image {
			display: inline-block;
			width: 160upx;
			height: 160upx;
			margin-right: 20upx;
			border-radius: 10upx;
		}
	}
}
</style>
