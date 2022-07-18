<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item"
				:class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">{{ item.text }}</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白頁 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>

					<!-- 訂單列表 -->
					<view v-for="(item, index) in tabItem.orderList" :key="index" class="order-item">
						<view class="i-top b-b">
							<text class="time" @click="navToDetailPage(item)">{{ item.createTimeDateFormat }}</text>
							<text class="order-label">訂單號:</text>
							<text class="order-id" @click="navToDetailPage(item)">{{ item.id }}</text>
							<text class="state" :style="{ color: item.stateTipColor }"
								@click="navToDetailPage(item)">{{ item.stateTip }}</text>
							<text v-if="item.status==2 && (item.createTime+24*60*60*1000>now)" class="del-btn yticon icon-iconfontshanchu1"
								@click="cancelOrder(index)"></text>
						</view>

						<scroll-view v-if="item.orderItemList.length > 1" class="goods-box" scroll-y>
							<view v-for="(goodsItem, goodsIndex) in item.orderItemList" :key="goodsIndex"
								class="goods-item">
								<image class="goods-img" :src="goodsItem.productPic" @click="navToDetailPage(item)"
									mode="aspectFit"></image>
							</view>
						</scroll-view>
						<view v-if="item.orderItemList.length === 1" class="goods-box-single"
							@click="navToDetailPage(item)" v-for="(goodsItem, goodsIndex) in item.orderItemList"
							:key="goodsIndex">
							<image class="goods-img" :src="goodsItem.productPic" mode="aspectFit"></image>
							<view class="right">
								<text class="title clamp">{{ goodsItem.productName }}</text>
								 <text class="attr-box"> {{ goodsItem.productAttr || '' }} x
									{{ goodsItem.productQuantity }}</text>
							</view>
						</view>

						<view class="price-box">
							共
							<text class="num">{{ item.orderItemList.length }}</text>
							件法寶 預估運費
							<text class="price">
								{{unit}} {{ item.freightAmount }}
							</text>
						</view>
						<view class="action-box b-t">
							<button v-if="item.status==2 && (item.createTime+24*60*60*1000>now)" class="action-btn" @click="cancelOrder(item)">取消訂單</button>
							<button v-if="item.status===15||item.status===16" class="action-btn recom"
								@click="deleteOrder(item)">刪除訂單</button>
						<!-- 	<button v-if="(item.status >2 && item.status <6) && item.addressId>0" class="action-btn recom"
								@click="lookLogistics(item.id)">查看物流</button> -->
							<button class="action-btn detail"
									@click="navToDetailPage(item)">查看詳情</button>
							<button v-if="(item.status>=3 && item.status<=5) && item.pickupAddressId>0" class="action-btn recom"
								>已自提</button>
							<button v-if="item.status == 3" class="action-btn recom"
								@click="confirmDelivery(item)">確認收貨</button>
						</view>
					</view>
					<uni-load-more :status="loadingType"></uni-load-more>
				</scroll-view>

			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex';
	import Api from '@/common/api';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from '@/components/empty';
	import {
		formatDate
	} from '@/common/date';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				pageNum: 1,
				orderType: 0,
				orderList: [],
				headerPosition: 'fixed',
				headerTop: '0px',
				loadingType: 'loading', //加載更多狀態
				navList: [{
						status: 0,
						text: '全部',
						loadingType: 'loading',
						orderList: []
					},
					{
						status: 2,
						text: '待發貨',
						loadingType: 'loading',
						orderList: []
					},
					{
						status: 3,
						text: '已發貨',
						loadingType: 'loading',
						orderList: []
					},
					{
						status: 5,
						text: '已完成',
						loadingType: 'loading',
						orderList: []
					}

				],
				now: new Date().getTime()
			};
		},
		async onShow(options) {},
		onLoad(options) {
			console.log(this.now);
			
			
			/**
			 * 修復app端點擊除全部訂單外的按鈕進入時不加載數據的問題
			 * 替換onLoad下代碼即可
			 */
			this.tabCurrentIndex = +options.status;
			this.orderType = options.orderType
			this.loadData();
		},
		onPageScroll(e) {
			//兼容iOS端下拉時頂部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = 'fixed';
			} else {
				this.headerPosition = 'absolute';
			}
		},

		//下拉刷新
		onPullDownRefresh() {
			this.pageNum = 1;
			this.loadData('refresh');
		},
		//加載更多
		onReachBottom() {
			this.pageNum = this.pageNum + 1;
			this.loadData('refresh');
		},
		computed: {
			...mapState(['userInfo']),
			...mapGetters(['unit'])
		},
		methods: {
			//詳情
			navToApplyDetailPage(item) {
				//測試數據沒有寫id，用title代替
				let id = item.id;
				uni.navigateTo({
					url: `../../pagesA/after_sale/list`
				});
			},
			//詳情
			navToDetailPage(item) {
				//測試數據沒有寫id，用title代替
				let id = item.id;
				uni.navigateTo({
					url: `/pages/order/orderDetail?id=${id}`
				});
			},
			//獲取訂單列表
			async loadData(type = 'add', loading) {
				//這裏是將訂單掛載到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				console.log(navItem)
				let status = navItem.status;


				let url;


				let params = {
					pageNum: this.pageNum,
					status: status
				};
				if (this.orderType && this.orderType != 0) {
					params.orderType = this.orderType;
				}
				let data = await Api.apiCall('get', Api.order.orderList, params);
				let goodsList = data.records;
				let orderList = goodsList.filter(item => {
					//添加不同狀態下訂單的表現形式
					item = Object.assign(item, this.orderStateExp(item.status));
					item.createTimeDateFormat = this.dateFormat(item.createTime);
					//演示數據所以自己進行狀態篩選
					if (status === 0) {
						//0為全部訂單
						return item;
					}
					return item.status === status;
				});

				if (type === 'refresh') {
					this.orderList = [];
				}

				this.orderList = this.orderList.concat(orderList);

				//判斷是否還有下一頁，有是more  沒有是nomore(測試數據判斷大於20就沒有了)
				this.loadingType = this.orderList.length >= data.total ? 'nomore' : 'loading';
				if (type === 'refresh') {
					if (loading == 1) {
						uni.hideLoading();
					} else {
						uni.stopPullDownRefresh();
					}
				}

				navItem.orderList = [];
				orderList.forEach(item => {
					navItem.orderList.push(item);
				});

			},

			//swiper 切換
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				//this.pageNum =  1;
				this.loadData('refresh');
			},
			//頂部tab點擊
			tabClick(index) {
				this.pageNum = 1;
				//	this.loadData('refresh');
				this.tabCurrentIndex = index;
			},

			async payOrder(item) {
				let url = '/pages/order/payment/index?order_id=' + item.id + '&type=1';
				this.$common.navigateTo(
					url
				)

			},
			async deleteOrder(item) {
				let params = {
					orderId: item.id
				};
				let data = await Api.apiCall('post', Api.order.deleteOrder, params);

				if (data) {
					this.$api.msg(data);
					this.pageNum = 1;
					this.loadData('refresh');
					this.tabCurrentIndex = 0;
				}

			},

			//取消訂單
			async cancelOrder(item) {
				// 超過1天的不能取消
				let date = new Date(item.createTime);
				if (this.now-date.getTime()>24*60*60*1000){
					 this.$api.msg("已超過猶豫期，不能取消");
					 return
				 }
				let params = {
					orderId: item.id
				};
				let data = await Api.apiCall('post', Api.order.cancelOrder, params);
				if (data) {
					this.$api.msg(data);
					this.pageNum = 1;
					this.loadData('refresh');
					this.tabCurrentIndex = 4;
				}
			},
			//訂單確認收貨
			async confirmDelivery(item) {
				let params = {
					id: item.id
				};
				let data = await Api.apiCall('post', Api.order.confirmDelivery, params);
				console.log(data);
				if (data) {
					this.$api.msg(data);
					this.pageNum = 1;
					this.loadData('refresh');
					this.tabCurrentIndex = 4;
				}

			},
			lookLogistics(orderId) {
				this.$common.navigateTo(
					'/pages/order/logistics?order_id=' + orderId
				)
			},

			// 去評價
			toEvaluate(orderId) {
				this.$common.navigateTo(
					'/pages/order/evaluate?order_id=' + orderId
				)
			},

			//訂單狀態文字和顏色
			orderStateExp(value) {
				let stateTip = '',
					stateTipColor = '#fa436a';
				if (value === 2) {
					stateTip = '待發貨';
				} else if (value === 3) {
					stateTip = '待收貨';
				} else if (value === 4) {
					stateTip = '已完成';  // 已評價
				} else if (value === 5) {
					stateTip = '已完成';
				} else if (value === 15) {
					stateTip = '已關閉';
				} else if (value === 16) {
					stateTip = '無效訂單';
				} else {
					stateTip = '待審核';
				}
				return {
					stateTip,
					stateTipColor
				};
			},

			dateFormat(time) {
				if (time == null || time === '') {
					return 'N/A';
				}
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
			},
			timeFormat(timeDate){
				let Time = new Date(timeDate)
				return Time;
			}
			
		}
	};
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;

		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

			.time {
				flex: 1;
			}
			.order-label .order-id{
				font-size:$font-sm;
			}
			.order-id{
				color: $font-color-dark;
				margin-right:30upx;
			}
			.state {
				color: $base-color;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		/* 多條法寶 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;

			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
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
			&.detail {
				background: #fff9f9;
				color: $base-color;
			
				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}

	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center;
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999;
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px;
	}

	.uni-load-more__img>view {
		position: absolute;
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: 0.2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite;
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px;
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0;
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px;
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0;
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px;
	}

	.load2 {
		transform: rotate(30deg);
	}

	.load3 {
		transform: rotate(60deg);
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s;
	}

	.load2 view:nth-child(1) {
		animation-delay: 0.13s;
	}

	.load3 view:nth-child(1) {
		animation-delay: 0.26s;
	}

	.load1 view:nth-child(2) {
		animation-delay: 0.39s;
	}

	.load2 view:nth-child(2) {
		animation-delay: 0.52s;
	}

	.load3 view:nth-child(2) {
		animation-delay: 0.65s;
	}

	.load1 view:nth-child(3) {
		animation-delay: 0.78s;
	}

	.load2 view:nth-child(3) {
		animation-delay: 0.91s;
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s;
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s;
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s;
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s;
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0.2;
		}
	}
</style>
