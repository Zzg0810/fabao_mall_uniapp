<template>
	<view class="containner">
		 <view class="navbar">
			  <view class="navbar-item" :class="{active: currentIndex == i}" v-for="(item, i) in navList" :key="i" @click="tabClick(i)">
			  {{item.name}}
			  </view>
		 </view>
		 <swiper :current="currentIndex" class="swiper-box" duration="300" @change="changeTab">
		 	<swiper-item class="tab-content" >
		 		<view class="list-scroll-content" >
		 			<!-- 空白頁 -->
		 			<view v-if="tabItem.loaded === true && tabItem.list.length === 0" class="no-data">
						<image src="/static/images/icon_none@2x.png" mode="aspectFit"></image>
						暫無申請
					</view>
		 			<!-- 訂單列表 -->
		 			<view v-for="(item, index) in tabItem.list" :key="index" class="fb-item">
						<view class="top-info">
							<text>{{statusName[item.status]}}</text>
							<text>{{expireFlagName[item.expire_flag]}}</text>
							<text>{{item.create_at && $moment(item.create_at).format()}}</text>
						</view>
						<view class="detail-box">
							<view class="img-box">
								<image :src="item.propic" mode="aspectFit"></image>
							</view>
							<view class="detail">
								 <view class="name">{{item.productName}}</view>
								 <view class="normal">請求數{{item.product_quantity}}</view>
								 <view class="normal">實批數量：{{item.product_real_quantity}}</view>
								 <view class="normal"></view>
								 <view class="normal"></view>
							</view>
						</view>
						<!-- 按鈕組 -->
					
							<view class="action-box b-t">
								<button v-if="item.status===2 && item.expire_flag===0" class="action-btn" 
									@click="navTo(item)">編輯</button>
								<button v-if="item.status!==2 || item.expire_flag===1" class="action-btn view"
									@click="navTo(item)">查看</button>
								<button v-if="item.status===2" class="action-btn recom"
									@click="deleteItem(item)">刪除</button>
							</view>
						
						
					
					</view>
		 		</view>
		 	</swiper-item>
			<swiper-item class="tab-content" >
				<scroll-view class="list-scroll-content" scroll-y >
					<view class="infoss" v-html="info.crowdfundingProtocol"></view>
				</scroll-view>
			</swiper-item>
		 </swiper>
		 <view class="add" v-show="currentIndex == 0" @click="add">
			 新增
		 </view>
	</view>
</template>
<script>
	import Api from '@/common/api';
	export default {
		name: 'projectManagement',
		data () {
			return {
				navList: [
					{
						name: '法寶列表'
					},
					{
						name: '禮請說明'
					}
				],
				currentIndex: 0,
				info: {},
				loadingType: 'loading', //加載更多狀態
				tabItem: {
					loaded: false,
					list: [
					]
				},
				statusName: ['未通過', '通過', '待審核'],
				expireFlagName: ['有效','失效']
				
			}
		},
		onShow (){
			this.getInfo()
			this.loadData()
		},
		methods: {
			tabClick (index) {
				this.currentIndex = index
			},
			async getInfo () {
				const data = await Api.apiCall('get', Api.index.sysInfo, {});
				this.info = data || {}
			},
			changeTab(e) {
				this.currentIndex = e.target.current;
			},
			async loadData () {
				const data = await Api.apiCall('get', Api.goods.getProjectManagementApplyList, {pageSize: 1000});
				this.tabItem.loaded = false
				this.tabItem.list = data && data.records || []
				this.tabItem.loaded = true
			},
			navTo (item) {
				uni.setStorageSync('fbZhuanAng', JSON.stringify(item))
				uni.navigateTo({
					url: `/pages/index/projectManagementDetail?id=${item.id}`
				});
			},
			add () {
				uni.setStorageSync('fbZhuanAng', '')
				uni.navigateTo({
					url: `/pages/index/projectManagementDetail`
				});
			},
			async deleteItem(item) {
				const result = await  Api.apiCall('get', Api.index.deletesZhuanan, {id:item.id})
				if (result) {
					this.$api.msg('刪除成功')
					setTimeout(() => {
						uni.navigateBack({
							url: '/pages/index/projectManagement'
						})
					}, 1000)
					
				}
			}
		}
	}
</script>
<style lang="scss">
	.containner {
		width: 100%;
		overflow:hidden;
		background: #f3f3f3;
		.add {
			width: 100upx;
			height: 100upx;
			text-align: center;
			line-height: 100upx;
			border-radius: 50%;
			font-size: 30upx;
			color: #fff;
			// background: rgba(0,0,0, 0.5);
			background: $theme-blue;
			box-shadow: 0 0 2upx 4upx rgba(0,0,0,0.2);
			position:fixed;
			right: 40upx;
			bottom: 100upx;
			z-index: 100;
		}
	}
	.swiper-box {
		height: calc(100vh - 40px);
	}
	.tab-content {
		overflow-y:auto;
		padding-bottom: 40upx;
	}
	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 10;
		width: 100%;
		.navbar-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.active {
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
	.infoss {
		width: 100%;
		padding: 10px;
	}
	.list-scroll-content {
		padding: 0 20upx;
		width: 100%;
		.fb-item {
			margin-top: 20upx;
			background: #fff;
			padding: 0 20upx;
			border-radius:8upx;
			.top-info {
				height: 60upx;
				display:flex;
				width: 100%;
				padding: 0 10upx;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #eee;
				text {
					color: #666;
				}
			}
			.detail-box {
				display:flex;
				align-items: center;
				padding: 20upx 0;
				.img-box {
					width: 300upx;
					height: 200upx;
					display:flex;
					align-items: center;
					justify-content: center;
					image {
						max-width: 100%;
						max-height: 100%;
					}
				}
				.detail {
					padding-left: 20upx;
					width:calc(100% - 300upx);
					.name {
						font-size: 16px;
						color: #333;
						width: 100%;
						white-space: nowrap;
						overflow:hidden;
						text-overflow: ellipsis;
					}
					.normal {
						font-size: 14px;
						color: #666;
					}
					view {
						margin-bottom: 8upx;
					}
				}
			}
		}
	}
	
	// 從order復製
	
	.action-box {
		display: flex;
		flex-direction: row;
		padding: 30upx 0 ;
		background: #fff;
		margin-top: 16upx;
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
		display:inline-block;
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
		&.view {
			background: #fff9f9;
			color:  #0d8c0d;
			
			&:after {
				border-color: #09c00d;
			}
		}
	}
	
	.no-data {
		display:flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		color: #666;
		height: calc(100vh - 120rpx);
		image {
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 40rpx;
		}
	}
	
</style>