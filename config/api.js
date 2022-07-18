
import Api from '@/common/api';
import {getDb} from './db.js'
// 需要登陸的，都寫到這裏，否則就是不需要登陸的接口
const methodsToken = [
	'user.info',
	'user.editinfo',
	'user.changeavatar',
	'user.logout',
	'user.addgoodsbrowsing',
	'user.delgoodsbrowsing',
	'user.goodsbrowsing',
	'user.goodscollection',
	'user.goodscollectionlist',
	'user.vuesaveusership',
	'user.saveusership',
	'user.getshipdetail',
	'user.setdefship',
	'user.editship',
	'user.removeship',
	'user.getusership',
	'user.pay',
	'user.orderevaluate',
	'user.getuserdefaultship',
	'user.issign',
	'user.sign',
	'user.mypoint',
	'user.userpointlog',
	'user.getbankcardlist',
	'user.getdefaultbankcard',
	'user.addbankcard',
	'user.removebankcard',
	'user.setdefaultbankcard',
	'user.getbankcardinfo',
	'user.editpwd',
	'user.forgotpwd',
	'user.recommend',
	'user.balancelist',
	'user.sharecode',
	'user.cash',
	'user.cashlist',
	'user.myinvite',
	'user.activationinvite',
	'coupon.getcoupon',
	'coupon.usercoupon',
	'cart.add',
	'cart.del',
	'cart.getlist',
	'cart.setnums',
	'cart.getnumber',
	'order.cancel',
	'order.del',
	'order.details',
	'order.confirm',
	'order.getlist',
	'order.create',
	'order.getship',
	'order.getorderlist',
	'order.getorderstatusnum',
	'order.aftersaleslist',
	'order.aftersalesinfo',
	'order.aftersalesstatus',
	'order.addaftersales',
	'order.sendreship',
	'order.iscomment',
	'payments.getinfo',
	'user.getuserpoint',
	'coupon.getcouponkey',
	'store.isclerk',
	'store.storeladinglist',
	'store.ladinginfo',
	'store.lading',
	'store.ladingdel',
	'distribution_center-api-info',
	'distribution_center-api-applydistribution',
	'distribution_center-api-setstore',
	'distribution_center-api-myorder',
	'pintuan.pintuanteam',
	'lottery-api-getLotteryConfig',
	'lottery-api-lottery',
	'lottery-api-lotteryLog'
];





const get = (url, callback) => {
	uni.showLoading({
		title: '加載中'
	});
	uni.request({
		url: url,
		header: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded', //自定義請求頭信息
		},
		method: 'GET',
		success: (response) => {
			uni.hideLoading();
			callback(response.data);
		},
		fail: (error) => {
			uni.hideLoading();
			if (error && error.response) {
				showError(error.response);
			}
		},
		complete: () => {
			setTimeout(function() {
				uni.hideLoading();
			}, 250);
		}
	});
}

const showError = error => {
	let errorMsg = ''
	switch (error.status) {
		case 400:
			errorMsg = '請求參數錯誤'
			break
		case 401:
			errorMsg = '未授權，請登錄'
			break
		case 403:
			errorMsg = '跨域拒絕訪問'
			break
		case 404:
			errorMsg = `請求地址出錯: ${error.config.url}`
			break
		case 408:
			errorMsg = '請求超時'
			break
		case 500:
			errorMsg = '服務器內部錯誤'
			break
		case 501:
			errorMsg = '服務未實現'
			break
		case 502:
			errorMsg = '網關錯誤'
			break
		case 503:
			errorMsg = '服務不可用'
			break
		case 504:
			errorMsg = '網關超時'
			break
		case 505:
			errorMsg = 'HTTP版本不受支持'
			break
		default:
			errorMsg = error.msg
			break
	}

	uni.showToast({
		title: errorMsg,
		icon: 'none',
		duration: 1000,
		complete: function() {
			setTimeout(function() {
				uni.hideToast();
			}, 1000);
		}
	});
}
export const uplodHeader = (userId, callback = null) => {
	uni.chooseImage({
		success: (chooseImageRes) => {
			console.log(chooseImageRes)
			 let imgFile = new FileReader();
			 const data = chooseImageRes.tempFiles && chooseImageRes.tempFiles[0]
			 const userInfo = getDb('userInfos')
			 imgFile.readAsDataURL(data);
			 imgFile.onload = res => {
			      console.log(res);
				  toUp(res.target.result)
			  }; 
			const toUp = (imgData) => {
				uni.showLoading({
					title: '上傳中...'
				});
				const uploadTask = uni.uploadFile({
					url:  Api.BASEURI +'single/home/v2/uploadHead', //僅為示例，非真實的接口地址
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					formData: {
						userId:userInfo.id || '',
						token: getDb('token'),
						headflag: 1,
						imgData
					},
					success: (uploadFileRes) => {
						callback && callback(JSON.parse(uploadFileRes.data));
						uni.hideLoading()
					},
					fail: (error) => {
						if (error && error.response) {
							showError(error.response);
						}
						uni.hideLoading()
					},
					complete: () => {
						setTimeout(function() {
							uni.hideLoading();
						}, 250);
					}
				});
			}
			
						uploadTask.onProgressUpdate((res) => {
			            console.log('上傳進度' + res.progress);
			            console.log('已經上傳的數據長度' + res.totalBytesSent);
			            console.log('預期需要上傳的數據總長度' + res.totalBytesExpectedToSend);
			
			            // 測試條件，取消上傳任務。
			            if (res.progress > 50) {
			                uploadTask.abort();
			            }
								});
		}
	});
}

// 文件上傳
export const uploadFiles = (callback) => {
	uni.chooseImage({
		success: (chooseImageRes) => {
			uni.showLoading({
				title: '上傳中...'
			});
			const tempFilePaths = chooseImageRes.tempFilePaths;
			const uploadTask = uni.uploadFile({
				url:  Api.BASEURI +'single/home/upload', //僅為示例，非真實的接口地址
				filePath: tempFilePaths[0],
				fileType: 'image',
				name: 'file',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data',
				},
				formData: {
					'method': 'images.upload',
					'upfile': tempFilePaths[0]
				},
				success: (uploadFileRes) => {
					callback(JSON.parse(uploadFileRes.data));
					uni.hideLoading()
				},
				fail: (error) => {
					if (error && error.response) {
						showError(error.response);
					}
					uni.hideLoading()
				},
				complete: () => {
					setTimeout(function() {
						uni.hideLoading();
					}, 250);
				}
			});
						   uploadTask.onProgressUpdate((res) => {
			            console.log('上傳進度' + res.progress);
			            console.log('已經上傳的數據長度' + res.totalBytesSent);
			            console.log('預期需要上傳的數據總長度' + res.totalBytesExpectedToSend);
			
			            // 測試條件，取消上傳任務。
			            if (res.progress > 50) {
			                uploadTask.abort();
			            }
								});
		}
	});
}



