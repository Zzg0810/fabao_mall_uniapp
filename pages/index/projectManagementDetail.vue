<template>
	<view class="projectManagementDetail">
		<view class="form">
			<view class="form-item" v-show="!id" >
				<view>新增時默認填寫上一條記錄的內容。</view>
			</view>
			<view class="form-item">
				<text class="label">法寶名稱</text>
				<view class="cont" @click="showName">
					<input type="text" v-model="infos.productName" placeholder="點擊申請法寶" readonly disabled="disabled">
					<uni-icons type="arrowdown"></uni-icons>
				</view>
			</view>
			<view class="form-item">
				<text class="label">件數</text>
				<view class="cont">
					<input type="number" v-model.trim="infos.product_quantity" placeholder="請輸入件數" />
				</view>
			</view>
			<view class="form-item">
				<text class="label">禮請單位</text>
				<view class="cont">
					<input type="text" v-model.trim="infos.org" placeholder="請輸入禮請單位" />
				</view>
			</view>
			<view class="form-item">
				<text class="label">是否宗教團體</text>
				<view class="cont">
					<checkbox-group @change="checkboxChange" v-if="refres">
						<label>
							<checkbox :value="infos.relig" :checked="infos.relig == 1"/>
						</label>
					</checkbox-group>
				</view>
			</view>
			<view class="form-item">
				<text class="label">單位簡介</text>
				<view class="cont">
					<input type="text" v-model.trim="infos.intro" placeholder="請輸入單位簡介"/>
				</view>
			</view>
			<view class="form-item">
				<text class="label">聯絡人姓名</text>
				<view class="cont">
					<input type="text" v-model.trim="infos.contact"  placeholder="請輸入聯絡人姓名"/>
				</view>
			</view>
			<view class="form-item">
				<text class="label">聯系電話</text>
				<view class="cont">
					<input type="text" v-model.trim="infos.phone" placeholder="請輸入聯系電話"/>
				</view>
			</view>
			<view class="form-item">
				<text class="label">聯系郵箱</text>
				<view class="cont">
					<input type="text" v-model.trim="infos.email" placeholder="請輸入聯系郵箱"/>
				</view>
			</view>
			<view class="form-item special">
				<text class="label">備註</text>
				<view class="cont">
					<textarea type="text" v-model.trim="infos.brief" placeholder="請輸入備註" />
				</view>
			</view>
			<view class="form-item special">
				<text class="label">證明圖片</text>
				<view class="cont s">
					<view class="img-list" v-if="imgSrc.length">
						 <view class="img" v-for="(item, i) in imgSrc" :key="i">
							  <image :src="item"></image>
							  <text type="close" @click="deletes(i)">x</text>
						 </view>
					</view>
					<!-- <view class="upload">
						上傳圖片
						<input type="file" @change=""/>
					</view> -->
					<button type="primary" @click="upload" v-show="!id || (id && infos.status != 1 && infos.expire_flag == 0)">上傳圖片</button>
				</view>
			</view>
		</view>
		<view class="control">
			<button type="primary" @click="save" v-show="!id || (id && infos.status != 1 && infos.expire_flag == 0)">保存</button>
			<button type="warn" class="reset" @click="resets" v-show="!id || (id && infos.status != 1 && infos.expire_flag == 0)">重置</button>
			<button type="primary" class="reset" @click="deleteDetail" v-show="(id && infos.status != 1 && infos.expire_flag == 0)">刪除</button>
		</view>
		<uni-popup ref="popup" type="bottom">
			 <view class="choice-goods">
				  <view class="form-item">
					   <text class="label">一級分類：</text>
					   <view class="cont">
						   <picker  :value="firstIndex" :range="firstListName" @change="changeFirst">
						   	<view>{{firstListName[firstIndex]}}</view>
						   </picker>
					   </view>
				  </view>
				  <view class="form-item">
					   <text class="label">二級分類：</text>
					   <view class="cont">
						   <picker placeholder="請選擇" :value="secondIndex" :range="secondListName" @change="changeSecond">
							<view>{{secondListName[secondIndex]}}</view>
						   </picker>
					   </view>
				  </view>
				   <view class="form-item">
					   <text class="label">選擇法寶：</text>
					   <view class="cont">
						   <picker  :value="thirdIndex" :range="thirdListName" @change="changeThird">
							<view>{{thirdListName[thirdIndex]}}</view>
						   </picker>
					   </view>
				   </view> 
				   <button type="primary" @click="confirmChoice" >申請</button>
			 </view>
		</uni-popup>
	</view>
</template>
<script>
	import Api from '@/common/api';
	import {regPhone,regEmail} from '@/config/reg'
	export default {
		name: 'projectManagementDetail',
		data () {
			return {
				id: '',
				infos: {
					id: 0,
					productName: '', // 法寶名稱
					product_id: '', // 法寶id
					product_quantity: '', // 件數
					org: '', // 禮請單位
					relig: '', // 是否宗教團體
					intro: '', // 單位簡介
					contact: '', // 聯絡人姓名
					phone: '', // 聯系人電話
					email: '', // 聯系人郵箱
					brief: '', // 備註
				},
				imgSrc: [],
				firstList: [],
				firstListName: [],
				secondList: [],
				secondListName: [],
				thirdList: [],
				thirdListName: [],
				firstIndex: 0,
				secondIndex: 0,
				thirdIndex: 0,
				list: [],
				refres: true,
				allReadyList: []
			}
		},
		onLoad(options) {
			this.id = options.id || 0;
			if (this.id) {
				let fbZhuanAng = uni.getStorageSync('fbZhuanAng') && JSON.parse(uni.getStorageSync('fbZhuanAng')) || {}
				console.log(fbZhuanAng)
				if (!fbZhuanAng.relig) {
					fbZhuanAng.relig = ''
				} else {
					fbZhuanAng.relig = '1'
				}
				if (fbZhuanAng.pic) {
					this.imgSrc = fbZhuanAng.pic.split(',')
				}
				Object.assign(this.infos,fbZhuanAng)
				console.log(this.infos)
			} else {
				this.loadData()
			}
		},
		created () {
			this.getCateGory(0)
			this.getAllList()
		},
		methods: {
			async getAllList () {
				const data = await Api.apiCall('get', Api.goods.getProjectManagementApplyList, {pageSize: 1000});
				this.allReadyList = data && data.records || []
			},
			async loadData () {
				this.$loading()
				const data = await Api.apiCall('get', Api.goods.getProjectManagementApplyList, {});
				this.list = data && data.records || []
				if (this.list.length) {
					let item = JSON.parse(JSON.stringify(this.list[0])) || {}
					delete item.id
					Object.assign(this.infos, item)
					if (item.pic) {
						this.imgSrc = item.pic.split(',')
					}
				}
				this.$loading(false)
			},
			async save () {
				const {infos: {productName, product_id, product_quantity, phone, email}, imgSrc} = this
				if (!product_id) {
					this.$api.msg('請選擇法寶')
					return
				}
				if (!product_quantity) {
					this.$api.msg('請輸入件數')
					return
				}
				// if (phone && !regPhone.test(phone)) {
				// 	this.$api.msg('請輸入正確的手機號碼')
				// 	return
				// }
				// 由於有座機號和國際電話，先不做規則判斷，有填就行
				if (!phone) {
				 	this.$api.msg('請輸入正確的電話號碼')
				 	return
				 }
				if (email && !regEmail.test(email)) {
					this.$api.msg('請輸入正確的郵箱地址')
					return
				}
				let param = {
					...this.infos
				}
				if (this.id) {
					delete param.product_id
					delete param.status
				}
				if (!param.relig) {
					param.relig = 0
				}else{
					param.relig = 1
				}
				
				if (imgSrc.length) {
					param['pic'] = String(imgSrc)
				}
				if (!this.id) {
					param.productId = param.product_id
					param.productQuantity = param.product_quantity
					delete param.product_id
					delete param.product_quantity
					delete param.status
				}
				// 不要提交這些參數
				delete param.product_real_quantity
				delete param.product_used_quantity
				delete param.memberName
				delete param.member_id
				delete param.propic
				delete param.expire_flag
				
				if (!this.id) {
					let list = this.allReadyList || []
					let arr = []
					if (list.length) {
						arr = list.filter(r => r.product_id == product_id) || []
						if (arr.length) {
							this.$api.msg('選擇的法寶已申請，請重新選擇')
							return
						}
					}
				}
				let api =this.id ?  'updateApplyRecordInfo' : 'addApplyRecordInfo'
				const data = await  Api.apiCall('post', Api.goods[api], param);
				this.$api.msg('保存成功')
				setTimeout(() => {
					uni.navigateBack({delta: 1})
				}, 1000)
				return
			},
			showName () {
				this.$refs.popup.open('top')
			},
			reset (type = 1) {
				if (type == 1) {
					this.secondIndex = 0
					this.secondList = []
					this.secondListName = []
					this.thirdIndex = 0
					this.thirdList = []
					this.thirdListName = []
				}
				if (type == 2) {
					this.thirdIndex = 0
					this.thirdList = []
					this.thirdListName = []
				}
			},
			resets () {
				let {infos, id} = this
				if (id) {
					for (let k in infos) {
						if(k != id) {
							infos[k] = ''
						}
					}
					this.infos = {}
					this.infos = infos
					console.log(infos)
				} else {
					this.infos = {}
					this.infos = {
						id: 0,
						productName: '', // 法寶名稱
						product_id: '', // 法寶id
						product_quantity: '', // 件數
						org: '', // 禮請單位
						relig:'', // 是否宗教團體
						intro: '', // 單位簡介
						contact: '', // 聯絡人姓名
						phone: '', // 聯系人電話
						email: '', // 聯系人郵箱
						brief: '', // 備註
					}
				}
				this.imgSrc = []
				this.refres  = false
				setTimeout(() => {
					this.refres = true
				}, 30)
			},
			changeFirst (val) {
				this.firstIndex = val.detail.value
				const {firstList} = this
				this.reset(1)
				if (!this.firstIndex) return
				let id = this.firstIndex && firstList[this.firstIndex-1].id || ''
				this.getCateGory(id, 2)
			},
			changeSecond (val) {
				this.secondIndex = val.detail.value
				const {secondList} = this
				if (!this.secondIndex) return
				let id = secondList[this.secondIndex-1].id
				this.reset(2)
				this.getThree(id)
			},
			changeThird (val) {
				this.thirdIndex = val.detail.value
			},
			async getCateGory (parentId = 0, type = 1) {
				this.$loading()
				const data = await  Api.apiCall('get', Api.goods.getProductCategoryList, {parentId});
				if (type == 1) {
					this.firstList = data || []
					console.log(data)
					this.firstListName = this.firstList.map(r => r.name)
					this.firstListName.unshift('請選擇')
				}
				if (type == 2) {
					this.secondList = data || []
					this.secondListName = this.secondList.map(r => r.name)
					this.secondListName.unshift('請選擇')
				}
				this.$loading(false)
			},
			async getThree (id) {
				this.$loading()
				const data = await  Api.apiCall('get', Api.goods.getProductListBuyCategory, {id});
				this.thirdList = data || []
				this.thirdListName = this.thirdList.map(r => r.name)
				this.thirdListName.unshift('請選擇')
				this.$loading(false)
			},
			checkboxChange (e) {
				console.log(e)
			},
			// 確認選擇
			async confirmChoice () {
				const {thirdList, thirdIndex} = this
				if (!thirdIndex) {
					this.$api.msg('請選擇法寶')
					return
				}
				let item = thirdList[thirdIndex - 1] || {}
				let list = this.allReadyList || []
				let arr = []
				if (list.length) {
					arr = list.filter(r => r.product_id == item.id) || []
					if (arr.length) {
						this.$api.msg('選擇的法寶已申請，請重新選擇')
						return
					}
				}
				this.$set(this.infos, 'productName', item.name )
				this.$set(this.infos, 'product_id', item.id )
				this.$refs.popup.close()
			},
			upload () {
				uni.chooseImage({
					count: 1, //默認9
					sizeType: ['original', 'compressed'], //可以指定是原圖還是壓縮圖，默認二者都有
					sourceType: ['album'], //從相冊選擇
					success:  res => {
						console.log(res)
						console.log(JSON.stringify(res.tempFilePaths));
						let image = new Image()
						image.src= res.tempFilePaths[0]
						image.onload =  () => {
								// 默認按比例壓縮
								var w = image.width,
								  h = image.height,
								  scale = w / h;
								w = 600;
								h = w / scale;
								// 默認圖片質量為0.7，quality值越小，所繪製出的圖像越模糊
								var quality = 0.9;
								//生成canvas
								var canvas = document.createElement('canvas');
								var ctx = canvas.getContext('2d');
								// 創建屬性節點
								var anw = document.createAttribute("width");
								anw.nodeValue = w;
								var anh = document.createAttribute("height");
								anh.nodeValue = h;
								canvas.setAttributeNode(anw);
								canvas.setAttributeNode(anh);
								ctx.drawImage(image, 0, 0, w, h);
								var ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();//圖片格式
								var base64 = canvas.toDataURL("image/" + ext, quality);
								// 回調函數返回base64的值
								this.uploadbase64(base64)
							  }
					}
				});
			},
			async uploadbase64 (datas) {
				console.log(uni.getStorageSync('userInfos'))
				let userInfo = uni.getStorageSync('userInfos') || {}
				this.$loading()
				const data = await  Api.apiCall('post', Api.goods.uploadProductImg, {userId: userInfo.id, imgData: datas, headflag: '0'});
				this.$loading(false)
				let  {imgSrc} = this
				imgSrc.push(data)
				this.imgSrc = []
				this.imgSrc = imgSrc
			},
			// 刪除圖片
			deletes (i) {
				let {imgSrc} = this
				imgSrc.splice(i, 1)
				this.imgSrc = []
				this.imgSrc = imgSrc
			},
			async deleteDetail () {
				const result = await  Api.apiCall('get', Api.index.deletesZhuanan, {id:this.id})
				if (result) {
					this.$api.msg('刪除成功')
					setTimeout(() => {
						uni.navigateBack({
							url: '/pages/index/projectManagement'
						})
					}, 1000)
					
				}
			}
		}
	}
</script>

<style lang="scss">
	.projectManagementDetail {
		overflow:hidden;
		min-height: 100vh;
		width: 100%;
		background: #f3f3f3;
		padding: 20upx;
		.form {
			width: 100%;
			overflow:hidden;
			padding: 20upx;
			border-radius: 8px;
			background: #fff;
			margin-bottom: 40upx;
			.form-item {
				display:flex;
				align-items: center;
				min-height: 80upx;
				border-bottom: 1px solid #eee;
				view{
					color:#555;
				}
				&.special {
					align-items: initial;
					.label {
						position:relative;
						top: 10upx;
					}
					.cont {
						padding: 10upx 0 10px 10px;
					}
				}
				&:last-child {
					border-bottom: 0;
				}
				.label {
					display:inline-block;
					width: 200upx;
					text-align-last: justify;
				}
				.cont {
					width: calc(100% - 200upx);
					padding-left: 10upx;
					min-height: 80upx;
					display:flex;
					align-items: center;
					&.s {
						display:block;
						button {
							width: 300upx;
							display:inline-block;
						}
					}
					.img-list {
						display:inline-block;
						.img {
							width: 200upx;
							height: 200upx;
							display:flex;
							align-items: center;
							justify-content: center;
							float:left;
							margin-right: 10px;
							position:relative;
							image {
								max-width: 100%;
								max-height: 100%;
								background:#f3f3f3;
							}
							text {
								font-size: 40upx;
								position:absolute;
								right: 0upx;
								top: -20upx;
								color: #fff;
								background: rgba(0,0,0,.5);
								width: 40upx;
								height: 40upx;
								border-radius: 50%;
								text-align: center;
								line-height: 40upx;
							}
						}
					}
				}
			}
		}
	}
	.reset {
		margin-top: 20upx;
	}
	.choice-goods {
		overflow:hidden;
		width: 100%;
		padding: 20upx;
		background: #fff;
		.form-item {
			display:flex;
			align-items: center;
			height: 80upx;
			.lable {
				display:inline-block;
				width: 200upx;
				text-align-last: justify;
			}
			.cont {
				width: calc(100% - 200upx);
				padding-left: 10upx;
			}
		}
	}
</style>
