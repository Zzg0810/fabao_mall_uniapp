import store from '../store/index';

const ipList = [
	// #ifdef H5
	[
		//正式环境，看mainifest.json
		'/onlinefront/api/',//正式的前台 api
		'/onlineadmin/adminapi/',//正式的后台 api
		'/onlineesuri/'//ESURI
	],

	[
		//测试环境
		'/sapi/api/',//front api
		'/sadmin/adminapi/',//admin api
		'/sesuri/'//ESURI
	],
	
	[
		//其它 正式环境，
		'http://fabaomallapi.yyii.info:6811/api/',//正式的前台 api
		'http://fabaomallapi.yyii.info:6885/adminapi/',//正式的后台 api
		'/onlineesuri/'//ESURI
		
	],
	[
		'/api/',
		'/onlineadmin/adminapi/',//正式的后台 api
		'/onlineesuri/'//ESURI
	]
	
	// #endif
	//#ifdef APP-PLUS  ||  APP-NVUE
	[
		//正式环境，
		'/onlinefront',//factory api
		'/onlineadmin',//factory ESURI
		'/onlineesuri'//ESURI
	],
	[
		//测试环境
		'/news/',//front api
		'/sadmin',//admin api
		'/sesuri'//ESURI
	]
	// #endif
]
// 在这里切换 i=0时，是正式环境api, i=1时，是本地api,
var i=0; 
var dev=true 
// #ifdef H5

if(location.host.indexOf('m.fabaomall.yyii.info')>=0 ){
	i=0
	dev=false
}else if(location.host.indexOf('m.fabaomall.amtbhk.com')>=0){
	i=0
	dev=false
}else if(location.host.indexOf('test2.fabaomall.amtbhk.com')>=0){
	i=2
	dev=false
}else{
	i=i
	dev=true
}
// #endif

//#ifdef APP-PLUS  ||  APP-NVUE
    i=0
	dev=true
// #endif
export default {
	DEV:dev,
    BASEURI: ipList[i][0],//'http://127.0.0.1:8711/api/',
	ADMINURI: ipList[i][1],//'http://127.0.0.1:8785/adminapi/', //  商户端接口域名
	ESURI: ipList[i][2],//'http://192.168.1.169:8081/', //
	h5Appid: 'wx7a3e78f36464b170', // h5微信登录的appId  暂时测试用
	qqMapKey:'MVGBZ-R2U3U-W5CVY-2PQID-AT4VZ-PDF35',
	source: 2, //1 weixinApplet 2 h5Source 3 pcSource 4 android 5ios
	selfStoreId: 1,// 自营店铺编号，可以首页展示自营店铺的数据 轮播图，商品等等
	es: {
		simpleSearchList: 'esProduct/search/simple', //简单搜索
		search: 'esProduct/search', //综合搜索、筛选、排序
	},
	/**
	 * 接口名称
	 */
	index: {
		sysInfo: 'single/home/sysInfo',
		submitLocaltion: 'single/home/submitLocaltion',
		getAppletOpenId: 'applet/getAppletOpenId', // 获取openId
		getWxPhone: 'applet/getWxPhone', // 获取手机号
		logout: 'single/home/logout',
		appletLogin_by_weixin: 'applet/login_by_weixin1', // 登录(手机号:phone 密码:password)
		login: 'single/home/login', // 登录(手机号:phone 密码:password)
		appLogin: 'single/home/appLogin',
		simpleReg: 'single/home/simpleReg', // 登录(手机号:phone 密码:password)
		home: 'single/home/content', //首页展示
		home1: 'single/home/content1', //首页展示
		homeFlashPromotionList: 'single/home/homeFlashPromotionList', // 秒杀列表
		bannerList: 'single/home/bannerList', // 首页banner
		updatePassword: 'single/home/updatePassword', // 修改密码
		loginByCode: 'single/home/loginByCode', // 手机和验证码登录
		reg: 'single/home/reg', // 注册
		sendCodes: 'single/home/sms/codes', // 获取验证码
		acceptCoupon: 'single/sms/add', // 获取优惠券
		listMemberCoupon: 'single/sms/listMemberCoupon', // 优惠券列表
		couponList: 'single/home/couponList', //  优惠券
		selectNotRecive: 'single/home/selectNotRecive', //  可领取的优惠券
		userInfo: 'single/home/userInfo', //  用户信息
		userSampleInfo: 'single/home/userSampleInfo', //  用户信息
		groupActivityDetail: 'single/sms/group.activity.getdetial', // 查询团购详情信息
		groupActivityList: 'single/sms/groupActivityList', // 查询商品团购列表
		logs: 'single/home/logs', //  记录日志
		diyDetail: 'single/sms/diyDetail',
		homeNewProduct: 'single/sms/homeNewProduct/list', //首页新品推荐列表
		homeBrand: 'single/sms/homeBrand/list', //首页品牌推荐列表
		homeRecommendProduct: 'single/sms/homeRecommendProduct/list', //首页人气推荐列表
		homeRecommendSubject: 'single/sms/homeRecommendSubject/list', //首页专题推荐列表
		getAllGoods:'single/pms/goods/list', // 商品列表
		nearShopList: 'single/store/dis/shopList', //附近门店
		nearStoreList: 'single/store/dis/storeList', // 附近商户
		shoplist: 'single/store/shoplist', //查询门店管理
		shopDetail: 'single/store/shopDetail', // 门店详情
		storeClassList: 'single/store/storeClass/list', // 商户内部分类
		storeCommentList: 'single/store/storeComment/list', // 商户评论
        noticeList: 'single/home/notice/list',
        noticeDetail: 'single/home/notice/detail',
        videoList: 'single/sms/video/list', //列表
		preSaleList: 'single/sms/preSale/list', //预售活动列表
		preSaleDetail: 'single/sms/preSale/detail', //预售活动详情
		samplePreSale: 'single/sms/samplePreSale/detail', //预售活动详情
		queryliveplayerroomlist: 'single/sms/queryliveplayerroomlist', //直播列表
		coutryList:'single/home/listcountry',  // 国家列表
		deletesZhuanan: 'fabao/query/delete', // 删除专案

	},
	member: {
		getFenxiaoMemberTotal: 'single/user/getFenxiaoMemberTotal', // 用户分销统计
		applyMember: 'single/user/applyMember', // 会员升级等级
		memberLevelList: 'single/user/memberLevel/list', // 查询会员等级列表
		getInviteData: 'single/user/getInviteData',
		inviteUser: 'single/user/inviteUser',
		inviteMoney: 'single/user/inviteMoney',
		toBlance: 'single/user/toBlance',
		currentMember: 'single/user/currentMember',
		updateMember: 'single/user/updateMember',
		resetPassword: 'single/user/resetPassword',
		schoolList: 'single/user/school/list', // 查询学校列表
		schoolDetail: 'single/user/schoolDetail', // 查询拼团商品详情信息
		getAreaByPid: 'single/user/getAreaByPid', // 根据pid查询区域
		bindSchool: 'single/user/bindSchool', // 会员绑定学校
		bindArea: 'single/user/bindArea', // 会员绑定区域
		applyStore: 'single/store/applyStore', // 商户入驻
		storeDetail: 'single/store/detail', // 商户详情
		storeDetail1: 'single/store/detail1', // 商户详情 带用户
		store: 'single/store/home', // 商户主页
		storeList: 'single/store/store/list', // 商户列表
        memberTagList: 'single/user/memberTag/list', // 商户列表
        addStoreComment: 'single/store/addStoreComment', // 商户addStoreComment
        memberBlanceLogList:  'single/user/memberBlanceLog/list',
        integrationlist:  'single/user/integrationlist',
	},
	build: {
		getBuildNoticeByPage: 'single/build/getBuildNoticeByPage', // 所有社区和房间
		getBuildWuyeCompanyByPage: 'single/build/getBuildWuyeCompanyByPage', // 所有社区和房间
		groupList: 'single/build/groupList', // 所有社区和房间
		communityList: 'single/build/communityList', // 所有社区和房间
		nearCommunityList: 'single/build/near/communityList', // 周边社区
		floorList: 'single/build/floorList', // 所有社区和房间
		allCommunity: 'single/build/allCommunity', // 所有社区和房间
		bindCommunity: 'single/build/bindCommunity', // 绑定小区和房间
		home: 'single/build/home', // 首页内容页信息展示
		applyCommunity: 'single/build/applyCommunity', // 社区入驻

	},
	goods: {
	    getposter: 'single/pms/getposter', // 生成商品海报
	    tagGoodsList: 'single/pms/tag/goods', // 查询标签商品
		goodsPromoto: 'single/sms/detail', // 单个商品的优惠详情
		secskillDetail: 'single/pms/secskill/detail', // 查询秒杀商品详情信息
		groupGoodsDetail: 'single/pms/goodsGroup/detail', // 查询拼团商品详情信息
		listWithChildren: 'single/pms/list/withChildren',
		groupHotGoodsList: 'single/pms/groupHotGoods/list', // 查询生效拼团商品列表
		giftDetail: 'single/pms/gift/detail', // 查询商品详情信息
		giftList: 'single/pms/gift/list', // 查询商品列表
		paiMaiDetail: 'single/pms/paimai/detail', // 查询商品详情信息
		updatePaiMai: 'single/pms/updatePaiMai', // 参与竞价
		typeGiftList: 'single/pms/typeGiftList', //查询商品类型下的商品列表
		addView: 'single/pms/addView', // 查询商品详情信息
		viewList: 'single/pms/viewList', // 查询商品列表

		goodsDetail: 'single/pms/goods/detail', // 查询商品详情信息
		goodsList: 'single/pms/goods/list', // 查询商品列表
		productAttrCategoryList: 'single/pms/productAttrCategory/list', // 查询商品属性分类列表
		categoryList: 'single/pms/productCategory/list', // 查询商品分类列表
		createGoods: 'single/pms/createGoods', //创建商品
		brandList: 'single/pms/brand/list', // 根据条件查询所有品牌表列表
		consultList: 'single/pms/consult/list', // 取某个商品的评价
		categoryAndGoodsList: 'single/pms/categoryAndGoodsList/list', // 查询商品属性分类列表和商品
		typeGoodsList: 'single/pms/typeGoodsList', //查询商品类型下的商品列表
		typeGoodsList1: 'single/pms/typeGoodsList1', //查询商品类型下的商品列表
		areaGoodsList: 'single/pms/areaGoodsList', //查询商品类型下的商品列表
		typeList: 'single/pms/typeList', //查询商品类型下的商品列表

		getGoodsTypes: 'single/pms/getGoodsTypes', // 查询分类

		recommendBrand: 'single/pms/recommendBrand/list', // 查询首页推荐品牌
		newProductList: 'single/pms/newProductList/list', //查询首页新品
		hotProductList: 'single/pms/hotProductList/list', // 查询热销商品
		listCollect: 'collection/listCollect', // 显示关注列表
		deleteCollect: 'collection/delete', // 删除收藏中的某个商品
		favoriteSave: 'collection/favoriteSave', // 添加/商品收藏
		listAddress: 'address/list', // 显示所有收货地址
		deleteAddress: 'address/delete', // 删除
		addressSave: 'address/save', // 添加
		setDefaultAddress: 'address/address-set-default', // 设为默认地址
		getItemDefautl: 'address/getItemDefautl', // 显示默认收货地址
		getAddressType: 'address/addresstype', // 获取收货地类型 ( yi add )
		getLimit: 'single/home/goodsLimit',  // 获取 法宝限请数  ( yi add )
		getProjectManagementApplyList: 'fabao/query/list', // 获取专案办理，申请列表
		deleteApplyRecordList: 'fabao/query/delete', // 删除专案办理申请记录
		updateApplyRecordInfo: 'fabao/query/update', // 更新 专案办理 记录
		addApplyRecordInfo: 'fabao/query/create', // 新增 专案办理 记录
		getProductCategoryList: 'single/home/categorylist', // 获取法宝分类列表
		getProductListBuyCategory: 'single/pms/goods/Droplist', // 获取法宝列表通过分类获取
		uploadProductImg: 'single/home/uploadHead', // 上传图片  
		uploadHead: 'single/home/uploadHead', // 上传頭像图片 
		getPickupAdressList: 'single/oms/pickupList', // 获取自提点列表
	},
	order: {
		getRefundReason: 'single/oms/order/getRefundReason', // 查询售后原因
		orderItemList: 'single/oms/orderItemList', // 商品购买记录
		saveOmsOrderReturnApply: 'single/oms/saveOmsOrderReturnApply', // 添加售后
		aftersaleslist: 'single/oms/order/aftersaleslist', // 查询售后列表
		aftersalesinfo: 'single/oms/order/aftersalesinfo', // 查询售后详情
		addGroup: 'single/oms/addGroup', // 发起拼团
		acceptGroup: 'single/oms/acceptGroup', // 提交拼团
		sampleOrderList: 'single/oms/sampleOrderList', // 查询订单列表
		orderList: 'single/oms/order/list', // 查询订单列表
		orderDetail: 'single/oms/detail', // 查询订单列表
		preGroupActivityOrder: 'single/oms/preGroupActivityOrder', // 预览订单团购
		submitJifenPreview: 'single/oms/submitJifenPreview', // 预览积分订单
		preOrder: 'single/oms/submitPreview', // 预览订单
		bookOrder: 'single/oms/generateOrder', //  生成订单
		submitStorePreview: 'single/oms/submitStorePreview', // 预览订单
		generateStoreOrder: 'single/oms/generateStoreOrder', //  生成订单
		cancelOrder: 'single/oms/cancelOrder', // 取消订单
		closeOrder: 'single/oms/closeOrder', // 关闭订单
		deleteOrder: 'single/oms/deleteOrder', // 删除订单
		confirmDelivery: 'single/oms/confirmDelivery', //确认收货
		applyRefund: 'single/oms/applyRefund', // 申请退款
		logisticbyapi: 'single/oms/logisticbyapi', // 查看物流
		express: 'single/oms/express', //  查看阿里物流
		orderevaluate: 'single/oms/orderevaluate', //订单评价
		addCart: 'cart/addCart', // 添加商品到购物车
		cartList: 'cart/list', // 获取某个会员的购物车列表
		promotionCartList: 'cart/list/promotion', // 获取某个会员的购物车列表,包括促销信息
		updateQuantity: 'cart/update/quantity', //修改购物车中某个商品的数量
		deleteCart: 'cart/delete', // 删除购物车中的某个商品
		clearCart: 'cart/clear', // 清空购物车

		paymentlist: 'pay/paymentlist', // 查询订单列表

		jifenPay: 'pay/jifenPay', // 积分兑换
		balancePay: 'pay/balancePay', // 余额支付
		weixinAppletPay: 'pay/weixinAppletPay', // 微信小程序支付
		//支付宝
		aliAppPay: 'aliPay/appPay', // 支付宝app支付
		aliWapPay: 'aliPay/wapPay', // 支付宝支付
		wapPayNoSdk: 'aliPay/wapPayNoSdk', // 支付宝支付
		pcPay: 'aliPay/pcPay', // 支付宝支付
		aliPay: 'aliPay/tradePay', // 支付宝支付 String authCode,  String scene
		aliPrecreatePay: 'aliPay/tradePrecreatePay', // 支付宝扫码支付
		aliRefund: 'aliPay/tradePrecreatePay', // 支付宝退款
		//微信
		wapPay: 'wxPay/wapPay', //微信H5 支付 注意：必须再web页面中发起支付且域名已添加到开发配置中
		webPay: 'wxPay/webPay', //公众号支付
		scanCode1: 'wxPay/scanCode1', //扫码支付模式一 已测试
		scanCode2: 'wxPay/scanCode2', //扫码支付模式二 已测试
		appPay: 'wxPay/appPay', //微信APP支付
		micropay: 'wxPay/micropay', //微信刷卡支付
		miniAppPay: 'wxPay/miniAppPay', //微信小程序支付
		refund: 'wxPay/refund', //微信退款 String transactionId,String outTradeNo
		authCodeToOpenid: 'wxPay/authCodeToOpenid', //openId，采用 网页授权获取 access_token API：SnsAccessTokenApi获取

		//银联支付
		frontConsume: 'unionPay/frontConsume', //PC网关支付 B2C跟B2B查询区别就在于bizType的不同
		frontConsume2: 'unionPay/frontConsume2', //B2B的网关支付 B2C跟B2B查询区别就在于bizType的不同
		wapConsume: 'unionPay/wapConsume', //WAP支付 请在手机paymentlist端访问此action
		appConsume: 'unionPay/appConsume', //APP支付获取tn
		frontrefund: 'unionPay/refund', //

		//京东
		jdappPay: 'JDPay/appPay', //App 支付
		saveOrder: 'JDPay/saveOrder', //String payType PC H5 支付
		customerPay: 'JDPay/customerPay', //商户二维码支付
		fkmPay: 'JDPay/fkmPay', //刷卡支付 String token, String amount
		jdrefund: 'JDPay/refund', //微信APP支付
		
		getFreightprice: 'address/getweightfee', // 获取选择地址后的运费

	},
	cms: {
		subjectList: 'single/cms/subject/list', //  查询文章列表
		subjectCategoryList: 'single/cms/subjectCategory/list', //  查询文章分类列表
		subjectCommentList: 'single/cms/subjectComment/list', //  查询文章评论列表
		recommendSubjectList: 'single/cms/recommendSubjectList/list', //查询首页推荐文章
		topicList: 'single/cms/topic/list', //  查询专题列表
		topicDetail: 'single/cms/topic/detail', // 专题详情
		subjectDetail: 'single/cms/subject/detail', // 文章详情
		createSubject: 'single/cms/createSubject', // 创建文章
		helpList: 'single/cms/help/list', //  查询帮助文档列表
		helpDetail: 'single/cms/help/detail', // 帮助文档详情
		helpCategoryList: 'single/cms/helpCategory/list', //  查询帮助文档分类列表
        helpCategoryDetail: 'single/cms/helpCategory/detail', // 帮助文档分类详情
		getProvinceList: 'single/home/listprovince', // 获取省列表
		getCityList: 'single/home/listcity', // 获取市列表
		getAreaList: 'single/home/listregion', // 获取区列表
	},
	/**
	商户端后台接口
	**/
	admin: {

		login: 'sys/sysUser/login', // 登录(手机号:phone 密码:password)
		orderStatic: 'home/orderStatic', // 订单统计
		goodsStatic: 'home/goodsStatic', // 商品统计
		userStatic: 'home/userStatic', //会员统计
		orderDayStatic: 'home/orderDayStatic', //订单日统计
		dayStatic: 'home/dayStatic', //订单日统计

		bannerList: 'sms/SmsHomeAdvertise/list', // 首页banner
		memberList: 'ums/UmsMember/list', // 查询学校列表
		storeDetail: 'sys/SysStore/storeDetail', // 查询拼团商品详情信息
		schoolList: 'single/user/school/list', // 查询学校列表
		schoolDetail: 'single/user/schoolDetail', // 查询拼团商品详情信息
		getAreaByPid: 'single/user/getAreaByPid', // 根据pid查询区域
		bindSchool: 'single/user/bindSchool', // 会员绑定学校
		bindArea: 'single/user/bindArea', // 会员绑定区域
		goodsDetail: 'single/pms/goods/detail', // 查询商品详情信息
		goodsList: 'pms/PmsProduct/goods/list', // 查询商品列表
		updatePublishStatus: 'pms/PmsProduct/publishStatus',
		updateReComStatus: 'pms/PmsProduct/updateReComStatus',
		delivery: 'oms/OmsOrder/delivery', // 订单发货
		orderList: 'oms/OmsOrder/order/list', // 查询订单列表
		orderDetail: 'single/oms/detail', // 查询订单列表
		subjectList: 'single/cms/subject/list', //  查询文章列表
	},
	/**
	 * 封装请求（async await 封装uni.request） 对应portal 项目
	 * method	   post/get
	 * endpoint    接口方法名
	 * data		   所需传递参数
	 * load		   是否需要loading
	 */
	async apiCall(method, endpoint, data, load) {
		if (load) {
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
		}
		let isChina = uni.getStorageSync('isChina')
		let needAddKey = [
		'single/pms/goods/list', 
		'single/sms/homeNewProduct/list', 
		'single/sms/homeRecommendProduct/list', 
		'single/sms/homeRecommendSubject/list', 
		'single/pms/goods/Droplist', 
		'single/home/bannerList']
		if (needAddKey.includes(endpoint)) {
			data.deliveryId = isChina == 1? 1 : 2
		}
		let token = uni.getStorageSync('token') || '';
		let fullurl = this.BASEURI + endpoint;
		var contentType = 'application/x-www-form-urlencoded';
		//data.authorization = token;
		let [error, res] = await uni.request({
			url: fullurl,
			data: data,
			method: method,
			header: {
				'content-type': contentType,
				 Authorization: token
			},
		});
		if (load) {
			uni.hideLoading();
		}
		// console.log('api.js________')
		// console.log("res___",res)
	
		if (undefined == res || 'undefined' == res || res.statusCode!=200) {
			console.log('res.statusCode='+(res && res.statusCode || ''));
			uni.showToast({
				title: res &&res.data && res.data.message,
				icon: 'none'
			});
			return false;
		}
		if (res.data.msg == 'User token expired!') {
			//console.log('User token expired');
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			uni.navigateTo({
				url: `/pages/public/login`
			})
			return false;
		}
		//console.log(res.data);
		if (res.data.msg == '请先登录' || res.data.code == 100|| (res.data.data && res.data.data.code == 100)) {
			//console.log(res.data);
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});

			uni.navigateTo({
				url: `/pages/public/login`
			})
			return false;
		}

		if (res.data.code == 200) {
			return res.data.data;
		} else {

			if (res.data) {
				if (!(res.data && res.data.msg)) {
					res.data.msg = res.data.data;
				}
				uni.showToast({
					title: res.data && res.data.msg,
					icon: 'none'
				});
				if(res.data.msg=='操作失败')
				console.log('操作失败'+fullurl)
				
				this.$api.msg(res.data && res.data.msg || '系统异常');
			}

		}
	},
	/**
	 * 封装请求（async await 封装uni.request） 对应admin 项目
	 * method	   post/get
	 * endpoint    接口方法名
	 * data		   所需传递参数
	 * load		   是否需要loading
	 */
	async apiAdminCall(method, endpoint, data, load) {
		if (load) {
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
		}

		let token = uni.getStorageSync('adminToken') || '';
		let fullurl = this.ADMINURI + endpoint;
		console.log(fullurl)
		
		var contentType = 'application/json';

		data.Authorization = token;
		//console.log(endpoint);
		let [error, res] = await uni.request({
			url: fullurl,
			data: data,
			method: method,
			header: {
				//'Content-Type': 'application/x-www-form-urlencoded',
				'content-type': contentType,
				// 'authorization1': Authorization || ''
			},
		});
		if (load) {
			uni.hideLoading();
		}


		if (undefined == res || 'undefined' == res) {

			uni.navigateTo({
				url: `/pages/index/index`
			})
		}
		if (res.data.msg == 'User token expired!') {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			uni.navigateTo({
				url: `/pages/public/login`
			})
		}
		if (res.data.msg == '请先登录' || res.data.code == 100) {
			//console.log("100=" + res.data);
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			uni.navigateTo({
				url: `/pagesC/seller/login`
			})
		}

		if (res.data.code == 200) {
			//console.log(res.data.data);
			return res.data.data;
		} else {
			//console.log(res.data);
			if (res.data && res.data.msg) {

				uni.showToast({
					title: res.data.msg,
					icon: 'none'
				});
				this.$api.msg(res.data.msg);
			}

		}
	},
	/**
	 * 封装请求（async await 封装uni.request）  对应search 项目
	 * method	   post/get
	 * endpoint    接口方法名
	 * data		   所需传递参数
	 * load		   是否需要loading
	 */
	async apiEsCall(method, endpoint, data, load) {
		if (!load) {
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
		}

		let fullurl = this.ESURI + endpoint;
		//let fullurl = 'http://localhost:8085/api/' + endpoint;
		let Authorization = `${store.state.userInfo.tokenHead}${store.state.userInfo.token}`;
		let [error, res] = await uni.request({
			url: fullurl,
			data: data,
			method: method,
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				// 'content-type': 'application/json',
				'Authorization': Authorization || ''
			},
		});
		//console.log(error);
		if (!load) {
			uni.hideLoading();
		}
		return res;

	},

}
