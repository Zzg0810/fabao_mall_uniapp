<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index">
			<view class="wrapper" @click="checkAddress(item)">
				<view class="u-box">
					<text class="name">{{ item.name }}</text>
					<text class="name">{{ item.phoneNumber }}</text>
					<text class="mobile">{{item.country}}</text>
				</view>
				<view class="address-box">
					<text v-if="item.defaultStatus == 1" class="tag">默認</text>
					<text class="address"> {{ item.province }}-{{ item.city }}-{{ item.region }}-{{ item.detailAddress }}</text>
				</view>
				
			</view>
			<view class="" style="display: flex;flex-direction: row;width: 100%;justify-content: flex-end;">
				<!--<view class="" style="width: 20%;display: flex;align-items: center;justify-content: center;" @click="addAddress('edit', item)">
					<text class="yticon icon-bianji"></text>
					 <text style="font-size: 30upx;margin-left: 10upx;">編輯</text> 
				</view>-->
				<view class="" style="width: 20%;display: flex;align-items: center;justify-content: center;" @click="delAddress(item)">
					<text class="yticon icon-iconfontshanchu1"></text>
					<text style="font-size: 30upx;">刪除</text>
				</view>
			</view>
		</view>
		<!--<text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			重要：添加和修改地址回調僅增加了一條數據做演示，實際開發中將回調改為請求後端接口刷新一下列表即可
		</text>-->

		<button class="add-btn" @click="addAddress('add')">新增地址</button>

	</view>
</template>

<script>
import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';

import Api from '@/common/api';
export default {
components: {
		mallplusCopyright
	},
	data() {
		return {
			source: 0,
			addressList: []
		};
	},
	async onLoad(option) {
		this.source = option.source;
		this.getListAddress()
	},
	async onShow(){
		this.getListAddress()
	},
	methods: {
		async getListAddress(){
			let params = {};
			this.addressList = await Api.apiCall('get', Api.goods.listAddress, params);
		},
		//選擇地址
		checkAddress(item) {
			if (this.source == 1) {
				//this.$api.prePage()獲取上一頁實例，在App.vue定義
				this.$api.prePage().addressData = item;
				this.$api.prePage().addressId = item.id;
				uni.navigateBack();
			}
		},
		addAddress(type, item) {
			uni.navigateTo({
				url: `../../pagesU/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
			});
		},
		//添加或修改成功之後回調
		refreshList(data, type) {
			//添加或修改後事件，這裏直接在最前面添加了一條數據，實際應用中直接刷新地址列表即可
			this.addressList.unshift(data);

			console.log(data, type);
		},
		// 刪除地址
		async delAddress(item){
			console.log(item)
			// let params = {
			// 	id: item.id
			// }
			let data = await Api.apiCall('post', Api.goods.deleteAddress, {id: item.id});
			if(data){
				uni.showToast({
					title: '刪除成功',
				})
			}else{
				uni.showToast({
					title: '刪除失敗',
					icon: 'none'
				})
			}
			this.getListAddress();
			console.log("------刪除-------",data)
		}
	}
};
</script>

<style lang="scss">
page {
	padding-bottom: 120upx;
}
.content {
	position: relative;
}
.list {
	display: flex;
	align-items: center;
	flex-direction: column;
	padding: 20upx;
	background: #fff;
	position: relative;
}
.wrapper {
	width: 100%;
	display: flex;
	flex-direction: column;
	flex: 1;
}
.address-box {
	display: flex;
	align-items: center;
	margin: 10upx 0;
	.tag {
		font-size: 24upx;
		color: $base-color;
		margin-right: 10upx;
		background: #fffafb;
		border: 1px solid #ffb4c7;
		border-radius: 4upx;
		padding: 4upx 10upx;
		line-height: 1;
	}
	.address {
		font-size: 28upx;
		color: $font-color-light;
	}
}
.u-box {
	font-size: 32upx;
	color: $font-color-000;
	// margin-top: 16upx;
	.name {
		margin-right: 30upx;
	}
}
.icon-bianji {
	// display: flex;
	// align-items: center;
	// height: 80upx;
	font-size: 36upx;
	color: $font-color-light;
	// padding-left: 30upx;
}

.add-btn {
	position: fixed;
	left: 30upx;
	right: 30upx;
	bottom: 16upx;
	z-index: 95;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 690upx;
	height: 80upx;
	font-size: 32upx;
	color: #fff;
	background-color: $base-color;
	border-radius: 10upx;
	box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
</style>
