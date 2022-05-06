<template>
	<view :data-theme="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getData" :size="5">
			<block slot="list">
				<view class="ns-adv"><image class="fx_adv" :src="$util.img('upload/uniapp/fenxiao/fx_adv.png')" mode="widthFix"></image></view>
				<view class="goods-list double-column" v-if="goodsList.length">
					<view class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="toDetail(item)">
						<view class="goods-img"><image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image></view>
						<view class="info-wrap">
							<view class="name-wrap">
								<view class="goods-name">{{ item.sku_name }}</view>
							</view>
							<view class="pro-info">
								<view class="color-base-text font-size-goods-tag lineheight-clear color-base-border">
									<text class="iconfont iconfenxiang1 color-base-text lineheight-clear font-size-goods-tag"></text>
									赚
									<text class="unit color-base-text font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
									{{ item.commission_money }}
								</view>
							</view>
							<view class="lineheight-clear">
								<view class="discount-price">
									<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
									<text class="price color-base-text font-size-toolbar">{{ item.discount_price }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<ns-empty v-if="emptyShow && goodsList.length == 0" :isIndex="!1" :fixed="!1" text="暂无分销商品"></ns-empty>
			</block>
		</mescroll-uni>
	</view>
</template>

<script>
import fenxiaoWords from 'common/js/fenxiao-words.js';
import MescrollMixin from '@/components/mescroll/mescroll-mixins.js';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			goodsList: [],
			emptyShow: false,
			searchText: '',
			account: 0,
			memberImg: '',
			memberName: ''
		};
	},
	components: {},
	onLoad() {},
	mixins: [fenxiaoWords, MescrollMixin, globalConfig],
	onShow() {
		if (!this.addonIsExit.fenxiao) {
			this.$util.showToast({
				title: '商家未开启分销',
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
		this.$langConfig.title(this.fenxiaoWords.concept + '商品');
		if (uni.getStorageSync('token')) {
			this.getMemberInfo();
		} else {
			this.$util.redirectTo(
				'/otherpages/login/login/login',
				{
					back: '/otherpages/fenxiao/goods/goods'
				},
				'redirectTo'
			);
		}
	},
	methods: {
		//获得列表数据
		getData(mescroll) {
			this.emptyShow = false;
			if (mescroll.num == 1) {
				this.withdrawList = [];
			}
			this.$api.sendRequest({
				url: '/fenxiao/api/goodscollect/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					keyword: this.searchText.trim()
				},
				success: res => {
					this.emptyShow = true;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data && res.data.list) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
					this.goodsList = this.goodsList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//搜索
		search() {
			this.$refs.mescroll.refresh();
		},
		//获取个人信息
		getMemberInfo() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/detail',
				data: {},
				success: res => {
					if (res.code == 0 && res.data) {
						this.account = res.data.account;
						this.memberImg = this.$util.getDefaultImage().default_headimg;
						if (res.data.headimg) {
							this.memberImg = res.data.headimg;
						}
						this.memberName = res.data.fenxiao_name;
					}
				}
			});
		},
		imageError(index) {
			this.goodsList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		goTixian() {
			this.$util.redirectTo('/otherpages/fenxiao/withdraw_apply/withdraw_apply');
		},
		//跳转至商品详情
		toDetail(e) {
			this.$util.redirectTo('/pages/goods/detail/detail', {
				sku_id: e.sku_id
			});
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], { size: 'mid' }) : this.$util.getDefaultImage().default_goods_img;
		},
		imgError(index) {
			this.goodsList[index].goods_image = this.$util.getDefaultImage().default_goods_img;
		}
	}
};
</script>

<style lang="scss">
@import '../public/css/follow.scss';
</style>
