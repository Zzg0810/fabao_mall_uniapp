<template>
	<view class="content">
		<view class="search-box">
			<!-- mSearch組件 如果使用原樣式，刪除組件元素-->
			<!-- 
			<mSearch class="mSearch-input-box" :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)" @input="inputChange" @confirm="doSearch(false)" v-model="keyword"></mSearch>
			 -->
			<!-- 原樣式 如果使用原樣式，恢復下方註銷代碼 -->
			<view class="input-box">
				<input type="text" :placeholder="defaultKeyword" @input="inputChange" v-model="keyword" @confirm="doSearch(false)"
				 placeholder-class="placeholder-class" confirm-type="search">
			</view>
			<view class="search-btn" @tap="doSearch(false)">搜索</view>
			
			<!-- 原樣式 end -->
			<!-- <uni-search-bar @confirm="search" @input="input" ></uni-search-bar> -->
		</view>
		<view class="search-keyword" @touchstart="blur">
			<scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
				<view class="keyword-entry" hover-class="keyword-entry-tap" v-for="row in keywordList" :key="row.keyword">
					<view class="keyword-text" @tap="doSearch(row.keyword)">
						<rich-text :nodes="row.htmlStr"></rich-text>
					</view>
					<view class="keyword-img" @tap="setkeyword(row)">
						<image src="/static/HM-search/back.png"></image>
					</view>
				</view>
			</scroll-view>
			<scroll-view class="keyword-box" v-show="!isShowKeywordList" scroll-y>
				<!-- 歷史搜索暫無法刪除，先隱藏 -->
				<!-- <view class="keyword-block" v-if="oldKeywordList.length>0">
					<view class="keyword-list-header">
						<view>歷史搜索</view>
						<view>
							<image @tap="oldDelete" src="/static/HM-search/delete.png"></image>
						</view>
					</view>
					<view class="keyword">
						<view v-for="(keyword,index) in oldKeywordList" @tap="doSearch(keyword)" :key="index">{{keyword}}</view>
					</view>
				</view> -->
				<!-- <view class="keyword-block">
					<view class="keyword-list-header">
						<view>熱門搜索</view>
						<view>
							<image @tap="hotToggle" :src="'/static/HM-search/attention'+forbid+'.png'"></image>
						</view>
					</view>
					<view class="keyword" v-if="forbid==''">
						<view v-for="(keyword,index) in hotKeywordList" @tap="doSearch(keyword)" :key="index">{{keyword}}</view>
					</view>
					<view class="hide-hot-tis" v-else>
						<view>當前搜熱門搜索已隱藏</view>
					</view>
				</view> -->
			</scroll-view>
		</view>
	</view>
</template>

<script>
	//引用mSearch組件，如不需要刪除即可
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
	export default {
		data() {
			return {
				defaultKeyword: "",
				keyword: "",
				oldKeywordList: [],
				hotKeywordList: [],
				keywordList: [],
				forbid: '',
				isShowKeywordList: false
			}
		},
		onLoad() {
			this.init();
		},
		components: {
			//引用mSearch組件，如不需要刪除即可
			mSearch
		},
		methods: {
			search (val) {
				console.log(val)
			},
			input () {},
			init() {
				this.loadDefaultKeyword();
				this.loadOldKeyword();
				// this.loadHotKeyword();

			},
			blur(){
				uni.hideKeyboard()
			},
			//加載默認搜索關鍵字
			loadDefaultKeyword() {
				//定義默認搜索關鍵字，可以自己實現ajax請求數據再賦值,用戶未輸入時，以水印方式顯示在輸入框，直接不輸入內容搜索會搜索默認關鍵字
				this.defaultKeyword = "請輸入法寶名稱或編號";
			},
			//加載歷史搜索,自動讀取本地Storage
			loadOldKeyword() {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
			},
			//加載熱門搜索
			loadHotKeyword() {
				//定義熱門搜索關鍵字，可以自己實現ajax請求數據再賦值
				this.hotKeywordList = ['阿彌陀經', '無量壽經'];
			},
			//監聽輸入
			inputChange(event) {
				//兼容引入組件時傳入參數情況
				var keyword = event.detail?event.detail.value:event;
				// if (!keyword) {
				// 	this.keywordList = [];
				// 	this.isShowKeywordList = false;
				// 	return;
				// }
				// this.isShowKeywordList = true;
				// //以下示例截取淘寶的關鍵字，請替換成你的接口
				// uni.request({
				// 	url: 'https://suggest.taobao.com/sug?code=utf-8&q=' + keyword, //僅為示例
				// 	success: (res) => {
				// 		this.keywordList = this.drawCorrelativeKeyword(res.data.result, keyword);
				// 	}
				// });
			},
			//高亮關鍵字
			drawCorrelativeKeyword(keywords, keyword) {
				var len = keywords.length,
					keywordArr = [];
				for (var i = 0; i < len; i++) {
					var row = keywords[i];
					//定義高亮#9f9f9f
					var html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + "</span>");
					html = '<div>' + html + '</div>';
					var tmpObj = {
						keyword: row[0],
						htmlStr: html
					};
					keywordArr.push(tmpObj)
				}
				return keywordArr;
			},
			//頂置關鍵字
			setkeyword(data) {
				this.keyword = data.keyword;
			},
			//清除歷史搜索
			oldDelete() {
				uni.showModal({
					content: '確定清除歷史搜索記錄？',
					success: (res) => {
						if (res.confirm) {
							console.log('用戶點擊確定');
							this.oldKeywordList = [];
							uni.removeStorage({
								key: 'OldKeys'
							});
						} else if (res.cancel) {
							console.log('用戶點擊取消');
						}
					}
				});
			},
			//熱門搜索開關
			hotToggle() {
				this.forbid = this.forbid ? '' : '_forbid';
			},
			//執行搜索
			doSearch(key) {
			console.log('doSearch')
				key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
				this.keyword = key;
				this.saveKeyword(key); //保存為歷史
				uni.navigateTo({
					url: `../../pagesA/product/list?keyword=${key}`
				})
			},
			//保存關鍵字到歷史記錄
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						console.log(res.data);
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10個紀錄
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新歷史搜索
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新歷史搜索
					}
				});
			}
		}
	}
</script>
<style lang="scss" scoped>
	view{display:block;}
	.search-box {width:100%;background-color:rgb(242,242,242);padding:15upx 2.5%;display:flex;justify-content:space-between;}
	.search-box .mSearch-input-box{width: 100%;}
	.search-box .input-box {width:85%;flex-shrink:1;display:flex;justify-content:center;align-items:center;}
	.search-box .search-btn {width:15%;margin:0 0 0 2%;display:flex;justify-content:center;align-items:center;flex-shrink:0;font-size:28upx;color:#fff;background:linear-gradient(to right,#ff9801,#ff570a);border-radius:60upx;}
	.search-box .input-box>input {width:100%;height:60upx;font-size:32upx;border:0;border-radius:60upx;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0 3%;margin:0;background-color:#ffffff;}
	.placeholder-class {color:#9e9e9e;}
	.search-keyword {width:100%;background-color:rgb(242,242,242);}
	.keyword-list-box {height:calc(100vh - 110upx);padding-top:10upx;border-radius:20upx 20upx 0 0;background-color:#fff;}
	.keyword-entry-tap {background-color:#eee;}
	.keyword-entry {width:94%;height:80upx;margin:0 3%;font-size:30upx;color:#333;display:flex;justify-content:space-between;align-items:center;border-bottom:solid 1upx #e7e7e7;}
	.keyword-entry image {width:60upx;height:60upx;}
	.keyword-entry .keyword-text,.keyword-entry .keyword-img {height:80upx;display:flex;align-items:center;}
	.keyword-entry .keyword-text {width:90%;}
	.keyword-entry .keyword-img {width:10%;justify-content:center;}
	.keyword-box {height:calc(100vh - 110upx);border-radius:20upx 20upx 0 0;background-color:#fff;}
	.keyword-box .keyword-block {padding:10upx 0;}
	.keyword-box .keyword-block .keyword-list-header {width:94%;padding:10upx 3%;font-size:27upx;color:#333;display:flex;justify-content:space-between;}
	.keyword-box .keyword-block .keyword-list-header image {width:40upx;height:40upx;}
	.keyword-box .keyword-block .keyword {width:94%;padding:3px 3%;display:flex;flex-flow:wrap;justify-content:flex-start;}
	.keyword-box .keyword-block .hide-hot-tis {display:flex;justify-content:center;font-size:28upx;color:#6b6b6b;}
	.keyword-box .keyword-block .keyword>view {display:flex;justify-content:center;align-items:center;border-radius:60upx;padding:0 20upx;margin:10upx 20upx 10upx 0;height:60upx;font-size:28upx;background-color:rgb(242,242,242);color:#6b6b6b;}
	.uni-searchbar {
		width: 100%;
	}
</style>
