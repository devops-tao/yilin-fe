<template>
	<view :data-theme="themeStyle">
		<view class="coupon-head">
			<view class="sort" :class="sort == 1 ? 'color-base-border color-base-text' : ''" @click="changeSort(1)">全部</view>
			<view class="sort" :class="sort == 2 ? 'color-base-border color-base-text' : ''" @click="changeSort(2,'reward')">满减券</view>
			<view class="sort" :class="sort == 3 ? 'color-base-border color-base-text' : ''" @click="changeSort(3,'discount')">折扣券</view>
			<view class="sort" :class="sort == 4 ? 'color-base-border color-base-text' : ''" @click="changeSort(4,'no_threshold')">无门槛券</view>
		</view>
		<mescroll-uni ref="mescroll"  top="100" @getData="getMemberCounponList">
			<block slot="list">
				<view class="coupon-listone">
					<view class="item" v-for="(item, index) in list" :key="index" @click="liClick(item, index)" :style="{ backgroundColor: item.useState == 2 ? '#F2F2F2' : '#FFF2F0' }">
						<view class="item-base" :style="{
								backgroundImage: 'url(' + $util.img(item.useState == 2 ? '/upload/uniapp/coupon/bg_lingqu_gary.png' : '/upload/uniapp/coupon/bg_lingqu.png') + ')'
							}">
							<view>
								<view class="use_price" v-if="item.type == 'reward'" :class="{ disabled: item.useState == 2 }">
									<text>￥</text>
									{{ parseInt(item.money) }}
								</view>
								<view class="use_price" v-else-if="item.type == 'discount'" :class="{ disabled: item.useState == 2 }">
									{{ parseFloat(item.discount) }}
									<text>折</text>
								</view>
								<view class="use_condition font-size-tag" v-if="item.at_least > 0" :class="{ disabled: item.useState == 2 }">满{{ item.at_least }}元可用</view>
								<view class="use_condition font-size-tag" v-else :class="{ disabled: item.useState == 2 }">无门槛优惠券</view>
							</view>
						</view>
						<view class="item-info">
							<view class="use_title">
								<view class="title">{{ item.coupon_name }}</view>
								<view class="max_price" v-if="item.goods_type == 1" :class="{ disabled: item.useState == 2 }">全场商品</view>
								<view class="max_price" v-else :class="{ disabled: item.useState == 2 }">指定商品</view>
								<view class="max_price" v-if="item.discount_limit != '0.00'">(最大优惠{{ item.discount_limit }}元)</view>
							</view>
							<view class="use_time" v-if="item.validity_type">有效期：领取之日起{{ item.fixed_term }}日内有效</view>
							<view class="use_time" v-else>有效期：{{ $util.timeStampTurnTime(item.end_time) }}</view>
						</view>
						<view class="item-btn">
							<view v-if="item.useState == 0" @click.stop="receiveCoupon(item, index)">领取</view>
							<view v-if="item.useState == 1" @click.stop="toGoodsList(item, index)">去使用</view>
							<view v-if="item.useState == 2" :class="{ disabled: item.useState == 2 }">已抢光</view>
						</view>
					</view>
				</view>
				<view v-if="list.length == 0">
					<ns-empty text="暂无可领取的优惠券" :isIndex="!1" :fixed="!1"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				list: [],
				sort: 1,
				types:'',
				couponBtnSwitch: false
			};
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
		},
		mixins: [globalConfig],
		methods: {
			changeSort(sort,types) {
				this.list = [];
				this.sort = sort;
				this.types = types;
				this.$refs.mescroll.refresh(false);
				
			},
			liClick(item, index) {
				if (item.useState == 0) this.receiveCoupon(item, index);
				else this.toGoodsList(item, index);
			},

			//领取优惠券
			receiveCoupon(item, index) {
				if (this.couponBtnSwitch) return;
				this.couponBtnSwitch = true;
				let token = uni.getStorageSync('token');
				if (token != '') {
					this.$api.sendRequest({
						url: '/coupon/api/coupon/receive',
						data: {
							coupon_type_id: item.coupon_type_id,
							get_type: 2 //获取方式:1订单2.直接领取3.活动领取
						},
						success: res => {
							this.couponBtnSwitch = false;
							let msg = '';
							msg = '领取成功，快去使用吧';
							let list = this.list;
							if (res.data.is_exist == 1 && res.code < 0) {
								msg = '您已领取过该优惠券，快去使用吧';
							} else {
								msg = res.message;
							}
							if (res.data.is_exist == 1) {
								for (let i = 0; i < list.length; i++) {
									if (list[i].coupon_type_id == item.coupon_type_id) {
										list[i].useState = 1;
									}
								}
							} else {
								for (let i = 0; i < list.length; i++) {
									if (list[i].coupon_type_id == item.coupon_type_id) {
										list[i].useState = 2;
									}
								}
							}
							this.$util.showToast({
								title: msg
							});
						},
						fail: res => {
							this.couponBtnSwitch = false;
						}
					});
				} else {
					this.couponBtnSwitch = false;
					this.$refs.login.open('/otherpages/login/login/login');
				}
			},
			//获取优惠券列表
			getMemberCounponList(mescroll) {
				this.$api.sendRequest({
					url: '/coupon/api/coupon/typepagelists',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						sort: this.sort,
						type: this.types,
					},
					success: res => {
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
						if (newArr.length) {
							newArr.forEach(v => {
								if (v.count == v.lead_count) v.useState = 2;
								else v.useState = 0;
							});
						}
						//设置列表数据
						if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
						this.list = this.list.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail() {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			imageError(index) {
				this.list[index].logo = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
			couponImageError(index) {
				this.list[index].image = this.$util.img('upload/uniapp/goods/coupon.png');
				this.$forceUpdate();
			},
			toGoodsList(item) {
				if (item.goods_type != 1) {
					this.$util.redirectTo('/pages/goods/list/list', {
						coupon: item.coupon_type_id
					});
				} else {
					this.$util.redirectTo('/pages/goods/list/list', {});
				}
			}
		},
		/**
		 * 自定义分享内容
		 * @param {Object} res
		 */
		onShareAppMessage(res) {
			var title = '送您一张优惠券,快来领取吧';
			var path = '/otherpages/goods/coupon/coupon';
			return {
				title: title,
				path: path,
				success: res => {},
				fail: res => {}
			};
		}
	};
</script>

<style lang="scss">
	.coupon-head {
		padding: 20rpx 50rpx;
		display: flex;
		background: #fff;
		
		.sort {
			border: 1px solid #c5c5c5;
			padding: 1rpx 20rpx;
			border-radius: 50rpx;
			cursor: pointer;
			margin-right: 15rpx;
		}
	}
	.coupon-listone {
		padding: 0 30rpx;
		
		.item {
			display: flex;
			background-color: #fff2f0; //
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
				background-image: linear-gradient(to right top, #fc6831, #ff4544);
				background-repeat: no-repeat;
				background-size: 100% 100%;
				padding: 38rpx 10rpx 38rpx 18rpx;

				>view {
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
						color: $color-tip;
					}
				}

				.use_condition {
					color: #fff;
					margin-top: $padding;

					&.margin_top_none {
						margin-top: 0;
					}

					&.disabled {
						color: $color-tip;
					}
				}

				&::after {
					position: absolute;
					content: '';
					background-color: #ffffff;
					left: 0;
					top: 50%;
					transform: translate(0, -50%);
					height: 30rpx;
					width: 15rpx;
					border-radius: 0 15px 15px 0;
				}
			}

			.item-btn {
				width: 160rpx;
				min-width: 160rpx;
				align-self: center;
				position: relative;

				view {
					width: 100rpx;
					height: 50rpx;
					border-radius: 50rpx;
					line-height: 50rpx;
					margin: auto;
					text-align: center;
					background-image: linear-gradient(to right, #fc6831, #ff4544);
					color: #fff;
					font-size: $font-size-tag;

					&.disabled {
						background: #dedede !important;
						color: #909399 !important;
					}
				}

				&::after {
					position: absolute;
					content: '';
					background-color: #ffffff;
					right: 0;
					top: 50%;
					transform: translate(0, -50%);
					height: 30rpx;
					width: 15rpx;
					border-radius: 15px 0 0 15px;
				}
			}

			.item-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				margin-left: 20rpx;
				overflow: hidden;
				background-repeat-x: no-repeat;
				background-repeat-y: repeat;

				.use_time {
					padding: 20rpx 0;
					border-top: 1px dashed #cccccc;
					font-size: $font-size-activity-tag;
					color: #909399;
				}

				.use_title {
					font-size: $font-size-base;
					font-weight: 500;
					padding: 20rpx 0;

					// height:80rpx;
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

	.empty {
		margin-top: 200rpx;
	}
</style>
<style scoped>
	/deep/ .reward-popup .uni-popup__wrapper-box {
		background: none !important;
		max-width: unset !important;
		max-height: unset !important;
	}
</style>
