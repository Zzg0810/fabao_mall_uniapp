<template>
  <div class="total-wrap">
    <div class="logistics-title">物流跟蹤</div>
    <trackNode  v-for="(item, index) in tracesData" :key="index" :is-first="index===tracesData.length-1" :is-newest="index===0" :is-main-node="item.isMainNode" :node-data="item"></trackNode>
  </div>
</template>

<script>
import trackNode from '@/components/trackNode'
import Api from '@/common/api';
export default {
  data () {
    return {
      tracesData: [

      ]
    }
  },
  components: {
    trackNode
  },
  async onLoad(options) {
	  let params = { orderId: options.order_id };
	   const tracesDatas = await Api.apiCall('get', Api.order.logisticbyapi, params);
	   this.tracesData=tracesDatas.Traces || []
  },
  created () {

  }
}
</script>

<style lang="scss" scoped>
.total-wrap {
  width: 100vw;
  height: auto;
  box-sizing: border-box;
  padding: 20rpx 40rpx 20rpx;
  .logistics-title {
    height: 72rpx;
    box-sizing: border-box;
    padding: 36rpx 0 8rpx;
    line-height: 28rpx;
    color: #4B4B4B;
    font-size: 26rpx;
    font-family: 'PingFangSC-Medium';
    text-align: left;
  }
}
</style>
