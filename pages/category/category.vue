<template>
	<view class="rf-category">
		<view class="rf-search-bar" v-if="loaded">
			<!-- 狀態欄 -->
			<view v-if="headerShow" class="status" :style="{
				position: headerPosition,
				top: statusTop,
				opacity: afterHeaderOpacity
			}"></view>
			<!-- 頂部搜索欄 -->
			<view v-if="headerShow" class="header" :style="{
				position: headerPosition,
				top: headerTop,
				opacity: afterHeaderOpacity
			}">
				<!-- 跳轉分類模塊 -->
				<view class="addr">
					<text class="iconfont iconsaomiao" v-if="isOpenScan" @tap.stop="link"></text>
					<image class="logo" :src="appLogo" v-else></image>
				</view>
				<!-- 搜索框 -->
				<view class="input-box" @tap.stop="discard" v-if="true">
					<input @confirm="toSearch" :value="placeholder" @input="handleSearchValueChange"
						:placeholder="placeholder ? '' : '請輸入法寶名稱或編號'" style="color:#888;"
						placeholder-style="color:#ccc;" />
					<view class="iconfont iconsousuo2" @tap.stop="toSearch"></view>
				</view>
				<view class="input-box" v-else>
					<input @tap="toSearch" disabled :value="placeholder" placeholder-style="color:#ccc;" />
					<view class="icon iconfont iconsousuo2"></view>
				</view>
			</view>
			<!-- 占位 -->
			<view v-if="headerShow" class="place"></view>
		</view>
		<view class="category-list" @touchmove.stop.prevent="moveHandle"
			v-if="(styleCateType === 'one_two_three_cover' || styleCateType === 'one_two_three_text') && categoryList.length > 0">
			<!-- 左側分類導航 -->
			<scroll-view scroll-x="true" class="left">
				<view class="row" v-for="(fItem, fIndex) in categoryList" :key="fItem.id"
					:class="[fIndex === showCategoryIndex ? 'on' : '']" @tap="showCategory(fItem,fIndex)">
					<view class="text">
						<view class="block"></view>
						{{ fItem.name }}
					</view>
				</view>
			</scroll-view>
			<!--右側子導航-->
			<view  class="right">
				<view v-for="(fItem, fIndex) in categoryList" :key="fItem.id">
					<view v-if="fIndex === showCategoryIndex" class="category">
						<scroll-view class="rf-drawer-content rf-flex-attr" scroll-y="true">
							<view class="rf-attr-item"
								:class="[categoryInvertedIndex == index ? `bg-rf rf-btmItem-active` : 'rf-btmItem-normal']"
								v-for="(item1, index) in  fItem.children" :key="item1.id"
								@tap.stop="handleCategoryInvertedChange(item1,index)">
								<view class="rf-attr-ellipsis">{{ item1.name }}</view>
							</view>
						</scroll-view>
						<scroll-view  class="list-box" scroll-y="true">
							<!-- <view class="banner">
								<image :src="fItem.icon || errorImage" mode="scaleToFill" />
							</view> -->
							<view v-if="loaded">
								<view class="list" v-if="categoryProductList && categoryProductList.length > 0">
									<view class="box" v-for="tItem in categoryProductList" :key="tItem.id"
										@tap.stop="navTo(`../../pagesA/product/product?id=${tItem.id}`)">
										<block v-if="styleCateType === 'one_two_three_cover'">
											<view class="img-box">
												<image :src="tItem.pic || errorImage" mode="aspectFit"></image>
											</view>
											<view class="text">{{ tItem.name }}</view>
										</block>
										<text class="category-tag in1line" v-if="styleCateType === 'one_two_three_text'">
											{{ tItem.name }}
										</text>
									</view>
								</view>
								<view v-else class="no-data">
									<i class="iconfont icon404"></i>
									暫無法寶
								</view>
							</view>
							<uni-load-more v-if="!loaded" :status="loading"></uni-load-more>
						</scroll-view >
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	/**
	 * @des 分類
	 *
	 * @author stav stavyan@qq.com
	 * @date 2020-03-10 18:19
	 * @copyright 2019
	 */
	import Api from '@/common/api';
	import {
		mapMutations,
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				loaded: false,
				hotSearchDefault: '請輸入法寶名稱或編號', // 搜索默認關鍵字
				showCategoryIndex: 0, // 一級菜單高亮顯示序號
				categoryList: [], // 分類列表
				specClass: 'none', // 規格彈窗
				productDetail: {}, // 法寶詳情
				search: {},
				cateTop: {}, // 分類通用廣告圖
				loading: true,
				styleCateType: 'one_two_three_cover',
				errorImage: '/static/errorImage.jpg',
				afterHeaderOpacity: 1, // 不透明度
				headerPosition: 'fixed',
				headerTop: null,
				statusTop: null,
				nVueTitle: null,
				searchValue: this.placeholder,
				placeholder: null,
				isOpenScan: true,
				headerShow: false,
				currentCateId: '',
				categoryProductList: [],
				price: '',
				total_sales: '',
				loadingType: 'more',
				loading: 'loading',
				pageNum: 0,
				moneySymbol: this.moneySymbol,
				productLoading: true,
				currentSecondCategoryList: [],
				categoryInvertedIndex: 0,
				pagetoken: 0,
				isChina: 1,
			};
		},
		computed: {
			bottom() {
				let bottom = 0;
				/*  #ifdef H5  */
				bottom = 90;
				/*  #endif */
				return bottom;
			},
			...mapGetters({getIsChina: 'getIsChina'})
		},
		filters: {
			filterTotalSales(val) {
				if (val > 10000) {
					val = `${(val / 10000).toFixed(2)}w`;
				}
				return val;
			}
		},
		onShow() {
			let token = uni.getStorageSync('token');
			if(this.isChina!=this.getIsChina||token!=this.pagetoken){
				console.log('重新加載頁面');
				this.isChina = this.getIsChina||0;
				this.pagetoken = uni.getStorageSync('token');
			}
			this.initData();
		},
		// 每次頁面顯示 執行該方法
		onLoad() {
			this.pagetoken = uni.getStorageSync('token');
			this.isChina = this.getIsChina || 0;
			//this.initData();
		},
		methods: {
			moveHandle() {},
			...mapMutations(['setCartNum']),
			// 監聽二級分類變化
			handleCategoryInvertedChange(item, index) {
				// uni.showLoading({title: '加载中',mask:true});
				this.categoryInvertedIndex = index;
				this.currentCateId = item.id;
				this.price = '';
				this.total_sales = '';
				this.pageNum = 0;
				this.categoryProductList = [];
				this.loaded = false;
				this.getProductList();
			},
			// 監聽一級分類變化
			showCategory(item, index) {
				// uni.showLoading({title: '加载中',mask:true});
				this.loaded = false;
				this.showCategoryIndex = index;
				console.log(item.children)
				if (item.children && item.children[0]) {
					this.currentCateId = item.children && item.children[0].id;
					this.price = '';
					this.total_sales = '';
					this.pageNum = 0;
					this.categoryProductList = [];
					this.getProductList();
				} else {
					this.price = '';
					this.total_sales = '';
					this.pageNum = 0;
					this.categoryProductList = [];

				}


			},
			stopPrevent() {},

			// 添加法寶至購物車
			async handleCartItemCreate(skuId, cartCount) {
				await this.$http
					.post(`${cartItemCreate}`, {
						skuId: skuId,
						num: cartCount
					})
					.then(async () => {
						await this.$http.get(`${cartItemCount}`).then(async r => {
							this.setCartNum(r);
						});
						this.$mHelper.toast('添加成功，在禮請單');
					});
			},
			hideSpec() {
				this.specClass = 'hide';
				setTimeout(() => {
					this.specClass = 'none';
				}, 250);
			},
			// 獲取產品詳情
			async getProductDetail(row) {
				await this.$http
					.get(`${productDetail}`, {
						id: row.id
					})
					.then(async r => {
						this.productDetail = r;
						this.specClass = 'show';
					});
			},
			// 跳轉至法寶列表
			navTo(route) {
				uni.navigateTo({
					url: route
				});
			},
			// 跳至廣告圖指定頁面
			indexTopToDetailPage(item) {
				console.log(item)
				this.navTo(item)

			},
			// 數據初始化
			async initData() {
				// uni.showLoading({title: '加载中',mask:true});
				this.search = uni.getStorageSync('search') || {};
				this.hotSearchDefault = this.search.hot_search_default || '請輸入法寶名稱或編號';
				this.categoryList = [];
				this.categoryProductList = [];
				await this.getProductCate();

			},

			// 獲取法寶分類列表
			async getProductCate() {
				let list = this.$db.get('categoryList')
				if (!list) {
					let params = {};
					list = await Api.apiCall('get', Api.goods.typeGoodsList, params);
					uni.setStorageSync('categoryList', list)
				}
				let indexs = 0
				if (list) {
					this.categoryList = list;
					let cateId = uni.getStorageSync('indexToCateId');
					if (cateId) {
						this.categoryList.forEach((item, index) => {
							if (cateId === item.id) {
								this.showCategoryIndex = index;
								indexs = index
								// this.currentCateId = item.children[0].id
							}
						});
					} else {
						if (this.styleCateType === 'one_two_product' && list[0].children.length > 0) {
							this.currentCateId = this.categoryList && this.categoryList[0].children[0].id;
						} else {
							this.showCategoryIndex = 0;

							this.currentCateId = this.categoryList && this.categoryList[0].children[0].id;
						}
					}

					if (list.length > 0) {
						this.currentSecondCategoryList = list[indexs].children;
						this.currentCateId = this.currentSecondCategoryList[0].id
						this.getProductList();
					}
				}


			},


			showProduct(item, index) {
				this.categoryInvertedIndex = 0;
				this.currentSecondCategoryList = item.children;
				this.showCategoryIndex = index;
				if (this.styleCateType === 'one_two_product' && item.children.length > 0) {
					this.currentCateId = item.children[0].id;
				} else {
					this.currentCateId = item.children[0].id;
				}
				this.price = '';
				this.total_sales = '';
				this.pageNum = 0;
				this.categoryProductList = [];
				this.getProductList();
			},
			handleSalesOrderByChange() {
				if (this.categoryProductList.length === 0) return;
				this.price = '';
				this.total_sales = this.total_sales === 'asc' ? '1' : '1';
				this.pageNum = 0;
				this.categoryProductList = [];
				this.getProductList();
			},
			handlePriceOrderByChange() {
				if (this.categoryProductList.length === 0) return;
				this.total_sales = '';
				this.price = this.price === 'asc' ? '2' : '3';
				this.pageNum = 0;
				this.categoryProductList = [];
				this.getProductList();
			},
			// 獲取產品列表
			async getProductList() {
				this.productLoading = true;
				const params = {};
				if (this.total_sales) {
					params.orderBys = this.total_sales;
				}
				if (this.price) {
					params.orderBys = this.price;
				}
				params.pageNum = this.pageNum;
				let list = await Api.apiCall('get', Api.goods.goodsList, {
					productCategoryId: this.currentCateId,
					...params
				});
				let goodsList = list.records;
				this.productLoading = false;
				this.loadingType = goodsList.length === 10 ? 'more' : 'nomore';
				this.categoryProductList = [...this.categoryProductList, ...goodsList];
				uni.removeStorageSync('indexToCateId');
				let _this = this;
				setTimeout(()=>{
					_this.loaded = true;
					uni.hideLoading();
				}, 300)
			},
			// 跳轉至搜索詳情頁
			toSearch() {
				uni.navigateTo({
					url: `/pages/index/search/search?data=${JSON.stringify(this.search)}`
				});

			},

			getMoreProductList() {
				if (this.loadingType === 'nomore' || this.categoryProductList.length === 0) return;
				this.pageNum++
				this.getProductList();
			}
		}
	};
</script>
<style scoped lang="scss">
	page {
		background-color: $color-white;
	}

	.rf-category {

		/*模塊分類*/
		.category-list {
			width: 100%;
			background-color: #fff;
			display: flex;
			flex-direction: column;
			.left,.right {
				// position: absolute;
				// top: 100upx;
				// /*  #ifdef  APP-PLUS  */
				// top: calc(100upx + var(--status-bar-height));
				// /*  #endif  */
				// bottom: 0upx;
			}

			.left {
				width: 100%;
				left: 0upx;
				background-color: $page-color-base;
				white-space: nowrap;
				margin-bottom: 20upx;
				.row {
					width: 25%;
					height: 80rpx;
					display: inline-block;
					line-height: 80rpx;
					.text {
						width: 100%;
						position: relative;
						font-size: 28upx;
						display: flex;
						justify-content: center;
						color: #3c3c3c;

						.block {
							position: absolute;
							width: 0upx;
							left: 0;
						}
					}

					&.on {
						height: 80upx;
						background-color: #f7e5c7ea;
						.text {
							font-size: 30upx;
							font-weight: 600;
							color: #2d2d2d;

							.block {
								width: 6upx;
								height: 120%;
								left: 10upx;
							}
						}
					}
				}
			}

			.right {
				width: 100%;
				background-color: #fff;
				.second-category {
					z-index: 10;
					white-space: nowrap;
					width: 100%;
					margin: $spacing-sm $spacing-sm $spacing-base;

					.second-category-tag {
						margin-right: $spacing-base;
						padding: 5upx $spacing-lg;
						display: inline-block;
						border-radius: 8upx;
						font-size: $font-sm + 2upx;
					}

					.second-category-normal {
						color: $font-color-dark;
						border: none;
						background-color: $page-color-light;
					}
				}

				.category {
					width: 100%;
					padding: 0 15upx $spacing-base;
					display:flex;
					flex-direction: row;
					.banner {
						width: 96%;
						margin: 10upx auto 30upx;
						height: 24.262vw;
						border-radius: 10upx;
						overflow: hidden;
						box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.05);

						image {
							width: 100%;
							height: 24.262vw;
						}
					}

					.order-by-wrapper {
						height: 48upx;
						line-height: 48upx;
						display: flex;
						justify-content: space-between;
						margin: $spacing-sm 0;
						font-size: $font-sm + 2upx;

						.order-by {
							display: flex;
							justify-content: center;
							align-items: center;

							.order-by-item {
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: $font-sm + 2upx;
								margin: 0 $spacing-base 0 $spacing-sm;
								color: $font-color-light;

								.iconfont-group {
									margin-top: -2upx;
								}

								.iconfont {
									height: 16upx;
									line-height: 16upx;
									display: block;
									margin-left: 6upx;
									font-weight: 550;
									font-size: $font-sm - 4upx;
								}
							}
						}
					}

					.list {
						margin-top: $spacing-base;
						width: 100%;
						display: flex;
						flex-wrap: wrap;

						.box {
							width: calc(71.44vw / 3);
							margin-bottom: $spacing-lg;
							display: flex;
							justify-content: center;
							align-items: center;
							flex-wrap: wrap;
							.text {
								margin-top: 8upx;
								width: 100%;
								display: flex;
								justify-content: center;
								font-size: 26upx;
							}

							.category-tag {
								width: 100%;
								display: flex;
								justify-content: center;
								align-items: center;
								padding: $spacing-sm;
								font-size: $font-sm + 2upx;
								margin-right: $spacing-base;
								color: $font-color-dark;
								background-color: $page-color-base;
								border-radius: 6upx;
							}
						}
					}

					.second-category-text {
						display: flex;
						justify-content: space-between;
					}

					.no-data {
						margin: 48upx 0;
						color: $font-color-light;
						display: flex;
						justify-content: center;
						align-items: center;

						.iconfont {
							margin-right: 20upx;
							font-size: $font-lg + 16upx;
						}
					}
				}
			}
		}

		.one-cover-category {
			margin-top: $spacing-base;
			width: 100%;
			display: flex;
			flex-wrap: wrap;

			.box {
				width: calc(71.44vw / 3);
				margin-bottom: $spacing-lg;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-wrap: wrap;

				.text {
					margin-top: 8upx;
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 26upx;
				}

				.category-tag {
					width: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					padding: $spacing-sm;
					font-size: $font-sm + 2upx;
					margin-right: $spacing-base;
					color: $font-color-dark;
					background-color: $page-color-base;
					border-radius: 6upx;
				}
			}
		}

		.tui-product-container {
			flex: 1;
			margin-right: 10upx;
		}

		.tui-product-container:last-child {
			margin-right: 0;
		}

		.category-product-list {
			margin-bottom: 15upx;
			padding-bottom: 15upx;
			border-bottom: 1upx solid rgba(0, 0, 0, 0.08);
		}

		.category-product-list:last-child {
			border-bottom: none;
			background-color: #007aff;
		}

		.tui-pro-item {
			width: 100%;
			margin-bottom: 20upx;
			background: $color-white;
			box-sizing: border-box;
			border-radius: 12upx;
			overflow: hidden;
			transition: all 0.15s ease-in-out;
		}

		.tui-flex-list {
			display: flex;
			margin-bottom: 1upx !important;
		}

		.tui-pro-img {
			width: 100%;
			display: block;
		}

		.tui-proimg-list {
			width: 160upx;
			height: 160upx !important;
			flex-shrink: 0;
			border-radius: 12upx;
		}

		.tui-pro-content {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0 20upx;
		}

		.tui-pro-tit {
			color: #2e2e2e;
			font-size: 26upx;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}

		.tui-sale-price {
			font-size: 34upx;
			font-weight: 500;
		}

		.tui-factory-price {
			font-size: 24upx;
			color: #a0a0a0;
			text-decoration: line-through;
			padding-left: 12upx;
		}

		.tui-pro-pay {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 24upx;
			color: #656565;

			.iconfont {
				font-size: $font-lg + 6upx;
				padding: 0 $spacing-sm;
			}
		}

		.popup .layer {
			// #ifndef H5
			bottom: 0;
			// #endif
		}
	}

	.rf-drawer-content {
		padding: 8rpx 10rpx 20rpx 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		width: 25%;
		font-size: 28rpx;
		text-align: center;
		height: calc(100vh - 300rpx);
		.rf-attr-item {
			height: 80rpx;
			line-height: 80rpx;
			.rf-attr-ellipsis {
				width: 100%;
				// overflow:hidden;
				// white-space: nowrap;
				text-overflow: ellipsis;
				line-height: 1.5em;
				display: -webkit-box !important;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
			&.rf-btmItem-active {
				color:#007AFF;
			}
		}
	}
	.list-box {
		width: 75%;
		height: calc(100vh - 300rpx);
		.list {
			.text {
				width: 250rpx !important;
				height: 72rpx;
				overflow: hidden;
				display: -webkit-box !important;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;     //用一個省略號代替超出的內容
			}
			.box {
				width:50% !important;
				padding: 10rpx;
				.img-box {
					display:flex;
					width: 100%;
					height: 150rpx;
					justify-content: center;
					align-items: center;
				}
				uni-image {
					height: 100%;
					max-width:100%;
					max-height: 100%;
					img {
						width: auto;
					}
				}
			}
		}
	}
	.rf-search-bar {
		background-color: #fff;

		.status {
			width: 100%;
			height: 0;
			position: fixed;
			z-index: 10;
			background-color: #fff;
			top: 0;
			/*  #ifdef  APP-PLUS  */
			height: var(--status-bar-height); //覆蓋樣式
			/*  #endif  */
		}

		.header {
			width: 100%;
			height: 100upx;
			display: flex;
			align-items: center;
			position: fixed;
			top: 0;
			z-index: 10;
			background-color: #fff;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);

			/*  #endif  */
			.addr {
				height: 60upx;
				flex-shrink: 0;
				display: flex;
				align-items: center;

				.iconfont {
					margin-left: $spacing-lg;
					margin-right: $spacing-sm;
					font-weight: 500;
					display: flex;
					align-items: center;
					font-size: 48upx;
				}

				.logo {
					width: 45upx;
					height: 45upx;
					border-radius: 8upx;
					margin-left: 10upx;
				}
			}

			.input-box {
				width: 100%;
				height: 60upx;
				background-color: #f5f5f5;
				border-radius: 30upx;
				position: relative;
				display: flex;
				align-items: center;
				margin: 0 20upx 0 10upx;

				.iconsousuo2 {
					z-index: 999;
					display: flex;
					align-items: center;
					position: absolute;
					top: 0;
					right: 0;
					width: 60upx;
					height: 60upx;
					font-size: 34upx;
					color: #c0c0c0;
				}

				input {
					width: 100%;
					padding-left: 28upx;
					height: 28upx;
					color: #888;
					font-size: 28upx;
				}
			}
		}

		.place {
			background-color: #ffffff;
			height: 100upx;
			/*  #ifdef  APP-PLUS  */
			margin-top: var(--status-bar-height);
			/*  #endif  */
		}
	}
</style>
