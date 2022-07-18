<template>
  <view class="content">
    <view class="login-t">
      <image class="login-logo" :src="logoImage" mode="aspectFill"></image>
    </view>
    <view class="login-m">
      <view class="login-item">
        <input type="number" v-model="mobile" :maxlength="maxMobile" placeholder="請輸入手機號碼" focus placeholder-class="login-item-i-p" />
      </view>
      <view class="login-item flc">
        <input class="login-item-input" placeholder-class="login-item-i-p" type="text" v-model="code" placeholder="請輸入驗證碼" />
        <view :class="sendCodeBtn" @click="sendCode" v-if="verification">發送驗證碼</view>
        <view class="btn btn-g" v-if="!verification">{{ timer }} 秒後重新獲取</view>
      </view>

    </view>
    <view class="login-b">
      <!-- #ifdef H5|APP-PLUS|APP-PLUS-NVUE -->
      <view v-if="user_wx_id">
        <button :class="regButtonClass" @click="toBind()" hover-class="btn-hover">登錄</button>
      </view>
      <view v-else>
        <button :class="regButtonClass" @click="login()" hover-class="btn-hover">登錄</button>
        <view class="login-other flc">
          <view class="fz12 item" @click="selectLoginType">
            密碼登錄
          </view>
          <view class="fz12 item" @click="toReg">
            註冊
          </view>
        </view>
      </view>
      <!-- #endif -->
      <!-- #ifdef MP -->
      <button :class="regButtonClass" @click="showTopTips()" hover-class="btn-hover">登錄</button>
      <!-- #endif -->

    </view>
<mallplusCopyright></mallplusCopyright>
  </view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
import Api from '@/common/api';
import store from '@/store/index';
import { goBack, jumpBackPage } from '@/config/mixins.js'
export default {
components: {
		mallplusCopyright
	},
  mixins: [goBack,jumpBackPage],
  data() {
    return {
      maxMobile: 11,
      mobile: '', // 用戶手機號
      code: '', // 短信驗證碼
      user_wx_id: '', //授權id
      verification: true, // 通過v-show控製顯示獲取還是倒計時
      timer: 60, // 定義初始時間為60s
      btnb: 'btn btn-square btn-c btn-all', //按鈕背景
      type: '', // 有值是第三方登錄賬號綁定
      isWeixinBrowser: this.$common.isWeiXinBrowser()
    }
  },
  onLoad(option) {
    if (option.user_wx_id) {
      this.user_wx_id = option.user_wx_id
      uni.setNavigationBarTitle({
        title: '綁定手機號'
      })
    }


    // H5第三方授權登錄綁定
    // if (option.type && option.type === 'bind') {
    // 	this.type = option.type
    // 	uni.setNavigationBarTitle({
    // 		title: '綁定手機號'
    // 	})
    // }
  },
  computed: {
    // 驗證手機號
    rightMobile() {
      let res = {}
      if (!this.mobile) {
        res.status = false
        res.msg = '請輸入手機號'
      } else if (!/^1[123456789]{1}\d{9}$/gi.test(this.mobile)) {
        res.status = false
        res.msg = '手機號格式不正確'
      } else {
        res.status = true
      }
      return res
    },
    // 動態計算發送驗證碼按鈕樣式
    sendCodeBtn() {
      let btn = 'btn btn-g'
      if (this.mobile.length === this.maxMobile && this.rightMobile.status) {
        return btn + ' btn-b'
      } else {
        return btn
      }
    },
    // 動態更改登錄按鈕bg
    regButtonClass() {
      return this.mobile && this.mobile.length === this.maxMobile && this.code
        ? this.btnb + ' btn-b'
        : this.btnb
    },
    logoImage() {
      return '/static/missing-face.png'
    }
  },
  onShow() {
    let _this = this
    let userToken = _this.$db.get('userToken')
    if (userToken) {
      uni.switchTab({
        url: '/pages/member/index/index'
      })
      return true
    }
    _this.timer = parseInt(_this.$db.get('timer'))
    if (_this.timer != null && _this.timer > 0) {
      _this.countDown()
      _this.verification = false
    }
  },
  methods: {
    // 發送短信驗證碼
    sendCode() {
      if (!this.rightMobile.status) {
        this.$common.errorToShow(this.rightMobile.msg)
      } else {
        this.$common.loadToShow('發送中...')
        setTimeout(() => {
          this.$common.loadToHide()
          this.$api.sms({ mobile: this.mobile, code: 'login' }, res => {
            if (res.status) {
              this.timer = 60
              this.verification = false
              this.$common.successToShow(res.msg)
              this.countDown() // 執行驗證碼計時
              // this.btnb = 'btn btn-square btn-all btn-b';
            } else {
              this.$common.errorToShow(res.msg)
            }
          })
        }, 1000)
      }
    },
    // 去註冊
    toReg() {
      this.$common.navigateTo('/pages/login/register/index')
    },
    // 驗證碼倒計時
    countDown() {
      let auth_timer = setInterval(() => {
        // 定時器設置每秒遞減
        this.timer-- // 遞減時間
        uni.setStorage({
          key: 'timer',
          data: this.timer,
          success: function() {}
        })
        if (this.timer <= 0) {
          this.verification = true // 60s時間結束還原v-show狀態並清除定時器
          clearInterval(auth_timer)
        }
      }, 1000)
    },
    // 登錄
    login() {
      var _this = this
      if (!_this.rightMobile.status) {
        _this.$common.errorToShow(_this.rightMobile.msg)
      } else {
        // 短信驗證碼登錄
        if (!_this.code) {
          _this.$common.errorToShow('請輸入短信驗證碼!')
        } else {
          let data = {
            mobile: _this.mobile,
            code: _this.code
          }

          let invicode = _uni.getStorageSync('invitecode')
          if (invicode) {
            data.invitecode = invicode
          }

          _this.$api.smsLogin(data, res => {
            if (res.status) {
              uni.setStorageSync('userToken', res.data)
              _this.redirectHandler()
            } else {
              _this.$common.errorToShow(res.msg)
            }
          })
        }
      }
    },
    // 重定向跳轉 或者返回上一個頁面
    redirectHandler() {
      this.$common.successToShow('登錄成功!', () => {
        uni.setStorageSync('timer', 0)
        this.$db.del('invitecode')
        this.handleBack()
      })
    },
    // 跳轉到普通登錄
    toLogin() {
      uni.navigateTo({
        url: '../../login/login/index'
      })
    },
    //提交按鈕
    showTopTips: function() {
      let _this = this
      if (_this.mobile == '') {
        _this.$common.errorToShow('請輸入手機號碼')
        return false
      }
      if (this.code == '') {
        _this.$common.errorToShow('請輸入驗證碼')
        return false
      }
      if (_this.user_wx_id == 0) {
        _this.$common.errorToShow('登錄失敗，請稍後再試', function() {
          uni.navigateBack({
            delta: 1
          })
        })
        return false
      }
      var platform = 2
      //1就是h5登陸（h5端和微信公眾號端），2就是微信小程序登陸，3是支付寶小程序，4是app，5是pc
      // #ifdef MP-ALIPAY
      platform = 3
      // #endif
      // #ifdef APP-PLUS||APP-PLUS-NVUE
      platform = 4
      // #endif
      var data = {
        mobile: _this.mobile,
        code: _this.code,
        platform: platform, //平臺id，標識是小程序登陸的
        user_wx_id: _this.user_wx_id //微信小程序接口存不了session，所以要綁定的id只能傳到前臺
      }
      //有推薦碼的話，帶上
      var invitecode = _uni.getStorageSync('invitecode')
      if (invitecode) {
        data.invitecode = invitecode
      }
      _this.$api.smsLogin(data, function(res) {
        if (res.status) {
          _uni.setStorageSync('userToken', res.data)
          _this.redirectHandler()
        } else {
          //報錯了
          _this.$common.errorToShow(res.msg)
        }
      })
    },
    // 公眾號第三方登錄賬號綁定
    toBind() {
      if (this.mobile == '') {
        this.$common.errorToShow('請輸入手機號碼')
        return false
      }
      if (this.code == '') {
        this.$common.errorToShow('請輸入驗證碼')
        return false
      }

      let data = {
        mobile: this.mobile,
        code: this.code,
        user_wx_id:this.user_wx_id
      }

      // 獲取邀請碼
      let invicode = uni.getStorageSync('invitecode')
      if (invicode) {
        data.invitecode = invicode
      }

      this.$api.smsLogin(data, res => {
        if (res.status) {
          uni.setStorageSync('userToken', res.data)
          this.redirectHandler()
        } else {
          this.$common.errorToShow(res.msg)
        }
      })
    },
    // 切換登錄方式
    selectLoginType() {
      this.$common.redirectTo('./index1')
    }
  }
}
</script>

<style lang="scss">
.content {
  /*  #ifdef  H5  */
  height: calc(100vh - 90upx);
  /*  #endif  */
  /*  #ifndef  H5  */
  height: 100vh;
  /*  #endif  */
  background-color: #fff;

  padding: 0upx 100upx;
}
.login-t {
  text-align: center;
  padding: 50upx 0;
}
.login-logo {
  width: 180upx;
  height: 180upx;
  border-radius: 20upx;
  background-color: #f8f8f8;
  /* margin: 0 auto; */
}
.login-m {
  margin-bottom: 100upx;
}
.login-item {
  border-bottom: 2upx solid #d0d0d0;
  overflow: hidden;
  padding: 10upx;
  color: #333;
  margin-bottom: 30upx;
}
.login-item-input {
  display: inline-block;
  flex: 1;
  box-sizing: border-box;
}
.login-item .btn {
  border: none;
  width: 40%;
  text-align: right;
  padding: 0;
  &.btn-b {
    background: none;
    color: #333 !important;
  }
}
.login-b .btn {
  color: #999;
}
.btn-b {
  color: #fff !important;
}
.login-other {
  margin-bottom: 40upx;
  .item {
    padding: 20upx 0;
  }
}
.btn-square {
  height: 80upx;
  line-height: 80upx;
}
</style>
