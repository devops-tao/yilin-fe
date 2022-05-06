<template>
	<view v-if="list">
		<view class="tab-bar" :style="{ backgroundColor: backgroundColor }">
			<view class="tabbar-border"></view>
			<view class="item" v-for="(item, index) in list" :key="index" :class="{ bulge: isBulge && index == 2 }" @click="redirectTo(item.link)">
				<view class="bd">
					<view class="icon" v-if="bottomType == 1 || bottomType == 2">
						<image :src="verify(item.link) ? $util.img(item.selectedIconPath) : $util.img(item.iconPath)" />
						<view class="cartNumberBtn font-size-activity-tag color-base-bg" v-if="item.link.wap_url == '/pages/goods/cart/cart' && cartNumber > 0">
							{{ cartNumber }}
						</view>
					</view>
					<view class="label" v-if="bottomType == 1 || bottomType == 3" :style="{ color: verify(item.link) ? textHoverColor : textColor }">{{ item.text }}</view>
				</view>
			</view>
		</view>
		<!-- 解决fixed定位后底部导航栏塌陷问题 -->
		<view class="tab-bar-placeholder"></view>
		<!-- <view class="placeholder safe-area" :class="{ bulge: list.length == 5 && special.indexOf(currentRoute) == -1 && bottomNav.bulge }"></view> -->
		<!-- <view class="placeholder" v-else :class="{ bulge: list.length == 5 && special.indexOf(currentRoute) == -1 && bottomNav.bulge }"></view> -->
	</view>
</template>

<script>
export default {
	name: 'diy-bottom-nav',
	props: {
		value: {
			type: Object
		},
		type: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			default: ''
		}
	},

	data() {
		return {
			currentRoute: '', //当前页面路径
			//特殊页面处理悬浮
			special: ['pages/goods/cart/cart'],
			specialPage: '',
			isIphoneX: false, //判断手机是否是iphoneX以上
			jumpFlag: true, //是否可以跳转，防止重复点击

			bottomNav: {},
			textHoverColor: '',
			textColor: '',
			backgroundColor: '',
			list: {},
			bottomType: 1
		};
	},
	mounted() {
		let currentPage = getCurrentPages()[getCurrentPages().length - 1];
		this.currentRoute = currentPage.route;
		this.getBottomNav();
		this.$store.dispatch('getCartNumber');
	},
	computed: {
		cartNumber() {
			return this.$store.state.cartNumber;
		},
		isBulge() {
			// 暂时去掉悬浮功能
			return false;
			if (this.bottomNav.list) {
				return this.bottomNav.list.length == 5 && this.special.indexOf(this.currentRoute) == -1 && this.bottomNav.bulge;
			} else {
				return false;
			}
		}
	},
	methods: {
		redirectTo(link) {
			this.$emit('callback');
			if (link.wap_url.indexOf('http') != -1 || link.wap_url.indexOf('https') != -1) {
				// #ifdef MP-WEIXIN
				this.redirectTo('/otherpages/web/web?src=' + link.wap_url);
				// #endif
				// #ifdef H5
				location.href = link.wap_url;
				// #endif
			}else if (link.appid) {
				uni.navigateToMiniProgram({
					appId: link.appid,
					path: link.page
				})
			}
			if (!this.jumpFlag) return;
			this.jumpFlag = false;
			setTimeout(() => {
				this.jumpFlag = true;
			}, 300);
			if (link == null || link == '' || !link.wap_url) return false;
			
			if(this.name){
				var url = this.currentRoute + '?name=' + this.name;
			}else{
				var url = this.currentRoute
			}
			
			if (link.wap_url.indexOf(url) != -1) return false;

			let jump = true;
			let arr = getCurrentPages().reverse();
			
			for (let i = 0; i < arr.length; i++) {
				
				if(this.name){
					var route = arr[i].route + '?name=' + this.name;
				}else{
					var route = arr[i].route;
				}
				if (link.wap_url.indexOf(route) != -1) {
					jump = false;
					uni.navigateBack({
						delta: i
					});
					break;
				}
			}
			if (jump) {
				this.$util.redirectTo(link.wap_url);
			}
		},
		verify(link) {
			if (link == null || link == '' || !link.wap_url) return false;
			if(this.name){
				var url = this.currentRoute + '?name=' + this.name;
			}else{
				var url = this.currentRoute
			}
			if (link.wap_url.indexOf(url) != -1) {
				return true;
			}
			return false;
		},
		getBottomNav() {
			let url = '/api/diyview/bottomNav';
			let data = {};
			if (this.siteId) {
				url = '/api/diyview/shopBottomNav';
				data.site_id = this.siteId;
			}
		
			this.$api.sendRequest({
				url: url,
				data: data,
				success: res => {
					let data = res.data;
					if (data && data.value && data.value.length) {
						var value = JSON.parse(data.value);
						this.bottomNav = value;
						this.textColor = value.textColor;
						this.textHoverColor = value.textHoverColor;
						this.backgroundColor = value.backgroundColor;
						this.bottomType = value.type;
						this.list = value.list;
						this.$store.commit('setTabbarList', JSON.parse(data.value));
						this.$forceUpdate();
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.placeholder {
	height: 56px;
	&.bluge {
		height: 90px;
	}
}

.safe-area {
	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}

.tab-bar {
	background-color: #fff;
	box-sizing: border-box;
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	z-index: 998;
	display: flex;
	border-top: 2rpx solid #f5f5f5;
	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);

	.tabbar-border {
		background-color: rgba(255, 255, 255, 0.329412);
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 2rpx;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.item {
		display: flex;
		align-items: center;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		flex: 1;
		flex-direction: column;
		padding-bottom: 10rpx;
		box-sizing: border-box;

		.bd {
			position: relative;
			height: 100rpx;
			flex-direction: column;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.icon {
				position: relative;
				display: inline-block;
				margin-top: 10rpx;
				width: 40rpx;
				height: 40rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}

			.label {
				position: relative;
				text-align: center;
				font-size: 24rpx;
				line-height: 1;
				margin-top: 12rpx;
			}
		}

		&.bulge {
			.bd {
				position: relative;
				height: 50px;
				flex-direction: column;
				text-align: center;

				.icon {
					margin-top: -30px;
					margin-bottom: 2px;
					border-radius: 50%;
					width: 50px;
					height: 51px;
					padding: 5px;
					border-top: 1px solid #f5f5f5;
					background-color: #fff;
					box-sizing: border-box;

					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}

				.label {
					position: relative;
					text-align: center;
					font-size: 12px;
					line-height: 1.6;
					height: 20px;
					line-height: 20px;
				}
			}
		}

		.cartNumberBtn {
			position: absolute;
			top: -8rpx;
			right: -18rpx;
			width: 24rpx;
			height: 24rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			padding: 6rpx;
			border-radius: 50%;
			z-index: 99;
		}
	}
}
.tab-bar-placeholder{
	padding-bottom: calc(constant(safe-area-inset-bottom) + 112rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 112rpx);
}
</style>
