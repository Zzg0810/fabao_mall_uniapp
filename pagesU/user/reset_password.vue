<template>
	<view>
		<!-- <form @submit="formSubmit"> -->
			<view class="section">
				<input name="account"   v-model="password" password="true"  maxlength="32"  placeholder="請新輸入密碼" placeholder-style="font-size:15px" class="password"/>
				<view class="eyesBox">
					<image src="http://rs.eonfox.cc/clzy/static/eyes.png" class="eyes"></image>
				</view>
			</view>
			<view class="section">
				<input name="password"  password="true" v-model="confirm_password"  maxlength="32"  placeholder="請確認密碼" placeholder-style="font-size:26upx" class="password"/>
				<view class="eyesBox" >
					<image src="http://rs.eonfox.cc/clzy/static/eyes.png" mode="" class="eyes"></image>
				</view>
			</view>
			<view class="remind">
				<text class="remindText">密碼長度8~24位,必須包含數字/字母/符號至少2種以上元素</text>
			</view>
			<view class="btn-area" >
				<button formType="submit" @click="formSubmit()" class="buttons" >確認提交</button>
			</view>
		<!-- </form> -->
	</view>
</template>

<script>
	import eonfox from '@/components/eonfox/eonfox.js';
	import fns from '@/components/eonfox/fns.js';
	var ef = new eonfox();
export default {
	data() {
		return {
			phone:'',
			code:'',
			password:'',
			confirm_password:'',
		};
	},
	onLoad(e) {
		this.phone=e.phone;
		this.code=e.code;
		console.log("電話號碼",this.phone);
		console.log("驗證碼",this.code);
	},
	methods: {
		formSubmit:function(){
			var _this = this;
			ef.submit({
				request: {
					s: ['USERRESETPASSWORD',[{phone:_this.phone,password:_this.password,confirm_password:_this.confirm_password,phone_verify_key:"reset_password",phone_verify_code:_this.code,log_out:true}]	
					]
				},
				callback: function(data) {
					if (fns.checkError(data,'s',function(errno,error){
						_this.getverifSwitch=false;
						uni.showToast({
							title:error,
							icon:'none'
						})
					})) {
						uni.showToast({
							title:'密碼修改成功',
							icon:'success',
							success() {
								setTimeout(function(){
									uni.reLaunch({
										url:
											'../../pagesA/login/login' 
									})
								},1000)
							}
						})
						
					} 
					console.log(data)
				},
				error: function(err) {
					console.log('出錯啦', err);
					uni.showToast({
						title:JSON.stringify(err),
						icon:'none'
					})
				}
			});
		}
	}
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
	.section
		width 90%
		// height 80upx
		margin 20upx auto
		padding 18upx 0
		background #F2F2F2
		border-radius 10upx
		position relative
		top 5px
		.eyesBox
			position absolute
			right 10upx
			top 5upx
			height 100%
			width 60upx
			.eyes
				width 40upx
				height 40upx
				position absolute
				right 10upx
				top 25upx
	.remind
		width 90%
		height 80upx
		margin 20upx auto
		font-size 26upx
		color #A9A9A9
		.remindText
			height 80upx
			line-height 80upx
	.btn-area
		width 90%
		margin 10upx auto
		.buttons
			color #fff
			background #F76968
</style>
