<template>
	<view class="diy-pinfan" v-if="list.length" :style="{ backgroundColor: value.backgroundColor, marginTop: value.marginTop * 2 + 'rpx' }">
		<template v-if="value.style == 1">
			<view class="marketing-wrap marketing-wrap-1">
				<image :src="$util.img('/upload/uniapp/bargain/' + value.bgSelect + '.png')" mode="widthFix"></image>
				<view class="marketimg-box">
					<view class="marketimg-box-title">
						<view class="marketimg-box-title-left">
							<template v-for="(item, index) in value.list" v-if="item.style == 1">
								<image v-if="item.imageUrl" :src="$util.img(item.imageUrl)"></image>
								<text>{{ item.title }}</text>
							</template>
						</view>
			
						<view class="marketimg-box-title-right" :class="value.bgSelect" @click="toMore">
							<text>更多拼团</text>
							<text class="iconfont iconright"></text>
						</view>
					</view>
			
					<view class="marketimg-box-con" v-if="value.changeType == 1">
						<scroll-view class="marketimg-box-con-scroll" :scroll-x="true" :show-scrollbar="false">
							<view class="marketimg-box-con-item" v-for="(dataItem, index) in list" :key="index" @click="toDetail(dataItem)">
								<view class="wrap">
									<view class="img-box">
										<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(index)"></image>
									</view>
									<view class="content">
										<view class="title">{{ dataItem.goods_name }}</view>
										<view class="tuan-box font-size-activity-tag color-base-border"> 
											<text class="tuan color-base-bg">{{ dataItem.pintuan_num }}人团</text>
											<text class="pinfan color-base-text" v-if="dataItem.reward_type==4">返{{dataItem.reward_type_num}}积分</text>
											<text class="pinfan color-base-text" v-if="dataItem.reward_type==1||dataItem.reward_type==2">返￥{{dataItem.reward_type_num}}</text>
											<text class="pinfan color-base-text" v-if="dataItem.reward_type==3">返优惠券</text>
									    </view>
										<view class="price-box color-base-text">
											￥<text class="original-price">{{ dataItem.pintuan_price }}</text>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
			
					<view class="marketimg-box-con" v-if="value.changeType == 2">
						<swiper class="marketimg-swiper" style="height: 360rpx;" :autoplay="false">
							<swiper-item class="swiper-item" v-for="index in Math.ceil(list.length / 3)" :key="index">
								<view class="item" style="overflow: hidden;">
									<!-- #ifdef MP-WEIXIN -->
									<block v-for="(dataItem, dataIndex) in list" :key="dataIndex" v-if="dataIndex < (index + 1) * 3 && dataIndex >= index * 3">
										<view class="marketimg-box-con-item marketimg-box-con-item_two" @click="toDetail(dataItem)">
											<view class="img-box">
												<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(dataIndex)"></image>
											</view>
											<view class="content">
												<view class="title">{{ dataItem.goods_name }}</view>
												<view class="tuan-box font-size-activity-tag color-base-border">
													<text class="tuan color-base-bg">{{ dataItem.pintuan_num }}人团</text>
													<text class="pinfan color-base-text" v-if="dataItem.reward_type==4">返{{dataItem.reward_type_num}}积分</text>
													<text class="pinfan color-base-text" v-if="dataItem.reward_type==1||dataItem.reward_type==2">返￥{{dataItem.reward_type_num}}</text>
													<text class="pinfan color-base-text" v-if="dataItem.reward_type==3">返优惠券</text>
												</view>
												<view class="price-box color-base-text">
													￥<text class="original-price">{{ dataItem.pintuan_price }}</text>
												</view>
											</view>
										</view>
									</block>
									<!-- #endif -->
									<!-- #ifndef MP-WEIXIN -->
									<block v-for="(dataItem, dataIndex) in list" :key="dataIndex" v-if="dataIndex < index * 3 && dataIndex >= (index - 1) * 3">
										<view class="marketimg-box-con-item marketimg-box-con-item_two" @click="toDetail(dataItem)">
											<view class="img-box">
												<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(dataIndex)"></image>
											</view>
											<view class="content">
												<view class="title">{{ dataItem.goods_name }}</view>
												<view class="tuan-box font-size-activity-tag color-base-border">
													<text class="tuan color-base-bg">{{ dataItem.pintuan_num }}人团</text>
													<text class="pinfan color-base-text" v-if="dataItem.reward_type==4">返{{dataItem.reward_type_num}}积分</text>
													<text class="pinfan color-base-text" v-if="dataItem.reward_type==1||dataItem.reward_type==2">返￥{{dataItem.reward_type_num}}</text>
													<text class="pinfan color-base-text" v-if="dataItem.reward_type==3">返优惠券</text>
												</view>
												<view class="price-box color-base-text">
													￥<text class="original-price">{{ dataItem.pintuan_price }}</text>
												</view>
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
		</template>
		
		<template v-if="value.style == 2 || value.style == 3">
			<view class="marketing-wrap marketing-wrap-two" :class="'marketing-wrap-'+ value.style">
				<view class="marketimg-box">
					<view class="marketimg-box-title marketimg-box-title-2" v-if="value.style == 2">
						<view class="marketimg-box-title-left">
							<template v-for="(item, index) in value.list" v-if="item.style == 2">
								<image :src="$util.img(item.imageUrl)"></image>
							</template>
						</view>
						<view class="marketimg-box-title-right" @click="toMore">
							<text>更多拼团</text>
							<text class="iconfont iconright"></text>
						</view>
					</view>
					<view class="marketimg-box-title marketimg-box-title-3" v-if="value.style == 3">
						<view class="marketimg-box-title-left">
							<template v-for="(item, index) in value.list" v-if="item.style == 3">
								<image :src="$util.img(item.imageUrl)"></image>
							</template>
						</view>
					</view>
					<view class="marketimg-box-con">
						<view class="marketimg-box-con-item" v-for="(dataItem, i) in list" :key="i" @click="toDetail(dataItem)">
							<view class="wrap">
								<view class="img-box">
									<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(i)"></image>
								</view>
								<view class="content">
									<view class="top">
										<view class="title">{{ dataItem.goods_name }}</view>
										<view class="label">
											<view>
												<text class="iconfont iconyonghu3 bodicon"></text>
												<text class="group">{{ dataItem.pintuan_num }}人团</text>
											</view>
											<view class="num">已拼{{ dataItem.order_num }}件</view>
										</view>
									</view>
									<view class="bot">
										<view class="price-box">
											<text class="unit color-base-text">￥</text>
											<text class="seckill-price color-base-text">{{ dataItem.pintuan_price }}</text>
											<text class="original-price">￥{{ dataItem.price }}</text>
										</view>
										<view class="btn color-base-bg">
											立即拼团
											<view class="font-size-activity-tag" v-if="dataItem.reward_type==4">返{{dataItem.reward_type_num}}积分</view>
											<view class="font-size-activity-tag" v-if="dataItem.reward_type==1||dataItem.reward_type==2">返￥{{dataItem.reward_type_num}}</view>
											<view class="font-size-activity-tag" v-if="dataItem.reward_type==3">返优惠券</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="marketimg-box-title-right" @click="toMore" v-if="value.style == 3">
						<text>更多拼团</text>
						<text class="iconfont iconright"></text>
					</view>
				</view>
			</view>
		</template>
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
			list: [],
			goodsNum: 0
		};
	},
	created() {
		this.getData();
	},
	computed: {
		itemList: {
			set: function(index) {
				index = index * 3;
				this.goodsNum = this.list.length > index ? index : this.list.length;
			},
			get: function() {
				return this.goodsNum;
			}
		}
	},
	mixins: [globalConfig],
	methods: {
		toMore() {
			this.$util.redirectTo('/promotionpages/rebate/rebate/list');
		},
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
				url: '/pinfan/api/goods/page',
				data: data,
				success: res => {
					if (res.code == 0 && res.data) {
						this.list = res.data.list;
					}
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/rebate/rebate/detail', {
				pinfan_id: e.pintuan_id
			});
		},
		imageError(index) {
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

scroll-view ::-webkit-scrollbar {
	width: 0;
	height: 0;
	background-color: transparent;
}

.diy-pinfan {
	// padding: 0 30rpx;

	.marketing-wrap.marketing-wrap-1 {
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
				width: 33.3333%;
				&.marketimg-box-con-item_two {
					width: calc((100% - 40rpx) / 3);
				}
				.wrap {
					margin: 0 20rpx 0 10rpx;
				}

				.img-box {
					width: 190rpx;
					height: 190rpx;
					text-align: center;
					margin: auto;
				}

				image {
					width: 188rpx;
					height: 188rpx;
					border-radius: 10rpx;
				}

				.content {
					.title {
						font-size: $font-size-base;
						line-height: $font-size-base;
						margin-top: 20rpx;
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					
					.tuan-box{
						padding: 6rpx 0;
						line-height: 1;
						white-space: nowrap;
						margin: 14rpx 0 18rpx;
						.tuan{
							color: #fff;
							border-radius:0 4rpx 4rpx 0;
							padding:2rpx 8rpx;
							border-radius: 2px;
						}
						.pinfan{
							padding: 0px 5px;
							text-align: center;
							border: 1px solid;
							margin: 0 0 0 -2px;
							border-radius: 2px;
						}
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
						display: inline-block;
						width: 84rpx;
						height: 34rpx;
						font-size: 20rpx;
						line-height: 34rpx;
						text-align: center;
						margin-top: 20rpx;
						background-color: rgba(255, 69, 68, 0.06);
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

.diy-pintuan-top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: $padding 0 0 $padding;
	box-sizing: border-box;

	.pintuan-title {
		width: 65%;
		display: flex;
		align-items: center;

		.left-img {
			width: 50rpx;
			height: 50rpx;
			margin-right: 10rpx;
		}
		.pintuan-title-name {
			font-size: $font-size-base;
			font-weight: bold;
		}
		.pintuan-ptyh {
			flex: 1;
			height: 40rpx;
			margin-left: 20rpx;
			.ptyh {
				display: flex;
				align-items: center;
				image {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
				}
				text {
					font-size: $font-size-activity-tag;
					color: rgba(121, 121, 121, 1);
					padding: 0 5rpx;
				}
			}
		}
	}

	.pintuan-more {
		font-size: $font-size-tag;
		color: #858585;
		margin-right: 20rpx;
	}

	.pintuan-more::after {
		font-family: 'iconfont';
		content: '\e6a3';
		font-size: $font-size-base;
		line-height: 1;
		position: relative;
		top: 2rpx;
		margin-left: 4rpx;
	}
}

// 风格二 / 风格三
.marketing-wrap-two {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	
	&.marketing-wrap-2 {
		padding: 40rpx 30rpx 10rpx;
	}
	
	&.marketing-wrap-3 {
		padding: 40rpx 30rpx 0;
		
		
	}
	.marketimg-box-title-right {
		text-align: center;
		line-height: 100rpx;
		border-top: 1rpx solid #EEEEEE;
	}
	.marketimg-box-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 10rpx;
	}
	
	.marketimg-box-title-2 {
		image {
			width: 240rpx;
			height: 70rpx;
		}
	}
	
	.marketimg-box-title-3 {
		justify-content: center;
		
		image {
			width: 348rpx;
			height: 72rpx;
		}
		
		.seckill-title-time {
			justify-content: center;
		}
	}
	
	.marketimg-box-title-left {
		font-size: 0;
	}
	
	.seckill-title-time {
		display: flex;
		align-items: center;
		height: 32rpx;
		line-height: 32rpx;
		margin-top: 20rpx;
		
		view {
			font-size: $font-size-tag;
			line-height: 32rpx;
		}
		
		.seckill-title-name {
			margin-right: 18rpx;
			color: rgba(255, 69, 68, .5);
		}
		
		.seckill-H, .seckill-I, .seckill-S {
			width: 32rpx;
			background-color: #303133;
			border-radius: 4rpx;
			color: #FFFFFF;
			text-align: center;
		}
		
		.symbol {
			color: rgba(255, 69, 68, .5);
			margin: 0 8rpx;
		}
	}
	
	.marketimg-box-title-right {
		text {
			font-size: $font-size-tag;
			color: $color-tip;
		}
	}
	
	// 商品列表
	.marketimg-box-con {
		
		.wrap {
			display: flex;
			align-items: center;
			
			.img-box {
				width: 190rpx;
				height: 190rpx;
				flex-shrink: 0;
				margin-right: 18rpx;
				border-radius: 10rpx;
				overflow: hidden;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
			
			.content {
				padding: 30rpx 0;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				border-bottom: 2rpx solid #EEEEEE;
				width: 420rpx;
				.top {
					.title {
						font-size: $font-size-base;
						line-height: 40rpx;
						position: relative;
						bottom: 8rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						height: 80rpx;
					}
					
					.progress {
						display: flex;
						align-items: center;
						height: 20rpx;
						margin-top: 4rpx;
						
						.left {
							margin-right: 20rpx;
							.box {
								width: 240rpx;
								height: 20rpx;
								border-radius: 10rpx;
								background-color: #FCECD7;
							}
							
							.con {
								height: 20rpx;
								border-radius: 10rpx;
								background-color: #FDBE6C;
							}
						}
						
						.right {
							color: $color-tip;
							font-size: 20rpx;
							line-height: 1;
						}
					}
					.label {
						display: flex;
						align-items: center;
						height: 30rpx;
						margin-top: 4rpx;
						
						view {
							height: 30rpx;
							line-height:30rpx;
							border-radius: 4rpx;
							border: 1rpx solid #FF4544;
							box-sizing: border-box;
							margin-right: 10rpx;
							font-size: 20rpx;
							display: flex;
							align-items: center;
							
							.bodicon {
								display: inline-block;
								width: 30rpx;
								height: 30rpx;
								text-align: center;
								line-height:30rpx;
								font-size: $font-size-tag;
								background-color: #FF4544;
								color: #FFFFFF;
								border-radius: 4rpx 0 0 4rpx;
							}
							
							.group {
								line-height:30rpx;
								color: #FF4544;
								padding: 0 10rpx;
							}
							
							&.num {
								line-height:30rpx;
								color: #FF4544;
								padding: 0 10rpx;
							}
						}
					}
				}
				
				.bot {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					margin-top: 4rpx;
					.price-box {
						display: flex;
						align-items: flex-end;
						line-height: 1;
						
						.unit {
							font-size: $font-size-tag;
						}
						
						.seckill-price {
							font-size: 32rpx;
							margin-right: 10rpx;
							font-weight: bold;
						}
						
						.original-price {
							font-size: 20rpx;
							color: $color-tip;
							text-decoration: line-through;
						}
					}
					
					.btn {
						padding: 0;
						margin: 0;
						color: #FFFFFF;
						width: 160rpx;
						// height: 50rpx;
						text-align: center;
						// line-height: 50rpx;
						padding: 10rpx 0;
						line-height: 1;
						flex-shrink: 0;
						border-radius: $border-radius;
						view{
							line-height: 1;
							color: #FFF;
							margin-top: 10rpx;
						}
					}
				}
			}
		}
		
		.marketimg-box-con-item {
			&:last-child .content {
				border-bottom: 0;
			}
		}
	}
}
</style>
