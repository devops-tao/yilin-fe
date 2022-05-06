<template>
	<view class="diy-group">
		<view v-for="(item, index) in diyData.value" :key="index">
			<view v-if="addonIsExit.store && showStore && item.controller == 'StoreShow' && currentPage">
				<ns-store
					ref="nsStore"
					:storeId="storeId"
					:value="item"
					:textColor="!bgUrl && (!bgColor || bgColor == '#ffffff') ? '#000000' : '#ffffff'"
					:bgColor="!bgUrl && (!bgColor || bgColor == '#ffffff') ? '#ffffff' : 'rgba(0,0,0,0)'"
				></ns-store>
			</view>

			<template v-if="addonIsExit.store && item.controller == 'StoreInfo'">
				<!-- 门店详情 -->
				<ns-store-info :storeId="storeId"></ns-store-info>
			</template>

			<template v-if="item.controller == 'Text'">
				<!-- 文本 -->
				<diy-text :value="item"></diy-text>
			</template>

			<template v-if="item.controller == 'TextNav'">
				<!-- 文本导航 -->
				<diy-text-nav :value="item"></diy-text-nav>
			</template>

			<template v-if="item.controller == 'Notice'">
				<!-- 公告 -->
				<diy-notice :value="item"></diy-notice>
			</template>

			<template v-if="item.controller == 'GraphicNav'">
				<!-- 图文导航 -->
				<diy-graphic-nav :value="item"></diy-graphic-nav>
			</template>

			<template v-if="item.controller == 'ImageAds'">
				<!-- 图片广告 -->
				<view :class="!showStore || !addonIsExit.store ? 'noStore-bg' : ''"><diy-img-ads :value="item"></diy-img-ads></view>
			</template>

			<template v-if="item.controller == 'Search'">
				<!-- 搜索 -->
				<view :class="!showStore || !addonIsExit.store ? 'noStore-bg' : ''"><diy-search :value="item"></diy-search></view>
				<!-- <view :class="!showStore || !addonIsExit.store ? 'noStore-bg' : 'isStore-top'">
					<diy-search :value="item"></diy-search>
				</view> -->
			</template>

			<template v-if="item.controller == 'Title'">
				<!-- 顶部标题 -->
				<diy-title :value="item"></diy-title>
			</template>

			<template v-if="item.controller == 'RichText'">
				<!-- 富文本 -->
				<diy-rich-text :value="item"></diy-rich-text>
			</template>

			<template v-if="item.controller == 'HorzLine'">
				<!-- 辅助线 -->
				<diy-horz-line :value="item"></diy-horz-line>
			</template>

			<template v-if="item.controller == 'HorzBlank'">
				<!-- 辅助空白 -->
				<diy-horz-blank :value="item"></diy-horz-blank>
			</template>

			<template v-if="item.controller == 'Coupon' && addonIsExit.coupon">
				<!-- 优惠券 -->
				<diy-coupon :value="item"></diy-coupon>
			</template>

			<template v-if="item.controller == 'GoodsList'">
				<!-- 商品列表 -->
				<diy-goods-list :value="item" :diyData="diyData" :position="index"></diy-goods-list>
			</template>
			
			<template v-if="item.controller == 'ManyGoodsList'">
				<!-- 多商品组 -->
				<diy-many-goods-list :value="item" :diyData="diyData" :position="index"></diy-many-goods-list>
			</template>

			<template v-if="item.controller == 'RubikCube'">
				<!-- 魔方、橱窗 -->
				<diy-rubik-cube :value="item"></diy-rubik-cube>
			</template>

			<template v-if="item.controller == 'VideoMoba'">
				<!-- 视频 -->
				<diy-video :value="item"></diy-video>
			</template>

			<template v-if="item.controller == 'Seckill' && addonIsExit.seckill">
				<!-- 秒杀 -->
				<diy-seckill :value="item"></diy-seckill>
			</template>

			<template v-if="item.controller == 'Pintuan' && addonIsExit.pintuan">
				<!-- 拼团 -->
				<diy-pintuan :value="item"></diy-pintuan>
			</template>

			<template v-if="item.controller == 'Groupbuy' && addonIsExit.groupbuy">
				<!-- 团购 -->
				<diy-groupbuy :value="item"></diy-groupbuy>
			</template>
			
			<!-- 拼团返利 -->
			<template v-if="item.controller == 'Pinfan' && addonIsExit.pinfan">
				<diy-rebate :value="item"></diy-rebate>
			</template>

			<template v-if="item.controller == 'Bargain' && addonIsExit.bargain">
				<!-- 砍价 -->
				<diy-bargain :value="item"></diy-bargain>
			</template>
			
			<template v-if="item.controller == 'Presale' && addonIsExit.bargain">
				<!-- 预售 -->
				<diy-presale :value="item"></diy-presale>
			</template>

			<template v-if="item.controller == 'Notes' && addonIsExit.notes">
				<!-- 店铺笔记 -->
				<diy-notes :value="item"></diy-notes>
			</template>

			<view class="diy-goods-level-wrap" v-if="item.controller == 'GoodsCategory'">
				<!-- 商品分类 使用view替代template目的是限制商品分类在自定义首页的高度-->
				<diy-goods-level-category :value="item" :bottom="height"></diy-goods-level-category>
			</view>

			<template v-if="item.controller == 'FloatBtn'">
				<!-- 浮动按钮 -->
				<diy-float-btn :value="item"></diy-float-btn>
			</template>

			<template v-if="item.controller == 'LiveInfo'">
				<!-- 小程序直播 -->
				<!-- #ifdef MP-WEIXIN -->
				<diy-live :value="item"></diy-live>
				<!-- #endif -->
			</template>

			<template v-if="item.controller == 'FenxiaoGoodsList'">
				<!-- 分销商品 -->
				<diy-fenxiao-goods-list :value="item"></diy-fenxiao-goods-list>
			</template>

			<template v-if="item.controller == 'MakeTel'">
				<!-- 浮动按钮 -->
				<diy-make-btn :value="item"></diy-make-btn>
			</template>
		</view>
	</view>
</template>

<script>
import diyHorzBlank from '@/components/diy-horz-blank/diy-horz-blank.vue';
import diyHorzLine from '@/components/diy-horz-line/diy-horz-line.vue';
import diyCoupon from '@/components/diy-coupon/diy-coupon.vue';
import diyGoodsList from '@/components/diy-goods-list/diy-goods-list.vue';
import diyManyGoodsList from '@/components/diy-many-goods-list/diy-many-goods-list.vue';
import diyImgAds from '@/components/diy-img-ads/diy-img-ads.vue';
import diyGraphicNav from '@/components/diy-graphic-nav/diy-graphic-nav.vue';
import diyNotice from '@/components/diy-notice/diy-notice.vue';
import diyRichText from '@/components/diy-rich-text/diy-rich-text.vue';
import diyRubikCube from '@/components/diy-rubik-cube/diy-rubik-cube';
import diySearch from '@/components/diy-search/diy-search.vue';
import diyTextNav from '@/components/diy-text-nav/diy-text-nav.vue';
import diyTitle from '@/components/diy-title/diy-title.vue';
import diyVideo from '@/components/diy-video/diy-video.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import diySeckill from '@/components/diy-seckill/diy-seckill.vue';
import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
import diyPintuan from '@/components/diy-pintuan/diy-pintuan.vue';
import diyGroupBuy from '@/components/diy-groupbuy/diy-groupbuy.vue';
import diyRebate from '@/components/diy-rebate/diy-rebate.vue';
import diyBargain from '@/components/diy-bargain/diy-bargain.vue';
import diyNotes from '@/components/diy-notes/diy-notes.vue';
import diyGoodsLevelCategory from '@/components/diy-goods-level-category/diy-goods-level-category.vue';
import diyLive from '@/components/diy-live/diy-live.vue';
import diyFloatBtn from '@/components/diy-float-btn/diy-float-btn.vue';
import globalConfig from '@/common/js/golbalConfig.js';
import diyFenxiaoGoodsList from '@/components/diy-fenxiao-goods-list/diy-fenxiao-goods-list';
import nsStore from '@/components/ns-store/ns-store.vue';
import nsStoreInfo from '@/components/ns-store-info/ns-store-info.vue';
import diyPresale from '@/components/diy-presale/diy-presale.vue';
import diyMakeBtn from '@/components/diy-make-btn/diy-make-btn.vue';

export default {
	components: {
		diyHorzBlank,
		diyHorzLine,
		diyCoupon,
		diyGoodsList,
		diyManyGoodsList,
		diyImgAds,
		diyGraphicNav,
		diyNotice,
		diyRichText,
		diyRubikCube,
		diySearch,
		diyTextNav,
		diyTitle,
		diyVideo,
		uniPopup,
		diySeckill,
		diyBottomNav,
		diyPintuan,
		diyGroupBuy,
		diyRebate,
		diyNotes,
		diyGoodsLevelCategory,
		diyFloatBtn,
		diyLive,
		diyBargain,
		nsStore,
		nsStoreInfo,
		diyFenxiaoGoodsList,
		diyPresale,
		diyMakeBtn
	},
	props: {
		diyData: {
			type: Object
		},
		storeId: {
			type: [String, Number]
		},
		height: {
			type: String,
			default() {
				return '100vh';
			}
		}
	},
	data() {
		return {
			currentPage: false,
			showStore: false,
			currentRouteShowStore: false
		};
	},
	mixins: [globalConfig],
	computed: {
		top() {
			let top = 0;
			// #ifndef h5
			top = this.isIphoneX ? 180 : 140;
			// #endif
			// #ifdef H5
			top = 90;
			// #endif
			return top;
		},
		bgColor() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.bgColor;
			}
			return str;
		},
		bgUrl() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.bgUrl;
			}
			return str;
		},
		bgNav() {
			if (this.bgUrl) {
				return { background: 'url(' + this.$util.img(this.bgUrl) + ') no-repeat 0 0/100%' };
			} else if (this.bgColor) {
				return { background: this.bgColor };
			} else {
				return { background: '#ffffff' };
			}
		}
	},
	mounted() {
		if (this.diyData != undefined) {
			this.dealData();
		}
		let currentPage = getCurrentPages()[getCurrentPages().length - 1].route;
		if (currentPage != 'otherpages/diy/diy/diy') {
			this.currentPage = true;
		}
	},
	methods: {
		dealData() {
			if (Array.isArray(this.diyData.value)) {
				for (var i = 0; i < this.diyData.value.length; i++) {
					if (this.diyData.value[i].controller == 'StoreShow') {
						this.showStore = true;
					}
				}
			}
		}
	}
};
</script>

<style lang="scss">
.diy-group {
	width: 100%;
}
.diy-goods-level-wrap{
	position: relative;
	height: 60vh;
}
</style>
