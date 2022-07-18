<template>
	<view class="addAsk">
		 <view class="form">
			 <div class="form-item">
				  <text class="label">法寶</text>
				  <div class="cont">
					<input type="text" v-model.trim="form.productName" placeholder="請輸入法寶名稱" readonly="readonly">
				  </div>
			 </div>
			  <div class="form-item">
				  <text class="label">件數</text>
				  <div class="cont">
					<input type="text" v-model.trim="form.productQuantity" placeholder="請輸入件數">
				  </div>
			  </div>
			  <div class="form-item">
				  <text class="label">禮請單位</text>
				  <div class="cont">
					<input type="text" v-model.trim="form.org" placeholder="請輸入禮請單位">
				  </div>
			  </div>
			  <div class="form-item">
				  <text class="label">是否宗教團體</text>
				  <div class="cont">
					<checkbox-group v-model="form.relig"  @change="checkboxChange">
						<label>
							<checkbox  value="1" ></checkbox>
						</label>
					</checkbox-group>
				  </div>
			  </div>
			  <div class="form-item">
					  <text class="label">單位簡介</text>
					  <div class="cont">
						<input type="text" v-model.trim="form.intro" placeholder="請輸入單位簡介">
					  </div>
			  </div>
			  <div class="form-item">
				  <text class="label">聯絡人姓名</text>
				  <div class="cont">
					<input type="text" v-model.trim="form.contact" placeholder="請輸入聯絡人姓名">
				  </div>
			  </div>
			  <div class="form-item">
				  <text class="label">聯系電話</text>
				  <div class="cont">
					<input type="text" v-model.trim="form.phone" placeholder="請輸入聯系電話">
				  </div>
			  </div>
			  <div class="form-item">
				  <text class="label">聯系郵箱</text>
				  <div class="cont">
					<input type="text" v-model.trim="form.email" placeholder="請輸入聯系郵箱">
				  </div>
			  </div>
			  <div class="form-item">
				  <text class="label">備註</text>
				  <div class="cont">
					<textarea  v-model.trim="form.brief" placeholder="請輸入備註"/>
				  </div>
			  </div>
			  <view class="control">
				  <div class="cont">
					<button type="primary" @click="save">保存</button>
				  </div>
			  </view>
		 </view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import {get} from '../../config/db.js'
	export default {
		data () {
			return {
				form: {
					productQuantity: '10',
					org: '',
					intro: '',
					contact: '',
					phone: '',
					email: '',
					brief: '',// 備註
					relig: '0', // 是否宗教團體
					productId: '',
					pic: '',
					id: 0,
					productName: ''
				},
				type: 0
			}
		},
		onLoad(e){
			console.log(e)
			this.type = e.type || 0
			this.form.productId = e.id || ''
			this.form.productName = e.productName
			console.log(get('editerRecords'))
			if (this.type) {
				this.form = Object.assign(this.form, get('editerRecords'))
			}
		},
		methods: {
			async save () {
				const {type} = this
				let api = type == 0 ? 'addApplyRecordInfo' : 'updateApplyRecordInfo'
				let param = {
					...this.form
				}
				param.relig = param.relig
				let data = await Api.apiCall('post', Api.goods[api], param)
				this.$api.msg('保存成功!');
			},
			checkboxChange (e) {
				let arr = e.detail.value || []
				let status = arr.length == 0 ? '0' : '1'
				this.form.relig = status
			}
		}
	}
</script>

<style lang="less">
	.addAsk {
		overflow:hidden;
		background: #f5f5f5;
		.form {
			width: 100%;
			overflow:hidden;
			background: #fff;
			padding: 10px;
			.form-item {
				width: 100%;
				display:flex;
				align-items: center;
				min-height: 40px;
				border-bottom: 1px solid #ddd;
				padding: 5px 0;
				&:last-child {
					border-bottom: 0;
				}
				.label {
					font-size: 12px;
					color: #333;
					display:inline-block;
					width: 100px;
					text-align-last: justify;
				}
				.cont {
					padding-left: 10px;
					flex: 1;
					input {
						border: 1px solid #ddd;
						width: 100%;
						height: 30px;
						border-radius: 2px;
						padding-left: 10px;
						font-size: 12px;
						color: #999;
					}
					textarea {
						border: 1px solid #ddd;
						border-radius: 2px;
						height: 100px;
						width: 100%;
						padding-left: 10px;
						color: #999;
						&::-webkit-input-placeholder {
							color: #aaa;
						}
					}
				}
			}
		}
	}
</style>
