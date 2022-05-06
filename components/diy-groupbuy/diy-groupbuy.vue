<template>
	<view class="diy-groupbuy" v-if="list.length > 0" :data-theme="themeStyle" :style="{ backgroundColor: value.backgroundColor, marginTop: value.marginTop * 2 + 'rpx' }">
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
							
						<view class="marketimg-box-title-right" :class="value.bgSelect" @click="$util.redirectTo('/promotionpages/groupbuy/list/list')">
							<text>更多团购</text>
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
							<!-- <image :src="$util.img('upload/uniapp/groupbuy/title1.png')" mode="widthFix"></image> -->
						</view>
							
						<view class="marketimg-box-title-right" @click="$util.redirectTo('/promotionpages/groupbuy/list/list')">
							<text>更多团购</text>
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
							<!-- <image :src="$util.img('upload/uniapp/groupbuy/title2.png')" mode="widthFix"></image> -->
						</view>
					</view>
				</template>
		
				<view class="marketimg-box-con" v-if="value.changeType == 1">
					<scroll-view class="marketimg-box-con-scroll" :scroll-x="true" :show-scrollbar="false">
						<view class="marketimg-box-con-item" v-for="(dataItem, index) in list" :key="index" @click="toDetail(dataItem)">
							<view class="wrap">
								<view class="img-box">
									<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(index)"></image>
									
									<template v-if="value.style == 2 || value.style == 3">
										<image class="bg" :src="$util.img('upload/uniapp/groupbuy/bg.png')" mode="widthFix"></image>
										<view class="num">已团{{dataItem.sell_num}}件</view>
									</template>
								</view>
								<view class="content">
									<view class="title">{{ dataItem.goods_name }}</view>
									<view class="price-box color-base-text">
										￥
										<text class="original-price">{{ dataItem.groupbuy_price }}</text>
									</view>
									<view class="num">￥{{ dataItem.price }}</view>
									
									<template v-if="value.style == 2 || value.style == 3">
										<!-- <view class="btn color-base-bg"><text class="iconfont icongouwuche3"></text></view> -->
									</template>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
		
				<view class="marketimg-box-con" v-if="value.changeType == 2">
					<swiper class="marketimg-swiper" style="height: 340rpx;" :autoplay="false">
						<swiper-item class="swiper-item" v-for="index in Math.ceil(list.length / 3)" :key="index">
							<view class="item" style="overflow: hidden;">
								<!-- #ifdef MP-WEIXIN -->
								<block v-for="(dataItem, dataIndex) in list" :key="dataIndex" v-if="dataIndex < (index + 1) * 3 && dataIndex >= index * 3">
									<view
										class="marketimg-box-con-item marketimg-box-con-item_two"
										@click="toDetail(dataItem)"
										v-show="3 * (index - 1) <= dataIndex && dataIndex < 3 * (index - 1) + 3"
									>
										<view class="img-box">
											<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(dataIndex)"></image>
											
											<template v-if="value.style == 2 || value.style == 3">
												<image class="bg" :src="$util.img('upload/uniapp/groupbuy/bg.png')" mode="widthFix"></image>
												<view class="num">已团{{dataItem.sell_num}}件</view>
											</template>
										</view>
										<view class="content">
											<view class="title">{{ dataItem.goods_name }}</view>
											<view class="price-box color-base-text">
												￥
												<text class="original-price">{{ dataItem.groupbuy_price }}</text>
											</view>
											<view class="num">￥{{ dataItem.price }}</view>
											
											<template v-if="value.style == 2 || value.style == 3">
												<!-- <view class="btn color-base-bg"><text class="iconfont icongouwuche3"></text></view> -->
											</template>
										</view>
									</view>
								</block>
								<!-- #endif -->
								<!-- #ifndef MP-WEIXIN -->
								<block v-for="(dataItem, dataIndex) in list" :key="dataIndex" v-if="dataIndex < index * 3 && dataIndex >= (index - 1) * 3">
									<view
										class="marketimg-box-con-item marketimg-box-con-item_two"
										@click="toDetail(dataItem)"
										v-show="3 * (index - 1) <= dataIndex && dataIndex < 3 * (index - 1) + 3"
									>
										<view class="img-box">
											<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(dataIndex)"></image>
											
											<template v-if="value.style == 2 || value.style == 3">
												<image class="bg" :src="$util.img('upload/uniapp/groupbuy/bg.png')" mode="widthFix"></image>
												<view class="num">已团{{dataItem.sell_num}}件</view>
											</template>
										</view>
										<view class="content">
											<view class="title">{{ dataItem.goods_name }}</view>
											<view class="price-box color-base-text">
												￥
												<text class="original-price">{{ dataItem.groupbuy_price }}</text>
											</view>
											<view class="num">￥{{ dataItem.price }}</view>
											
											<template v-if="value.style == 2 || value.style == 3">
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
	name: 'diy-groupbuy',
	props: {
		value: {
			type: Object
		}
	},
	mixins: [globalConfig],
	data() {
		return {
			list: []
		};
	},
	created() {
		this.getData();
	},
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
				data.goods_id_arr = this.value.goodsId.toString();
			}
			this.$api.sendRequest({
				url: '/groupbuy/api/goods/page',
				data: data,
				success: res => {
					if (res.code == 0) {
						this.list = res.data.list;
					}
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/groupbuy/detail/detail', {
				groupbuy_id: e.groupbuy_id
			});
		},
		imageError(index){
			this.list[index].goods_image = this.$util.getDefaultImage().default_goods_img;
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

.diy-groupbuy {
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
						width: 262rpx;
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
		
		.marketimg-box-2, .marketimg-box-3 {
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
						color: #FFFFFF;
						line-height: 1;
						z-index: 3;
					}
				}

				image {
					width: 100%;
					height: 100%;
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
						text-decoration: line-through;
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
							color: #FFFFFF;
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

.diy-groupbuy-top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 0 0 $padding;
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
