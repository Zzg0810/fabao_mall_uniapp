<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular="true" duration="400" autoplay="autoplay" >
				<swiper-item class="swiper-item" v-for="(item, index) in small" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFit"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="introduce-section">
			<text class="title">{{ goods.name }}</text>
			<view class="price-box">
				<!-- <text class="price-tip">{{ goods.productSn }}</text>
				<text class="price"
					v-if="goods.vipPrice && goods.vipPrice > 0">{{ (goods.price * goods.memberRate) / 10 }}</text>
				<text class="price" v-else>{{ goods.price }}</text>
				<text class="m-price" v-if="!goods.vipPrice">¥{{ goods.originalPrice }}</text>
				<text class="m-price" v-else-if="goods.vipPrice && goods.vipPrice > 0">¥{{ goods.price }}</text>
				<text class="coupon-tip" v-if="goods.isFenxiao == 1 && goods.fenxiaoPrice > 0">傭金
					¥{{ goods.fenxiaoPrice }}</text>
				<text class="coupon-tip"
					v-if="goods.memberRate && goods.memberRate != 10">會員折扣{{ goods.memberRate }}折
				</text> -->
			</view>
			<view class="bot-row">
				<text>編號: {{goods.productSn}}</text>
				<!-- <text>銷量: {{ goods.sale }}</text> -->
				<text v-if="token">限請:{{ limitNumber>=0 ? limitNumber : '' }}</text>
				<!-- <text>瀏覽量: {{ goods.hit }}</text> -->
			</view>
			<view class="bot-row">
				<text>分類: {{ productCategory.name }}</text>
				<text v-if="goods.fabaoType == 2">語種: {{goods.language}}</text>
			</view>
			<view class="bot-row">
				<text>重量: {{goods.weight?goods.weight:1000}}克</text>
				<text>尺寸: {{ goods.size }}</text> 
			</view>
			<view class="bot-row" v-if="goods.fabaoType == 2">
				<text>裝訂: {{ goods.bookBinding }}</text> 
				<text>版次: {{ goods.bookEdition }}</text> 
			</view>
			
		<!-- 	<div class="item-select">
				<div class="item-select-column">
					<div class="item-select-row" v-for="(item, index) in skuList" :key="item.id">
						<div class="item-select-box" @click="select(item.id,item.meno,item.stock)"
							:class="{'item-select-box-active': item.id === selectBoxIndex}">
							<div class="item-select-intro">
								<p>{{ item.meno }} 庫存 {{ item.stock }}</p>
							</div>
						</div>
					</div>
				</div>
			</div> -->

		</view>
		
		
		<!--<view class="share-section" @click="navToTabPageStore(goods.storeId)">
			 <view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				鋪
			</view> 
			<text class="tit"></text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				進入店鋪
				<text class="yticon icon-you"></text>
			</view>
		</view> -->

		<!--分享-->
		<!-- <view class="share-section" @click="goShare"> 
			 <view class="share-icon" v-if="goods.fenxiaoPrice && goods.fenxiaoPrice>0">
				<text class="yticon icon-xingxing"></text>
				返傭金
			</view>
			<text class="tit" v-if="goods.fenxiaoPrice && goods.fenxiaoPrice>0">¥{{ goods.fenxiaoPrice || 0}}</text>
			<text class="yticon icon-bangzhu1" v-if="goods.fenxiaoPrice && goods.fenxiaoPrice>0"></text> 
			 <view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>
		</view> -->

		<view class="c-list">
			<!-- <view class="c-row b-b" v-if="skuList && skuList.length > 0" @click="toggleSpec">
				<text class="tit">規格</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected"
						:key="sIndex">{{ sItem.name }}</text>
				</view>
				<text class="yticon icon-you"></text>
			</view> -->
			<!-- <view class="c-row b-b" v-if="couponList.length > 0" @click="toggleMask('show')">
				<text class="tit">優惠券</text>
				<text class="con t-r red">領取優惠券</text>
				<text class="yticon icon-you"></text>
			</view> -->

			<!-- <view class="c-row b-b" v-if="serviceList && serviceList.length > 0">
				<text class="tit">服務</text>
				<view class="bz-list con">
					<text v-for="(item1, index1) in serviceList" :key="index1">{{ item1 }}</text>
				</view>
			</view> -->
		</view>

		<!-- 評價 -->
		<!-- <view class="eva-section">
			<view class="e-header">
				<text class="tit">評價</text>
				<text>({{ consultCount.all }})</text>
				<text class="tit">好評</text>
				<text>({{ consultCount.goods }})</text>
				<text class="tit">一般</text>
				<text>({{ consultCount.general }})</text>
				<text class="tit">差評</text>
				<text>({{ consultCount.bad }})</text>
				<text class="tip" v-if="consultCount.persent != 200">好評率 {{ consultCount.persent }}%</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="eva-box" v-for="(item, index) in consultList" :key="item.id">
				<image :src="item.pic" class="portrait" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{ item.memberName }}</text>
					<text class="con">{{ item.consultContent }}</text>
					<view class="bot">
						<text class="attr" v-if="item.attr">購買類型：{{ item.attr }}</text>
						<text class="time">{{ item.consultAddtime |formatCreateTime}}</text>
					</view>
				</view>
			</view>
		</view>
 -->
		<view class="detail-desc">
			<view class="d-header"><text>圖文詳情</text></view>
			<!-- <rf-parser :html="desc" lazy-load style="white-space: pre-line"></rf-parser> -->
			<view v-html="desc" style="white-space: pre-wrap;"></view>
		</view>
		<!-- 底部操作菜單 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首頁</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>禮請單</text>
			</navigator>
			<!-- <view class="p-b-btn" :class="{ active: favorite }" @click="toFavorite(goods)">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view> -->

			<view class="action-btn-group">
				<!-- #ifdef MP-WEIXIN -->
				<button type="primary" class=" action-btn no-border now-cart-btn" open-type="contact">客服</button>
				<!-- #endif -->
				<button type="primary" class=" action-btn no-border add-cart-btn" v-if="showCart"
					@click="addCart()">加入禮請單</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" v-if="false"
					@click="getmore()">專案辦理</button>
					<button type="primary" class=" action-btn no-border add-cart-btn" v-if="goods.hasEbook"
						@click="goDown()">下載電子書</button>
					
			</view>
		</view>

		<view class="mask" :class="maskState === 0 ? 'none' : maskState === 1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<view @click="obtainCoupon(item)" class="coupon-item" v-for="(item, index) in couponList" :key="index">
					<view class="con">
						<view class="left">
							<text class="title">{{ item.name }}</text>
							<text class="time">在{{ item.endTime }}前有效。 可領{{ item.perLimit }}張</text>
						</view>
						<!-- <view class="right">
							<text class="price">{{ item.amount }}</text>
							<text>滿{{ item.minPoint }}可減{{ item.amount }}</text>
						</view> -->
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">{{ item.categoryTitle ? '限' + item.categoryTitle + '可用' : '全品類可用' }}</text>
				</view>
			</view>
		</view>

		<!-- 規格-模態層彈窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩層 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="sku.pic"></image>
					<view class="right">
						<text class="price">¥{{ (sku.price * goods.memberRate) / 10 }} 原價 ¥{{ sku.price }}</text>
						<text class="stock">庫存：{{ sku.stock }}件</text>
						<view class="selected">
							已選：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected"
								:key="sIndex">{{ sItem.name }}</text>
						</view>
					</view>
				</view>
				<view v-for="(item, index) in specList" :key="index" class="attr-list">
					<text>{{ item.name }}</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in specChildList" v-if="childItem.pid === item.id"
							:key="childIndex" class="tit" :class="{ selected: childItem.selected }"
							@click="selectSpec(childIndex, childItem.pid)">
							{{ childItem.name }}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>

	</view>
</template>

<script>
	import jshopContent from '@/components/jshop/jshop-content.vue' //視頻和文本解析組件
	import Api from '@/common/api';
	import share from '@/components/share';
	import rfParser from '@/components/rf-parser';
	import {
		mapState
	} from 'vuex';
	import {
		formatDate
	} from '@/common/date';
	
	export default {
		components: {
			jshopContent,
			rfParser,
			
		},
		data() {
			return {
				maskState: 0, //優惠券面板顯示狀態
				specClass: 'none',
				shareGoodsImg: '',
				specSelected: [],
				small: null,
				sku: [],
				preSale: [],
				showCart: true,
				detailData: [],
				serviceList: [],
				goods: [],
				favorite: true,
				shareList: [],
				consultList: [],
				couponList: [],
				basicMarkingList: [],
				basicGiftsList: [],
				consultCount: {
					all: 0,
					bad: 0,
					general: 0,
					goods: 0
				},
				imgList: [{
						src: ''
					},
					{
						src: ''
					},
					{
						src: ''
					}
				],
				ifwx: false,
				desc: '',
				parentId: 0,
				skuList: [],
				specList: [],
				specChildList: [],
				selectBoxIndex: 0, // 規格發貨地 選擇 的 index
				limitNumber: '', // 限請數量
				productCategory: { name: "" },
				token:uni.getStorageSync('token')
			};
		},
		async onLoad(ops) {
			if (ops && ops.invitecode) {
				uni.setStorageSync('invitecode', ops.invitecode);
			}
			//接收傳值,id裏面放的是標題，因為測試數據並沒寫id
			let id = ops.id;
			let saleId = ops.saleId; // 預售id
			if (saleId) {
				this.showCart = false;
				let params1 = {
					id: ops.saleId
				};
				let preSale = await Api.apiCall('get', Api.index.samplePreSale, params1);
				this.preSale = preSale;
			}

			let user_id = ops.user_id;
			if (user_id != undefined) {
				this.parentId = user_id
				//let params = { objId: item.id, type: 1, name: item.name, meno1: item.pic, meno2: item.price, meno3: item.sale };
				//Api.apiCall('post', Api.goods.favoriteSave, params);
			}
			if (id) {
				// 判斷是不是微信瀏覽器
				this.ifwx = this.$common.isWeiXinBrowser()
				this.logining = true;
				let params = {
					id: ops.id
				};
				let data = await Api.apiCall('get', Api.goods.goodsDetail, params);
				this.logining = false;

				if (data) {
					let detailData = data.goods;
					let goods = detailData.goods;
					this.goods = goods;
					if (detailData.productCategory) {
					   this.productCategory = detailData.productCategory;
					}
					
					this.favorite = data.favorite;
					this.typeGoodsList = detailData.typeGoodsList;
					// var subImages = goods.albumPics; // 為 null
					var subImages = goods.pic;
					this.desc = goods.detailMobileHtml || goods.detailHtml;
					this.small = subImages.split(',');
					//await this.$api.json('detailData');
					console.log(this.small.length)
					if (this.small.length < 2) {
						this.small = [];
						this.small.push(this.goods.pic)

					}
					let shareList = await this.$api.json('shareList');
					this.loaded = true;

					var sers = goods.serviceIds;
					if (sers && sers.indexOf("1") != -1) {
						this.serviceList.push('無憂退貨');
					}
					if (sers && sers.indexOf("2") != -1) {
						this.serviceList.push('快速退款');
					}
					if (sers && sers.indexOf("3") != -1) {
						this.serviceList.push('正品保證');
					}
					this.shareList = shareList;
					this.specList = detailData.productAttributeValueList;
					this.skuList = detailData.skuStockList;
					// 法寶規格屬性
					this.skuList = detailData.skuStockList;
					let i = uni.getStorageSync('address')
					console.log(i, this.skuList)
					this.skuList.forEach((item, index) => {
						if (i == 1) {
							if (item.meno == '規格:內地') {
								this.selectBoxIndex = item.id
							}
						} else {
							this.selectBoxIndex = item.id
						}
					})


					if (this.specList) {
						this.specList.forEach(item => {
							let valuesA = item.value.split(',');
							if (valuesA) {
								for (let cItem of valuesA) {
									let att = {};
									att.pid = item.id;
									att.name = cItem;
									this.specChildList.push(att);
								}
							}
						});
					}

					uni.setNavigationBarTitle({
						title: goods.name
					});
				}
				let token = uni.getStorageSync('token')
				if (token) {
					let params = {
						goodsId: ops.id,
						pic: this.goods.pic
					};
					await Api.apiCall('post', Api.goods.addView, params);
				}
				let params1 = {
					goodsId: ops.id
				};
				let consoltL = await Api.apiCall('get', Api.goods.consultList, params1);
				this.consultList = consoltL.list;
				this.consultCount = consoltL.count;

				let params3 = {};
				let couponList1 = await Api.apiCall('get', Api.index.couponList, params3);
				this.couponList = couponList1;

			}

			//規格 默認選中第一條
			if (this.specList) {
				var specs = '';
				this.specList.forEach(item => {
					for (let cItem of this.specChildList) {
						if (cItem.pid === item.id) {
							this.$set(cItem, 'selected', true);
							this.specSelected.push(cItem);
							specs = cItem.name + ',' + specs;
							break; //forEach不能使用break
						}
					}
				});
				let valuesA = specs.substr(0, specs.length - 1).split(',');

				this.skuList.forEach(item => {
					if (valuesA.length == 1 && item.sp1 == valuesA[0]) {
						this.sku = item;
					}
					if (valuesA.length == 2 && item.sp2 == valuesA[0] && item.sp1 == valuesA[1]) {
						this.sku = item;
					}
					if (valuesA.length == 3 && item.sp3 == valuesA[0] && item.sp2 == valuesA[1] && item.sp1 ==
						valuesA[2]) {
						this.sku = item;
					}
					if (!this.sku.pic) {
						this.sku.pic = this.goods.pic;
					}
					if (!this.sku.stock) {
						this.sku.stock = 0;
					}
					this.goods.price = this.sku.price

				});
			}
			// 
			//console.log()
			let token = uni.getStorageSync('token')
			if(token && id>0){
				this.getLimits(id)
			}
		
		},
		computed: {

			shareHref() {
				let pages = getCurrentPages()
				let page = pages[pages.length - 1]
				// #ifdef H5 || MP-WEIXIN || APP-PLUS || APP-PLUS-NVUE
				return page.route + '?id=' + this.goodsId;
				// #endif

				// #ifdef MP-ALIPAY
				return page.__proto__.route + '?id=' + this.goodsId;
				// #endif
			},
		},
		filters: {
			/**
			 * 處理富文本裏的圖片寬度自適應
			 * 1.去掉img標簽裏的style、width、height屬性
			 * 2.img標簽添加style屬性：max-width:100%;height:auto
			 * 3.修改所有style裏的width屬性為max-width:100%
			 * 4.去掉<br/>標簽
			 * @param html
			 * @returns {void|string|*}
			 */
			formatRichText(html) { //控製小程序中圖片大小
				if (html) {
					let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
						match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
						match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
						match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
						return match;
					});
					newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
						match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi,
							'max-width:100%;');
						return match;
					});
					newContent = newContent.replace(/<br[^>]*\/>/gi, '');
					newContent = newContent.replace(/\<img/gi,
						'<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"');
					return newContent;
				} else {
					return '暫無法寶詳情'
				}
			},
			formatCreateTime(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
			},
		},
		methods: {

			navToTabPageStore(item) {

				let id = item;
				uni.navigateTo({
					url: `../../pagesC/store/businessDetails?id=${id}`
				});
			},
			toggleMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			//領取優惠券
			async obtainCoupon(index) {

				uni.showLoading({
					title: '請稍後'
				});

				let params = {
					couponId: index.id
				};
				let data = await Api.apiCall('post', Api.index.acceptCoupon, params);
				console.log(data);
				if (data) {
					this.$api.msg(data);
					this.toggleMask()
				}
				uni.hideLoading();


			},
			//規格彈窗開關
			toggleSpec() {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//選擇規格
			selectSpec(index, pid) {
				let list = this.specChildList;
				list.forEach(item => {
					if (item.pid === pid) {
						this.$set(item, 'selected', false);
					}
				});

				this.$set(list[index], 'selected', true);
				//存儲已選擇
				/**
				 * 修復選擇規格存儲錯誤
				 * 將這幾行代碼替換即可
				 * 選擇的規格存放在specSelected中
				 */
				var specs = '';
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
						specs = item.name + ',' + specs;
					}
				});
				let valuesA = specs.substr(0, specs.length - 1).split(',');
				this.sku = null;
				this.skuList.forEach(item => {

					if (valuesA.length == 1 && item.sp1 == valuesA[0]) {
						this.sku = item;
					}
					if (valuesA.length == 2 && item.sp2 == valuesA[0] && item.sp1 == valuesA[1]) {
						this.sku = item;
					}
					if (valuesA.length == 3 && item.sp3 == valuesA[0] && item.sp2 == valuesA[1] && item.sp1 ==
						valuesA[2]) {
						this.sku = item;
					}
				});
				if (!this.sku) {
					uni.showToast({
						title: "法寶不存在！"
					});
				}
				if (!this.sku.pic) {
					this.sku.pic = this.goods.pic;
				}
				if (!this.sku.stock) {
					this.sku.stock = 0;
				}

				this.goods.price = this.sku.price;

				console.log(this.sku)
			},
			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			// 跳轉到h5分享頁面
			goShare() {
				this.$refs.share.show();
			},
			closeShare() {
				this.$refs.share.close();
			},
			//獲取分享URL
			async getShareUrl() {
				this.shareGoodsImg = await Api.apiCall('get', Api.goods.getposter, {
					id: this.goods.id
				});
			},
			//收藏
			toFavorite(item) {
				let token = uni.getStorageSync('token')
				if (!token) {
					let url = '/pages/public/login';
					uni.navigateTo({
						url
					});
				} else {
					this.favorite = !this.favorite;
					let params = {
						objId: item.id,
						type: 1,
						name: item.name,
						meno1: item.pic,
						meno2: item.price,
						meno3: item.sale
					};
					Api.apiCall('post', Api.goods.favoriteSave, params);
				}
			},
			async buy(item) {
				let token = uni.getStorageSync('token')
				if (!token) {
					let url = '/pages/public/login';
					uni.navigateTo({
						url
					});
				}
				let userInfo = uni.getStorageSync('userInfo')

				let data;
				let id = item.id;
				console.log(id);
				if (this.sku && this.sku.id) {
					if (this.sku.stock < 1) {
						uni.showToast({
							title: "庫存不夠！"
						});
						return;
					}
					let params = {
						goodsId: id,
						skuId: this.sku.id,
						inviteMemberId: this.parentId > 0 ? this.parentId : 0
					};
					// data = await Api.apiCall('post', Api.order.addCart, params);
					let dataJson = {};
					dataJson.goodsId = this.goods.id;
					dataJson.inviteMemberId = this.parentId > 0 ? this.parentId : 0;
					dataJson.type = 1;
					dataJson.skuId = this.sku.id;
					let url = '/pages/order/createOrder?dataJson=' + JSON.stringify(dataJson)

					uni.navigateTo({
						url: url
					});

				} else {
					if (this.goods.stock < 1) {
						uni.showToast({
							title: "庫存不夠！"
						});
						return;
					}
					let params = {
						goodsId: id
					};
					//	data = await Api.apiCall('post', Api.order.addCart, params);
					let dataJson = {};

					dataJson.goodsId = this.goods.id;

					dataJson.type = 1;
					dataJson.inviteMemberId = this.parentId > 0 ? this.parentId : 0;
					let url = '/pages/order/createOrder?dataJson=' + JSON.stringify(dataJson)

					uni.navigateTo({
						url: url
					});
				}
			},
			async addCart(item) {
				let token = uni.getStorageSync('token')
				if (!token) {
					let url = '/pages/public/login';
					uni.navigateTo({
						url
					});
					return false;
				}
				let userInfo = uni.getStorageSync('userInfo')
				//console.log(userInfo)
				//console.log(this.goods.storeId)
				let id = this.goods.id;
				let data;

				if (this.sku && this.sku.id) {
					if (this.sku.stock < 1) {
						uni.showToast({
							title: "庫存不夠！"
						});
						return;
					}
					let params = {
						goodsId: id,
						skuId: this.sku.id,
						inviteMemberId: this.parentId > 0 ? this.parentId : 0
					};
					data = await Api.apiCall('post', Api.order.addCart, params);
				} else {
					if (this.goods.stock < 1) {
						uni.showToast({
							title: "庫存不夠！"
						});
						return;
					}
					let params = {
						goodsId: id,
						inviteMemberId: this.parentId > 0 ? this.parentId : 0,
						total:1
					};
					data = await Api.apiCall('post', Api.order.addCart, params);
				}

				if (data) {
					this.$api.msg('添加禮請單成功!');
				} else {
					this.$api.msg('加入禮請單錯誤');
				}
			},
			stopPrevent() {},
			// 獲取限請數 
			async getLimits(id) {
				let that = this;
				let params = {
					id: id
				}
				let res = await Api.apiCall('get', Api.goods.getLimit, {id: id})
				console.log("res",res)
				console.log(res.data)
				that.limitNumber = res.num
				console.log(res)
			},
			// 跳轉到專案辦理
		getmore() {
				uni.navigateTo({
					url: '/pagesU/user/askList?id=' + this.goods.id + "&cid=" + this.goods.productCategoryId + "&name=" + this
					.goods.name 
				});

			},
			goDown () {
				window.location.href =
				        "http://www.amtbhk.com/home/ebook/detail?id=" + this.goods.id;
			}
		},
		watch: {
			goods: {
				handler() {
					this.getShareUrl();
				},
				deep: true
			}
		},
		onShareAppMessage() {
			let token = uni.getStorageSync('token');
			if (token) {
				let userInfo = uni.getStorageSync('userInfo')
				return {
					title: this.goods.name,
					// #ifdef MP-ALIPAY
					desc: this.goods.subTitle,
					// #endif
					imageUrl: this.shareGoodsImg,
					path: "/pagesA/product/product?id=" + this.goods.id + "&invitecode" + userInfo.id,
				};
			} else {
				return {
					title: `歡迎加入`,
					path: '/pages/index/index'
				};
			}
		},


	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
			padding: 20upx;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	/* 標題簡介 */
	.introduce-section {
		background: #fff;
		padding: 20upx;

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
		}

		.price {
			font-size: $font-lg + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: $font-base;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 評價 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  詳情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
		width: 100%;
		padding: 0 20upx;
		font-size: 28upx;
		color: #333;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 規格選擇彈窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  彈出層 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜單 */
	.page-bottom {
		position: fixed;
		left: 80upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 620upx;
		height: 100upx;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, 0.5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}

	/* 優惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: 0.3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: 0.3s;
			overflow-y: scroll;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, 0.4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}

	/* 優惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}

	/* 分類推薦樓層 */
	.hot-floor {
		width: 100%;
		overflow: hidden;
		margin-bottom: 20upx;

		.floor-img-box {
			width: 100%;
			height: 220upx;
			position: relative;
			display: flex;

			&:after {
				padding: 10 30upx;
				content: '';
				position: absolute;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(255, 255, 255, 0.06) 30%, #f8f8f8);
			}
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
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
				width: 100upx;
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
</style>
