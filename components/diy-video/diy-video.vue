<template>
	<block v-if="value.list.length > 0">
		<view v-for="(item, index) in value.list" :key="index">
			<video v-if="item.is_mute == 1 && item.is_play == 1" :src="$util.img(item.videoUrl)" :autoplay='true' :muted="true" :controls="true" :poster="$util.img(item.imageUrl)"></video>
			<video v-if="item.is_mute == 0 && item.is_play == 1" :src="$util.img(item.videoUrl)" :autoplay='true' :controls="true" :poster="$util.img(item.imageUrl)"></video>
			<video v-if="item.is_mute == 1 && item.is_play == 0" :src="$util.img(item.videoUrl)" :muted="true" :controls="true" :poster="$util.img(item.imageUrl)"></video>
			<video v-if="item.is_mute == 0 && item.is_play == 0" :src="$util.img(item.videoUrl)" controls :poster="$util.img(item.imageUrl)"></video>
		</view>	
	</block>
</template>

<script>
// 视频
export default {
	name: 'diy-video',
	props: {
		value: {
			type: Object,
			default: () => {
				return { id: '', url: '' };
			}
		}
	},
	data() {
		return {};
	},
	created() {
	},
	methods: {}
};
</script>

<style>
video {
	width: 100%;
}
</style>
