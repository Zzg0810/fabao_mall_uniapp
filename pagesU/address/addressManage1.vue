<template>
	<view class="content">
		<view class="box">
			<view class="box_left">收貨人:</view>
			<view class="box_right"><input type="text" v-model="user.name" placeholder="為確保收貨請使用真名" /></view>
		</view>
		<view class="box">
			<view class="box_left">手機號:</view>
			<view class="box_right"><input type="number" maxlength="11" v-model="user.phoneNumber" placeholder="請確保收貨電話真實有效" /></view>
		</view>
		<view class="box">
			<view class="box_left">地區:</view>
			<view class="box_right">
				<view class="citybtn" @click="showMulLinkageThreePicker">{{ pickerText }}</view>
				<!-- <view><image src="../../static/xiala.png" mode=""></image></view> -->
			</view>
		</view>
		<view class="box">
			<view class="box_left">地址定位:</view>
			<view class="box_right_right" @click="openMap()">
				<input type="text" value="" v-model="mapAddressName" placeholder="在地圖上搜索並選擇地址" disabled="true" />
				<!-- <text>{{ mapAddressName }}</text> -->
				<image src="/static/location.png" mode=""></image>
			</view>
		</view>
		<view class="box">
			<view class="box_left">詳細地址:</view>
			<view class="box_right_right">
				<input type="text" value="" v-model="user.detailAddress" placeholder="街道門牌,樓層房間號等信息" />
				<image src="../../static/address.png" mode="" @click="gosite"></image>
			</view>
		</view>

		<!-- <view class="box">
			<view class="box_left">
				身份證號
			</view>
			<view class="box_right">
				<input type="text" value="" v-model="IDcard" placeholder="身份證號碼" />
			</view>
		</view> -->
		<view class="box">
			<view class="box_left_two">設為默認收件地址:</view>
			<view class="box_right_two"><switch color="#D23535" :checked="user.defaultStatus == 1" style="transform:scale(0.8)" @change="switchBtn" /></view>
		</view>
		<button class="btn" @click="submit">提交</button>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>

	</view>
</template>

<script>
import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';

import Api from '@/common/api';



export default {
components: {
		mallplusCopyright
	},
	data() {
		return {
			cityPickerValueDefault: [0, 0, 1],
			themeColor: '#007AFF',
			pickerText: '選擇省/市/區',
			mode: '',
			deepLength: 1,
			pickerValueDefault: [0],
			pickerValueArray: [],
			user: {
				name: '', // [str] [必填] [收貨人]
				phoneNumber: '',
				province: '', //[str] [必填] [省]
				city: '', //        [str] [必填] [市]
				region: '', //    [str] [必填] [區]
				detailAddress: '', //     [str] [必填] [詳址]
				defaultStatus: '0', //     [int] [可選] [默認地址。1是0否]
				longitude: 0, //經度
				latitude: 0 //緯度
			},
			IDcard: '',
			id: '',
			mapAddressName: ''
		};
	},
	components: {
		mpvueCityPicker
	},
	onLoad(option) {
		console.log(option);
		let title = '新增收貨地址';
		var that = this;
		if (option.type === 'edit') {
			title = '編輯收貨地址';
			this.user = JSON.parse(option.data);
			console.log('user',this.user);
			that.id = this.user.id;
			var province = this.user.province;
			var city = this.user.city;
			var region = this.user.region;
			that.pickerText = province + '-' + city + '-' + region;
		}
		uni.setNavigationBarTitle({
			title
		});

	},
	methods: {
		// 三級聯動選擇
		showMulLinkageThreePicker() {
			this.$refs.mpvueCityPicker.show();
		},
		onConfirm(e) {
			console.log(e);
			var label = e.label;
			this.pickerText = label;
			var labelArr = label.split('-');
			this.user.province = labelArr[0];
			this.user.city = labelArr[1];
			this.user.region = labelArr[2];
		},
		gosite() {
			var that = this;
			uni.chooseLocation({
				success: function(res) {
					console.log('位置名稱：' + res.name);
					console.log('詳細地址：' + res.address);
					that.user.detailAddress = res.address;
					console.log('緯度：' + res.latitude);
					console.log('經度：' + res.longitude);
				}
			});
		},
		openMap() {
			var _this = this;
			uni.chooseLocation({
				keyword: _this.user.detailAddress,
				success: function(res) {
					console.log('res', res);

					_this.user.latitude = res.latitude;
					_this.user.longitude = res.longitude;
					_this.mapAddressName = res.address + res.name;
					console.log('經度：' + res.longitude);
					console.log('詳細地址：' + res.address);
					console.log('緯度：' + res.latitude);
				}
			});

		},
		async submit() {
			let params;
			var info = this.user,
				_this = this;
			if (info.name==''||info.phoneNumber==''||info.detailAddress=='') {
				uni.showToast({
					title: '請將信息填寫完整',
					icon: 'none'
				});
				return;
			}
			var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
			if(!reg.test(info.phoneNumber)){
				uni.showToast({
					title: '請輸入正確的手機號',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '請稍等...'
			});
			if (_this.id) {
				params = {
					id: _this.id,
					defaultStatus: info.defaultStatus,

					detailAddress: info.detailAddress,
					phoneNumber: info.phoneNumber,
					province: info.province,
					city: info.city,
					region: info.region,
					longitude: info.longitude,
					latitude: info.latitude,
					name: info.name
				};
			} else {
				params = {
					defaultStatus: info.defaultStatus,
					region: info.region,
					detailAddress: info.detailAddress,
					phoneNumber: info.phoneNumber,
					province: info.province,
					city: info.city,
					longitude: info.longitude,
					latitude: info.latitude,
					name: info.name
				};
			}
			let data = await Api.apiCall('post', Api.goods.addressSave, params);
			if (data) {
				this.$api.msg(`地址${_this.id ? '修改' : '添加'}成功`);
				setTimeout(() => {
					uni.navigateBack({
						delta:1
					})
					// let url = '../../pagesU/address/address';
					// uni.navigateTo({
					// 	url
					// });
				}, 800);
			} else {
				this.$api.msg(`地址${_this.id ? '修改' : '添加'}失敗`);
			}
		},
		switchBtn: function(e) {
			var that = this;
			console.log('switch1 發生 change 事件，攜帶值為', e.target.value);
			if (e.target.value == true) {
				that.user.defaultStatus = 1;
			} else {
				that.user.defaultStatus = 0;
			}
			console.log(that.user.defaultStatus);
		}
	}
};
</script>

<style>
page {
	background: $page-color-base;
	padding-top: 16upx;
}
.content {
	width: 100%;
	font-size: 28upx;
	/* padding-top: 40upx; */
	color: #676769;
}
.box {
	width: 100%;
	padding: 0 20upx;
	height: 100upx;
	display: flex;
	align-items: center;
	/* margin-bottom: 20upx; */
	border-bottom: 1upx solid #EEEEEE;
}
.box_left {
	width: 20%;
	display: flex;
	align-items: center;
}
.box_left_two {
	width: 550upx;
}
.box_right {
	width: 70%;
	display: flex;
}
.box_right_right {
	width: 85%;
	height: 80upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-left: 3%;
}
.box_right_right input {
	width: 87%;
	height: 70upx;
	line-height: 70upx;
}
.box_right_right image {
	width: 40upx;
	height: 40upx;
}
.box_right image {
	width: 40upx;
	height: 40upx;
	margin-top: 20upx;
	margin-left: 30upx;
}
.box_right_two {
	width: 150upx;
}

.box_right input {
	width: 97%;
	height: 80upx;
	padding-left: 3%;
	background-color: #ffffff;
}
.btn {
	width: 690upx;
	height: 90upx;
	line-height: 90upx;
	background: #fa436a;
	/* background-color: rgba(242 155 135); */
	color: #ffffff;
	font-size: 32upx;
	margin-top: 120upx;
}
.citybtn {
	width: 80%;
	height: 80upx;
	line-height: 80upx;
	overflow: hidden;
}
</style>
