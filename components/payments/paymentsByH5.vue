<template>
	<view class="pay-type-list">

		<view class="type-item b-b" v-for="item in payments" :key="item.id" @click="toPayHandler(item.code)"
			  v-if="!(type == 2 && item.code == 'balancepay')">
			<text v-if=" item.code == 'wechatpay'" class="icon yticon icon-weixinzhifu"></text>
			<text v-if=" item.code == 'alipay'" class="icon yticon icon-alipay"></text>
			<text v-if=" item.code == 'offline'" class="icon yticon icon-weixinzhifu"></text>
			<text v-if=" item.code == 'union'" class="icon yticon icon-weixinzhifu"></text>
			<text v-if=" item.code == 'balancepay'" class="icon yticon icon-erjiye-yucunkuan"></text>
			<view class="con">
				<text class="tit">{{ item.name }}</text>
			</view>
		</view>
	</view>
	<!--<view class='cell-group payment-method'>
		<view class='cell-item add-title-item' v-for="item in payments" :key="item.code" @click="toPayHandler(item.code)"
		 v-if="!(type == 2 && item.code == 'balancepay')">
			<view class='cell-item-hd'>
				<image class='cell-hd-icon' :src='item.icon'></image>
			</view>
			<view class='cell-item-bd'>
				<view class="cell-bd-view">
					<text class="cell-bd-text">{{ item.name }}</text>
				</view>
				<view class="cell-bd-view">
					<text class="cell-bd-text address">{{ item.memo }}</text>
				</view>
			</view>
			<view class='cell-item-ft'>
				<image class='cell-ft-next icon' src='../../../static/image/right.png'></image>
			</view>
		</view>
	</view>-->
</template>

<script>

	import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
import Api from '@/common/api';
	export default {
		props: {
			// 如果是法宝订单此参数必须
			orderId: {
				type: String,
				default () {
					return ''
				}
			},
			// 如果是充值订单此参数必须
			recharge: {
				type: Number,
				default () {
					return 0
				}
			},
			// 用户id
			uid: {
				type: Number,
				default () {
					return 0
				}
			},
			// 订单类型
			type: {
				type: Number,
				default () {
					return 1
				}
			}
		},
		data() {
			return {
				payments: [],
				openid: ''
			}
		},
		mounted() {
			this.getPayments()
		},
		methods: {
			// 获取可用支付方式列表
			async	getPayments() {
				let params = {};
				this.orderInfo = await Api.apiCall('get',Api.order.paymentlist,params);
				this.payments = this.formatPayments(this.orderInfo)
			},
			// 支付方式处理
			formatPayments(payments) {
				// h5支付并且是在微信浏览器内 过滤支付宝支付
				if (this.$common.isWeiXinBrowser()) {
					payments = payments.filter(item => item.code !== 'alipay')
					payments = payments.filter(item => item.code !== 'wechatapppay')
                    payments = payments.filter(item => item.code !== 'wechatappletpay')
				}
                payments = payments.filter(item => item.code !== 'wechatapppay')
                payments = payments.filter(item => item.code !== 'wechatappletpay')
				// 如果是充值订单 过滤余额支付 过滤非线上支付方式
				if (this.type === 2) {
					payments = payments.filter(
						item => item.code !== 'balancepay' || item.is_online === 1
					)
				}

				// 设置logo图片
				payments.forEach(item => {
					this.$set(item, 'icon', '/static/image/' + item.code + '.png')
				})
				console.log(payments)
				return payments
			},
			checkWXJSBridge(data) {
				let that = this
				let interval = setInterval(() => {
					if (typeof window.WeixinJSBridge != 'undefined') {
						clearTimeout(interval)
						that.onBridgeReady(data)
					}
				}, 200)
			},
			onBridgeReady(data) {
				var _this = this
				let orderId =0;
				window.WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						appId: data.appId, // 公众号名称，由商户传入
						timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
						nonceStr: data.nonceStr, // 随机串
						package: data.package,
						signType: data.signType, // 微信签名方式：
						paySign: data.paySign // 微信签名
					},
					function(res) {
						if (res.err_msg === 'get_brand_wcpay_request:ok') {
							_this.$common.successToShow('支付成功')

						} else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
							_this.$common.errorToShow('取消支付')
						} else {
							_this.$common.errorToShow('支付失败')
						}

						setTimeout(() => {
							_this.$common.redirectTo(
								'/pages/order/payment/result?id='+ data.orderId
							)
						}, 1000)
					}
				)
			},
			// 用户点击支付方式处理
			async toPayHandler(code) {
				let params = {'orderId':this.orderId};
				let data = {
					payment_code: code,
					payment_type: this.type
				}

				switch (code) {
					case 'alipay':

						let res = await Api.apiCall('get',Api.order.aliWapPay,params);
						console.log('============================')
						console.log(res);

						if (res) {
                            let divDom = document.createElement('div')
                            divDom.innerHTML = res;
                            document.body.appendChild(divDom)

							let testForm = document.getElementsByName('punchout_form')
							testForm[0].dispatchEvent(new Event('submit'))
							testForm[0].submit()
							document.body.removeChild(testForm[0])

						}
						break
					case 'wechatpay':

						/**
						 * 微信支付有两种
						 * 判断是否在微信浏览器
						 * 	微信jsapi支付
						 */
						let isWeiXin = this.$common.isWeiXinBrowser()

						if (isWeiXin) {



							let res = await Api.apiCall('get',Api.order.webPay,params);
							console.log(res);
							if (res) {
								this.checkWXJSBridge(res)
							}else{
									window.location.href = res.msg
									return;
							}
						} else {
							// 微信 H5支付

							console.log(data);
							// 微信h5支付
							let res = await Api.apiCall('get',Api.order.wapPay,params);
							console.log(res);
							if (res) {

								if (res) {
									location.href = res
								} else {
									this.$common.errorToShow(res)
								}
							}
						}
						break
					case 'balancepay':
						/**
						 *  用户余额支付
						 *
						 */
						if ((this.type == 5 || this.type == 6) && this.recharge) {
							data['params'] = {
								orderId: this.orderId
							}
						}
						let params1 = {'orderId':this.orderId};
						let data1 = await Api.apiCall('post',Api.order.balancePay,params1);
						console.log(data1)
						if (data1) {
							uni.redirectTo({
								url: '/pages/order/payment/result?id='+ this.orderId
							})
						}else {
							this.$api.msg(data1.data);
						}

						break
					case 'offline':
						/**
						 * 线下支付
						 */
						this.$common.modelShow(
							'线下支付说明',
							'请联系客服进行线下支付qq:951449465',
							() => {},
							false,
							'取消',
							'确定'
						)
						break
				}
			}
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
			&:before{
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}

		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>
