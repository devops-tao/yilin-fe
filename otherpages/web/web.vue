<template>
	<view :data-theme="themeStyle">
		<view class="iconfont iconshang navigate-back" @click="navigateBack"></view>
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			src: ''
		};
	},
	mixins: [globalConfig],
	onLoad(event) {
		this.src = event.src;
	},
	methods: {
		navigateBack() {
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss">
.navigate-back {
	position: absolute;
	top: 34rpx;
	left: 34rpx;
	z-index: 5;
	font-size: $font-size-toolbar;
}
</style>
