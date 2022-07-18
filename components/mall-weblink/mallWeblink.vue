<template>
	<view class="cpr">
		<view class="color-9">
				<a target="_blank" href="http://www.amtbhk.com">香港佛陀教育協會</a>
				<a @click="navToHelpDetail(11)">聯絡法寶部</a>
				<a @click="navToHelpDetail(8)">助印法寶</a>
				<a @click="navToHelpDetail(9)">隱私政策</a>
				<a target="_blank" href="http://fabaomall.amtbhk.com">電腦版</a>
	   </ul>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
		
		}
	},
	methods:{
	   navToHelpDetail(id) {
		   uni.navigateTo({
			url: `/pagesU/help/detail?id=${id}`
		   })
		},
	}
}
</script>

<style>
.cpr{
	text-align: center;
	font-size: 24upx;
	margin: 80upx 0;
}
.cpr a{
	display: inline-block;
	text-decoration: none;
	color: #333 !important;
	margin-right:10upx;
	padding-right:10upx;
	line-height: 1;
	border-right: 1px solid #333;
}
.cpr a:last-child{
	border-right:0;
}

</style>
