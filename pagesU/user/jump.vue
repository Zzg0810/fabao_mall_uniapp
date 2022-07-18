<template>
	<view></view>
</template>
<script>
	export default {
		data() {
			return {};
		},
		onLoad(e) {
            if(e.scene) {
                this.deshare(e.scene);
            } else {
                this.gotoIndex();
                // this.$common.errorToShow('失敗', () => {
                // 	uni.navigateBack({
                // 		delta: 1
                // 	});
                // });
            }
		},
		methods: {
            deshare(data) {
                this.$api.deshare({code: data}, res => {
                    if (res.status) {
                        this.saveInviteCode(res.data.userShareCode); //存儲邀請碼
                        switch(res.data.page) {
                            case '1': //首頁
                                this.gotoIndex();
                                break;
                            case '2': //法寶
                                this.gotoGoods(res.data.params.goods_id);
                                break;
                            case '3': //拼團
                                this.gotoPinTuan(res.data.params.goods_id, res.data.params.team_id);
                                break;
                            case '4': //店鋪邀請
                                this.gotoStore(res.data.params.store);
                                break;
                            case '5': //文章頁面
                                this.gotoArticle(res.data.params.article_id, res.data.params.article_type);
                                break;
                            case '6': //參團頁面
                                this.gotoInvitationGroup(res.data.params.goods_id, res.data.params.group_id, res.data.params.team_id)
                                break;
                            case '7': //自定義頁面
                                this.gotoCustom(res.data.params.page_code);
                                break;
                            case '8': //智能表單
                                this.gotoForm(res.data.params.id)
                                break;
                            case '9': //團購秒殺
                                this.gotoGroup(res.data.params.goods_id, res.data.params.group_id);
                                break;
                            default:
                            	this.gotoIndex();
                            	break;
                        }
                    } else {
                        this.$common.errorToShow('失敗', () => {
                        	uni.navigateBack({
                        		delta: 1
                        	});
                        });
                    }
                });
            },
			//存儲邀請碼
			saveInviteCode(invite) {
				if (invite && invite != '') {
					uni.setStorageSync('invitecode', invite);
				}
			},
			//跳轉到首頁
			gotoIndex() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			//跳轉到法寶
			gotoGoods(id) {
				if(id && id != ''){
					let url = '/pages/goods/index/index?id=' + id;
					this.$common.redirectTo(url);
				}else{
					this.gotoIndex();
				}
			},
			//跳轉到文章
			gotoArticle(id, id_type) {
				if(id && id != ''){
					let url = '/pages/article/index?id=' + id + '&id_type=' + id_type;
					this.$common.redirectTo(url);
				}else{
					this.gotoIndex();
				}
			},
			//跳轉到拼團
			gotoPinTuan(id, team_id) {
				if(id && id != ''){
					let url = '/pages/goods/index/pintuan?id=' + id + '&team_id=' + team_id;
					this.$common.redirectTo(url);
				}else{
					this.gotoIndex();
				}
			},
			//跳轉到團購
			gotoGroup(id, group_id) {
				if(id && id != ''){
					let url = '/pages/goods/index/group?id=' + id + '&group_id=' + group_id;
					this.$common.redirectTo(url);
				}else{
					this.gotoIndex();
				}
			},
			//跳轉到參團
			//todo:: 功能暫無後續開發
			// gotoInvitationGroup(id, group_id, team_id) {
			// 	if(id && id != '' && group_id && group_id != '' && team_id && team_id != ''){
			// 		let url = '/pages/member/order/invitation_group?id=' + id + '&group_id=' + group_id + '&team_id=' + team_id;
			// 		this.$common.redirectTo(url);
			// 	}else{
			// 		this.gotoIndex();
			// 	}
			// },
			//跳轉到自定義頁
			gotoCustom(page_code) {
				if(page_code && page_code != ''){
					let url = '/pages/index/custom?page_code=' + page_code;
					this.$common.redirectTo(url);
				}else{
					this.gotoIndex();
				}
			},
			gotoStore(id) {
				if(id && id != ''){
					let url = '/pages/member/distribution/my_store?store=' + id;
					this.$common.redirectTo(url);
				}else{
					this.gotoIndex();
				}
			},
			//跳轉表單
			gotoForm(id){
				if(id && id != ''){
					let url = '/pages/form/detail/form?id=' + id;
					this.$common.redirectTo(url);
				}else{
					this.gotoIndex();
				}
			}
		}
	};
</script>