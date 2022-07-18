<template>
	<view>
		<view class="notice-item" v-for="(item, index) in goodsList" :key="index">
			<text class="time">{{ item.createTime |formatCreateTime}}</text>
			<view class="content" @click="navToDetailPage(item)">
				<text class="title">{{ item.noticeTitle }}</text>
				<view class="img-wrapper"><image :src="item.pic" mode="aspectFill" class="pic"></image></view>
				<text class="introduce">{{ item.remark }}</text>
				<view class="bot b-t" @click="navToDetailPage(item)">
					<text>查看詳情</text>
					<text class="more-icon yticon icon-you"></text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
	import { formatDate } from '@/common/date';
import Api from '@/common/api';
export default {
components: {
		mallplusCopyright
	},
	data() {
		return {
			pageNum: 1,

			goodsList: []
		};
	},
	onLoad() {
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
		this.pageNum = this.pageNum + 1;
		this.loadData('refresh');
	},
	//加載更多
	onReachBottom() {
		this.pageNum = this.pageNum + 1;
		this.loadData();
	},
	filters: {
                  formatCreateTime(time) {
                    let date = new Date(time);
                    return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
                  },
                },
	methods: {
		//加載法寶 ，帶下拉刷新和上滑加載
		async loadData(type = 'add', loading) {
			//沒有更多直接返回
			if (type === 'add') {
				if (this.loadingType === 'nomore') {
					return;
				}
				this.loadingType = 'loading';
			} else {
				this.loadingType = 'more';
			}
			let params={};


			let list = await Api.apiCall('get', Api.index.noticeList, params);
			let goodsList = list.records;
			// let goodsList = await this.$api.json('goodsList');
			if (type === 'refresh') {
				this.goodsList = [];
			}

			this.goodsList = this.goodsList.concat(goodsList);

			//判斷是否還有下一頁，有是more  沒有是nomore(測試數據判斷大於20就沒有了)
			this.loadingType = this.goodsList.length > list.total ? 'nomore' : 'more';
			if (type === 'refresh') {
				if (loading == 1) {
					uni.hideLoading();
				} else {
					uni.stopPullDownRefresh();
				}
			}
		},
		//詳情
		navToDetailPage(item) {
			//測試數據沒有寫id，用title代替
			let id = item.noticeId;
			uni.navigateTo({
				url: `../../pagesU/notice/subjectDetail?id=${id}`
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f7f7f7;
	padding-bottom: 30upx;
}

.notice-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.time {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 80upx;
	padding-top: 10upx;
	font-size: 26upx;
	color: #7d7d7d;
}

.content {
	width: 710upx;
	padding: 0 24upx;
	background-color: #fff;
	border-radius: 4upx;
}

.title {
	display: flex;
	align-items: center;
	height: 90upx;
	font-size: 32upx;
	color: #303133;
}

.img-wrapper {
	width: 100%;
	height: 260upx;
	position: relative;
}

.pic {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 6upx;
}

.cover {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	font-size: 36upx;
	color: #fff;
}

.introduce {
	display: inline-block;
	padding: 16upx 0;
	font-size: 28upx;
	color: #606266;
	line-height: 38upx;
}

.bot {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 80upx;
	font-size: 24upx;
	color: #707070;
	position: relative;
}

.more-icon {
	font-size: 32upx;
}
</style>
