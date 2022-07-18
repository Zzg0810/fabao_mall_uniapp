import * as db from './db.js' //引入common
import store from './../store'
//把obj對象裏的值覆蓋到newobj裏面
function deepCopy(newobj, obj) {
  if (typeof obj != 'object') {
    return obj
  }
  for (var attr in obj) {
    var a = {}
    if (newobj[attr]) {
      a = newobj[attr]
    }
    newobj[attr] = deepCopy(a, obj[attr])
  }
  return newobj
}

//跳轉到登陸頁面
function jumpToLogin(method) {
  var now_time = Date.parse(new Date())
  var value = db.get('jump_to_login')
  if (!value) {
    value = 0
  }
  if (now_time - value > 3000) {
    //db.set('jump_to_login',now_time); //暫時屏蔽登錄時間查詢
    // 將當前頁面route存vuex中 登錄註冊後跳轉
    let pages = getCurrentPages()
    let page = pages[pages.length - 1]
    // 獲取頁面參數信息
    let pagePath = ''
    // #ifdef H5 || MP-WEIXIN || APP-PLUS	 || APP-PLUS-NVUE
    if (page.route.indexOf('pages/goods/index/index') !== -1) {
		//法寶詳情頁
		if(page.goodsId) {
			pagePath = '/' + page.route + '?id=' + page.goodsId;
		}else{
			pagePath = '/pages/index/index';
		}
    }
	if (page.route.indexOf('pages/goods/index/group') !== -1) {
		//團購秒殺詳情頁
		if(page.goodsId && page.groupId) {
			pagePath = '/' + page.route + '?id=' + page.goodsId + '&group_id' + page.groupId;
		}else{
			pagePath = '/pages/index/index';
		}
	}
    // #endif

    // #ifdef MP-ALIPAY
    if (page.__proto__.route.indexOf('pages/goods/index/index') !== -1)
	{
		//法寶詳情頁
		if(page.rootVM.goodsId) {
			pagePath = '/' + page.__proto__.route + '?id=' + page.rootVM.goodsId;
		}else{
			pagePath = '/pages/index/index';
		}
    }
	if (page.__proto__.route.indexOf('pages/goods/index/group') !== -1) {
		//團購秒殺詳情頁
		if(page.rootVM.goodsId && page.rootVM.groupId) {
			pagePath = '/' + page.__proto__.route + '?id=' + page.rootVM.goodsId + '&group_id' + page.rootVM.groupId;
		}else{
			pagePath = '/pages/index/index';
		}
	}
    // #endif
	if(pagePath){
		store.commit({
			type: 'redirect',
			page: pagePath
		})
	}
    uni.showToast({
      title: '請先登錄!',
      icon: 'none',
      duration: 1000,
      success: function(res) {
        // #ifdef H5 || APP-PLUS
        setTimeout(() => {
			uni.hideToast();
			uni.navigateTo({
				url: '/pages/public/index1'
			})
        }, 1000)
        // #endif
        // #ifdef MP-WEIXIN || MP-ALIPAY
        setTimeout(() => {
			uni.hideToast();
			uni.navigateTo({
				url: '/pages/public/choose/index',
				animationType: 'pop-in',
				animationDuration: 200
			})
        }, 500)
        // #endif
      }
    })
  }
}

//當出錯的時候，顯示錯誤信息，並且跳轉 棄用
/* function errorToBack(msg = '出錯了，請重試',delta=1){
  uni.showToast({
    title: msg,
    icon: 'none',
    duration: 2000,
  });
  if(delta > 0){
    setTimeout(function () {
      uni.navigateBack({
        delta: delta
      })
    }, 1000);
  }
} */
//操作成功後，的提示信息
function successToShow(msg = '保存成功', callback = function() {}) {
  uni.showToast({
    title: msg,
    icon: 'success',
    duration: 1000
  })
  setTimeout(function() {
    callback()
  }, 500)
}

//操作失敗的提示信息
function errorToShow(msg = '操作失敗', callback = function() {}) {
  uni.showToast({
    title: msg,
    icon: 'none',
    duration: 1500
  })
  setTimeout(function() {
    callback()
  }, 1500)
}

//加載顯示
function loadToShow(msg = '加載中') {
  uni.showToast({
    title: msg,
    icon: 'loading'
  })
}

//加載隱藏
function loadToHide() {
  uni.hideToast()
}

// 提示框
function modelShow(
  title = '提示',
  content = '確認執行此操作嗎?',
  callback = () => {},
  showCancel = true,
  cancelText = '取消',
  confirmText = '確定'
) {
  uni.showModal({
    title: title,
    content: content,
    showCancel: showCancel,
    cancelText: cancelText,
    confirmText: confirmText,
    cancelText: cancelText,
    success: function(res) {
      if (res.confirm) {
        // 用戶點擊確定操作
        setTimeout(() => {
          callback()
        }, 500)
      } else if (res.cancel) {
        // 用戶取消操作
      }
    }
  })
}

//時間戳轉時間格式
function timeToDate(date, flag = false) {
  var date = new Date(date * 1000) //如果date為13位不需要乘1000
  var Y = date.getFullYear() + '-'
  var M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  if(flag)
  {
	  return Y + M + D
  }
  else
  {
	  return Y + M + D + h + m + s
  }
}

function time2date(micro_second) {
  var time = {}
  // 總秒數
  var second = Math.floor(micro_second)
  // 天數
  time.day = PrefixInteger(Math.floor(second / 3600 / 24), 2)
  // 小時
  time.hour = PrefixInteger(Math.floor((second / 3600) % 24), 2)
  // 分鐘
  time.minute = PrefixInteger(Math.floor((second / 60) % 60), 2)
  // 秒
  time.second = PrefixInteger(Math.floor(second % 60), 2)

  var newtime = ''
  if (time.day > 0) {
    newtime =
      time.day +
      '天' +
      time.hour +
      '小時' +
      time.minute +
      '分' +
      time.second +
      '秒'
  } else {
    if (time.hour != 0) {
      newtime = time.hour + '小時' + time.minute + '分' + time.second + '秒'
    } else {
      newtime = time.minute + '分' + time.second + '秒'
    }
  }
  return newtime
}

function timeToDateObj(micro_second) {
  var time = {}
  // 總秒數
  var second = Math.floor(micro_second)
  // 天數
  time.day = Math.floor(second / 3600 / 24)
  // 小時
  time.hour = Math.floor((second / 3600) % 24)
  // 分鐘
  time.minute = Math.floor((second / 60) % 60)
  // 秒
  time.second = Math.floor(second % 60)

  return time

}

//貨幣格式化
function formatMoney(number, places, symbol, thousand, decimal) {
  number = number || 0
  places = !isNaN((places = Math.abs(places))) ? places : 2
  symbol = symbol !== undefined ? symbol : '￥'
  thousand = thousand || ','
  decimal = decimal || '.'
  var negative = number < 0 ? '-' : '',
    i = parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + '',
    j = (j = i.length) > 3 ? j % 3 : 0
  return (
    symbol +
    negative +
    (j ? i.substr(0, j) + thousand : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
    (places
      ? decimal +
        Math.abs(number - i)
          .toFixed(places)
          .slice(2)
      : '')
  )
}
function throttle(fn, context, delay) {
  clearTimeout(fn.timeoutId)
  fn.timeoutId = setTimeout(function() {
    fn.call(context)
  }, delay)
}

// 時間格式化輸出，如11:03 25:19 每1s都會調用一次
function dateformat(micro_second) {
  var time = {}
  // 總秒數
  var second = Math.floor(micro_second / 1000) // 天數
  time.day = PrefixInteger(Math.floor(second / 3600 / 24), 2) // 小時
  time.hour = PrefixInteger(Math.floor((second / 3600) % 24), 2) // 分鐘
  time.minute = PrefixInteger(Math.floor((second / 60) % 60), 2) // 秒
  time.second = PrefixInteger(Math.floor(second % 60), 2)
  return time
}

//不足位數前面補0
function PrefixInteger(num, length) {
  return (Array(length).join('0') + num).slice(-length)
}

//驗證是否是手機號
function isPhoneNumber(str) {
  var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  if (!myreg.test(str)) {
    return false
  } else {
    return true
  }
}

/**
 *
 * 對象參數轉為url參數
 *
 */
function builderUrlParams(url, data) {
  if (typeof url == 'undefined' || url == null || url == '') {
    return ''
  }
  if (typeof data == 'undefined' || data == null || typeof data != 'object') {
    return ''
  }
  url += url.indexOf('?') != -1 ? '' : '?'
  for (var k in data) {
    url += (url.indexOf('=') != -1 ? '&' : '') + k + '=' + encodeURI(data[k])
  }
  return url
}

/**
 * 使用循環的方式判斷一個元素是否存在於一個數組中
 * @param {Object} arr 數組
 * @param {Object} value 元素值
 */
function isInArray(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true
    }
  }
  return false
}
/**
 * 統一跳轉
 */
function navigateTo(url) {
  uni.navigateTo({
    url: url,
    animationType: 'pop-in',
    animationDuration: 300
  })
}

/**
 *  關閉當前頁面並跳轉
 */
function redirectTo(url) {
  uni.redirectTo({
    url: url,
    animationType: 'pop-in',
    animationDuration: 300
  })
}

/**
 * 獲取url參數
 *
 * @param {*} name
 * @param {*} [url=window.location.serach]
 * @returns
 */
function getQueryString(name, url) {
  var url = url || window.location.href
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    return r[2]
  }
  return null
}

/**
 *
 *  判斷是否在微信瀏覽器 true是
 */
function isWeiXinBrowser() {
  // #ifdef H5
  // window.navigator.userAgent屬性包含了瀏覽器類型、版本、操作系統類型、瀏覽器引擎類型等信息，這個屬性可以用來判斷瀏覽器類型
  let ua = window.navigator.userAgent.toLowerCase()
  // 通過正則表達式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
  // #endif

  return false
}

/**
 * 金額相加
 * @param {Object} value1
 * @param {Object} value2
 */
function moneySum(value1,value2){
	return (parseFloat(value1)+parseFloat(value2)).toFixed(2);
}
/**
 * 金額相減
 * @param {Object} value1
 * @param {Object} value2
 */
function moneySub(value1,value2){
	let res = (parseFloat(value1)-parseFloat(value2)).toFixed(2);
	return res>0?res:0;
}


/**
 * 分享URL解壓縮
 * @param {Object} url
 */
function shareParameterEncode(url){
	let urlArray = url.split('-');
    let newUrl = 'type=' + urlArray[0] + '&invite=' + urlArray[1] + '&id=' + urlArray[2] + '&team_id=' + urlArray[3] + '&id_type=' + urlArray[4] + '&page_code=' + urlArray[5] + '&group_id=' + urlArray[6];
    return newUrl;
}


/**
 * 分享URL壓縮
 * @param {Object} url
 */
function shareParameterDecode(url){
	var urlArray = url.split('&');
	var allParameter = {
		'type': '',
		'invite': '',
		'id': '',
		'team_id': '',
		'id_type': '',
		'page_code': '',
		'group_id': '',
	};
	for(var i = 0; i < urlArray.length; i++) {
		var parameter = urlArray[i].split('=');
		allParameter[parameter[0]] = parameter[1];
	}
	var newUrl = allParameter.type + '-' + allParameter.invite + '-' + allParameter.id + '-' + allParameter.team_id + '-' + allParameter.id_type + '-' + allParameter.page_code + '-' + allParameter.group_id;
	return newUrl;
}
const unit = 'as'
export {
  deepCopy,
  jumpToLogin,
  timeToDate,
  formatMoney,
  /* errorToBack, */
  successToShow,
  throttle,
  errorToShow,
  time2date,
  isPhoneNumber,
  isInArray,
  loadToShow,
  loadToHide,
  navigateTo,
  redirectTo,
  modelShow,
  builderUrlParams,
  isWeiXinBrowser,
  dateformat,
  getQueryString,
  timeToDateObj,
  moneySum,
  moneySub,
  shareParameterEncode,
  shareParameterDecode,
  unit
}
