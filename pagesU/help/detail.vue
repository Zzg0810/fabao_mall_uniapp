<template>
	<view class="articleDetail">
		<view class="content" v-html="articleInfo.content">
			
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	export default {
		data () {
			return {
				id: '',
				articleInfo: {}
			}
		},
		onLoad (options) {
			const {id} = options
			this.id = id
			this.getDetail()
		},
		methods: {
			async getDetail () {
				let data = await Api.apiCall('get', Api.cms.helpDetail, {id: this.id});
				this.articleInfo = data || {}
				uni.setNavigationBarTitle({
					title: data.title || '文章詳情'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.articleDetail {
		overflow:hidden;
		width: 100%;
		padding: 40rpx;
		.content {
			line-height: 40rpx;
		}
	}
</style>
