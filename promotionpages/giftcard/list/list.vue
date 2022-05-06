<template>
	<view :data-theme="themeStyle">
		<mescroll-uni @getData="getData" ref="mescroll" :size="10">
			<block slot="list">
				<block v-if="cardList.length">
					<view class="ns-adv">
						<ns-adv keyword="NS_GIFTCARD"></ns-adv>
						<!-- 排序 -->
						<view class="sort-wrap"  >
							<view @click="changeOrder(1)"><text
									:class="order == 1 ? 'color-base-text active color-base-border-bottom' : ''">综合排序</text>
							</view>
							<view @click="changeOrder(2)"><text
									:class="order == 2 ? 'color-base-text active color-base-border-bottom' : ''">价格从高到低</text>
							</view>
							<view @click="changeOrder(3)"><text
									:class="order == 3 ? 'color-base-text active color-base-border-bottom' : ''">价格从低到高</text>
							</view>
						</view>
					</view>

					<view class="card-list single-column">
						<view class="card-item" v-for="(item, index) in cardList" :key="index" :style="{background:item.card_cover?'url(' + $util.img(item.card_cover) + ') no-repeat 0 0/100% 100%':'url(https://cs.b2c.niuteam.cn/upload/uniapp/giftcard/detail/gitcard_default3.png) no-repeat 0 0/100% 100%' }">
							<view class="card-content">
								<view class="card-name">{{item.card_name}}</view>
								<view class="" style="display: flex; justify-content: space-between;">
									<view class="" style="display: flex; flex-direction: column; margin-top: 20rpx;">
										<view class="card-use">礼品卡权益</view>
										<view class="card-num" v-if="item.balance>0.00 && item.point>0 && item.goods_num>0">￥{{item.balance}}+{{item.point}}积分+商品*{{item.goods_num}}</view>
										<view class="card-num" v-else-if="item.balance>0.00 && item.point==0 && item.goods_num==0">￥{{item.balance}}</view>
										<view class="card-num" v-else-if="item.balance==0.00 && item.point>0 && item.goods_num==0">{{item.point}} 积分</view>
										<view class="card-num" v-else-if="item.balance==0.00 && item.point==0 && item.goods_num>0">商品*{{item.goods_num}}</view>
										
										<view class="card-num" v-else-if="item.balance>0.00 && item.point>0 && item.goods_num==0">￥{{item.balance}}+{{item.point}}积分</view>
										<view class="card-num" v-else-if="item.balance>0.00 && item.point==0 && item.goods_num>0">￥{{item.balance}}+商品*{{item.goods_num}}</view>
										<view class="card-num" v-else-if="item.balance==0.00 && item.point>0 && item.goods_num>0">{{item.point}}积分+商品*{{item.goods_num}}</view>
									</view>
									<view class=""  style="display: flex; flex-direction: column;">
										<view class="card-money">￥{{item.selling_price}}</view>
										<button type="primary" size="mini" @click="goBuy(item)">立即购买</button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<ns-empty v-else :isIndex="false" text="还没有礼品卡哦"></ns-empty>
			</block>
		</mescroll-uni>

		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
	import nsAdv from '@/components/ns-adv/ns-adv.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {
			nsAdv
		},
		data() {
			return {
				order: 1,
				cardList:[],
			};
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		mixins: [globalConfig],
		methods: {
			//切换状态
			changeOrder(order) {
				this.list = [];
				this.order = order;
				this.$refs.mescroll.refresh();
			},
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/giftcard/api/giftcard/giftCardList',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						order: this.order
					},
					success: res => {
						let newArr = [];
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.cardList = []; //如果是第一页需手动制空列表
						this.cardList = this.cardList.concat(newArr); //追加新数据
						this.cardList.forEach(i => {
							i.start_time = this.$util.timeStampTurnTime(i.start_time).slice(0, 10);
							i.end_time = this.$util.timeStampTurnTime(i.end_time).slice(0, 10);
						});
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			goBuy(item) {
				if (!uni.getStorageSync('token')) {
					var url = "/promotionpages/giftcard/list/list";
					this.$refs.login.open(url);
				} else {
					this.$util.redirectTo('/promotionpages/giftcard/my_giftcard/detail', {
						id: item.id
					});
				}
				
			}
		},
	};
</script>

<style lang="scss" scoped>
	.ns-adv {
		padding: 20rpx 30rpx 10rpx;
		border-radius: $border-radius;
		overflow: hidden;
		line-height: 1;
		background: #fff;

		image {
			width: 100%;
		}
	}

	/deep/ .fixed {
		position: relative;
		top: 0;
	}

	/deep/ .empty {
		margin-top: 0 !important;
	}

	.topic-pic {
		height: 300rpx;

		image {
			height: 300rpx;
		}
	}

	.topic-list {
		margin: 0 24rpx 24rpx;
		border-radius: 10rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		margin-bottom: 16rpx;
		background-color: #fff;

		.list-img {
			width: 100%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.sort-wrap {
		display: flex;
		padding: 20rpx 0 5rpx ;
		background: #fff;

		>view {
			flex: 1;
			text-align: center;
			font-size: $font-size-base;
			height: 60rpx;
			line-height: 60rpx;
		}

		.comprehensive-wrap {
			display: flex;
			justify-content: center;
			align-items: center;

			.iconfont-wrap {
				display: inline-block;
				margin-left: 10rpx;
				width: 40rpx;

				.iconfont {
					font-size: $font-size-toolbar;
					line-height: 1;
					margin-bottom: 5rpx;
				}
			}
		}

		.price-wrap {
			display: flex;
			justify-content: center;
			align-items: center;

			.iconfont-wrap {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				width: 40rpx;

				.iconfont {
					float: left;
					font-size: 24rpx;
					line-height: 1;
					height: 20rpx;
					color: #909399;
				}
			}
		}

		.screen-wrap {
			display: flex;
			justify-content: center;
			align-items: center;

			.iconfont-wrap {
				display: inline-block;
				margin-left: 10rpx;
				width: 40rpx;

				.iconfont {
					font-size: $font-size-toolbar;
					line-height: 1;
				}
			}
		}
	}

	.card-list {
		padding: 30rpx;

		.card-item {
			background: #ff9696;
			border-radius: 20rpx;
			padding: 20rpx;
			margin: 25rpx 5rpx;

			.card-content {
				// border: 1rpx solid #ffc7c7;
				padding: 20rpx 50rpx;

				.card-name {
					font-size: 48rpx;
					margin-bottom: 10rpx;
					color: #fff;
					max-height: 160rpx;
					overflow: hidden;
				}
				
				.card-use {
					color: #fff;
				}
				
				.card-num {
					color: #fff;
				}
				
				.card-money {
					font-size: 40rpx;
					color: #fff;
				}
				
				button {
					color: #ff4c4b;
					background: #fff;
				}

			}

			.card-pay {
				display: flex;
				justify-content: space-between;
				padding: 10rpx 20rpx 0 10rpx;
			}

		}
	}
</style>
