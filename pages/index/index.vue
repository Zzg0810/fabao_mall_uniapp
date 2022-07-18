<template>
	
	<view class="container">
	<!-- 頂部 Logo add by zy-->
		<!-- 小程序頭部兼容 -->
		<!-- #ifdef MP -->
		<nav-bar>{{Areaaddress}}</nav-bar>
		<view class="MP-search" @click="search()" style="">
			<input class="MP-search-input" type="text" disabled="true"
			 placeholder="請輸入法寶名稱或編號" />
		</view>
		<!-- #endif -->
		<!-- 頭部輪播 -->
		<!-- #ifdef MP -->
		<view class="carousel-section">
			<!-- #endif -->
			<!-- #ifndef MP -->
			<view class="carousel-section" >
				<!-- #endif -->
				<!-- 標題欄和狀態欄占位符 -->
				<view class="titleNview-placing"></view>
				<!-- 背景色區域 -->
				<view class="titleNview-background" ></view>
				<swiper class="carousel" circular @change="swiperChange" autoplay="autoplay" indicator-dots="true">
					<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToTabPage(item.url)">
						<image v-if="item.clickCount==1" :src="item.pic" />
						 <video v-else :src="item.pic" style="width: 100%;height:100%" controls="controls" type="video/mp4" />
					</swiper-item>
				</swiper>
				<!-- 自定義swiper指示器
				<view class="swiper-dots">
					<text class="num">{{ swiperCurrent + 1 }}</text>
					<text class="sign">/</text>
					<text class="num">{{ swiperLength }}</text>
				</view>-->
			</view>
		
			<!-- 四大分類 -->
			<view class="navbar-list">
				<view
					class="navbar-list-item" style=""
					v-for="item in homeCategoryList"
					:key='item.id'
					@click="goCateInfo(item.id)"
				>
					<image
						mode="aspectFit"
						:src="item.icon"
						class="navbar-list-item-icon"
					/>
					<view class="navbar-list-item-text">
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- 法寶禮請說明 最新公告-->
	<!-- 	<view class="recommend-section">
				<view class="s-header">
					<text class="tit">法寶禮請說明</text>
					<text class="yticon icon-you" @click="navToTabPage('/pagesU/help/help')"></text>
				</view>
			</view> -->
			<view class="f-header m-t" >
				<image src="/static/temp/h1.png"></image>
				<view class="tit-box">
					<text class="tit">法寶禮請說明</text>
					<text class="tit2"></text>
				</view>
				<text class="yticon icon-you" @click="navToTabPage('/pagesU/help/index')"></text>
			</view>
			<!-- 最新公告 -->
			<view class="notices">
				<view class="lft">
					<image src="/static/images/laba.png"></image>
				</view>
				<view class="rgt">
					<swiper class="swiper" circular :indicator-dots="false" :autoplay="true" :vertical="true"
									:duration="3000">
						<swiper-item v-for="(item, i) in helpList2" :key="i" @click="navToHelpDetailPage(item)" v-if="i < 1">
							<view class="swiper-item">
								<text class="tis">{{item.title}}</text>
								<text class="times">
									{{item.createTime && formatDate(new Date(item.createTime), 'Y-MM-DD')}}
								</text>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<view class="notices">
				<view class="lft">
					<image src="/static/images/dengpao.png"></image>
				</view>
				<view class="rgt">
					<swiper class="swiper" circular :indicator-dots="false" :autoplay="true" :vertical="true"
									:duration="3000">
						<swiper-item v-for="(item, i) in helpList1" :key="i" @click="navToHelpDetailPage(item)" v-if="i < 3">
							<view class="swiper-item">
								<text class="tis">{{item.title}}</text>
								<text class="times">
									{{item.createTime && formatDate(new Date(item.createTime), 'Y-MM-DD')}}
								</text>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<!-- 新上架法寶  add code -->
			<view v-if='homeNewProductList && homeNewProductList.length>0' class="f-header m-t" >
				<image src="/static/temp/h1.png"></image>
				<view class="tit-box">
					<text class="tit">新上架法寶</text>
					<text class="tit2"></text>
				</view>
				<!-- <text class="yticon icon-you"></text> -->
			</view>

			<view class="guess-section">
				<view v-for="(item, index) in homeNewProductList" :key="index" class="guess-item" 
				@click="navToDetailPage(item)">
					<view class="image-wrapper">
						<image :src="item.pic" mode="aspectFit"></image>
					</view>
					<text class="title clamp">{{ item.productName }}</text>
					<!-- <text class="sn">{{ item.productSn }}</text> -->
				</view>
			</view>
			<!-- 協會推薦的法寶  -->
			<!-- @click="navToTabPage('../../pagesA/product/list')" -->
			<view v-if='homeRecommendProductList && homeRecommendProductList.length>0' class="f-header m-t" >
				<image src="/static/temp/h1.png"></image>
				<view class="tit-box">
					<text class="tit">協會推薦的法寶</text>
					<text class="tit2"></text>
				</view>
				<!-- <text class="yticon icon-you"></text> -->
			</view>

			<view class="guess-section">
				<view v-for="(item, index) in homeRecommendProductList" :key="index" class="guess-item" 
				@click="navToDetailPage(item)">
					<view class="image-wrapper">
						<image :src="item.pic" mode="aspectFit"></image>
					</view>
					<text class="title clamp">{{ item.productName }}</text>
					<!-- <text class="sn">{{ item.productSn }}</text> -->
				</view>
			</view>
			<view class="setting" @click="showSetting">
				<image src="/static/images/setting.png"></image>
			</view>
			<lvvPopup position="right" ref="popup">
				 <view class="settingInfo">
					 <view class="logos">
						 <image mode="aspectFit" src="/static/images/M.png"></image>
						 <image mode="aspectFit" src="/static/images/F.png"></image>
					 </view>
					 <view class="form">
						 <view class="form-item">
							 <view class="label">地區</view>
							 <view class="cont">
								 <radio-group @change="changeArea" v-if="!isLogin">
								 	<label class="uni-list-cell uni-list-cell-pd" >
								 		<view>
								 			<radio value="0" :checked="isChina == 0"/>
								 		</view>
								 		<view>香港及海外</view>
								 	</label>
								 	<label class="uni-list-cell uni-list-cell-pd">
								 		<view>
								 			<radio value="1" :checked="isChina == 1"/>
								 		</view>
								 		<view>內地</view>
								 	</label>
								 </radio-group>
								 <radio-group v-if="isLogin">
								 	<label class="uni-list-cell uni-list-cell-pd">
								 		<view v-show="isChina == 0" :checked="true">香港及海外</view>
								 	</label>
								 	<label class="uni-list-cell uni-list-cell-pd">
								 		<view v-show="isChina == 1" :checked="true">內地</view>
								 	</label>
								 </radio-group>
								 
							 </view>
							 
						 </view>
						 <view class="form-item">
									<view class="label">語言</view>
									<view class="cont">
										<radio-group @change="changeLang">
											<label class="uni-list-cell uni-list-cell-pd">
												<view>
													<radio value="0" :checked="lang == 0"/>
												</view>
												<view>簡體</view>
											</label>
											<label class="uni-list-cell uni-list-cell-pd">
												<view>
													<radio value="1" :checked="lang == 1"/>
												</view>
												<view>正體</view>
											</label>
										</radio-group>
								</view>
						 </view>
					 </view>
					 <view class="control">
						 <view @click="closePopup">取消</view>
						 <view class="confirm" @click="confirmChoice">確認</view>
					 </view>
				 </view>
			</lvvPopup>
			<mallWeblink></mallWeblink>
		</view>
</template>

<script>
	import mallWeblink from '@/components/mall-weblink/mallWeblink.vue';
	import Api from '@/common/api';
	import coupon from '@/components/coolc-coupon/coolc-coupon';
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	import auiPoster from '@/components/aui-poster/aui-poster.vue';
	import {
		formatDate
	} from '@/common/date';
	import {
		mapActions,
		mapGetters
	} from 'vuex';
	import navBar from '@/components/zhouWei-navBar';
	
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import lvvPopup from '@/components/lvv-popup/lvv-popup.vue'
	import {get, set} from '@/config/db.js'
	import {zh_tran} from '@/config/langChange'
	export default {
		components: {
			auiPoster,
			coupon,
			uniNoticeBar,
			mallWeblink,
			uniLoadMore,
			navBar,
			lvvPopup
		},
		computed:{
			...mapGetters({getIsChina: 'getIsChina'})
		},
		data() {
			return {
				auiPoster: {
					mask: true,
					maskTapClose: false,
					image: 'https://www.amtbhk.com/static/amtbhk_v1/images/bottom_gzft.png'
				},
				keyword: '',
				code: '',
				liveList: [],
				pageNum: 1,
				loadingType: 'more', //加載更多狀態
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				homeNewProductList: [],
				homeRecommendProductList: [],
				carouselList: [],
				hotProductList: [],
				brandList: [], // 推薦品牌
				homeFlashPromotion: [], // 當前秒殺場次
				subjectList: [], //推薦專題
				cat_list: [],
				groupHotGoodsList: [],
				couponList: [],
				storeList: [],
				announcement: [],
				articleList: [],
				newProductList: [],
				Areaaddress: '香港及海外', //當前位置
				helpList1: [],
				helpList2: [],
				formatDate,
				homeCategoryList: [],
				isChina: 1,
				lang: 0,
				pagetoken: 0,
				isLogin: uni.getStorageSync('token') ? true : false
			};
		},
		//加載更多
		onReachBottom() {
			this.pageNum++;
			this.getNewProductList();
		},
		onPullDownRefresh() {
			this.pageNum = 1;
			this.getNewProductList('refresh');
			this.loadData();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		},
		mounted: function() {
			
		},
		onShareAppMessage() {
			let token = uni.getStorageSync('token');
					if (token) {
						let userInfo = uni.getStorageSync('userInfo')
						return {
							title: `${userInfo.nickname}推薦您一個法寶禮請平臺`,
							path: '/pages/index/index?invitecode='+userInfo.id
						};
					} else {
						return {
							title: `歡迎您`,
							path: '/pages/index/index'
						};
					}
		},
		onShow () {
			// 檢查
			let token = uni.getStorageSync('token');
			// console.log('index-onShow');
			// console.log('token-'+token);
			// console.log('pagetoken'+this.pagetoken);
			if(token!=this.pagetoken){
				console.log('重新加載頁面');
				this.pagetoken = uni.getStorageSync('token');
				this.isLogin = uni.getStorageSync('token') ? true : false
				this.getBanner();
				this.homeNewProduct();
				this.homeRecommendProduct();
			}
			this.isChina = this.getIsChina || 0
			this.lang = get('lang') || 0
		},
		onLoad(ops) {
			this.pagetoken = uni.getStorageSync('token');
			// console.log('index-onLoad');
			// console.log('token-'+this.pagetoken);
            if (ops && ops.invitecode) {
				uni.setStorageSync('invitecode', ops.invitecode);
			}
			let isWeiXin = this.$common.isWeiXinBrowser();
			this.pageNum = 1;
			// this.getNewProductList('refresh');
			this.loadData(ops);
			this.sysInfoMethod();
			this.getcategory();
			this.getHelpList();
		},
		filters: {
			formatCreateTime(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
			},
			formatNull(value) {
				if (value === undefined || value === null || value === '') {
					return '暫無';
				} else {
					return value;
				}
			},
			formatLongText(value) {
				if (value === undefined || value === null || value === '') {
					return '暫無';
				} else if (value.length > 4) {
					return value.substr(0, 4) + '...';
				} else {
					return value;
				}
			},
			formatPayType(value) {
				if (value === 2) {
					return '支付寶';
				} else if (value === 1) {
					return '微信小程序';
				} else if (value === 3) {
					return '余額支付';
				} else if (value === 5) {
					return '積分兌換';
				}
			},
		},
		methods: {
			...mapActions({
				actionSetChina: 'actionSetChina'
			}),
			showPoster() {
				this.$refs.poster.show();
			},
			auiPosterCallback(e) {
				var _this = this;
				_this.auiToast.msg = '您關閉了彈窗';
				_this.$refs.toast.show();
			},
		
			async getcategory () {
				let params = { parentId: 0 };
				let res = await Api.apiCall('get', Api.goods.getProductCategoryList, params);
				this.homeCategoryList = res;
				console.log('getProductCategoryList', res);
			},
			async sysInfoMethod() {
				let params = {};
				let list = this.$db.get('sysInfo')
				if (!list) {
					list = await Api.apiCall('get', Api.index.sysInfo, params);
					uni.setStorageSync('sysInfo', list)
				}

			},
			async getOpenId(code) {
				let params = {
					code: code,
					scope: 2,
					state: this.state
				};
				//模擬接口
				let res = await Api.apiCall('get', Api.order.authCodeToOpenid, params);
				console.log(res);
				if (res) {
					// this.login(res);
					uni.setStorageSync('token',res.data.tokenHead + res.data.token)
					console.log(res.token);
					uni.setStorageSync('userInfos', res.data.userInfo);
					uni.setStorageSync('token', res.data.tokenHead + res.data.token);
					uni.switchTab({
						url: '/pages/index/index'
					});
				} else {
					this.$common.errorToShow(res);
				}
			},
			/**
			 *
			 * 加載首頁數據
			 */
			async loadData(option) {

				let token = uni.getStorageSync('token');
				/*  #ifdef H5  */
				let isWeiXin = this.$common.isWeiXinBrowser();

				// 不用微信
				// if (isWeiXin && !token) {
				// 	let code = this.getCode()

				// 	if (option.code !== null && option.code !== "" && option.code !== undefined) {

				// 		this.getOpenId(option.code)
				// 	}else if(this.code !== null && this.code !== "" && this.code !== undefined){

    //                 	this.getOpenId(option.code)
				// 	}
				// }
				
				/*  #endif  */
				this.getBanner();
				this.getHelpList()
				// this.getNoticeList();
				this.homeNewProduct();
				this.homeRecommendProduct();
			},

			// 獲取code
			// 先判斷url中有沒有code，如果有code，表明已經授權，如果沒有code，跳轉微信授權鏈接
			getCode() {
				var appid = Api.h5Appid;
				// 截取地址中的code，如果沒有code就去微信授權，如果已經獲取到code了就直接把code傳給後臺獲取openId
				let code = this.getUrlCode('code')

				if (code === null || code === '') {
					window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' +
						encodeURIComponent('https://mallplus.51wangshi.com') +
						'&response_type=code&scope=snsapi_userinfo&state=1234#wechat_redirect'
					// redirect_uri是授權成功後，跳轉的url地址，微信會幫我們跳轉到該鏈接，並且通過？的形式拼接code，這裏需要用encodeURIComponent對鏈接進行處理。
					// 如果配置參數一一對應，那麼此時已經通過回調地址刷新頁面後，你就會再地址欄中看到code了。
					// http://127.0.0.1/pages/views/profile/login/login?code=001BWV4J1lRzz00H4J1J1vRE4J1BWV4q&state=1
				}else{
				    this.code=code;

				}
			},
			getUrlCode(name) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1]
					.replace(/\+/g, '%20')) || null
			},

			/**
			 * 獲取新上架推薦
			 */
			async homeNewProduct() {
				let params = {

				};
				let groupHotGoodsList = await Api.apiCall('get', Api.index.homeNewProduct, params);
				this.homeNewProductList = groupHotGoodsList;
				console.log('- this.homeNewProductList -')
				console.log(this.homeNewProductList)
			},
			/**
			 * 獲取協會推薦的法寶
			 */
			async homeRecommendProduct() {
				let params = {
				    
				};
				let groupHotGoodsList = await Api.apiCall('get', Api.index.homeRecommendProduct, params);
				this.homeRecommendProductList = groupHotGoodsList;
				console.log('- this.homeRecommendProductList -')
				console.log(this.homeRecommendProductList)
			},
	
			/**
			 * 獲取輪播圖
			 */
			async getBanner() {
				 let params = {
				// 	storeId: Api.selfStoreId,
				// 	status: 1
				 };
				// params.type = Api.source;
				
				let data = await Api.apiCall('get', Api.index.bannerList, params);
				if (data) {
					this.carouselList = data || [];
					this.swiperLength = this.carouselList.length;
					this.titleNViewBackground = 'rgb(203, 87, 60)';
				}
			},
			/**
			 * 獲取通知信息-未調用
			 */
			async getNoticeList() {
				let params = {
					pageSize: 3
				};
				let data = await Api.apiCall('get', Api.index.noticeList, params);
				if (data) {
					this.announcement = data.records || [];
				}
			},
			/**
			 * 獲取新品上市信息-未調用
			 */
			async getNewProductList(type = 'add', loading) {
				//沒有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more';
				}
				let params = {
					pageNum: this.pageNum
				};
				let list = await Api.apiCall('get', Api.goods.goodsList, params);

				let goodsList = list.records;

				if (type === 'refresh') {
					this.newProductList = [];
				}

				this.newProductList = this.newProductList.concat(goodsList);

				//判斷是否還有下一頁，有是more  沒有是nomore(測試數據判斷大於20就沒有了)
				this.loadingType = this.newProductList.length > list.total ? 'nomore' : 'more';
				if (type === 'refresh') {
					if (loading == 1) {
						uni.hideLoading();
					} else {
						uni.stopPullDownRefresh();
					}
				}
			},
		
			/**
			 * 獲取分類精選列表信息-未調用
			 */
			async getCatList() {
				let params = {

				};
				let data = await Api.apiCall('get', Api.goods.newProductList, params);
				if (data) {
					let cat_list = data;
					this.cat_list = cat_list || [];
				}
			},
			// 公告文章的日期格式
			dateFormat(time) {
				if (time == null || time === '') {
					return 'N/A';
				}
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
			},
			// 輪播圖切換修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.carouselList[index].background;
			},
			// 跳轉到另一頁，非 底部頁
			navToTabPage(url) {
				uni.navigateTo({
					url: url
				});
			},
			// 跳轉到 法寶詳情頁 
			navToDetailPage(item) {
				let id = item.productId;
				uni.navigateTo({
					url: `../../pagesA/product/product?id=${id}`
				});
			},
			// 跳轉到  某一頁
			navToDetailPageL(url) {
				window.location.href = url;
			},
			//跳转对应分类
			goCateInfo(id){
				uni.setStorageSync('indexToCateId',id)
				uni.switchTab({
					url:'/pages/category/category'
				})
			},
			navToList() {
				uni.navigateTo({
					url: `../../pagesA/product/list`
				});
			},
			search() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},
			// 獲取幫助文章（法寶禮請說明，最新公告）
			async getHelpList () {
				let data = await Api.apiCall('get', Api.cms.helpList, {});
				let list = data.records || []
				let a = [], b = []
				a = list.filter(r => r.categoryId == 1) || []
				b = list.filter(r => r.categoryId == 2) || []
				this.helpList1 = a;
				this.helpList2 = b;
			},
			// 跳轉到幫助文章詳情
			navToHelpDetailPage (item) {
				uni.navigateTo({
					url: `/pagesU/help/detail?id=${item.id}`
				})
			},
			
			showSetting () {
				this.$refs.popup.show()
			},
			closePopup () {
				this.$refs.popup.close()
				this.lang = get('lang') || 0
				this.isChina = get('isChina') || 0
			},
			changeLang (value) {
				this.lang = value.target.value
			},
			changeArea (value) {
				this.isChina = value.target.value
			},
			confirmChoice () {
				zh_tran(this.lang == 0 ? 's' : 'n')
				if (this.isChina != this.getIsChina) {
					setTimeout(() => {
						this.loadData()
					}, 300)
				}
				this.actionSetChina(this.isChina)
				set('lang', this.lang)
				this.$refs.popup.close()
				
			},
			// 跳轉到 分類頁
			navToCategoryPage(){
				uni.switchTab({
					url: '/pages/category/category'
				})
			}
			
		},

		// 標題欄input搜索框點擊
		onNavigationBarSearchInputClicked: async function(e) {
			uni.navigateTo({
				url: '/pages/search/search'
			});
		},
		//點擊導航欄 buttons 時觸發 ，不讓他觸發
		onNavigationBarButtonTap0(e) {
			const index = e.index;
			if (index === 0) {
				var _this = this;

				uni.scanCode({
					onlyFromCamera: true,
					success: function(res) {
						if (res.result) {
							var data = JSON.parse(res.result);

							if (!data.errno) {
								if (data.type != 'merchant_money_plus') {
									uni.showToast({
										title: '該二維碼非收款二維碼'
									});
								} else if (data.data.merchant_id) {
									_this.merchant_id = data.data.merchant_id;

									if (data.data && data.data.user_id) {
										var user_id = data.data.user_id;
									} else {
										var user_id = '';
									}
									uni.navigateTo({
										url: '../../pagesB/payUser/payUser?mch_id=' + data.data.merchant_id + '&user_id=' + data.data.user_id
									});
								} else {
									uni.showToast({
										title: '掃碼失敗',
										icon: 'none'
									});
								}
							} else {
								uni.showToast({
									title: data.error,
									icon: 'none'
								});
							}
						}
					}
				});
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				
				// #endif
				// 打開設置
				// uni.navigateTo({
				// 	url: '../../pagesU/notice/notice'
				// });
			}
		}
	};
</script>

<style lang="scss">
	.MP-search {
		background: #ffffff;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		width: 100%;
		z-index: 999;
	}

	.MP-search-input {
		font-size: 28upx;
		background: #f5f5f5;
		height: 60upx;
		width: 90%;
		border-radius: 50upx;
		text-align: center;
	}

	.mp-search-box {
		position: absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;

		.ser-input {
			flex: 1;
			height: 60upx;
			line-height: 60upx;
			text-align: center;
			font-size: 28upx;
			color: $font-color-base;
			border-radius: 20px;
			background: rgba(255, 255, 255, 0.6);
		}
	}

	page {
		.cate-section {
			position: relative;
			z-index: 5;
			border-radius: 16upx 16upx 0 0;
			margin-top: -20upx;
		}

		.carousel-section {
			padding: 0;

			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}

			.carousel {
				.carousel-item {
					padding: 0;
				}
			}

			.swiper-dots {
				left: 45upx;
				bottom: 40upx;
			}
		}
	}

	page {
		background: #f5f5f5;
	}

	.m-t {
		margin-top: 20upx;
	}
	
	.m-t-20 {
		margin-top: 80upx;
	}

	/* 頭部 輪播圖 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: 0.4s;
		}
	}

	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	/* 分類 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;

		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}

		/* 原圖標顏色太深,不想改圖了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: 0.7;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}

	.ad-1 {
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		background: #fff;

		image {
			width: 100%;
			height: 100%;
		}
	}

	/* 秒殺專區 */
	.seckill-section {
		padding: 0upx 20upx 20upx;
		background: #fff;

		.s-header {
			display: flex;
			align-items: center;
			height: 90upx;
			line-height: 1;

			.s-img {
				width: 140upx;
				height: 30upx;
			}

			.tip {
				font-size: $font-base;
				color: $font-color-light;
				// margin: 0 20upx 0 40upx;
			}

			.timer {
				display: inline-block;
				width: 40upx;
				height: 36upx;
				text-align: center;
				line-height: 36upx;
				margin-right: 14upx;
				font-size: $font-sm + 2upx;
				color: #fff;
				border-radius: 2px;
				background: rgba(0, 0, 0, 0.8);
			}

			.icon-you {
				font-size: $font-lg;
				color: $font-color-light;
				flex: 1;
				text-align: right;
			}
		}

		.floor-list {
			white-space: nowrap;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			width: 150upx;
			margin-right: 20upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			line-height: 1.8;

			image {
				width: 150upx;
				height: 150upx;
				border-radius: 6upx;
			}

			.price {
				color: $uni-color-primary;
			}
		}
	}

	.f-header {
		display: flex;
		align-items: center;
		height: 140upx;
		padding: 0upx 20upx;
		background: #fff;

		image {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}

		.tit-box {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		.tit {
			font-size: $font-lg + 2upx;
			color: #font-color-dark;
			line-height: 1.3;
		}

		.tit2 {
			font-size: $font-sm;
			color: $font-color-light;
		}

		.icon-you {
			font-size: $font-lg + 2upx;
			color: $font-color-light;
		}
	}

	/* 團購樓層 */
	.group-section {
		background: #fff;

		.g-swiper {
			height: 650upx;
			padding-bottom: 20upx;
		}

		.g-swiper-item {
			width: 100%;
			padding: 0 20upx;
			display: flex;
		}

		image {
			width: 100%;
			height: 460upx;
			border-radius: 4px;
		}

		.g-item {
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}

		.left {
			flex: 1.2;

			// margin-right: 24upx;
			.t-box {
				padding-top: 20upx;
			}
		}

		.right {
			flex: 0.8;
			flex-direction: column-reverse;

			.t-box {
				padding-bottom: 20upx;
			}
		}

		.t-box {
			height: 160upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			line-height: 1.6;
		}

		.price {
			color: $uni-color-primary;
		}

		.m-price {
			font-size: $font-sm + 2upx;
			text-decoration: line-through;
			color: $font-color-light;
			margin-left: 8upx;
		}

		.pro-box {
			display: flex;
			align-items: center;
			margin-top: 10upx;
			font-size: $font-sm;
			color: $font-base;
			padding-right: 10upx;
		}

		.progress-box {
			flex: 1;
			border-radius: 10px;
			overflow: hidden;
			margin-right: 8upx;
		}
	}

	/* 分類推薦樓層 */
	.hot-floor {
		width: 100%;
		overflow: hidden;
		margin-bottom: 20upx;

		.floor-img-box {
			width: 100%;
			height: 320upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(255, 255, 255, 0.06) 30%, #f8f8f8);
			}
		}

		.floor-img {
			width: 100%;
			height: 100%;
		}

		.floor-list {
			white-space: nowrap;
			padding: 20upx;
			padding-right: 50upx;
			border-radius: 6upx;
			margin-top: -140upx;
			margin-left: 30upx;
			background: #fff;
			box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
			position: relative;
			z-index: 1;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			width: 180upx;
			margin-right: 20upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			line-height: 1.8;

			image {
				width: 180upx;
				height: 180upx;
				border-radius: 6upx;
			}

			.price {
				color: $uni-color-primary;
			}
		}

		.more {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			width: 180upx;
			height: 180upx;
			border-radius: 6upx;
			background: #f3f3f3;
			font-size: $font-base;
			color: $font-color-light;

			text:first-child {
				margin-bottom: 4upx;
			}
		}
	}

	/* 單條法寶 */
	.goods-box-single {
		display: flex;
		padding: 20upx 0;

		.goods-img {
			display: block;
			width: 120upx;
			height: 120upx;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 0 30upx 0 24upx;
			overflow: hidden;

			.title {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				line-height: 1;
			}

			.attr-box {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				padding: 10upx 12upx;
			}

			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;

				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
	}

	.price-box {
		display: flex;
		justify-content: flex-end;
		align-items: baseline;
		padding: 20upx 30upx;
		font-size: $font-sm + 2upx;
		color: $font-color-light;

		.num {
			margin: 0 8upx;
			color: $font-color-dark;
		}

		.price {
			font-size: $font-lg;
			color: $font-color-dark;

			&:before {
				content: '￥';
				font-size: $font-sm;
				margin: 0 2upx 0 8upx;
			}
		}
	}

	.action-box {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 100upx;
		position: relative;
		padding-right: 30upx;
	}

	.action-btn {
		width: 160upx;
		height: 60upx;
		margin: 0;
		margin-left: 24upx;
		padding: 0;
		text-align: center;
		line-height: 60upx;
		font-size: $font-sm + 2upx;
		color: $font-color-dark;
		background: #fff;
		border-radius: 100px;

		&:after {
			border-radius: 100px;
		}

		&.recom {
			background: #fff9f9;
			color: $base-color;

			&:after {
				border-color: #f7bcc8;
			}
		}
	}

	/* 猜你喜歡 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;
		.guess-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			&:nth-child(2n + 1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 4px;
			image {
				margin-top:15upx;
				height: 300upx;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 42upx;
    		margin: 8upx 0;
    		min-height: 80upx;
			text-align: center;
		}

		.clamp{
			-webkit-box-orient: vertical;
    		-webkit-line-clamp: 2 !important;
    		display: -webkit-box !important;
			white-space: normal !important;;
		}
		.sn{
			font-size: $font-base;
			line-height: 1.5em;
			text-align: center;
		}
		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
		.coupon_box {
			width: 100%;
			height: auto;
			display: table;
			padding: 6upx 26upx 26upx 26upx;
		}

		.other_type {
			width: 100%;
			height: 90upx;
			padding-top: 50upx;

			.text {
				width: 100%;
				border-top: 1px solid #eeeeee;
				display: block;
				text-align: center;
				position: relative;
			}

			.text span {
				width: 180upx;
				height: 40upx;
				line-height: 40upx;
				color: #999999;
				display: block;
				background: #ffffff;
				position: absolute;
				left: 50%;
				top: 50%;
				margin-left: -90upx;
				margin-top: -20upx;
				font-size: $font-base;
			}
		}
	}

	.getPosition {
		height: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32upx;
		background-color: #fff;
	}

	.recommend-section {
		.s-header {
			padding: 20upx 30upx;
			font-size: 30upx;
			color: #303133;
			background: #fff;
			margin-top: 16upx;
			display: flex;
			align-items: center;

			&:before {
				content: '';
				width: 0;
				height: 40upx;
				margin-right: 24upx;
				border-left: 6upx solid #ec706b;
			}

			.icon-you {
				font-size: $font-lg;
				color: $font-color-light;
				flex: 1;
				text-align: right;
				margin-left: auto;
			}
		}

		/* 推薦列表 */
		.rec-section {
			background-color: #fff;

			.rec-item {
				display: flex;
				padding: 20upx 30upx;
				position: relative;

				&:after {
					content: '';
					position: absolute;
					left: 30upx;
					right: 0;
					bottom: 0;
					height: 0;
					border-bottom: 1px solid #eee;
					transform: scaleY(50%);
				}
			}

			.left {
				flex: 1;
				padding-right: 10upx;
				overflow: hidden;
				position: relative;
				padding-bottom: 52upx;

				.title {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: 32upx;
					color: #303133;
					line-height: 44upx;
				}

				.bot {
					position: absolute;
					left: 0;
					bottom: 4upx;
					font-size: 26upx;
					color: #909399;
				}

				.time {
					margin-left: 20upx;
				}
			}

			.right {
				width: 220upx;
				height: 140upx;
				flex-shrink: 0;
				position: relative;

				.img {
					width: 100%;
					height: 100%;
				}

			}
		}
	}
	.navbar-list {
		margin: 20upx 0upx 0 20upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
	}
	.navbar-list-item {
		flex: 1;
		padding: 0 0 10upx 0;
		margin-right: 20upx;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 8upx;
		overflow:hidden;
	}
	.navbar-list-item-icon {
		width: 100%;
		height:140upx;
	}
	.navbar-list-item-text {
		width: 100%;
		text-align: center;
		font-size: 20upx;
		color: #303133;
	}
	.list {
		background: #ffffff;
		padding: 0 20upx;
	}
	.list-item {
		height: 60upx;
		display: flex;
		align-items: center;
		justify-content: space-between
	}
	.notices {
		height: 80rpx;
		display:flex;
		padding: 0 20rpx;
		width: 100%;
		align-items: center;
		overflow:hidden;
		.lft {
			width:60rpx;
			height: 100%;
			display:flex;
			align-items: center;
			image {
				width: 40rpx;
				height: 40rpx;
			}
		}
		.rgt {
			width: 650rpx;
			.swiper {
				width: 100%;
				height: 80rpx;
				.swiper-item {
					height: 80rpx;
					width: 100%;
					font-size: 28rpx;
					color: #666;
					display:flex;
					align-items: center;
					justify-content: space-between;
					.tis {
						width: 450rpx;
						white-space: nowrap;
						overflow:hidden;
						text-overflow: ellipsis;
					}
					.times {
						flex:1;
					}
				}
			}
		}
	}
	.setting {
		position:fixed;
		right: 0rpx;
		width: 80rpx;
		height: 80rpx;
		display:flex;
		top: 62%;
		justify-content: center;
		align-items: center;
		background: rgba(37,70,122,0.8);
		border-radius: 4rpx;
		image {
			width: 60rpx;
			height: 60rpx;
		}
	}
	.settingInfo {
		width: 80%;
		background: #fff;
		height: 80vh;
		float:right;
		position:relative;
		.logos {
			background:rgba(37,70,122,1);
			padding:10rpx;
			width: 100%;
			display:flex;
			image {
				height: 60rpx;
			}
		}
		.form {
			padding: 0 20rpx;
			.form-item {
				margin-top: 40rpx;
				.label {
					font-size: 28rpx;
					font-weight: 500;
					color: #333;
					margin-bottom: 20rpx;
				}
				.cont {
					display:flex;
					align-items: center;
					uni-radio-group {
						width: 100%;
						display:flex;
						align-items: center;
						uni-label {
							display:flex;
							align-items: center;
							margin-right: 20rpx;
							font-size: 28rpx;
							radio {
								transform:scale(0.7);
							}
						}
					}
				}
			}
		}
		.control {
		   position:absolute;
		   bottom: 0;
		   width: 100%;
		   height: 80rpx;
		   display:flex;
		   view {
			   flex:1;
			   border:2rpx solid #ddd;
			   height: 80rpx;
			   text-align: center;
			   color: #333;
			   font-size: 32rpx;
			   font-weight: 500;
			   line-height: 78rpx;
			   &.confirm {
				   border-color:rgba(37,70,122,1);
				   background: rgba(37,70,122,1);
				   color: #fff;
			   }
		   }
		}
	}
	
	i.uni-btn-icon{
		overflow: visible!important;
	}
</style>
