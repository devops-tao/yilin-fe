<template>
	<view class="diy-bargain" v-if="dataList.length" :data-theme="themeStyle" :style="{ backgroundColor: value.backgroundColor, marginTop: value.marginTop * 2 + 'rpx' }">
		<view class="marketing-wrap">
			<image v-if="value.style == 1" :src="$util.img('/upload/uniapp/bargain/' + value.bgSelect + '.png')" mode="widthFix"></image>
			<view class="marketimg-box" :class="'marketimg-box-' + value.style">
				<template v-if="value.style == 1">
					<view class="marketimg-box-title">
						<view class="marketimg-box-title-left">
							<template v-for="(item, index) in value.list" v-if="item.style == 1">
								<image v-if="item.imageUrl" :src="$util.img(item.imageUrl)"></image>
								<text>{{ item.title }}</text>
							</template>

							<!-- <image v-if="value.list.imageUrl" :src="$util.img(value.list.imageUrl)" mode="widthFix"></image>
							<text>{{ value.list.title }}</text> -->
						</view>

						<view class="marketimg-box-title-right" :class="value.bgSelect" @click="$util.redirectTo('/promotionpages/bargain/list/list')">
							<text>更多砍价</text>
							<text class="iconfont iconright"></text>
						</view>
					</view>
				</template>

				<template v-if="value.style == 2">
					<view class="marketimg-box-title marketimg-box-title-2">
						<view class="marketimg-box-title-left">
							<template v-for="(item, index) in value.list" v-if="item.style == 2">
								<image :src="$util.img(item.imageUrl)"></image>
							</template>
							<!-- <image :src="$util.img('upload/uniapp/bargain/title1.png')" mode="widthFix"></image> -->
						</view>

						<view class="marketimg-box-title-right" @click="$util.redirectTo('/promotionpages/bargain/list/list')">
							<text>更多砍价</text>
							<text class="iconfont iconright"></text>
						</view>
					</view>
				</template>

				<template v-if="value.style == 3">
					<view class="marketimg-box-title marketimg-box-title-3">
						<view class="marketimg-box-title-left">
							<template v-for="(item, index) in value.list" v-if="item.style == 3">
								<image :src="$util.img(item.imageUrl)"></image>
							</template>
							<!-- <image :src="$util.img('upload/uniapp/bargain/title2.png')" mode="widthFix"></image> -->
						</view>
					</view>
				</template>

				<view class="marketimg-box-con" v-if="value.changeType == 1">
					<scroll-view class="marketimg-box-con-scroll" :scroll-x="true" :show-scrollbar="false">
						<view class="marketimg-box-con-item" v-for="(dataItem, index) in dataList" :key="index" @click="toDetail(dataItem)">
							<view class="wrap">
								<view class="img-box">
									<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(index)"></image>
									<!-- <image :src="$util.img(dataItem.sku_image, { size: 'mid' })" mode="aspectFit" @error="imageError(index)"></image> -->

									<template v-if="value.style == 2 || value.style == 3">
										<image class="bg" :src="$util.img('upload/uniapp/bargain/bg.png')" mode="widthFix"></image>
										<view class="num">已砍{{ dataItem.sale_num }}件</view>
									</template>
								</view>
								<view class="content">
									<view class="title">{{ dataItem.goods_name }}</view>
									<view class="price-box color-base-text">
										￥
										<text class="original-price">{{ dataItem.floor_price }}</text>
									</view>
									<view class="num" v-if="value.style == 1">已砍{{ dataItem.sale_num }}件</view>

									<template v-if="value.style == 2 || value.style == 3">
										<view class="num" style="text-decoration: line-through;">￥{{ dataItem.price }}</view>
										<!-- <view class="btn color-base-bg"><text class="iconfont icongouwuche3"></text></view> -->
									</template>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>

				<view class="marketimg-box-con" v-if="value.changeType == 2">
					<swiper class="marketimg-swiper" style="height: 340rpx;" :autoplay="false">
						<swiper-item class="swiper-item" v-for="index in Math.ceil(dataList.length / 3)">
							<view class="item" style="overflow: hidden;">
								<!-- #ifdef MP-WEIXIN -->
								<block v-for="(dataItem, dataIndex) in dataList" :key="dataIndex" v-if="dataIndex < (index + 1) * 3 && dataIndex >= index * 3">
									<view
										class="marketimg-box-con-item marketimg-box-con-item_two"
										@click="toDetail(dataItem)"
										v-show="3 * (index - 1) <= dataIndex && dataIndex < 3 * (index - 1) + 3"
									>
										<view class="img-box">
											<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(dataIndex)"></image>
											<!-- <image :src="$util.img(dataItem.sku_image, { size: 'mid' })" mode="aspectFit" @error="imageError(dataIndex)"></image> -->

											<template v-if="value.style == 2 || value.style == 3">
												<image class="bg" :src="$util.img('upload/uniapp/bargain/bg.png')" mode="widthFix"></image>
												<view class="num">已砍{{ dataItem.cut_num }}件</view>
											</template>
										</view>
										<view class="content">
											<view class="title">{{ dataItem.goods_name }}</view>
											<view class="price-box color-base-text">
												￥
												<text class="original-price">{{ dataItem.floor_price }}</text>
											</view>
											<view class="num" v-if="value.style == 1">已砍{{ dataItem.cut_num }}件</view>

											<template v-if="value.style == 2 || value.style == 3">
												<view class="num" style="text-decoration: line-through;">￥{{ dataItem.price }}</view>
												<!-- <view class="btn color-base-bg"><text class="iconfont icongouwuche3"></text></view> -->
											</template>
										</view>
									</view>
								</block>
								<!-- #endif -->
								<!-- #ifndef MP-WEIXIN -->
								<block v-for="(dataItem, dataIndex) in dataList" :key="dataIndex" v-if="dataIndex < index * 3 && dataIndex >= (index - 1) * 3">
									<view
										class="marketimg-box-con-item marketimg-box-con-item_two"
										@click="toDetail(dataItem)"
										v-show="3 * (index - 1) <= dataIndex && dataIndex < 3 * (index - 1) + 3"
									>
										<view class="img-box">
											<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(dataIndex)"></image>
											<!-- <image :src="$util.img(dataItem.sku_image, { size: 'mid' })" mode="aspectFit" @error="imageError(dataIndex)"></image> -->

											<template v-if="value.style == 2 || value.style == 3">
												<image class="bg" :src="$util.img('upload/uniapp/bargain/bg.png')" mode="widthFix"></image>
												<view class="num">已砍{{ dataItem.cut_num }}件</view>
											</template>
										</view>
										<view class="content">
											<view class="title">{{ dataItem.goods_name }}</view>
											<view class="price-box color-base-text">
												￥
												<text class="original-price">{{ dataItem.floor_price }}</text>
											</view>

											<view class="num" v-if="value.style == 1">已砍{{ dataItem.cut_num }}件</view>

											<template v-if="value.style == 2 || value.style == 3">
												<view class="num" style="text-decoration: line-through;">￥{{ dataItem.price }}</view>
												<!-- <view class="btn color-base-bg"><text class="iconfont icongouwuche3"></text></view> -->
											</template>
										</view>
									</view>
								</block>
								<!-- #endif -->
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	name: 'diy-pintuan',
	props: {
		value: {
			type: Object
		}
	},
	data() {
		return {
			dataList: []
		};
	},
	components: {},
	created() {
		this.getData();
	},
	mixins: [globalConfig],
	methods: {
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], { size: 'mid' }) : this.$util.getDefaultImage().default_goods_img;
		},
		getData() {
			var data = {
				page: 1,
				page_size: this.value.goodsCount
			};
			if (this.value.sources == 'diy') {
				data.page_size = 0;
				data.id_arr = this.value.goodsId.toString();
			}

			this.$api.sendRequest({
				url: '/bargain/api/goods/page',
				data: data,
				success: res => {
					if (res.code == 0) {
						this.dataList = res.data.list;
					}
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/bargain/detail/detail', {
				bargain_id: e.bargain_id
			});
		},
		imageError(index) {
			this.dataList[index].goods_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
/deep/.uni-scroll-view ::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
	width: 0;
	height: 0;
	color: transparent;
	background: transparent;
}

/deep/::-webkit-scrollbar {
	display: none;
	width: 0;
	height: 0;
	color: transparent;
	background: transparent;
}

scroll-view ::-webkit-scrollbar {
	width: 0;
	height: 0;
	background-color: transparent;
}

.diy-bargain {
	// padding: 0 30rpx;

	.marketing-wrap {
		background-color: #ffffff;
		border-radius: 10rpx;
		overflow: hidden;
		box-sizing: border-box;
		position: relative;

		> image {
			width: 100%;
			position: absolute;
			top: 0;
			z-index: 1;
		}

		.marketimg-box {
			padding: 30rpx 0;
			position: relative;
			z-index: 2;

			.marketimg-box-title {
				display: flex;
				height: 32rpx;
				line-height: 32rpx;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx;

				.marketimg-box-title-left {
					display: flex;
					align-items: center;
					line-height: 32rpx;

					image {
						width: 126rpx;
						height: 30rpx;
						margin-right: 20rpx;
					}

					text {
						color: #909399;
					}
				}

				.marketimg-box-title-right {
					display: flex;
					align-items: center;

					text {
						font-size: 24rpx;
					}

					&.red text {
						background: linear-gradient(-55deg, #ff5151 0%, #ff7b91 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}

					&.blue text {
						background: linear-gradient(-55deg, #0ecfd3 0%, #12d0ae 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}

					&.yellow text {
						background: linear-gradient(-55deg, #feb632 0%, #fe6232 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}

					&.violet text {
						background: linear-gradient(-55deg, #627bfd 0%, #8662fd 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}
			}

			.marketimg-box-title-2 {
				height: 74rpx;
				padding-bottom: 10rpx;

				.marketimg-box-title-left {
					image {
						width: 218rpx;
						height: 74rpx;
					}
				}

				.marketimg-box-title-right {
					font-size: $font-size-tag;
					color: $color-tip;
				}
			}

			.marketimg-box-title-3 {
				height: 74rpx;
				padding-bottom: 10rpx;
				justify-content: center;

				.marketimg-box-title-left {
					image {
						width: 348rpx;
						height: 74rpx;
					}
				}
			}
		}

		.marketimg-box-2,
		.marketimg-box-3 {
			padding: 40rpx 0;
		}

		.marketimg-box-con {
			width: 100%;
			margin-top: 30rpx;

			.marketimg-box-con-scroll {
				width: calc(100% - 30rpx);
				margin: 0 10rpx 0 20rpx;
				line-height: 1;
				white-space: nowrap;
			}

			.marketimg-box-con-item {
				display: inline-block;
				width: 33.333%;
				&.marketimg-box-con-item_two {
					width: calc((100% - 40rpx) / 3);
				}
				.wrap {
					margin: 0 20rpx 0 10rpx;
				}

				.img-box {
					width: 188rpx;
					height: 188rpx;
					position: relative;

					.bg {
						width: 100%;
						position: absolute;
						bottom: 0;
						left: 0;
						z-index: 2;
					}

					.num {
						width: 100%;
						padding-left: 20rpx;
						box-sizing: border-box;
						position: absolute;
						bottom: 10rpx;
						font-size: 20rpx;
						color: #ffffff;
						line-height: 1;
						z-index: 3;
					}
				}

				image {
					width: 188rpx;
					height: 188rpx;
					border-radius: 10rpx;
				}

				.content {
					position: relative;

					.title {
						font-size: $font-size-base;
						line-height: $font-size-base;
						margin-top: 20rpx;
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.price-box {
						font-size: $font-size-tag;
						font-weight: 600;
						height: 32rpx;
						line-height: 32rpx;
						margin-top: 20rpx;

						text {
							font-size: 32rpx;
						}
					}

					.num {
						font-size: 20rpx;
						line-height: 20rpx;
						color: #909399;
						margin-top: 20rpx;
					}

					.btn {
						position: absolute;
						right: 0;
						bottom: 0;
						width: 44rpx;
						height: 44rpx;
						border-radius: 50%;
						text-align: center;
						line-height: 44rpx;

						text {
							font-size: 26rpx;
							color: #ffffff;
						}
					}
				}
			}

			.marketimg-swiper {
				width: 100%;

				.swiper-item {
					padding: 0 30rpx;
					box-sizing: border-box;
				}

				.marketimg-box-con-item {
					margin-right: 20rpx;

					&:nth-child(3n + 3) {
						margin-right: 0;
					}
				}
			}
		}
	}
}

.diy-bargain-list {
	padding: 20rpx;
	.bargin-item-title {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 76rpx;
	}
}
.diy-bargain-list .bargin-item {
	display: flex;
	background-color: #fff;
	border-radius: 10rpx;
	height: 250rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-sizing: border-box;
	border-radius: 10rpx;
	image {
		width: 200rpx;
		height: 200rpx;
		margin-right: 22rpx;
	}
	.content {
		position: relative;
		line-height: 1;
		flex: 1;
		.title {
			font-size: $font-size-tag;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			line-height: 1.4;
		}
		.action {
			position: absolute;
			bottom: 0;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			width: 100%;
		}
		.price-box {
			line-height: 1.6;
			font-size: $font-size-tag;
			.original-price {
				color: #777;
				text-decoration: line-through;
			}
			.time {
				font-size: $font-size-goods-tag;
				text {
					padding: 2rpx 4rpx;
					margin: 0 4rpx;
					color: #fff;
					border-radius: 4rpx;
					line-height: 1;
				}
			}
		}
		.btn {
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0;
			padding: 0;
			width: 136rpx;
			height: 48rpx;
			line-height: 1;
			color: #fff;
			font-size: $font-size-tag;
			border-radius: 40rpx;
		}
	}
	.price-box {
		display: flex;
		flex-direction: column;
	}
	.floor-price {
		font-weight: 500;
	}
}

.diy-bargain-title {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: $padding 0 0 $padding;
	box-sizing: border-box;

	.seckill-title {
		display: flex;
		align-items: center;

		.left-img {
			width: 50rpx;
			height: 50rpx;
			margin-right: 10rpx;
		}
		.seckill-title-name {
			font-size: $font-size-base;
			font-weight: bold;
			margin-right: $margin-both;
		}

		.seckill-title-time {
			font-size: $font-size-tag;
		}
	}

	.seckill-more {
		font-size: $font-size-tag;
		color: #858585;
		margin-right: 20rpx;
	}

	.seckill-more::after {
		font-family: 'iconfont';
		content: '\e6a3';
		font-size: $font-size-base;
		line-height: 1;
		position: relative;
		top: 0;
		margin-left: 2px;
	}
}
</style>
