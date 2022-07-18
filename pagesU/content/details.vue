<template>
	<view class="content">
	
		<scroll-view class="scroll" scroll-y>
			<view class="scroll-content">
				<view class="introduce-section">
					<text class="title">{{detailData.title}}</text>
					<view class="introduce">
						<text>{{detailData.memberName}}</text>
						<text>{{detailData.readCount}}閱讀</text>
						<text>{{detailData.createTime |formatCreateTime}}</text>
					</view>
					
                    <rf-parser :html="detailData.htmlNodes" lazy-load></rf-parser>

					<!-- <view class="actions" v-show="loading === false">
						<view class="action-item">
							<text class="yticon icon-dianzan-ash"></text>
							<text>75</text>
						</view>
						<view class="action-item">
							<text class="yticon icon-dianzan-ash reverse"></text>
							<text>6</text>
						</view>
						<view class="action-item">
							<text class="yticon icon-fenxiang2"></text>
							<text>分享</text>
						</view>
						<view class="action-item">
							<text class="yticon icon-shoucang active"></text>
							<text>收藏</text>
						</view>
					</view> -->
				</view>
				
				<view class="container" v-show="loading === false">
					<!-- 推薦 -->
					<view class="s-header">
						<text class="tit">相關推薦</text>
					</view>
					<view class="rec-section" v-for="item in newsList" :key="item.articleUuid">
						<view class="rec-item" @click="navToDetails(item)">
							<view class="left">
								<text class="title">{{item.title}}</text>
								<view class="bot">
									<text class="author">{{item.memberName}}</text>
									<text class="time">{{item.createTime |formatCreateTime}}</text>
								</view>
							</view>
							<view class="right">
								<image class="img" :src="item.pic" mode="aspectFill"></image>
							</view>
						</view>
					</view>
				</view>
				<!-- 加載圖標 -->
				<mixLoading class="mix-loading" v-if="loading"></mixLoading>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import Api from '@/common/api';
	import json from '@/Json';
	import mixLoading from '@/components/mix-loading/mix-loading';
	import rfParser from '@/components/rf-parser';
	import { formatDate } from '@/common/date';
	import htmlParser from '@/common/html-parser'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			mixLoading,rfParser
		},
		data() {
			return {
				loading: true,
				detailData: {},
				newsList: [],
				evaList: [],
			}
		},
		computed: {
			...mapState([ 'userInfo', 'footPrint', 'applicationConfig'])
		},
		onLoad(options){
			var id = options.id;
			this.loadNewsDetail(id);
			this.loadNewsList();
		},
			filters: {
                                    		  formatCreateTime(time) {
                                                     let date = new Date(time);
                                                     return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
                                                   },
                                                   },
		methods: {

			async loadNewsList(tagName){
				let that = this;
				let params = {categoryId:tagName};
                                let list = await Api.apiCall('get', Api.cms.subjectList, params);


						that.newsList = list.records;
						that.loading = false;


			},
			//獲取文章詳情
			 async loadNewsDetail(id){
				let that = this;
				let params = {id:id};
                   let list = await Api.apiCall('get', Api.cms.subjectDetail, params);



						that.detailData = list;
						that.loadNewsList(that.detailData.categoryId);
						that.detailData.htmlNodes = that.detailData.content;



			},
			//新聞詳情
			navToDetails(item){
				let url = '';

                					url = '../../pagesU/content/details?id='+item.id;
                				uni.navigateTo({
                					url:url
                				})
			},
			
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.content{
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #fff;
	}
	.video-wrapper{
		height: 422upx;
		
		.video{
			width: 100%;
			height: 100%;
		}
	}
	.scroll{
		flex: 1;
		position: relative;
		background-color: #f8f8f8;
		height: 0;
	}
	.scroll-content{
		display: flex;
		flex-direction: column;
	}
	/* 簡介 */
	.introduce-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		line-height: 1.5;
		
		.title{
			font-size: 36upx;
			color: #303133;
			margin-bottom: 16upx;
		}
		.introduce{
			display: flex;
			font-size: 26upx;
			color: #909399;
			text{
				margin-right: 16upx;
			}
		}
	}
	/* 點贊等操作 */
	.actions{
		display: flex;
		justify-content: space-around;
		align-items: center;
		line-height: 1.3;
		padding: 10upx 40upx 20upx;
	
		.action-item{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 24upx;
			color: #999;
		}
		.yticon{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 52upx;
			
			&.reverse{
				position: relative;
				top: 6upx;
				transform: scaleY(-1);
			}
			&.active{
				color: #ec706b;
			}
		}
		.icon-fenxiang2{
			font-weight: bold;
			font-size: 36upx;
		}
		.icon-shoucang{
			font-size: 44upx;
		}
	}

	.s-header{
		padding: 20upx 30upx;
		font-size: 30upx;
		color: #303133;
		background: #fff;
		margin-top: 16upx;
		
		&:before{
			content: '';
			width: 0;
			height: 40upx;
			margin-right: 24upx;
			border-left: 6upx solid #ec706b;
		}
	}
	/* 推薦列表 */
	.rec-section{
		background-color: #fff;
		.rec-item{
			display: flex;
			padding: 20upx 30upx;
			position: relative;
			&:after{
				content: '';
				position: absolute;
				left: 30upx;
				right: 0;
				bottom: 0;
				height: 0;
				border-bottom: 1px solid #eee;
				transform: scaleY(50%);
			}
		}
		.left{
			flex: 1;
			padding-right: 10upx;
			overflow: hidden;
			position: relative;
			padding-bottom: 52upx;
			.title{
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				font-size: 32upx;
				color: #303133;
				line-height: 44upx;
			}
			.bot{
				position: absolute;
				left: 0;
				bottom: 4upx;
				font-size: 26upx;
				color: #909399;
			}
			.time{
				margin-left: 20upx;
			}
		}
		.right{
			width: 220upx;
			height: 140upx;
			flex-shrink: 0;
			position: relative;
			.img{
				width: 100%;
				height: 100%;
			}
			
		}
	}
	/* 評論 */
	.evalution{
		display:flex;
		flex-direction:column;
		background: #fff;
		padding: 20upx 0;
	}
	
	.eva-item{
		display:flex;
		padding: 20upx 30upx;
		position: relative;
		image{
			width: 60upx;
			height: 60upx;
			border-radius: 50px;
			flex-shrink: 0;
			margin-right: 24upx;
		}
		&:after{
			content: '';
			position: absolute;
			left: 30upx;
			bottom: 0;
			right: 0;
			height: 0;
			border-bottom: 1px solid #eee;
			transform: translateY(50%);
		}
		&:last-child:after{
			border: 0;
		}
	}
	.eva-right{
		display:flex;
		flex-direction:column;
		flex: 1;
		font-size: 26upx;
		color: #909399;
		position:relative;
		.zan-box{
			display:flex;
			align-items:base-line;
			position:absolute;
			top: 10upx;
			right: 10upx;
			.yticon{
				margin-left: 8upx; 
			}
		}
		.content{
			font-size: 28upx;
			color: #333;
			padding-top:20upx;
		}
	}
	
	/* 底部 */
	.bottom{
		flex-shrink: 0;
		display: flex;
		align-items: center;
		height: 90upx;
		padding: 0 30upx;
		box-shadow: 0 -1px 3px rgba(0,0,0,.04); 
		position: relative;
		z-index: 1;
		
		.input-box{
			display: flex;
			align-items: center;
			flex: 1;
			height: 60upx;
			background: #f2f3f3;
			border-radius: 100px;
			padding-left: 30upx;
			
			.icon-huifu{
				font-size: 28upx;
				color: #909399;
			}
			.input{
				padding: 0 20upx;
				font-size: 28upx;
				color: #303133;
			}
		}
		.confirm-btn{
			font-size: 30upx;
			padding-left: 20upx;
			color: #0d9fff;
		}
	}
</style>
