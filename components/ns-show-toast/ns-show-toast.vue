<template>
	<view @touchmove.prevent.stop class="show-toast" v-if="showToastValue.title">
		<view class="show-toast-box">{{ showToastValue.title }}</view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {};
	},
	mixins: [globalConfig]
};
</script>

<style lang="scss" scoped>
.show-toast {
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	margin: auto;
	z-index: 999;
	.show-toast-box {
		min-width: 40%;
		max-width: 70%;
		text-align: center;
		margin: 0 auto;
		text-align: center;
		background: rgba(0, 0, 0, 0.5) !important;
		color: #fff;
		border-radius: 8rpx;
		font-size: $font-size-base;
		line-height: 1;
		padding: 20rpx 50rpx;
		box-sizing: border-box;
	}
}
</style>
