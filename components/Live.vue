<template>
	<view class="live-el mx20 mb10">
		<view class="head">
			<text class="head-title">热门直播</text>
			<view class="head-more" @tap="navToTabPage('/pages/index/liveList')">
				<text>更多</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="content-one">
			<view class="content-one__item" v-for="live in detail" :key="live.roomid" @tap="goRoom(live)">
				<image class="item-cover" :src="live.share_img" mode="widthFix"></image>
				<view class="item-status">
					<image class="status-img" :src="liveStatus[live.live_status].img" mode=""></image>
					<text class="status-text">{{ liveStatus[live.live_status].title }}</text>
				</view>
				<view class="item-title">{{ live.name }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ShopLiveCard from '@/components/ShopLiveCard.vue'

	let HAS_LIVE = false
	// #ifdef MP-WEIXIN
	HAS_LIVE = true
	let livePlayer = null;
	if (HAS_LIVE) {
		livePlayer = requirePlugin('live-player-plugin');
	}
	//  #endif

	let timer = null;
	export default {
		components: {
			ShopLiveCard
		},
		data() {
			return {
				liveList: [],
				liveStatus: {
				'101': {
						img: '/static/live/live.png',
						title: '直播中'
					},
					'102': {
						img: '/static/live/prevue.png',
						title: '未开始'
					},
					'103': {
						img: '/static/live/playback.png',
						title: '已结束'
					},
					'104': {
						img: '/static/live/104.png',
						title: '禁播'
					},
					'105': {
						img: '/static/live/105.png',
						title: '暂停中'
					},
					'106': {
						img: '/static/live/106.png',
						title: '异常'
					},
					'107': {
						img: '/static/live/past.png',
						title: '已过期'
					}
				}
			};
		},
		props: {
			detail: Array
		},
		created() {
		},
		mounted() {
			let that = this;
			timer = setInterval(() => {
				that.getLiveStatus();
			}, 60000);
		},
		beforeDestroy() {
			timer = null;
		},
		computed: {},
		methods: {
		navToTabPage(url) {
        				uni.navigateTo({
        					url: url
        				});
        			},
			// 直播列表
			getLiveList() {

			},
			// 轮询liveStatus
			getLiveStatus() {

			},
			goRoom(live) {

				wx.navigateTo({
					url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${live.roomid}`
				});
			}
		}
	};
</script>

<style lang="scss">
	.live-el {
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx 20rpx 25rpx;

		.head {
			display: flex;
			justify-content: space-between;
			align-items: center;

			&-title {
				font-size: 32rpx;
				font-weight: bold;
				font-family: PingFang SC;
				color: rgba(51, 51, 51, 1);
			}

			&-more {
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
		}

		// 单个大图直播
		.content-one {
			.content-one__item {
				position: relative;
				height: 280rpx;
				border-radius: 20rpx;
				margin-top: 25rpx;
				overflow: hidden;

				.item-cover {
					background-color: #eee;
					width: 100%;
					height: 100%;
				}

				.item-status {
					position: absolute;
					top: 20rpx;
					left: 10rpx;
					height: 40rpx;
					background: rgba(0, 0, 0, 0.4);
					border-radius: 20rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					.status-img {
						width: 38rpx;
						height: 38rpx;
					}

					.status-text {
						font-size: 22rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(255, 255, 255, 1);
						padding: 0 10rpx;
					}
				}

				.item-title {
					width: 680rpx;
					position: absolute;
					bottom: 0;
					line-height: 60rpx;
					padding: 0 20rpx;
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(255, 255, 255, 1);
					background: linear-gradient(transparent, rgba(#000, 0.5));
				}

				.like-img {
					position: absolute;
					bottom: 20rpx;
					right: 10rpx;
					width: 60rpx;
					height: 130rpx;
				}
			}
		}

		// 双图直播
		.content-two {
			width: 100%;
			// -moz-column-count: 2;
			// -webkit-column-count: 2;
			// column-count: 2;
			// padding-top: 20rpx;
			display: flex;
			flex-wrap: wrap;

			&__item {
				margin-right: 30rpx;
				margin-top: 20rpx;

				&:nth-child(2n) {
					margin-right: 0;
				}
			}
		}
	}
</style>
