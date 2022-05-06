<template>
	<view  v-if="showPage"
		class="goods-list"
		:data-theme="themeStyle"
		:style="{ backgroundColor: goodsValue.backgroundColor, marginTop: goodsValue.marginTop * 2 + 'rpx' }"
	>	
		<template v-if="goodsValue.style == 1 || goodsValue.style == 2">
			<view :class="goodsValue.style == 1 ? 'single-column' : 'double-column'">
				<view class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="toDetail(item)">
					<view class="goods-img">
						<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)" :lazy-load="true"></image>
						<view class="color-base-bg goods-tag" v-if="goodsValue.goodsTag == 'default' && goodsTag(item) != ''">{{ goodsTag(item) }}</view>
						<view class="goods-tag-img" v-if="goodsValue.goodsTag == 'diy'"><image :src="$util.img(goodsValue.tagImg.imageUrl)" mode=""></image></view>
					</view>
					<view class="info-wrap">
						<view class="name-wrap">
							<view class="goods-name">{{ item.goods_name }}</view>
						</view>
						<view class="pro-info">
							<view class="delete-price font-size-activity-tag color-tip">
								<block>
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									{{ item.market_price > 0 ? item.market_price : item.price }}
								</block>
							</view>
							<view class="sale font-size-activity-tag color-tip">已售{{ item.sale_num }}{{ item.unit ? item.unit : '件' }}</view>
						</view>
						<view class="lineheight-clear">
							<view class="discount-price">
								<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
								<text class="price color-base-text font-size-toolbar">{{ showPrice(item) }}</text>
							</view>
							<view class="member-price-tag" v-if="item.member_price && item.member_price == showPrice(item)">
								<image :src="$util.img('upload/uniapp/index/VIP.png')" mode="widthFix"></image>
							</view>
							<view class="member-price-tag" v-else-if="item.promotion_type == 1"><image :src="$util.img('upload/uniapp/index/discount.png')" mode="widthFix"></image></view>
						</view>
					</view>
				</view>
			</view>
		</template>
		
		<template v-if="goodsValue.style == 3">
			<view class="goods-list-3">
				<view class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="toDetail(item)">
					<view class="goods-img">
						<image :src="goodsImg(item.goods_image)" mode="aspectFill" @error="imgError(index)" :lazy-load="true"></image>
						<view class="goods-tag" :style="{'background': 'url(' + bgImg + ') no-repeat', 'backgroundSize': 'cover'}" v-if="goodsValue.goodsTag == 'default' && goodsTag(item) != ''">{{ goodsTag(item) }}</view>
						<view class="goods-tag-img" v-if="goodsValue.goodsTag == 'diy'"><image :src="$util.img(goodsValue.tagImg.imageUrl)" mode=""></image></view>
						<view class="bg"></view>
						<view class="num">已售{{ item.sale_num }}{{ item.unit ? item.unit : '件' }}</view>
					</view>
					<view class="info-wrap">
						<view class="name-wrap">
							<view class="goods-name">{{ item.goods_name }}</view>
						</view>
						<view class="pro-info">
							<view class="lineheight-clear">
								<view class="discount-price">
									<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
									<text class="price color-base-text font-size-toolbar">{{ showPrice(item) }}</text>
								</view>
								<view class="member-price-tag" v-if="item.member_price && item.member_price == showPrice(item)">
									<image :src="$util.img('upload/uniapp/goods/vip.png')" mode="widthFix"></image>
								</view>
							</view>
							
							<view class="delete-price font-size-activity-tag color-tip">
								<block>
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									{{ item.market_price > 0 ? item.market_price : item.price }}
								</block>
							</view>
						</view>
						
						<view class="label">
							<view v-if="item.is_free_shipping == 1">包邮</view>
							<view v-if="item.promotion_type == 1 && (!item.member_price || item.member_price != showPrice(item) )">限时折扣</view>
						</view>
						
						<button class="btn color-base-bg">立即购买</button>
					</view>
				</view>
			</view>
		</template>
		
		<template v-if="goodsValue.style == 4">
			<view class="goods-list-3 goods-list-4" v-show="goodsList.length > 0">
				<view class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="toDetail(item)">
					<view class="goods-img">
						<image :src="goodsImg(item.goods_image)" mode="aspectFill" @error="imgError(index)" :lazy-load="true"></image>
						<view class="goods-tag" :style="{'background': 'url(' + bgImg + ') no-repeat', 'backgroundSize': 'cover'}" v-if="goodsValue.goodsTag == 'default' && goodsTag(item) != ''">{{ goodsTag(item) }}</view>
						<view class="goods-tag-img" v-if="goodsValue.goodsTag == 'diy'"><image :src="$util.img(goodsValue.tagImg.imageUrl)" mode=""></image></view>
						<view class="bg"></view>
						<view class="num">已售{{ item.sale_num }}{{ item.unit ? item.unit : '件' }}</view>
					</view>
					<view class="info-wrap">
						<view class="name-wrap">
							<view class="goods-name">{{ item.goods_name }}</view>
						</view>
						
						<view class="label">
							<view v-if="item.is_free_shipping == 1">包邮</view>
							<view v-if="item.promotion_type == 1 && (!item.member_price || item.member_price != showPrice(item) )">限时折扣</view>
						</view>
						
						<view class="pro-info">
							<view class="lineheight-clear">
								<view class="discount-price">
									<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
									<text class="price color-base-text font-size-toolbar">{{ showPrice(item) }}</text>
								</view>
								<view class="member-price-tag" v-if="item.member_price && item.member_price == showPrice(item)">
									<image :src="$util.img('upload/uniapp/goods/vip.png')" mode="widthFix"></image>
								</view>
							</view>
							
							<!-- <view class="sale font-size-activity-tag color-tip">已售{{ item.sale_num }}{{ item.unit ? item.unit : '件' }}</view> -->
						</view>
						
						<!-- 注释划线价格 -->
						<!-- <view class="delete-price font-size-activity-tag color-tip">
							<block>
								<text class="unit">{{ $lang('common.currencySymbol') }}</text>
								{{ item.market_price > 0 ? item.market_price : item.price }}
							</block>
						</view> -->
						
						<!-- <view class="btn color-base-bg"><text class="iconfont icongouwuche3"></text></view> -->
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';

export default {
	name: 'diy-goods-list',
	props: {
		value: {
			type: Object,
			default: () => {
				return {};
			}
		},
		diyData: {},
		position: {
			type: Number,
			default: -1
		}
	},
	data() {
		return {
			goodsList: [],
			showPage: 1,
			goodsValue: {}
		};
	},
	mixins: [globalConfig],
	created() {
		this.goodsValue = this.value;
		if (this.diyData) {
			this.diyData.value.forEach((v, k) => {
				// if (k == (this.position - 1) && v.controller == "ManyGoodsList") {
				// 	this.showPage = 0;
				// }
				
				if (this.goodsValue.groupTitle == v.title && v.controller == "ManyGoodsList") {
					// this.showPage = 0;
					this.goodsValue.sources = v.list[0].sources;
					this.goodsValue.categoryId = v.list[0].categoryId;
					this.goodsValue.categoryName = v.list[0].categoryName;
					this.goodsValue.goodsId = v.list[0].goodsId;
				}
			})
		}
		this.getGoodsList();
	},
	computed: {
		bgImg() {
			var str = this.$util.img('upload/uniapp/goods/hot.png');
			return str
		},
		goodsGroupChange() {
			return this.$store.state.isGoodsGroupChange;
		}
	},
	watch:{
		value:{
			handler(val){
				this.getGoodsList();
			},
			deep: true
		},
		goodsGroupChange(val){
			var groupTitle = this.$store.state.groupTitle;
			
			if (this.diyData) {
				this.diyData.value.forEach((v, k) => {
					if (v.controller == "ManyGoodsList" && v.title == groupTitle && this.goodsValue.groupTitle == groupTitle) {
						this.goodsValue.sources = v.list[val].sources;
						this.goodsValue.categoryId = v.list[val].categoryId;
						this.goodsValue.categoryName = v.list[val].categoryName;
						this.goodsValue.goodsId = v.list[val].goodsId;
					}
				})
			}
			this.getGoodsList();
		}
	},
	methods: {
		getGoodsList() {
			var data = {
				page: 1,
				page_size: this.goodsValue.goodsCount
			};
			if (this.goodsValue.sources == 'category') {
				data.category_id = this.goodsValue.categoryId;
				data.category_level = 1;
			} else if (this.goodsValue.sources == 'diy') {
				data.page_size = 0;
				data.goods_id_arr = this.goodsValue.goodsId.toString();
			}
			this.$api.sendRequest({
				url: '/api/goodssku/pagecomponents',
				data: data,
				success: res => {
					if (res.code == 0 && res.data) {
							let data = res.data;
							this.goodsList = data.list;
					}
				}
			});
		},
		toDetail(item) {
			this.$util.redirectTo('/pages/goods/detail/detail', {
				sku_id: item.sku_id
			});
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], { size: 'mid' }) : this.$util.getDefaultImage().default_goods_img;
		},
		imgError(index) {
			this.goodsList[index].goods_image = this.$util.getDefaultImage().default_goods_img;
		},
		showPrice(data) {
			let price = data.discount_price;
			if (data.member_price && parseFloat(data.member_price) < parseFloat(price)) price = data.member_price;
			return price;
		},
		goodsTag(data) {
			return data.label_name || '';
		}
	}
};
</script>

<style lang="scss" scoped>
.lineheight-clear {
	line-height: 1 !important;
}
// 商品列表单列样式
.goods-list .single-column {
	.goods-item {
		padding: 26rpx;
		background: #fff;
		border-radius: $border-radius;
		display: flex;
		position: relative;
		margin-top: 10rpx;

		&.first-child {
			margin-top: 0;
		}

		.goods-img {
			width: 200rpx;
			height: 200rpx;
			overflow: hidden;
			border-radius: $border-radius;
			margin-right: 20rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.goods-tag {
			color: #fff;
			line-height: 1;
			padding: 8rpx 12rpx;
			position: absolute;
			border-top-left-radius: $border-radius;
			border-bottom-right-radius: $border-radius;
			top: 26rpx;
			left: 26rpx;
			font-size: $font-size-goods-tag;
		}

		.goods-tag-img {
			position: absolute;
			border-top-left-radius: $border-radius;
			width: 80rpx;
			height: 80rpx;
			top: 26rpx;
			left: 26rpx;
			z-index: 5;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info-wrap {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		.name-wrap {
			flex: 1;
		}

		.goods-name {
			font-size: $font-size-base;
			line-height: 1.3;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			height: 68rpx;
		}

		.introduction {
			line-height: 1;
			margin-top: 10rpx;
		}

		.discount-price {
			display: inline-block;
			font-weight: bold;
			line-height: 1;
			margin-top: 16rpx;

			.unit {
				margin-right: 6rpx;
			}
		}

		.pro-info {
			display: flex;
			margin-top: 16rpx;

			.delete-price {
				text-decoration: line-through;
				flex: 1;

				.unit {
					margin-right: 6rpx;
				}
			}

			& > view {
				line-height: 1;

				&:nth-child(2) {
					text-align: right;
				}
			}
		}

		.member-price-tag {
			display: inline-block;
			width: 60rpx;
			line-height: 1;
			margin-left: 6rpx;

			image {
				width: 100%;
			}
		}
	}
}
// 商品列表双列样式
.goods-list .double-column {
	display: flex;
	flex-wrap: wrap;
	// margin: 0 $margin-both;

	.goods-item {
		flex: 1;
		position: relative;
		background-color: #fff;
		flex-basis: 48%;
		max-width: calc((100% - 30rpx) / 2);
		margin-right: $margin-both;
		margin-bottom: $margin-updown;
		border-radius: $border-radius;

		&:nth-child(2n) {
			margin-right: 0;
		}

		.goods-img {
			position: relative;
			overflow: hidden;
			padding-top: 100%;
			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;

			image {
				width: 100%;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
			}
		}

		.goods-tag {
			color: #fff;
			line-height: 1;
			padding: 8rpx 16rpx;
			position: absolute;
			border-bottom-right-radius: $border-radius;
			top: 0;
			left: 0;
			font-size: $font-size-goods-tag;
		}

		.goods-tag-img {
			position: absolute;
			border-top-left-radius: $border-radius;
			width: 80rpx;
			height: 80rpx;
			top: 0;
			left: 0;
			z-index: 5;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info-wrap {
			padding: 0 26rpx 26rpx 26rpx;
		}

		.goods-name {
			font-size: $font-size-base;
			line-height: 1.3;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			margin-top: 20rpx;
			height: 68rpx;
		}

		.discount-price {
			display: inline-block;
			font-weight: bold;
			line-height: 1;
			margin-top: 16rpx;

			.unit {
				margin-right: 6rpx;
			}
		}

		.pro-info {
			display: flex;
			margin-top: 16rpx;

			.delete-price {
				text-decoration: line-through;
				flex: 1;

				.unit {
					margin-right: 6rpx;
				}
			}

			& > view {
				line-height: 1;

				&:nth-child(2) {
					text-align: right;
				}
			}
		}

		.member-price-tag {
			display: inline-block;
			width: 60rpx;
			line-height: 1;
			margin-left: 6rpx;

			image {
				width: 100%;
			}
		}
	}
}

// 风格三
.goods-list-3 {
	.goods-item {
		width: 100%;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		overflow: hidden;
		margin-top: 20rpx;
		
		&:first-child {
			margin-top: 0;
		}
		
		.goods-img {
			width: 100%;
			height: 330rpx;
			position: relative;
			
			image {
				width: 100%;
				height: 100%;
			}
			
			.goods-tag {
				width: 74rpx;
				height: 74rpx;
				position: absolute;
				top: 10rpx;
				left: 10rpx;
				line-height: 74rpx;
				text-align: center;
				color: #FFFFFF;
				font-size: 22rpx;
			}
			
			.goods-tag-img {
				position: absolute;
				border-top-left-radius: $border-radius;
				width: 80rpx;
				height: 80rpx;
				top: 26rpx;
				left: 26rpx;
				z-index: 5;
				overflow: hidden;
			
				image {
					width: 100%;
					height: 100%;
				}
			}
			
			.bg {
				width: 100%;
				height: 104rpx;
				position: absolute;
				bottom: 0;
				left: 0;
				background: linear-gradient(0deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0) 100%);
			}
			
			.num {
				position: absolute;
				right: 30rpx;
				bottom: 20rpx;
				font-size: 20rpx;
				line-height: 1;
				color: #FFFFFF;
			}
		}
		
		.info-wrap {
			padding: 0 24rpx 36rpx;
			position: relative;
			
			.name-wrap {
				height: 80rpx;
				margin-top: 16rpx;
				
				.goods-name {
					font-size: $font-size-base;
					line-height: 40rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
			
			.pro-info {
				display: flex;
				align-items: flex-end;
				margin-top: 15rpx;
			}
			
			.lineheight-clear {
				margin-right: 20rpx;
				display: flex;
				align-items: center;
				line-height: 1;
				
				.discount-price {
					line-height: 1;
					font-weight: bold;
				}
				
				.member-price-tag {
					width: 44rpx;
					height: 24rpx;
					margin-left: 10rpx;
				}
			}
			
			.delete-price {
				text-decoration: line-through;
				line-height: 1;
			}
			
			.label {
				display: flex;
				align-items: center;
				margin-top: 20rpx;
				
				view {
					height: 28rpx;
					font-size: 20rpx;
					line-height: 26rpx;
					border: 1rpx solid #FF4544;
					border-radius: 6rpx;
					color: #FF4544;
					margin-right: 10rpx;
					padding: 0 7rpx;
				}
			}
			
			.btn {
				width: 160rpx;
				height: 50rpx;
				border-radius: 25rpx;
				text-align: center;
				line-height: 50rpx;
				color: #FFFFFF;
				position: absolute;
				right: 24rpx;
				bottom: 36rpx;
				padding: 0;
				margin: 0;
			}
			
			.member-price-tag {
				display: inline-block;
				width: 60rpx;
				line-height: 1;
				margin-left: 6rpx;
			
				image {
					width: 100%;
				}
			}
		}
	}
}

.goods-list-4 {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	
	.goods-item {
		width: 330rpx;
		
		&:nth-child(-n+2) {
			margin-top: 0;
		}
		
		.info-wrap {
			.delete-price {
				margin-top: 20rpx;
			}
			
			.btn {
				width: 50rpx;
				
				text {
					font-size: 26rpx;
				}
			}
			
			.member-price-tag {
				display: inline-block;
				width: 60rpx;
				line-height: 1;
				margin-left: 6rpx;
			
				image {
					width: 100%;
				}
			}
		}
	}
}
</style>
