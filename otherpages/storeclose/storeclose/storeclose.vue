<template>
	<view :data-theme="themeStyle">
		<view class="closeBox">
			<image :src="$util.img('/upload/uniapp/storeclose.png')" mode="widthFix"></image>
			<text class="close-title">{{ textVal }}</text>
		</view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			isIphoneX: false
		};
	},
	onShow() {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		this.$langConfig.refresh();
		this.getSiteStatus();
		
		// #ifdef MP-WEIXIN
		wx.hideHomeButton();
		// #endif
	},
	mixins: [globalConfig],
	methods:{
		getSiteStatus(){
			this.$api.sendRequest({
				url: '/api/site/status',
				data: {},
				success: res => {
					if (res.code == 0) {
						this.$util.redirectTo('/pages/index/index/index');
					}
				}
			});
		}
	},
	computed: {
		textVal() {
			return '该店铺已打烊...';
		},
		pageVal() {
			if (this.$store.state.siteState == -2) {
				return '店铺不存在';
			} else if (this.$store.state.siteState == -3) {
				return '店铺打烊';
			}
		}
	},
	onBackPress() {
		return true;
	}
};
</script>

<style lang="scss">
.head-nav {
	width: 100%;
	height: var(--status-bar-height);
}

.head-nav.active {
	padding-top: 40rpx;
}

.head-return {
	padding-left: 30rpx;
	padding-right: 30rpx;
	height: 90rpx;
	line-height: 90rpx;
	text-align: center;
	font-weight: 600;
	font-size: $font-size-toolbar;

	text {
		display: inline-block;
		margin-right: 10rpx;
	}
}
.closeBox {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 330rpx;
}
image {
	width: 240rpx;
}
.close-title {
	font-size: $font-size-toolbar;
	color: $color-tip;
	margin-top: 55rpx;
	letter-spacing: 4rpx;
}
</style>
