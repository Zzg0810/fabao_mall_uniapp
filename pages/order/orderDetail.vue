<template>
	<view class="content">
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content">
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- 訂單列表 -->
					<view class="order-item">
						<view class="i-top b-b">
							<text class="time">{{ orderInfo.createTime }}</text>
							<text class="order-label">訂單號:</text>
							<text class="order-id" >{{ orderInfo.id }}</text>
							<text class="state" :style="{ color: orderInfo.stateTipColor }">{{ orderInfo.stateTip }}</text>
							<text v-if="orderInfo.status === 9" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(index)"></text>
						</view>
						<view class="i-top b-b">
							<text class="state" :style="{ color: orderInfo.stateTipColor }">訂單法寶</text>
						</view>

						<view v-if="goodsItem.type === 1" class="goods-box-single" @click="navToDetailPage(goodsItem)" v-for="(goodsItem, goodsIndex) in orderInfo.orderItemList" :key="goodsIndex">
							<img class="goods-img" :src="goodsItem.productPic" mode="aspectFill" ></img>
							<view class="right">
								<text class="title clamp">{{ goodsItem.productName }}</text>
								<text class="attr-box">{{ goodsItem.productAttr || '' }} x {{ goodsItem.productQuantity }}</text>
							</view>
						</view>
					
						<view v-if="goodsItem.type === 2" class="goods-box-single" @click="navToDetailPage(goodsItem)" v-for="(goodsItem, goodsIndex) in orderInfo.orderItemList" :key="goodsIndex">
							<img class="goods-img" :src="goodsItem.productPic" mode="aspectFit" ></img>
							<view class="right">
								<text class="title clamp">{{ goodsItem.productName }}</text>
							</view>
						</view>
						<view class="price-box">
							共
							<text class="num">{{ orderInfo.orderItemList && orderInfo.orderItemList.length || 0 }}</text>
							件法寶
						</view>
						<view class="price-box">預估運費
							<text class="price">{{unit}} {{ orderInfo.freightAmount }}</text>
						</view>
						<view v-if="orderInfo.addressId > 0 && orderInfo.status>2">
							<view class="price-box" >
								物流公司：
								<text class="num">{{ orderInfo.deliveryCompany||'' }}</text>
							</view>
							<view class="price-box">
								物流編號：
								<text class="num">{{ orderInfo.deliverySn||'' }} </text>
							</view>
							<view class="price-box" >
								<text><button type="default" size="mini" @click="copyNo(orderInfo.deliverySn)" class="copy-btn">復製物流編號</button></text>
								<text><a href="https://www.kuaidi100.com/" class="kuaidi-link" target="_blank" >查詢物流</a></text>
							</view>
						</view>
						
						<view class="action-box b-t">
							<button v-if="orderInfo.status==2" class="action-btn" @click="cancelOrder(orderInfo)">取消訂單</button>
							<button v-if="orderInfo.status===15||orderInfo.status===16" class="action-btn recom"
								@click="deleteOrder(orderInfo)">刪除訂單</button>
					<!-- 		<button v-if="(orderInfo.status >2 && orderInfo.status <6) && orderInfo.addressId>0" class="action-btn recom"
								@click="lookLogistics(orderInfo.id)">查看物流</button> -->
							<button v-if="(orderInfo.status>=3 && orderInfo.status<=5) && orderInfo.pickupAddressId>0" class="action-btn recom"
								>已自提</button>
							<button v-if="orderInfo.status == 3" class="action-btn recom"
								@click="confirmDelivery(orderInfo)">確認收貨</button>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
import Api from '@/common/api';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from '@/components/empty';
import Json from '@/Json';
import { formatDate } from '@/common/date';
export default {
	components: {
    		mallplusCopyright,
		uniLoadMore,
		empty
	},
	computed: {
		...mapGetters(['unit'])
	},
	data() {
		return {
			tabCurrentIndex: 0,
			orderInfo: [],
			navList: [
				{
					status: 0,
					text: '全部',
					loadingType: 'more',
					orderList: []
				},
				{
					status: 12,
					text: '待付款',
					loadingType: 'more',
					orderList: []
				},
				{
					status: 2,
					text: '待發貨',
					loadingType: 'more',
					orderList: []
				},
				{
					status: 3,
					text: '已發貨',
					loadingType: 'more',
					orderList: []
				},
				{
					status: 4,
					text: '已完成',
					loadingType: 'more',
					orderList: []
				}
			],
			deliveryCompany: '',
			deliverySn:''
		};
	},

	async onLoad(options) {
		let params = { id: options.id };
		this.orderInfo = await Api.apiCall('get', Api.order.orderDetail, params);
		this.deliveryCompany = this.orderInfo.deliveryCompany
		this.deliverySn = this.orderInfo.deliverySn
		this.orderInfo = Object.assign(this.orderInfo, this.orderStateExp(this.orderInfo.status));
		this.orderInfo.createTime = this.dateFormat(this.orderInfo.createTime);
	},

	methods: {

		//刪除訂單
		async deleteOrder(index) {
			uni.showLoading({
				title: '請稍後'
			});
			setTimeout(() => {
				this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
				uni.hideLoading();
			}, 600);
		},
		async payOrder(item) {
			 let url = '/pages/order/payment/index?order_id=' + item.id + '&type=1' ;
            			this.$common.navigateTo(
            					url
            			)
		},
			//詳情
        		navToDetailPage(item) {
        			//測試數據沒有寫id，用title代替
        			let id = item.productId;
        			uni.navigateTo({
        				url: `../../pagesA/product/product?id=${id}`
        			});
        		},
        			//詳情
                		navToApplyDetailPage(item) {
                			//測試數據沒有寫id，用title代替
                			let id = item.id;
                			uni.navigateTo({
                				url: `../../pagesA/after_sale/list`
                			});
                		},
		//取消訂單
		async cancelOrder(item) {
			uni.showLoading({
				title: '請稍後'
			});
			let params = { orderId: item.id };
			let data = await Api.apiCall('post', Api.order.closeOrder, params);

			if (data) {
				this.$api.msg(data.data);
			}
			uni.hideLoading();
		},
		//訂單確認收貨
		async confirmDelivery(item) {
			uni.showLoading({
				title: '請稍後'
			});
			let params = { id: item.id };
			let data = await Api.apiCall('post', Api.order.confirmDelivery, params);

			if (data) {
				this.$api.msg(data);
			}
			uni.hideLoading();
		},
			// 申請售後
                		applyRefund(orderId) {
                			this.$common.navigateTo(
                					'../../pagesA/after_sale/index?order_id=' + orderId
                			)
                		},

		//訂單申請退款
		async applyRefund1(item) {
			uni.showLoading({
				title: '請稍後'
			});
			let params = { id: item.id };
			let data = await Api.apiCall('post', Api.order.applyRefund, params);
			console.log(data);
			if (data) {
				this.$api.msg(data.data);
			}
			uni.hideLoading();
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
            			if (value === 12) {
            				stateTipColor = '#909399';
            				stateTip = '待付款';
            			}if (value === 1) {
            				stateTipColor = '#909399';
            				stateTip = '支付成功，沒有回掉';
            			}if (value === 2) {
            				stateTip = '待發貨';
            			} else if (value === 3) {
            				stateTip = '待收貨';
            			} else if (value === 4) {
            				stateTip = '待評價';
            			} else if (value === 5) {
            				stateTip = '已完成';
            			} else if (value === 6) {
            				stateTipColor = '#909399';
            				stateTip = '維權中';
            			} else if (value === 7) {
            				stateTip = ' 維權已完成';
            			} else if (value === 8) {
            				stateTip = '待分享';
            			} else if (value === 13) {
            				stateTip = '申請退款';
            			} else if (value === 14) {
            				stateTip = '已退款';
            			}  else if (value === 15) {
            				stateTip = '已關閉';
            			} else if (value === 16) {
            				stateTip = '無效訂單';
            			} else if (value === 18) {
                          				stateTip = '拼團下單';
                         }  else if (value === 19) {
                                         				stateTip = '申請售後';
                                        }else {
            				stateTip = '待付款';
            			}

            			return { stateTip, stateTipColor };
		},
		dateFormat(time) {
			if (time == null || time === '') {
				return 'N/A';
			}
			let date = new Date(time);
			return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
		},
		lookLogistics() {
			this.$common.navigateTo(
					'/pages/order/logistics?order_id=' + this.orderInfo.id
			)
		},
		copyNo (no) {
		        uni.setClipboardData({
		            data: no, // e是你要保存的内容
		            success: function () {
		        		uni.showToast({
		        			title:'复制成功',
		        			icon:'none'
		        		})
		            }
		        })
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

.uni-load-more__img > view {
	position: absolute;
}

.uni-load-more__img > view view {
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

.uni-load-more__img > view view:nth-child(1) {
	transform: rotate(90deg);
	top: 2px;
	left: 9px;
}

.uni-load-more__img > view view:nth-child(2) {
	transform: rotate(180deg);
	top: 11px;
	right: 0;
}

.uni-load-more__img > view view:nth-child(3) {
	transform: rotate(270deg);
	bottom: 2px;
	left: 9px;
}

.uni-load-more__img > view view:nth-child(4) {
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
.copy-btn{
	width: 180upx;
	height:55upx;
	line-height:55upx;
	padding:0;
	margin-right:10upx;
	border-radius: 80px;
	vertical-align: middle;
}
.kuaidi-link{
	text-decoration: none;
	vertical-align: center;
}
</style>
