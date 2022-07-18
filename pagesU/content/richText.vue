<template>
	<view class="content">
		<rich-text :nodes="richText"></rich-text>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import htmlParser from '@/common/html-parser'
	import {
		mapState,mapMutations
	} from 'vuex';
	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				richText:'',
				strings: '<p>點擊訂單進入訂單列表, 在想要退款的訂單下點擊退款</p>'
			};
		},
		
		onLoad(options){
			var content = JSON.parse(unescape(options.content));
			content = content.replace(/<!DOCTYPE html>/g,"").replace(/<html>/g,"").replace(/<\/html>/g,"").replace(/<head>/g,"").replace(/<\/head>/g,"").replace(/<body>/g,"").replace(/<\/body>/g,"")
			// var htmlString = content.replace(/\\/g, "").replace(/<img/g, "<img style=\"display:none;\"");
			this.richText = htmlParser(content);
			
		},
		computed: {
			...mapState([ 'userInfo'])
		},
		methods: {
			...mapMutations(['login']),
			
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: #fff;
		padding: 20upx;
	}
</style>
