<template>
	<view class="zwyVideoBox">
		<view class="videoNum">{{videoInfo.id}}</view>
		<!-- #ifdef H5 -->
			<video
				:src="videoInfo.videoUrl ? videoInfo.videoUrl : ''"
				:id="'videoPlayer'+videoInfo.id"
				:ref="'videoPlayer'+videoInfo.id"
				:autoplay="videoInfo.id == nowId"
				:poster="videoInfo.posterImg"
				style="width: 100vw;height: 100vh;display: inline-block;overflow: hidden;"
			></video>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<video
			:src="videoInfo.videoUrl ? videoInfo.videoUrl : ''"
			id="videoPlayer"
			:autoplay="videoInfo.id == nowId"
			:poster="videoInfo.posterImg"
			style="width: 100vw;height: 100vh;display: inline-block;overflow: hidden;"
		></video>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	props: {
		videoInfo: {
			type: Object,
			default: {}
		},
		nowId: {
			type: Number,
			default: -1
		}
	},
	watch: {
		/* val监听改变的值*/
		nowId(val) {
			console.log(val, '监听方法');
			this.playNow(val);
		}
	},
	data() {
		return {
			videoContent:''
		};
	},
	mounted() {
		console.log('mounted')
		// #ifdef H5
			this.videoContent =  uni.createVideoContext('videoPlayer'+this.videoInfo.id,this);
			this.playNow();
		// #endif
		// #ifndef H5
		this.videoContent =  uni.createVideoContext('videoPlayer',this);
		// #endif
	},
	methods:{
		    playNow(val = this.nowId){
				console.log('playNow',this.videoContent)
		      if(this.videoContent){
		        if(val == this.videoInfo.id) {
		          this.videoContent.play();
		        }else{
		          this.videoContent.pause();
		        }
		      }else{
		        setTimeout(() => {
				  // #ifdef H5
				  	this.videoContent =  uni.createVideoContext('videoPlayer'+this.videoInfo.id,this);
				  // #endif
				  // #ifndef H5
				  this.videoContent =  uni.createVideoContext('videoPlayer',this);
				  // #endif
		          this.playNow(val);
		        }, 600);
		      }
		    }
	},
	created() {}
};
</script>

<style>
	.videoNum{
		width: 100rpx;
		height: 100rpx;
		will-change: transform;
		position: absolute;
		left: 100rpx;
		top: 130rpx;
		z-index: 30;
		background-color: white;
		color: black;
	}
.zwyVideoBox {
	width: 100vw;
	will-change: transform;
	position: absolute;
	height: 100vh;
}
</style>
