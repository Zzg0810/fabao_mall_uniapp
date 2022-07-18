<template>
	<view class="container">
		<!-- #ifdef MP-WEIXIN -->
		<nav-bar>禮請單</nav-bar>
		<!-- #endif -->
		<!-- 空白頁 -->
		<view v-if="!hasLogin || empty === true" class="empty">
			<image src="/static/images/icon_none@2x.png" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				還沒有禮請法寶
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">去禮請></navigator>
			</view>
			<view v-else class="empty-tips">
				還沒有登錄
				<view class="navigator" @click="navToLogin">去登錄></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view class="cart-item" :class="{ 'b-b': index !== cartList.length - 1 }">
						<view class="image-wrapper">
							<image :src="item.productPic" class="loaded" mode="aspectFill" lazy-load @load="onImageLoad('cartList', index)"
							 @error="onImageError('cartList', index)"></image>
							<view class="yticon icon-xuanzhong2 checkbox" :class="{ checked: item.checked === '1' || item.checked }" @click="check('item', index)"></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{ item.productName }}</text>
							<text class="attr" v-if="item.productAttr">{{ item.productAttr  || '' }}</text>
							<!-- <text class="price">¥{{ item.price }}</text> -->
							<uni-number-box 
								class="step"
								:min="1"
								:max="item.limitNum"
								:value="item.quantity"
								:isMin="item.quantity === 1"
								:isMax="item.quantity === item.limitNum"
								:disabled="item.checkedmax"
								:index="index"
							 	@eventChange="numberChange"
							/>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>

			<!-- 底部菜單欄 -->
			<view class="action-section">
				<view class="checkbox">
					<image :src="allChecked ? '/static/selected.png' : '/static/select.png'" mode="aspectFit" @click="check('all')"></image>
					<view class="clear-btn" :class="{ show: allChecked }" @click="clearCart">清空</view>
				</view>
				<view class="total-box">
					<text class="price">重量：共 {{weightAll}} 克</text>
					<!-- <text class="coupon">
						預計到付運費
						<text>000.00</text>
						元
					</text> -->
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">提交申請</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	import Api from '@/common/api';
	import {
		mapState
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import navBar from '@/components/zhouWei-navBar';
	export default {
		components: {
			uniNumberBox,
			navBar,
		},
		data() {
			return {
				total: 0, //總價格
				allChecked: false, //全選狀態  true|false
				empty: false, //空白頁現實  true|false
				hasLogin: false,
				promoteAmount: 0,
				cartList: [],
				statusBarHeight: ''
			};
		},

		async onShow() {
			let token = uni.getStorageSync('token');
			if (token) {
				this.hasLogin = true;
				this.loadData();
			}
		},
		async onLoad() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		},
		watch: {
			//顯示空白頁
			cartList(e) {
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
			}
		},
		computed: {
			...mapState(['userInfo']),
			weightAll() {
				let weight = 0
				const {
					cartList
				} = this
				if (cartList.length) {
					cartList.forEach(r => {
						if (r.checked == 1 && r.product && r.product.weight) {
							weight += parseInt(r.quantity * r.product.weight)
						}
					})
				}
				return weight
			}
		},
		methods: {
			//請求數據
			async loadData() {
				let params = {};
				let list = await Api.apiCall('get', Api.order.cartList, params);
				// let list = await this.$api.json('cartList');
				let cartList = list.cartItemList.map(item => {
					item.checked = '1';
					item.checkedmax = false
					return item;
				});
				cartList = cartList.map(item=>{
					let data = {
						id: item.id
					}
					Api.apiCall('get',Api.goods.getLimit,data)
						.then(res=>{
							item.limitNum = res.num;
							if(item.quantity==res.num){
								item.checkedmax = true
							}
						});
					return item;
				});
				this.cartList = cartList;
				console.log('cartList', cartList)
				this.promoteAmount = list.promoteAmount;
				this.calcTotal(); //計算總價
			},
			//監聽image加載完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//監聽image加載失敗
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},
			//選中狀態處理
			check(type, index) {
				if (type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
				} else {
					const checked = !this.allChecked;
					const list = this.cartList;
					list.forEach(item => {
						item.checked = checked;
					});
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//數量
			async numberChange(data) {
				let {
					cartList
				} = this;
				let {
					index,
					number
				} = data;
				let self = this;
				let id = cartList[index].id;
				let productId = cartList[index].productId;
				let params = {
					id: productId,
					productId: productId,
					quantity: 0
				};
				if (Number(number) === 1) {
					self.cartList[index].quantity = 1;
					params.quantity = 1;
				} else {
					let limit = cartList[index].limitNum;
					if (number <= limit) {
						console.log(11);
						self.cartList[index].quantity = number;
						params.quantity = number;
						// Api.apiCall('post', Api.order.updateQuantity, params);
						// self.calcTotal();
					} else {
						self.cartList[index].quantity = limit;
						params.quantity = limit;
						uni.showToast({
							title:"超出限製數"
						});
						// self.$nextTick(() => {
						// 	//self.cartList[index].quantity = limit;
						// 	uni.showToast({
						// 		title:"超出限製數"
						// 	});
						// 	console.log('self.cartList', self.cartList)
						// });
					}
				}
				Api.apiCall('post', Api.order.updateQuantity, params);
				self.calcTotal();
				// this.cartList[data.index].quantity = data.number;
				// let productId = this.cartList[data.index].productId;
				// let params = {
				// 	id: productId,
				// 	productId: productId,
				// 	quantity: data.number
				// };
				// // console.log(JSON.stringify(params))
				// let re=await Api.apiCall('get',Api.goods.getLimit,params);
				// // console.log(re.num)
				// if(re.num>0){
				// 	data = await Api.apiCall('post', Api.order.updateQuantity, params);
				// 	console.log(data)
				// 	this.calcTotal();
				// }else{
				// 	this.cartList[data.index].quantity = data.number-1
				// 	uni.showToast({
				// 		title:"超出限製數"
				// })
				// }
			},
			//刪除
			deleteCartItem(index) {
				var that = this;
				uni.showModal({
					title: '提示',
					content: '確定將此法寶移出禮請單嗎',
					success: res => {
						if (res.confirm) {
							let list = that.cartList;
							let row = list[index];
							let id = row.id;
							let params = {
								cart_id_list: id
							};
							Api.apiCall('post', Api.order.deleteCart, params);
							that.cartList.splice(index, 1);
							that.calcTotal();
							uni.hideLoading();
						}
					},
				});
			},
			//清空
			clearCart() {
				var that = this;
				uni.showModal({
					title: '提示',
					content: '確定將禮請單清空嗎',
					success: res => {
						if (res.confirm) {
							let params = {};
							Api.apiCall('post', Api.order.clearCart, params);
							this.cartList = [];
						}
					}
				});
			},
			//計算總價
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item => {
					if (item.checked === true || item.checked === '1') {
						total += item.price * item.quantity;
					} else if (checked === true) {
						checked = false;
					}
				});
				total = total - this.promoteAmount;
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//創建訂單
			createOrder() {
				let list = this.cartList;
				var ids = '';
				list.forEach(item => {
					if (item.checked === true || item.checked === '1') {
						ids = item.id + ',' + ids;
					}
				});
				let cartIds = ids.substr(0, ids.length - 1);
				let dataJson = {};

				dataJson.type = 2;
				dataJson.cartIds = cartIds;
				let url = '/pages/order/createStoreOrder?dataJson=' + JSON.stringify(dataJson)

				uni.navigateTo({
					url: url
				});


			}
		}
	};
</script>

<style lang="scss">
	.container {
		padding-bottom: 134upx;

		/* 空白頁 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm + 2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	/* 法寶車列表項 */
	.cart-item {
		display: flex;
		position: relative;
		padding: 30upx 40upx;

		.image-wrapper {
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
			}
		}

		.checkbox {
			position: absolute;
			left: -16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				height: 50upx;
				line-height: 50upx;
			}
		}

		.del-btn {
			padding: 4upx 10upx;
			font-size: 34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}

	/* 底部欄 */
	.action-section {
		/* #ifdef H5 */
		margin-bottom: 100upx;
		/* #endif */
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
		border-radius: 16upx;

		.checkbox {
			height: 52upx;
			position: relative;

			image {
				width: 52upx;
				height: 100%;
				position: relative;
				z-index: 5;
			}
		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius: 0 50px 50px 0;
			opacity: 0;
			transition: 0.2s;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;

			.price {
				font-size: $font-lg;
				color: $font-color-dark;
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}

		.confirm-btn {
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72);
		}
	}

	/* 復選框選中狀態 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}

	.getPosition {
		height: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32upx;
		background-color: #fff;
	}
</style>
