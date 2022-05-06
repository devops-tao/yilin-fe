<template>
	<view :data-theme="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getData" class="member-point" :size="8" @listenRefresh="listenRefresh" v-if="token">
			<view class="goods_list" slot="list">
				<block v-if="collectionList.length > 0">
					<view class="goods_li margin-top" v-for="(item, index) in collectionList" :key="index" @click.stop="toDetail(item.sku_id)">
						<view class="pic">
							<image :src="$util.img(item.goods_image.split(',')[0], { size: 'mid' })" mode="aspectFill" @error="goodsImageError(index)"></image>
						</view>
						<view class="goods_info">
							<view class="goods_name font-size-base">{{ item.sku_name }}</view>
							<view class="goods_opection">
								<view class="left color-base-text lineheight-clear">
									<text class="symbol">￥</text>
									<text class="price">{{ item.discount_price }}</text>
								</view>
								<view class="right">
									<view class="cars" @click.stop="deleteItem(item.goods_id)">
										<view class="icon iconfont iconicon7"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<!-- 第一个列表为空时 -->
				<ns-empty v-if="collectionList.length == 0 && isShowEmpty" text="暂无关注的商品" :fixed="!1" :isIndex="!1"></ns-empty>
				<ns-goods-recommend ref="goodsRecommend" ></ns-goods-recommend>
			</view>
		</mescroll-uni>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>

	</view>
</template>

<script>
	import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
	import collection from '../public/js/collection.js';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {
			nsGoodsRecommend
		},
		mixins: [collection, globalConfig],
		data() {
			return {
				token: null
			};
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			
			if (uni.getStorageSync('token')) {
				this.token = uni.getStorageSync('token');
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				setTimeout(() => {
					this.$refs.login.open('/otherpages/member/collection/collection');
				});
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
	/deep/ .fixed {
		position: relative;
		top: 0;
	}

	/deep/ .empty {
		margin-top: 0 !important;
	}

	@import '../public/css/collection';
</style>
