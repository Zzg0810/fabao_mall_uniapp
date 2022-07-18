<template>
	<view class="content">
		
		<!-- 頂部選項卡 -->
		<scroll-view id="nav-bar" class="nav-bar" scroll-x scroll-with-animation :scroll-left="scrollLeft">
			<view 
				v-for="(item,index) in tabBars" :key="item.id"
				class="nav-item"
				:class="{current: index === tabCurrentIndex}"
				:id="'tab'+index"
				@click="changeTab(index)"
			>{{item.name}}</view>
		</scroll-view>
		
		<!-- 下拉刷新組件 -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
			<!-- 內容部分 -->
			<swiper 
				id="swiper"
				class="swiper-box" 
				:duration="300" 
				:current="tabCurrentIndex" 
				@change="changeTab"
			>
				<swiper-item v-for="tabItem in tabBars" :key="tabItem.id">
					<scroll-view 
						class="panel-scroll-box" 
						:scroll-y="enableScroll" 
						@scrolltolower="loadMore"
						>

						<view @click="navToDetails(item)" v-for="(item, index) in tabItem.newsList" :key="index" class="news-item" >
							<text :class="['title', 'title'+item.type]">{{item.title}}</text>
							<view :class="['img-list', 'img-list'+item.type, item.type!='1' ? 'img-list-single': '']">
								<view 
									:class="['img-wrapper', 'img-wrapper'+item.articleType, item.articleType!='1' ? 'img-wrapper-single': '']"
								>
									<image class="img" :src="item.pic"></image>
									<view class="video-tip" v-if="item.videoSrc">
										<image class="video-tip-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAEC0lEQVRoQ+2ajVEVMRDHdzuwA6ACpQKxArECtQKxAqECoQKhAqECoQKxAqEDrWCdn7Nx8vJy+bp3T4YhM2+O8S7J/rO7//2IKo9k6CPBIU9Acpo0s10ReSkiPA8mtH0tIncicqOqPDcyZmvEhX8rIu8cQI9gtyJyKSIXc0ENA3EAnxxAj/BT356LyEdV/TWyWDcQM3smIgA4mtjwXkQ4aX4Mngj3QkSYy5PfTmb+laoeLg7EzBDga8aEEB4TOVfVAKAoj2sUc+QXQC0PxMzY8Esi3W8ROVbV05FTDHPMDC1AEBzEcqY1AeLMQQxtXANuZvjMa/cb/i6Oqo9kQKCFI1WtLl7bfOq9mUHd3/w9ND1F5f+WKAJxn/gebQiIg1Y/mAEEUsDX8J0zVZ0iljoQZydAYLuMrYCIwXOQrYc2qREzw4E/RAu/X9KcRrUX5mWBODX+jBY/UdXjuZuNznd5PnscepNjtikgODJpRzCp3VFaHBU+MTEOkSDMIJ0hFKyMNSAZbZA2NMUJn7ujqjebABDWyDDnXpqb5YDEvnGvqsHZi7I5CMgBxiHDxRx5bmSYGZlyyADWmCwHBN8IwjdRH5Im3B+En5UIJuYFBeMnjFtV3Y/frwDJmNV+K/1NAGEvIv+pqp7MUU1GthXzSoHE+VSzWRU0EsuOaUDhw+aWmNdKOEiBxOzQlYkWNJIqAiAI0V0dmhkZNvkXYyUkpEDYhFJ17cOaWXQACUtxaPhgc9JpZvFBr+Rg/xNI8B+0w0lXR0LDzUCIoE0bNPpISdC1uJD7uJQVlzTyEIFQgFGhMpo10pVfDfgIwlAiU9s0af4h+gglARkE8WURZ98G/V65Fhal3zgg3qnqXpVK/IMG0/rhAOYExDh9KgZEcqy4DtlEirKpTgutqLjsnk5RnEaLWeaUhiY0srFOS1KxrqVPtTS+2by8xsdsnkONNN5G0pDCQcVmtcaoLYVVV63e0zDo8L+0OVgvrNy84lIXemRiM022CtjynWsabVCwMdpKXQeSOlZXcGwRsPWbJAgyLZvOPOh2UKZWn6xYS0Dibl/IVF+1VoytJ15wbqyCtmkwKdIZGnZZE+9tmbLI4mC8VRuDAG8xpo00sQFDi2iRJrabU2jGBYVVmbMKxJ0/dzfSXeGVzM3ZiRZt2tGsgmDdJiAFMGiHNPxijk+YGV1NsuHgD82aCB82A4lomdohvf8jrQm3s61XbzgzAMJtVXwWOPZhD7F0AXEwnBrqjzv1sRCACnfp/HvIdsNlTbiDn+pgDuVn3UCCxN4wA1Bods+xrr8R26/yuuuULh8p8D0nSzsTE8ldOZcAhttgKsUhAEM+Ujty1xIm1PJfOK7nCh/LM2xaNVDbfv8EZNsnXtvvDyrmF1FIBKIwAAAAAElFTkSuQmCC"></image>
									</view>
								</view>
							</view>
							<!-- 空圖片占位 -->
							<view v-if="!item.pic" class="img-empty"></view>
							<view :class="['bot', 'bot'+item.categoryName]">
								<text class="author">{{item.memberName}}</text>
								<text class="time">{{item.createTime |formatCreateTime}}</text>
							</view>
						</view>
						
						<!-- 上滑加載更多組件 -->
						<mix-load-more :status="tabItem.loadMoreStatus"></mix-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		</mix-pulldown-refresh>
		
	</view>
</template>

<script>
	import json from '@/Json'
	import { formatDate } from '@/common/date';
	import Api from '@/common/api';
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	let windowWidth = 0, scrollTimer = false, tabBar;
	export default {
		components: {
			mixPulldownRefresh,
			mixLoadMore
		},
		data() {
			return {
				tabCurrentIndex: 0, //當前選項卡索引
				scrollLeft: 0, //頂部選項卡左滑距離
				enableScroll: true,
				tabBars: [],
				pageSize: 10
			}
		},
		computed: {
			...mapState([ 'userInfo', 'footPrint', 'applicationConfig']),
			advertNavUrl(){
				let data = {
					title: '測試跳轉新聞詳情',
					author: '測試作者',
					time: '2019-04-26 21:21'
				}
				return `/pages/details/details?data=${JSON.stringify(data)}`;
			} 
		},
		async onLoad() {
			// 獲取屏幕寬度
			windowWidth = uni.getSystemInfoSync().windowWidth;
			this.loadTabbars();
		},
		onReady(){
			/**
			 * 啟動頁廣告 使用文檔（滑稽）
			 * 1. 引入組件並註冊 
			 * 		import mixAdvert from '@/components/mix-advert/vue/mix-advert';
			 *      components: {mixAdvert},
					 <!-- #ifndef MP -->
						<mix-advert 
							ref="mixAdvert" 
							:timedown="8" 
							imageUrl="/static/advert.jpg"
							:url="advertNavUrl"
						></mix-advert>
					<!-- #endif -->
			 * 	2. 調用組件的initAdvert()方法進行初始化
			 * 
			 *  初始化的時機應該是在splash關閉時，否則會造成在app端廣告顯示了數秒後首屏才渲染出來
			 */
			// #ifndef MP
			// this.$refs.mixAdvert.initAdvert();
			// #endif
		},
		filters: {
                            		  formatCreateTime(time) {
                                             let date = new Date(time);
                                             return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
                                           },
                                           },
		methods: {
			/**
			 * 數據處理方法在vue和nvue中通用，可以直接用mixin混合
			 * 這裏直接寫的
			 * mixin使用方法看index.nuve
			 */
			//獲取分類
			async loadTabbars(){
				let that = this;
				let params = {pageSize:3};
                let list = await Api.apiCall('get', Api.cms.subjectCategoryList, params);

						let tabList = list.records;
						tabList.forEach(item=>{
							item.newsList = [];
							item.loadMoreStatus = 0;  //加載更多 0加載前，1加載中，2沒有更多了
							item.refreshing = 0;
							item.pageNo = 1;
						})
						that.tabBars = tabList;
						that.loadNewsList('add');


			},
			//新聞列表
			async loadNewsList(type){
				let that = this;
				
				let tabItem = this.tabBars[this.tabCurrentIndex];
				
				//type add 加載更多 refresh下拉刷新
				if(type === 'add'){
					if(tabItem.loadMoreStatus === 2){
						return;
					}
					tabItem.loadMoreStatus = 1;
				}
				// #ifdef APP-PLUS
				else if(type === 'refresh'){
					tabItem.refreshing = true;
				}
				// #endif
				console.log(tabItem)
				let params = {pageNum:tabItem.pageNo,categoryId:tabItem.id};
                let list = await Api.apiCall('get', Api.cms.subjectList, params);


						let newsList = list.records;
						let total = list.total;
						tabItem.newsList = tabItem.newsList.concat(newsList);
						//下拉刷新 關閉刷新動畫
						if(type === 'refresh'){
							that.$refs.mixPulldownRefresh && that.$refs.mixPulldownRefresh.endPulldownRefresh();
							// #ifdef APP-PLUS
							tabItem.refreshing = false;
							// #endif
							tabItem.loadMoreStatus = 0;
						}
						//上滑加載 處理狀態
						if(type === 'add'){
							tabItem.loadMoreStatus = tabItem.newsList.length >= total ? 2: 0;
						}


				
				

			},
			//新聞詳情
			navToDetails(item){
				let url = '';
				if(videoSrc)
					url = '/pages/content/videoDetails?id='+item.id;
				if(item.articleType==='1' && item.linkType=='外部鏈接')
					url = '/pages/content/webView?src='+item.content;
				if(item.type)
					url = '../../pagesU/content/details?id='+item.id;
				uni.navigateTo({
					url:url
				})
			},
			
			//下拉刷新
			onPulldownReresh(){
				let tabItem = this.tabBars[this.tabCurrentIndex];
				this.resetPage(tabItem);
				this.loadNewsList('refresh');
			},
			//重置頁碼
			resetPage(tabItem){
				tabItem.pageNo = 1;
				tabItem.newsList = [];
			},
			//上滑加載
			loadMore(){
				let tabItem = this.tabBars[this.tabCurrentIndex];
				tabItem.pageNo = tabItem.pageNo + 1;
				this.loadNewsList('add');
			},
			//設置scroll-view是否允許滾動，在小程序裏下拉刷新時避免列表可以滑動
			setEnableScroll(enable){
				if(this.enableScroll !== enable){
					this.enableScroll = enable;
				}
			},

			//tab切換
			async changeTab(e){
				
				if(scrollTimer){
					//多次切換只執行最後一次
					clearTimeout(scrollTimer);
					scrollTimer = false;
				}
				let index = e;
				//e=number為點擊切換，e=object為swiper滑動切換
				if(typeof e === 'object'){
					index = e.detail.current
				}
				if(typeof tabBar !== 'object'){
					tabBar = await this.getElSize("nav-bar")
				}
				//計算寬度相關
				let tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0; 
				let nowWidth = 0;
				//獲取可滑動總寬度
				for (let i = 0; i <= index; i++) {
					let result = await this.getElSize('tab' + i);
					width += result.width;
					if(i === index){
						nowWidth = result.width;
					}
				}
				if(typeof e === 'number'){
					//點擊切換時先切換再滾動tabbar，避免同時切換視覺錯位
					this.tabCurrentIndex = index; 
				}
				//延遲300ms,等待swiper動畫結束再修改tabbar
				scrollTimer = setTimeout(()=>{
					if (width - nowWidth/2 > windowWidth / 2) {
						//如果當前項越過中心點，將其放在屏幕中心
						this.scrollLeft = width - nowWidth/2 - windowWidth / 2;
					}else{
						this.scrollLeft = 0;
					}
					if(typeof e === 'object'){
						this.tabCurrentIndex = index; 
					}
					this.tabCurrentIndex = index; 
					
					
					//第一次切換tab，動畫結束後需要加載數據
					let tabItem = this.tabBars[this.tabCurrentIndex];
					if(this.tabCurrentIndex !== 0 && tabItem.loaded !== true){
						this.loadNewsList('add');
						tabItem.loaded = true;
					}
				}, 300)
				
			},
			//獲得元素的size
			getElSize(id) { 
				return new Promise((res, rej) => {
					let el = uni.createSelectorQuery().select('#' + id);
					el.fields({
						size: true,
						scrollOffset: true,
						rect: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
		}
	}
</script>

<style lang='scss'>
	
	page, .content{
		background-color: #f8f8f8;
		height: 100%;
		overflow: hidden;
	}

	/* 頂部tabbar */
	.nav-bar{
		position: relative;
		z-index: 10;
		height: 90upx;
		white-space: nowrap;
		box-shadow: 0 2upx 8upx rgba(0,0,0,.06);
		background-color: #fff;
		.nav-item{
			display: inline-block;
			width: 200upx;
			height: 90upx;
			text-align: center;
			line-height: 90upx;
			font-size: 30upx;
			color: #303133;
			position: relative;
			&:after{
				content: '';
				width: 0;
				height: 0;
				border-bottom: 4upx solid rgba(219, 63, 96, 1);
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				transition: .3s;
			}
		}
		.current{
			color: rgba(219, 63, 96, 1);
			&:after{
				width: 50%;
			}
		}
	}

	.swiper-box{
		height: 100%;
	}

	.panel-scroll-box{
		height: 100%;
		
		.panel-item{
			background: #fff;
			padding: 30px 0;
			border-bottom: 2px solid #000;
		}
	}
	
	/**
	 * 新聞列表 直接拿的nvue樣式修改，,
	 * 一共需要修改不到10行代碼, 另外px需要直接修改為upx，只有單位不一樣，計算都是一樣的
	 * 吐槽：難道不能在編譯的時候把nuve中的upx轉為px? 這樣就不用修改單位了
	 */
	.video-wrapper{
		width: 100%;
		height: 440upx;
		.video{
			width: 100%;
		}
	}
	
	view{
		display:flex;
		flex-direction: column;
	}
	.img{
		width: 100%;
		height: 100%;
	}
	.news-item{
		position:relative;
	}
	/* 修改結束 */
	
	/* 新聞列表  emmm 僅供參考 */
	.news-item{
		width: 750upx;
		padding: 24upx 30upx;
		border-bottom-width: 1px;
		border-color: #eee;
		background-color: #fff;
	}
	.title{
		font-size: 32upx;
		color: #303133;
		line-height: 46upx;
	}
	.bot{
		flex-direction: row;
	}
	.author{
		font-size: 26upx;
		color: #aaa;
	}
	.time{
		font-size: 26upx;
		color: #aaa;
		margin-left: 20upx;
	}
	.img-list{
		flex-shrink: 0;
		flex-direction: row;
		background-color: #fff;
		width: 220upx;
		height: 140upx;
	}
	.img-wrapper{
		flex: 1;
		flex-direction: row;
		height: 140upx;
		position: relative;
		overflow: hidden;
	}
	.img{
		flex: 1;
	}
	.img-empty{
		height: 20upx;
	}
	
	/* 圖在左 */
	.img-list1{
		position:absolute;
		left: 30upx;
		top: 24upx;
	}
	.title1{
		padding-left: 240upx; 
	}
	.bot1{
		padding-left: 240upx; 
		margin-top: 50upx;
	}
	/* 圖在左 */
	.img-list2{
		width: 700upx;
		margin: 16upx 0upx;
	}
	.title2{
		padding-right: 210upx; 
	}
	.bot2{
		margin-top: 20upx;
	}
	/* 底部3圖 */
	.img-list3{
		width: 700upx;
		margin: 16upx 0upx;
	}
	.img-wrapper3{
		margin-right: 4upx;
	}
	/* 底部大圖 */
	.img-list-single{
		width: 690upx;
		height: 240upx;
		margin: 16upx 0upx;
	}
	.img-wrapper-single{
		height: 240upx;
		margin-right: 0upx;
	}
	
	.video-tip{
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.3);
	}
	.video-tip-icon{
		width: 60upx;
		height:60upx; 
	}
</style>
