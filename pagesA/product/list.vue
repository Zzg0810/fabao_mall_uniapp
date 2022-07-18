<template>
	<view class="content">
		<view class="navbar" :style="{ position: headerPosition, top: headerTop }">
			<view class="nav-title">搜索"{{keyword}}"的法宝如下：</view>
			<!--<view class="nav-item" :class="{ current: filterIndex === 0 }" @click="tabClick(0)">综合排序</view>
			 <view class="nav-item" :class="{ current: filterIndex === 1 }" @click="tabClick(1)">礼请数量</view> -->
		</view>
		<!-- 表格图片显示 -->
		<view class="goods-list" v-show="current === 0">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper"><image :src="item.pic" mode="aspectFit"></image></view>
				<text class="title clamp">{{ item.name }}</text>
				<view class="price-box">
					<text> {{ item.productSn }}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		<mallWeblink></mallWeblink>
	</view>
</template>

<script>
import mallWeblink from '@/components/mall-weblink/mallWeblink.vue';
import Api from '@/common/api';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
	components: {
		mallWeblink,
		uniLoadMore
	},
	data() {
		return {
			cateMaskState: 0, //分类面板展开状态
			headerPosition: 'fixed',
			headerTop: '0px',
			keyword: '',
			loadingType: 'more', //加载更多状态
			filterIndex: 0,
			cateId: 0, //已选三级分类id
			productAttributeCategoryId: 0,
			pageNum: 1,
			isFenxiao: 0,
			isVip: 0,
			cid: null,
			priceOrder: 0, //1 价格从低到高 2价格从高到低
			cateList: [],
			goodsList: [],

			current: 0 // 1为列表模式
		};
	},

	onLoad(options) {
		console.log(options);
		// #ifdef H5
		// this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
		// #endif
		this.keyword = options.keyword;
		this.cateId = options.sid==undefined?'':options.sid;
		this.isVip = options.isVip==undefined?'':options.isVip;
		this.isFenxiao = options.isFenxiao==undefined?'':options.isFenxiao;
		console.log(options);
		this.productAttributeCategoryId = options.productAttributeCategoryId==undefined?'':options.productAttributeCategoryId;
		this.loadCateList(options.fid, options.sid);
		this.loadData();
	},
	mounted() {
		this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
	},
	onPageScroll(e) {
		//兼容iOS端下拉时顶部漂移
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
	//加载更多
	onReachBottom() {
		this.pageNum = this.pageNum + 1;
		this.loadData();
	},
	methods: {
		toShowMode(mode) {
			if (this.current == 0) {
				this.current = 1;
			} else {
				this.current = 0;
			}
		},
		//加载分类
		async loadCateList(fid, sid) {
			let params = {};
			let list = await Api.apiCall('get', Api.goods.typeList, params);
			let cateList = list.filter(item => item.pid == null);

			cateList.forEach(item => {
				let tempList = list.filter(val => val.pid == item.id);
				item.child = tempList;
			});
			this.cateList = cateList;
		},
		//加载法宝 ，带下拉刷新和上滑加载
		async loadData(type = 'add', loading) {
			//没有更多直接返回
			if (type === 'add') {
				if (this.loadingType === 'nomore') {
					return;
				}
				this.loadingType = 'loading';
			} else {
				this.loadingType = 'more';
			}
			let params = { pageNum: this.pageNum, productCategoryId: this.cateId, type: 1, productAttributeCategoryId: this.productAttributeCategoryId };;
			if (this.cateId) {
			  params.productCategoryId = this.cateId;

			}
			if (this.productAttributeCategoryId) {
            		        params.productAttributeCategoryId = this.productAttributeCategoryId;
            			}
			if (this.keyword) {
		        params.keyword = this.keyword.tran('n');
			}
			if (this.isVip) {
				params.isVip = 1;
			}
			if (this.isFenxiao) {
				params.isFenxiao = 1;
			}
			let list = await Api.apiCall('get', Api.goods.goodsList, params);
			let goodsList = list.records;
			// let goodsList = await this.$api.json('goodsList');
			if (type === 'refresh') {
				this.goodsList = [];
			}
			//筛选，测试数据直接前端筛选了
			if (this.filterIndex === 1) {
				goodsList.sort((a, b) => b.sales - a.sales);
			}
			if (this.filterIndex === 2) {
				goodsList.sort((a, b) => {
					if (this.priceOrder == 1) {
						return a.price - b.price;
					}
					return b.price - a.price;
				});
			}

			this.goodsList = this.goodsList.concat(goodsList);

			//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
			this.loadingType = this.goodsList.length > list.total ? 'nomore' : 'more';
			if (list.records.length == 0) {
				this.loadingType = 'nomore';
			}
			if (type === 'refresh') {
				if (loading == 1) {
					uni.hideLoading();
				} else {
					uni.stopPullDownRefresh();
				}
			}
		},
		//筛选点击
		tabClick(index) {
			this.pageNum = 1;
			if (this.filterIndex === index && index !== 2) {
				return;
			}
			this.filterIndex = index;
			if (index === 2) {
				this.priceOrder = this.priceOrder === 1 ? 2 : 1;
			} else {
				this.priceOrder = 0;
			}
			uni.pageScrollTo({
				duration: 300,
				scrollTop: 0
			});
			this.loadData('refresh', 1);
		},
		//显示分类面板
		toggleCateMask(type) {
			let timer = type === 'show' ? 10 : 300;
			let state = type === 'show' ? 1 : 0;
			this.cateMaskState = 2;
			setTimeout(() => {
				this.cateMaskState = state;
			}, timer);
		},
		//分类点击
		changeCate(item) {
			this.pageNum = 1;
			this.cateId = item.id;
			this.toggleCateMask();
			uni.pageScrollTo({
				duration: 300,
				scrollTop: 0
			});
			this.loadData('refresh', 1);
		},
		//详情
		navToDetailPage(item) {
			//测试数据没有写id，用title代替
			let id = item.id;
			uni.navigateTo({
				url: `../../pagesA/product/product?id=${id}`
			});
		},
		stopPrevent() {}
	}
};
</script>

<style lang="scss">
@font-face {
	font-family: 'cgicon';
	font-weight: normal;
	font-style: normal;
	src: url('https://at.alicdn.com/t/font_1475801_65jj7c5ss9k.ttf') format('truetype');
}

.cgicon {
	font-family: 'cgicon' !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.icon-vertical:before {
	content: '\e61b';
}

page,
.content {
	background: $page-color-base;
}
.content {
	padding-top: 96upx;
}

.navbar {
	position: fixed;
	left: 0;
	top: var(--window-top);
	display: flex;
	width: 100%;
	height: 80upx;
	background: #fff;
	box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.06);
	z-index: 10;
	.nav-title{
		height: 100%;
		font-size: 30upx;
		color: $font-color-dark;
		position: relative;
		left:40upx;
	}
	.nav-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 30upx;
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
				width: 120upx;
				height: 0;
				border-bottom: 4upx solid $base-color;
			}
		}
	}
	.p-box {
		display: flex;
		flex-direction: column;
		.yticon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 30upx;
			height: 14upx;
			line-height: 1;
			margin-left: 4upx;
			font-size: 26upx;
			color: #888;
			&.active {
				color: $base-color;
			}
		}
		.xia {
			transform: scaleY(-1);
		}
	}
	.cate-item {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 80upx;
		position: relative;
		font-size: 44upx;
		&:after {
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			border-left: 1px solid #ddd;
			width: 0;
			height: 36upx;
		}
	}
}

/* 分类 */
.cate-mask {
	position: fixed;
	left: 0;
	top: var(--window-top);
	bottom: 0;
	width: 100%;
	background: rgba(0, 0, 0, 0);
	z-index: 95;
	transition: 0.3s;

	.cate-content {
		width: 630upx;
		height: 100%;
		background: #fff;
		float: right;
		transform: translateX(100%);
		transition: 0.3s;
	}
	&.none {
		display: none;
	}
	&.show {
		background: rgba(0, 0, 0, 0.4);

		.cate-content {
			transform: translateX(0);
		}
	}
}
.cate-list {
	display: flex;
	flex-direction: column;
	height: 100%;
	.cate-item {
		display: flex;
		align-items: center;
		height: 90upx;
		padding-left: 30upx;
		font-size: 28upx;
		color: #555;
		position: relative;
	}
	.two {
		height: 64upx;
		color: #303133;
		font-size: 30upx;
		background: #f8f8f8;
	}
	.active {
		color: $base-color;
	}
}

/* 法宝列表 */
.goods-list {
	display: flex;
	flex-wrap: wrap;
	padding: 20upx 20upx 0;
	background: #fff;
	.goods-item {
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
		border-radius: 3px;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
			opacity: 1;
		}
	}
	.title {
		font-size: $font-lg;
		color: $font-color-dark;
		line-height: 80upx;
	}
	.price-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 10upx;
		font-size: 24upx;
		color: $font-color-light;
	}
	.price {
		font-size: $font-lg;
		color: $uni-color-primary;
		line-height: 1;
		&:before {
			content: 'No.';
			font-size: 26upx;
		}
	}
}
.goods-list-vertical {
	display: flex;
	flex-wrap: wrap;
	padding: 0upx 20upx;
	background: #fff;
	.goods-item-vertical {
		display: flex;
		flex-direction: row;
		height: 280upx;
		align-items: center;
		justify-content: center;
		border-bottom: 1upx solid #eeeeee;
		.image-wrapper-vertical {
			width: 100%;
			height: 330upx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 10upx;
			image {
				width: 240upx;
				height: 240upx;
			}
		}
		.goods-list-right {
			width: 470upx;
			.goods-right-top {
				height: 200upx;
				text {
					font-size: 32upx;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
			.goods-right-bottom {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					line-height: 1;
					&:before {
						content: 'No.';
						font-size: 26upx;
					}
				}
				.sale {
					color: $font-color-light;
					font-size: 28upx;
				}
			}
		}
	}
}
</style>
