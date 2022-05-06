<template>
	<view class="diy-notice" :style="{ background: value.backgroundColor, marginTop: value.marginTop * 2 + 'rpx' }">
		<template v-if="value.style == 1">
			<view class="notice notice-1">
				<view v-if="$util.img('upload/uniapp/ns-notice.png')" class="pic"
					:style="'background-image:url(' + $util.img('upload/uniapp/ns-notice.png') + ');background-repeat: no-repeat;background-size: auto 100%;background-position: center'">
				</view>
				<view class="notice-xian"></view>
				<view class="main-wrap">
					<view class="uni-swiper-msg">
						<swiper vertical="true" autoplay="true" circular="true" @change="change">
							<swiper-item v-for="(item, index) in value.list" :key="index" @touchmove.stop>
								<text @click="redirectTo(item.link)" class="beyond-hiding"
									:style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)', fontSize: value.fontSize * 2 + 'rpx' }">
									{{ item.title }}
								</text>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
		</template>

		<template v-if="value.style == 2">
			<view class="notice notice-2">
				<view v-if="$util.img('upload/uniapp/notice/notice2_title.png')" class="pic"
					:style="'background-image:url(' + $util.img('upload/uniapp/notice/notice2_title.png') + ');background-repeat: no-repeat;background-size: auto 100%;background-position: center'">
				</view>
				<view class="main-wrap">
					<view class="uni-swiper-msg">
						<swiper vertical="true" autoplay="true" duration="0" interval="5000" circular="true" @change="change">
							<swiper-item v-for="(item, index) in value.list" :key="index" @touchmove.stop>
								<text @click="redirectTo(item.link)" class="beyond-hiding animate"
									:style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)', fontSize: value.fontSize * 2 + 'rpx' }">
									{{ item.title }}
								</text>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view> 
		</template>
	</view>
</template>
<script>
	// 公告
	export default {
		name: 'diy-notice',
		props: {
			value: {
				type: Object
			}
		},
		data() {
			return {
				list: [],
				index: 0
			};
		},
		created() {
			this.getData();
		},
		methods: {
			getData() {
				var data = {};

				if (this.value.sources == 'diy') {
					data.id_arr = this.value.noticeIds.toString();
				}
				this.$api.sendRequest({
					url: '/api/notice/lists',
					data: data,
					success: res => {
						if (res.code == 0 && res.data) {
							this.list = res.data;
						}
					}
				});
			},
			redirectTo(link) {
				if (link.wap_url) {
					this.$util.redirectTo(link.wap_url);
				} else if (link.appid) {
					uni.navigateToMiniProgram({
						appId: link.appid,
						path: link.page
					})
				} else {
					if (this.value && this.value.list) {
						if (this.value.noticeIds[this.index]) {
							this.$util.redirectTo('/otherpages/notice/detail/detail?notice_id=' + this.value.noticeIds[this
								.index]);
						} else if (this.value.list[this.index].link) {
							let link = this.value.list[this.index].link;
							this.$util.diyRedirectTo(link);
						}
					}
				}
			},
			change(e) {
				this.index = e.detail.current;
			}
		}
	};
</script>

<style lang="scss">
	.diy-notice {
		padding: 20rpx;
		line-height: 0;
		border-radius: 10rpx;
	}

	.notice-1 {
		height: 40rpx;
		position: relative;
		display: flex;
		align-items: center;
		overflow: hidden;

		.pic {
			width: 140rpx;
			height: 24rpx;
			flex-shrink: 0;

			image {
				height: 100%;
			}
		}

		.notice-xian {
			width: 1rpx;
			height: 26rpx;
			background-color: #e4e4e4;
			margin: 0 22rpx;
		}
	}

	.main-wrap {
		display: inline-block;
		width: calc(100% - 115rpx);
		position: relative;
	}

	.uni-swiper-msg {
		padding: 0;
	}

	.uni-swiper-msg swiper {
		height: 50rpx;
	}

	.beyond-hiding {
		display: inline-block;
		width: 100%;
		// overflow: hidden;
		// text-overflow: ellipsis;
		white-space: nowrap;
	}

	.notice-2 {
		display: flex;

		.pic {
			width: 155rpx;
			height: 50rpx;
			flex-shrink: 0;
			margin-right: 40rpx;

			image {
				height: 100%;
			}
		}

		// .main-wrap {}
	}
	
.animate {
		padding-left: 20px;
		font-size: 12px;
		color: #000;
		display: inline-block;
		white-space: nowrap;
		animation: 5s wordsLoop linear infinite normal;
	}

@keyframes wordsLoop {
	0% {
		transform: translateX(200px);
		-webkit-transform: translateX(200px);
	}
	100% {
		transform: translateX(-100%);
		-webkit-transform: translateX(-100%);
	}
}

@-webkit-keyframes wordsLoop {
	0% {
		transform: translateX(200px);
		-webkit-transform: translateX(200px);
	}
	100% {
		transform: translateX(-100%);
		-webkit-transform: translateX(-100%);
	}
}
</style>
