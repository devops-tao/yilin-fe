<template>
	<view :data-theme="themeStyle">
		<mescroll-uni @getData="getData" ref="mescroll" :size="10"  v-if="addonIsExit.pinfan">
			<block slot="list">
				<view class="ns-adv">
					<!-- <image :src="$util.img('upload/default/diy_view/index_groupbuy_gg.png')" mode="widthFix"></image> -->
					<ns-adv keyword="NS_PINFAN"></ns-adv>
				</view>
				<view class="pinfan-step">
					<view class="pinfan-title">
						<image :src="$util.img('upload/uniapp/rebate/rebate_left.png')" mode=""></image>
						<view class="step-title color-base-text">拼团返利玩法</view>
						<image :src="$util.img('upload/uniapp/rebate/rebate_right.png')" mode=""></image>
					</view>
					<view class="step">
						<view class="">
							<image :src="$util.img('upload/uniapp/rebate/open_group.png')" mode=""></image>
							<view>支付开团或参团</view>
						</view>
						<image :src="$util.img('upload/uniapp/rebate/spot.png')" mode=""></image>
						<view class="">
							<image :src="$util.img('upload/uniapp/rebate/deliver_goods.png')" mode=""></image>
							<view>拼中发货未中退款</view>
						</view>
						<image :src="$util.img('upload/uniapp/rebate/spot.png')" mode=""></image>
						<view class="">
							<image :src="$util.img('upload/uniapp/rebate/gift.png')" mode=""></image>
							<view>未拼中获得奖励</view>
						</view>
					</view>
				</view>
				<view class="goods-list single-column" v-if="dataList.length">
					<view class="goods-item margin-bottom" v-for="(item, index) in dataList" :key="index">
						<view class="list-item">
							<view class="goods-img" @click="toDetail(item)">
								<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
								<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
							</view>
							<view class="info-wrap">
								<view class="name-wrap">
									<view class="goods-name" @click="toDetail(item)">{{ item.goods_name }}</view>
									
									<view class="pintuan-info">
										<text class="color-base-text pinfan-num">已拼{{ item.order_num}}件</text>
										<text class="color-base-border color-base-text pinfan-box">{{item.pintuan_num}}人团</text>
									</view>
								</view>
								<view class="lineheight-clear">
									<view class="discount-price">
										<text class="unit color-base-text font-size-tag">￥</text>
										<text class="price color-base-text font-size-toolbar">{{ item.pintuan_price }}</text>
									</view>
								</view>
								<view class="pro-info">
									<view class="delete-price font-size-activity-tag color-tip" v-if="item.is_single_buy==1">
										<text class="font-size-tag lineheight-clear txt">单购价：</text>
										<text class="unit">￥</text>
										{{ item.price }}
									</view>
									<view @click="toDetail(item)" class="detail-btn"><button type="primary" size="mini">立即拼团</button></view>
								</view>
							</view>
						</view>
						<view class="step-status font-size-tag">
							<text class="color-base-text">{{item.pintuan_num}}</text>人拼团，
							<text class="color-base-text">{{item.chengtuan_num}}</text>人拼中，未拼中返
							<text class="color-base-text" v-if="item.reward_type==4">{{item.reward_type_num}}积分</text>
							<text class="color-base-text" v-if="item.reward_type==1||item.reward_type==2">￥{{item.reward_type_num}}</text>
							<text class="color-base-text" v-if="item.reward_type==3">优惠券</text>
						</view>
					</view>
				</view>
				<view v-if="!dataList.length">
					<ns-empty :fixed="false" text="暂无拼团返利"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import uniTag from '@/components/uni-tag/uni-tag.vue';
	import nsAdv from '@/components/ns-adv/ns-adv.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {
			uniTag,nsAdv
		},
		data() {
			return {
				dataList: []
			};
		},
		mixins: [globalConfig],
		onShow() {
			if (!this.addonIsExit.pinfan) {
				this.$util.showToast({
					title: '商家未开启拼团返利',
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
		methods: {
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/pinfan/api/goods/page',
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
				this.$util.redirectTo('/promotionpages/rebate/rebate/detail', {
					pinfan_id: e.pintuan_id
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
	};
</script>

<style lang="scss" scoped>
	@import '../public/css/list.scss';
</style>
