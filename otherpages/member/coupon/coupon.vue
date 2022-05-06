<template>
	<view :class="isIphoneX ? 'iphone-x' : ''" :data-theme="themeStyle">
		<view class="cf-container color-line-border" v-if="token">
			<view class="tab">
				<view @click="changeState(1)"><text :class="state == 1 ? 'color-base-text active color-base-border-bottom' : ''">未使用</text></view>
				<view @click="changeState(2)"><text :class="state == 2 ? 'color-base-text active color-base-border-bottom' : ''">已使用</text></view>
				<view @click="changeState(3)"><text :class="state == 3 ? 'color-base-text active color-base-border-bottom' : ''">已过期</text></view>
			</view>
			<view class="coupon-head">
				<view class="sort" :class="sort == 1 ? 'color-base-border color-base-text' : ''" @click="changeSort(1,'')">全部</view>
				<view class="sort" :class="sort == 2 ? 'color-base-border color-base-text' : ''" @click="changeSort(2,'reward')">满减券</view>
				<view class="sort" :class="sort == 3 ? 'color-base-border color-base-text' : ''" @click="changeSort(3,'discount')">折扣券</view>
				<view class="sort" :class="sort == 4 ? 'color-base-border color-base-text' : ''" @click="changeSort(4,'no_threshold')">无门槛券</view>
			</view>
		</view>

		<mescroll-uni ref="mescroll" top="180" @getData="getMemberCounponList" v-if="token">
			<block slot="list">
				<view class="coupon-listone">
					
					<view class="item" v-for="(item, index) in list" :key="index" @click="toGoodsList(item)" :style="{backgroundColor:item.state == 1?'#FFF2F0':'#F2F2F2'}">
						<view class="item-base" :style="{backgroundImage:'url('+$util.img(item.state == 1?'/upload/uniapp/coupon/bg_lingqu.png':'/upload/uniapp/coupon/bg_lingqu_gary.png')+')'}">
							<view>
								<view class="use_price " v-if="item.type == 'divideticket'" :class="{disabled:item.state != 1}"><text>￥</text>{{ parseInt(item.money) }}</view>
								<view class="use_price " v-if="item.type == 'reward'" :class="{disabled:item.state != 1}"><text>￥</text>{{ parseInt(item.money) }}</view>
								<view class="use_price" v-else-if="item.type == 'discount'" :class="{disabled:item.state != 1}">{{ parseFloat(item.discount) }}<text>折</text></view>
								<view class="use_condition font-size-tag" v-if="item.at_least > 0" :class="{disabled:item.state != 1}">满{{ item.at_least }}元可用</view>
								<view class="use_condition font-size-tag" v-else :class="{disabled:item.state != 1}">无门槛优惠券</view>
							</view>

						</view>
						<view class="item-info">
							<view class="use_title">
								<view class="title">{{ item.coupon_name }}</view>
								<view class="max_price" v-if="item.goods_type == 2" :class="{disabled:item.state == 3}">指定商品</view>
								<view class="max_price" v-if="item.discount_limit != '0.00'">(最大优惠{{ item.discount_limit }}元)</view>
							</view>
							<view class="use_time" v-if="item.validity_type">有效期：领取之日起{{ item.fixed_term }}日内有效</view>
							<view class="use_time" v-else>有效期：{{ $util.timeStampTurnTime(item.end_time) }}</view>
						</view>
						<view class="item-btn">
							<view class="tag" v-if="item.state == 1" @click="toGoodsList(item)">
								去使用
							</view>
							<view class="tag disabled" v-if="item.state == 2">已使用</view>
							<view class="tag disabled" v-if="item.state == 3">已过期</view>
						</view>
					</view>
				</view>
				<view v-if="!list.length && showEmpty" class="margin-top cart-empty" :fixed="!1">
					<ns-empty :isIndex="false" text="暂无优惠券"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<ns-login ref="ns-login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>

	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				type: '',
				types:'',
				state: 1,
				sort: 1,
				list: [],
				isIphoneX: false, //判断手机是否是iphoneX以上
				token: null,
				showEmpty: false,
				related_id:0
			};
		},
		mixins: [globalConfig],
		onLoad(data) {
			if(data.related_id) this.related_id = data.related_id ? data.related_id : 0;
			this.isIphoneX = this.$util.uniappIsIPhoneX();
		},
		onShow() {
			if (!this.addonIsExit.coupon) {
				this.$util.showToast({
					title: '商家未开启优惠券',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
			// 刷新多语言
			this.$langConfig.refresh();

			if (uni.getStorageSync('token')) {
				this.token = uni.getStorageSync('token');
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				setTimeout(() => {
					this.$refs.login.open('/otherpages/member/coupon/coupon');
				});
			}		
		},
		methods: {
			//切换状态
			changeState(state) {
				this.list = [];
				this.state = state;
				this.$refs.mescroll.refresh(false);
			},
			changeSort(sort,types) {
				this.list = [];
				this.sort = sort;
				this.types = types;
				this.$refs.mescroll.refresh(false);
				
			},
			getMemberCounponList(mescroll) {
				this.showEmpty = false;
				this.$api.sendRequest({
					url: '/coupon/api/coupon/memberpage',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						state: this.state,
						is_own: this.type,
						type: this.types,
						related_id: this.related_id
					},
					success: res => {
						this.showEmpty = true;
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1){
							this.list = []; //如果是第一页需手动制空列表
							this.related_id = 0
						} 
						this.list = this.list.concat(newArr); //追加新数据
						let data = res.data;
						if (data) this.couponList = data;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			imageError(index) {
				this.list[index].logo = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
			toGoodsList(item) {
				if (item.state == 1) {
					this.$util.redirectTo('/pages/goods/list/list', {
						coupon: item.coupon_type_id
					});
				}
			}
		},
		watch: {
			storeToken: function(nVal, oVal) {
				if (nVal) {
					this.token = nVal;
					this.$refs.mescroll.refresh();
				}
			}
		},
		computed: {
			storeToken() {
				return this.$store.state.token;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.cart-empty {
		margin-top: 104px !important;
	}

	.active {
		border-bottom: 4rpx solid;
	}
	
	.coupon-head {
		display: flex;
		background: #fff;
		padding: 20rpx 50rpx;
		
		.sort {
			border: 1px solid #c5c5c5;
			padding: 1rpx 20rpx;
			border-radius: 50rpx;
			cursor: pointer;
			margin-right: 15rpx;
		}
	}
	.cf-container {
		background: #fff;
		overflow: hidden;
	}

	.tab {
		display: flex;
		justify-content: space-between;
		height: 86rpx;

		>view {
			text-align: center;
			width: 33%;
			height: 86rpx;

			text {
				display: inline-block;
				line-height: 86rpx;
				height: 80rpx;
				font-size: 30rpx;
			}
		}
	}

	.coupon-listone {
		margin: 0 30rpx;
		
		
		
		.item {
			display: flex;
			background-color: #FFF2F0; 
			background-size: 100% 100%;
			border-radius: 20rpx;
			align-items: stretch;
			margin-top: $padding;
			overflow: hidden;

			.item-base {
				position: relative;
				width: 197rpx;
				min-width: 197rpx;
				text-align: center;
				background-image: linear-gradient(to right top, #FC6831, #FF4544);
				background-repeat: no-repeat;
				background-size: 100% 100%;
				padding: 38rpx 10rpx 38rpx 18rpx;

				>view {
					width: calc(100%);
					height: auto;
					position: relative;
					top: 50%;
					transform: translate(0, -50%);

				}

				.use_price {
					font-size: 60rpx;
					line-height: 1;
					color: #fff;

					text {
						font-size: $font-size-toolbar;
					}

					&.disabled {
						color: $color-tip
					}
				}

				.use_condition {
					color: #fff;
					margin-top: $padding;

					&.margin_top_none {
						margin-top: 0;
					}

					&.disabled {
						color: $color-tip
					}
				}

				&::after {
					position: absolute;
					content: '';
					background-color: #F8F8F8;
					left: 0;
					top: 50%;
					transform: translate(0, -50%);
					height: 30rpx;
					width: 15rpx;
					border-radius: 0 15px 15px 0;
				}
			}

			.item-btn {
				position: relative;
				width: 160rpx;
				min-width: 160rpx;
				align-self: center;

				view {
					width: 100rpx;
					height: 50rpx;
					border-radius: 50rpx;
					line-height: 50rpx;
					margin: auto;
					text-align: center;
					background-image: linear-gradient(to right, #FC6831, #FF4544);
					color: #fff;
					font-size: $font-size-tag;

					&.disabled {
						background: $color-line !important;
						color: $color-tip !important;
					}

				}

				&::after {
					position: absolute;
					content: '';
					background-color: #F8F8F8;
					right: 0;
					top: 50%;
					transform: translate(0, -50%);
					height: 30rpx;
					width: 15rpx;
					border-radius: 30rpx 0 0 30rpx;
				}
			}

			.item-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				margin-left: $padding;
				overflow: hidden;
				background-repeat-x: no-repeat;
				background-repeat-y: repeat;

				.use_time {
					padding: $padding 0;
					border-top: 1px dashed #CCCCCC;
					font-size: $font-size-activity-tag;
					color: #909399;

				}

				.use_title {
					font-size: $font-size-base;
					font-weight: 500;
					padding: $padding 0;

					.title {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.max_price {
						font-weight: 400;
						font-size: $font-size-tag;
					}
				}
			}
		}
	}
</style>
