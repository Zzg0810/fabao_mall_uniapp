<template>
	<view class="content">

		<view class="row b-b">
			<text class="tit">聯系人</text>
			<input class="input" type="text" v-model.trim="addressData.name" placeholder="收貨人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">國家/地區</text>
			<picker  :value="countryIndex" :range="coutryNameList" @change="changeCoutry">
				<view :class="{normal:countryIndex == 0 }">{{coutryNameList[countryIndex]}}</view>
			</picker>
		</view>
		<view class="row b-b">
			<text class="tit">手機號</text>
			<input class="input" type="number" v-model="addressData.phoneNumber" placeholder="收貨人手機號碼" placeholder-class="placeholder" />
		</view>
		<view class="row b-b" v-show="showProvince">
			<text class="tit">城市</text>
			<input placeholder="請選擇城市" disabled="true" :value="addressData.province + ' ' + addressData.city + ' ' + (addressData.region || '' )" @click="lotusAddressData.visible = true" class="input">
				<lotus-address v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>
			</input>
		</view>
<!-- 		<view class="row b-b">
				<text class="tit">地圖:</text>
				<input class="input" @click="openMap()" type="text" value="" v-model="mapAddressName" placeholder="在地圖上搜索並選擇地址" disabled="true" />
				<text class="yticon icon-shouhuodizhi"></text>
		</view> -->
		<view class="row b-b">
			<text class="tit">詳細</text>
			<input class="input" type="text" v-model="addressData.detailAddress" placeholder="街道、樓號、門牌" placeholder-class="placeholder" />
		</view>

		<view class="row default-row">
			<text class="tit">設為默認</text>
			<switch :checked="addressData.defaultStatus" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
import Api from '@/common/api';
import lotusAddress from "@/components/Winglau14-lotusAddress/new.vue"
	export default {
		data() {
			return {
				mapAddressName: '',
				addressData: {
					name: '',
					phoneNumber: '',
					province: '',
					city: '',
					region: '',
					detailAddress: '',
					defaultStatus: 0,
					def: false,
					countryId: '',
					cityId: '',
					provinceId: '',
					regionId: '',
					countryCode: ''
				},
				lotusAddressData:{
					visible:false,
					provinceName:'',
					cityName:'',
					townName:'',
				},
				countryIndex: 0,
				coutryNameList: [],
				coutryList: [],
				showProvince:true,
				isChina: uni.getStorageSync('isChina')
			}
		},
		async onLoad(option){
			let title = '新增收貨地址';
			if(option.type==='edit'){
				title = '編輯收貨地址'
				this.addressData = JSON.parse(option.data)
				console.log(this.addressData)
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
			this.getCountryList(option)
		},
		methods: {
			switchChange(e){
				this.addressData.defaultStatus = e.detail.value?1:0
				this.addressData.def = e.detail.value
			},
        openMap() {
			var _this = this;
			uni.chooseLocation({

				success: function(res) {
					console.log('res', res);

					_this.addressData.latitude = res.latitude;
					_this.addressData.longitude = res.longitude;
					_this.mapAddressName= res.address + res.name;
					_this.addressData.detailAddress = res.address + res.name;
					console.log('經度：' + res.longitude);
					console.log('詳細地址：' + res.address);
					console.log('緯度：' + res.latitude);
				}
			});

		},
			choseValue(res){
            //res數據源包括已選省市區與省市區code
				this.lotusAddressData.visible = false;//visible為顯示與關閉組件標識true顯示false隱藏
				if(res.isChose){
					console.log(res)
					this.lotusAddressData.provinceName = res.provice;//省
					this.lotusAddressData.cityName = res.city;//市
					this.lotusAddressData.townName = res.town;//區

					//賦值到addressData
					this.addressData.province = res.provice
					this.addressData.city = res.city
					this.addressData.region = res.town
					this.addressData.cityId = res.cityCode
					this.addressData.provinceId = res.provinceCode
					this.addressData.regionId = res.townCode
				}
			},

			//提交
			async confirm(){
				const that = this
				let data = this.addressData;
				if(!data.name){
					this.$api.msg('請填寫收貨人姓名');
					return;
				}
				if(data.countryId == "8001" && !/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phoneNumber)){
					that.$api.msg('請輸入正確的手機號碼');
					return
				}
				if (!data.countryId) {
					this.$api.msg('請選擇所屬國家/地區')
					return
				}
				if (data.countryId == "8001") {
					if (!data.province) {
						that.$api.msg('請選擇省市區');
						return
					}
					if (!data.city) {
						that.$api.msg('請選擇二級城市')
						return
					}
					if (!data.region) {
						that.$api.msg('請選擇三級區或縣')
						return
					}
				}
				if(!data.detailAddress){
					that.$api.msg('請輸入詳細地址');
					return
				}
				let param = {...this.addressData}
				if (!param.longitude) param.longitude = 0
				if (!param.latitude) param.latitude = 0
				
				param.country = that.coutryNameList[this.countryIndex]

				let data1 = await Api.apiCall('post', Api.goods.addressSave, param);
				if (data1) {
                				this.$api.msg(`保存成功`);
                				setTimeout(() => {
                					uni.navigateBack({
                						delta:1
                					})

                				}, 800);
                			} else {
                				this.$api.msg(`保存失敗`);
                			}


			},
			async getCountryList (option) {
				this.$loading()
				let data = await Api.apiCall('get', Api.index.coutryList,{});
				this.coutryList = data || []
				this.coutryNameList = this.coutryList.map(r => r.country)
				
				if(this.isChina == 1){
					this.coutryNameList = this.coutryNameList.slice(0,1);   // 只顯示內地
				}else{
					this.coutryNameList.shift() // 刪除第1個,內地
				}
				
				this.coutryNameList.unshift('請選擇所屬國家/地區')
				
				console.log(this.coutryNameList)
				console.log(option, this.addressData, this.coutryList)
				//this.countryList過濾
				if (option.type == 'edit') {
					for (let k = 0 ; k < this.coutryList.length; k++) {
						if (this.coutryList[k].countryId == this.addressData.countryId) {
							this.countryIndex = k+1
							break;
						}
					}
					console.log(this.countryIndex)
				} 
				this.$loading(false)
				
			},
			changeCoutry (val) {
				console.log(val)
				this.countryIndex = val.target.value
				const {coutryList} = this
				if (!this.countryIndex) return
				let countryId = coutryList[this.countryIndex-1].countryId
				if(countryId=='8001'){
					this.showProvince = true;
				}else{
					this.showProvince = false;
				}
				let countryCode = coutryList[this.countryIndex-1].code
				this.$set(this.addressData, 'countryId', countryId)
				this.$set(this.addressData, 'countryCode', countryCode)
				
				if(countryId!="8001"){
					this.$set(this.addressData, 'province', '')
					this.$set(this.addressData, 'provinceId', '')
					this.$set(this.addressData, 'city', '')
					this.$set(this.addressData, 'cityId', '')
					this.$set(this.addressData, 'region', '')
					this.$set(this.addressData, 'regionId', '')
				}
			}
		},
		components:{
			"lotus-address":lotusAddress
		},
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;

		.tit{
			flex-shrink: 0;
			width: 180upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
	.normal {
		color: #999;
	}
</style>
