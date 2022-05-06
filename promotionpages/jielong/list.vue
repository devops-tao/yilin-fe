<template>
	<view>
		<view class="" v-for="(item, index) in jieLong" :key="index">
			<view class="" @click="goJielongDetail(item.jielong_id)">
				{{item.jielong_name}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				jieLong: [],
				jielong_id: ''
			};
		},
		onLoad() {
			this.getJielongList()
		},
		methods: {
			getJielongList() {
				this.$api.sendRequest({
					url: '/jielong/api/Goods/jielongPage',
					data: {

					},
					success: res => {
						if (res.code == 0 && res.data) {
							let newArr = []
							var jielongList = res.data.list
							jielongList.forEach((v, k) => {
								newArr = res.data.list
							})
							this.jieLong = this.jieLong.concat(newArr);
						} else {}
					},
				})
			},
			goJielongDetail(jielong_id) {
				this.$util.redirectTo('/promotionpages/jielong/jielong', {
					jielong_id: jielong_id
				});
			}
		}
	}
</script>

<style>
</style>
