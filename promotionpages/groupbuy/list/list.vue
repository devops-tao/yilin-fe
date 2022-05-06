<template>
	<view :data-theme="themeStyle">
		<mescroll-uni @getData="getData" ref="mescroll" :size="10" v-if="addonIsExit.groupbuy">
			<block slot="list">
				<view class="ns-adv">
					<!-- <image :src="$util.img('upload/default/diy_view/index_groupbuy_gg.png')" mode="widthFix"></image> -->
					<ns-adv keyword="NS_GROUPBUY"></ns-adv>
				</view>
				<view class="goods-list single-column" v-if="dataList.length">
					<view class="goods-item margin-bottom" v-for="(item, index) in dataList" :key="index">
						<view class="goods-img" @click="toDetail(item)">
							<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
							<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
						</view>
						<view class="info-wrap">
							<view class="name-wrap">
								<view class="goods-name" @click="toDetail(item)">{{ item.goods_name }}</view>
								<view class="introduction font-size-activity-tag color-tip">库存{{ item.goods_stock }}件</view>
							</view>
							<view class="lineheight-clear">
								<view class="discount-price">
									<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
									<text class="price color-base-text font-size-toolbar">{{ item.groupbuy_price }}</text>
								</view>
							</view>
							<view class="pro-info">
								<view class="delete-price font-size-activity-tag color-tip">
									<block>
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										{{ item.price }}
									</block>
								</view>
								<view @click="toDetail(item)"><button type="primary" size="mini">去团购</button></view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="!dataList.length">
					<ns-empty :fixed="false" text="暂无团购"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import uniTag from '@/components/uni-tag/uni-tag.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {
			uniTag
		},
		data() {
			return {
				dataList: []
			};
		},
		onShow() {
			if (!this.addonIsExit.groupbuy) {
				this.$util.showToast({
					title: '团购插件未安装',
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
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/groupbuy/api/goods/page',
					data: {
						page_size: mescroll.size,
						page: mescroll.num
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
						//设置列表数据
						if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
						this.dataList = this.dataList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail() {
						//联网失败的回调
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			toDetail(e) {
				this.$util.redirectTo('/promotionpages/groupbuy/detail/detail', {
					groupbuy_id: e.groupbuy_id
				});
			},
			imgError(index) {
				this.goodsList[index].goods_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
			goodsImg(imgStr) {
				let imgs = imgStr.split(',');
				return imgs[0] ? this.$util.img(imgs[0], {
					size: 'mid'
				}) : this.$util.getDefaultImage().default_goods_img;
			},
			goodsTag(data) {
				return data.label_name || '';
			}
		},
		onShareAppMessage(res) {
			var title = '参加团购，优惠更多哦';
			var path = '/promotionpages/groupbuy/list/list';
			return {
				title: title,
				path: path,
				success: res => {},
				fail: res => {}
			};
		}
	};
</script>

<style lang="scss" scoped>
	@import '../public/css/list.scss';
</style>
