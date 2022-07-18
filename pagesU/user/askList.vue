<template>
	<view class="askList">
		<view class="decrease" v-html="infos.crowdfundingProtocol"></view>
		<view class="add-box">
			<button type="primary" class="add" @click="goAdd">新增</button>
		</view>
		<view class="apply-list">
			 <view class="apply-item" v-for="(item, i) in recordList" :key="i">
				 <div class="goods-info">
					   <view class="img-box">
						   <image :src="item.propic"></image>
					   </view>
					   <view class="detail">
						   <p class="name">
							   {{item.productName}}
						   </p>
						   <p>請求數量：{{item.product_quantity}}</p>
						   <p>實際批數量：{{item.product_real_quantity}}</p>
						   <p>{{item.update_at | dates}}</p>
					   </view>
				   </div>
				   <div class="other-info">
					    <div class="lft">
							{{statusName[item.status]}}
						</div>
						<div class="rgt">
							<button @click="editer(item)" v-if="item.status!= 1">修改</button>
							<button class="delete" @click="dates(item)">刪除</button>
						</div>
				   </div>
			 </view>
		</view>
	</view>
</template>

<script>
	import {get,set} from '../../config/db.js'
	import Api from '@/common/api';
	import {formatDate} from '@/common/date'
	export default {
		data() {
			return {
				infos: {},
				recordList: [],
				statusName: ['', '通過', '等待'],
				id:'',
				name: ''
			}
		},
		onLoad(e){
			if(e.id>0){
				this.id=e.id
				this.cid=e.cid
				this.name=e.name 
			}
			this.infos = get('sysInfo')  || {}
			this.getApplyList('')
		},
		methods: {
			async getApplyList (name) {
			  let data = await Api.apiCall('get', Api.goods.getProjectManagementApplyList, {name});
			  console.log(data)
			  this.recordList = data.records || []
			},
			async deleteRecord (item) {
			  let data = await Api.apiCall('get', Api.goods.deleteApplyRecordList, {id:item.id})
			  if (data.data) {
				this.$api.msg('刪除成功!');
			  }
			},
			goAdd () {
				uni.navigateTo({
					url: '/pagesU/user/addAsk?type=0&id='+this.id+'&productName='+this.name
				});
			},
			editer (item) {
				if (item.status == 1) {
					this.$api.msg('已處理不能再修改');
					return
				}
				set('editerRecords', item)
				uni.navigateTo({
					url: '/pagesU/user/addAsk?type=1&id='+this.id+'&productName='+this.name
				});
			}
		},
		filters: {
			dates (val) {
				return val && formatDate(new Date(val), 'Y-MM-dd hh:mm:ss') || ''
			}
		}
	}
</script>

<style scoped>
* {
	box-sizing:border-box;
}
.add-box {
	text-align: left;
	display:flex;
	margin-top: 10px;
}
.add {
	width: 100px;
	margin: 0;
}
.askList {
	overflow:hidden;
	padding: 10px;
	background: #f5f5f5;
}
.apply-list {
	overflow:hidden;
	margin-top: 20px;
}
.apply-item {
	overflow:hidden;
	margin-bottom: 10px;
	background: #fff;
	border-radius: 4px;
	padding: 10px;
}
.apply-item  .goods-info{
	width: 100%;
	display:flex;
	align-items: center;
	border-bottom: 1px solid #ddd;
}
.img-box {
	display:flex;
	width: 70px;
	height: 70px;
	overflow:hidden;
	align-items: center;
	justify-content: center;
}
.img-box  image{
	max-width: 100%;
	max-height: 100%;
}
.detail {
	width: 260px;
	padding-left: 10px;
}
p {
	font-size: 12px;
	color: #999;
	min-height: 20px;
	width: 100%;
	white-space: nowrap;
	overflow:hidden;
	text-overflow:ellipsis;
	margin-bottom: 4px;
}
p.name {
	font-size: 14px;
	color: #333;
}
.other-info {
	overflow:hidden;
	display:flex;
	justify-content: space-between;
	font-size: 10px;
	color: #666;
	align-items: center;
	height: 40px;
}
.rgt {
	display:flex;
}
.rgt button {
	width: 40px;
	background:#007AFF;
	color: #fff;
	padding: 0;
	outline: none;
	height: 30px;
	line-height: 30px;
	font-size: 12px;
	margin-left: 10px;
}
button.delete {
	background: #f00;
}
</style>
