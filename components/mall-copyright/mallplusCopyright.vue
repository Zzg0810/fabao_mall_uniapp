<template>
	<view class="cpr">
		<view class="color-9">
			香港佛陀教育協會
		<!-- 	{{sysInfo.copyrightInfo ||copyrightInfo}} 版权所有 -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
		copyrightInfo: this.$mSettingConfig.copyrightInfo,
			sysInfo : this.$db.get('sysInfo')
		}
	}
}
</script>

<style>
.cpr{
	text-align: center;
	font-size: 24upx;
	margin: 20upx 0;
}
.beian a{
	text-decoration: none;
	color: #999 !important;
}
</style>
