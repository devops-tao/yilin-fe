<template>
	<view :data-theme="themeStyle" class="container">
		<view class="user-section ns-gradient-pages-member-index-index" :data-theme="defaultInfo.topStyle == 'default' ? themeStyle : ''" :style="defaultBgColor">
			<view class="bg-img"><image :src="defaultBgImg" mode="widthFix"></image></view>
			<view class="user-section-box">
				<view class="user-info-box" v-if="token">
					<view @click="$util.redirectTo('/otherpages/member/info/info')" class="user-head">
						<image
							:src="memberInfo.headimg ? $util.img(memberInfo.headimg) : $util.getDefaultImage().default_headimg"
							mode="aspectFill"
							@error="memberInfo.headimg = $util.getDefaultImage().default_headimg"
						></image>
					</view>
					<view class="user-box">
						<text class="user-title" :style="defaultTextColor">{{ memberInfo.nickname }}</text>
						<block v-if="memberInfo.member_level_type == 0">
							<view v-if="memberInfo.member_level_name" @click="$util.redirectTo('/otherpages/member/level/level')" class="user-label">
								<text>{{ memberInfo.member_level_name }}</text>
							</view>
						</block>
						<block v-else>
							<view v-if="memberInfo.member_level_name" @click="$util.redirectTo('/otherpages/member/card/card')" class="user-label">
								<text>{{ memberInfo.member_level_name }}</text>
							</view>
						</block>
					</view>
				</view>
				<view class="user-info-box no-log" v-if="!token" @click="redirectToLink('/pages/member/index/index')">
					<view class="user-head"><image :src="$util.getDefaultImage().default_headimg"></image></view>
					<view class="user-box">
						<text class="user-title" :style="defaultTextColor">{{ $lang('login') }}</text>
						<text class="user-desc" :style="defaultTextColor">{{ $lang('loginTpis') }}</text>
					</view>
				</view>
				<view class="user-set" v-if="token">
					<view :style="defaultTextColor" class="iconfont icontiaoxingmasaomiao" @click="codeView"></view> 
					<view :style="defaultTextColor" class="iconfont iconshezhi"  @click="$util.redirectTo('/otherpages/member/info/info')" ></view>
					<!-- <view :style="defaultTextColor" class="iconfont iconziyuan"></view> -->
				</view>
				<view class="member-sction">
					<view class="sction-item" @click="redirectToLink('/otherpages/member/balance/balance')">
						<text class="num" :style="defaultTextColor">{{ (parseFloat(memberInfo.balance) + parseFloat(memberInfo.balance_money)).toFixed(2) }}</text>
						<text class="sction-item-name" :style="defaultTextColor">{{ $lang('balance') }}</text>
					</view>
					<view class="line"></view>
					<view class="sction-item" @click="redirectToLink('/otherpages/member/point/point')">
						<text class="num" :style="defaultTextColor">{{ parseInt(memberInfo.point) }}</text>
						<text class="sction-item-name" :style="defaultTextColor">{{ $lang('point') }}</text>
					</view>
					<view class="line"></view>
					<view class="sction-item" @click="redirectToLink('/otherpages/member/coupon/coupon')">
						<text class="num" :style="defaultTextColor">{{ couponNum }}</text>
						<text class="sction-item-name" :style="defaultTextColor">{{ $lang('coupon') }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="member-body">
			<!-- 订单模块 -->
			<view class="order-section">
				<view class="order-head" @click="redirectToLink('/pages/order/list/list')">
					<text class="order-tit">{{ $lang('allOrders') }}</text>
					<text class="order-tip">{{ $lang('seeAllOrders') }}</text>
					<text class="order-more iconfont iconright"></text>
				</view>
				<view class="order-body">
					<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitpay')">
						<view class="order-icon">
							<text v-if="orderNum.waitPay > 99" class="order-num color-base-bg">99+</text>
							<text v-else-if="orderNum.waitPay > 0" class="order-num color-base-bg">{{ orderNum.waitPay }}</text>
							<image :src="$util.img('upload/uniapp/member/index/order/default_order_1.png')" mode="aspectFit"></image>
						</view>
						<text class="order-name">{{ $lang('waitPay') }}</text>
					</view>
					<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitsend')">
						<view class="order-icon">
							<text v-if="orderNum.readyDelivery > 99" class="order-num color-base-bg">99+</text>
							<text v-else-if="orderNum.readyDelivery > 0" class="order-num color-base-bg">{{ orderNum.readyDelivery }}</text>
							<image :src="$util.img('upload/uniapp/member/index/order/default_order_2.png')" mode="aspectFit"></image>
						</view>
						<text class="order-name">{{ $lang('readyDelivery') }}</text>
					</view>
					<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitconfirm')">
						<view class="order-icon">
							<text v-if="orderNum.waitDelivery > 99" class="order-num color-base-bg">99+</text>
							<text v-else-if="orderNum.waitDelivery > 0" class="order-num color-base-bg">{{ orderNum.waitDelivery }}</text>
							<image :src="$util.img('upload/uniapp/member/index/order/default_order_3.png')" mode="aspectFit"></image>
						</view>
						<text class="order-name">{{ $lang('waitDelivery') }}</text>
					</view>
					<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitrate')">
						<view class="order-icon">
							<block v-if="evaluateConfig.evaluate_status == 1">
								<text v-if="orderNum.waitEvaluate > 99" class="order-num color-base-bg">99+</text>
								<text v-else-if="orderNum.waitEvaluate > 0" class="order-num color-base-bg">{{ orderNum.waitEvaluate }}</text>
							</block>
							<image :src="$util.img('upload/uniapp/member/index/order/default_order_4.png')" mode="aspectFit"></image>
						</view>
						<text class="order-name">{{ $lang('waitEvaluate') }}</text>
					</view>
					<view class="order-item" @click="redirectToLink('/otherpages/order/activist/activist')">
						<view class="order-icon">
							<text v-if="orderNum.refunding > 99" class="order-num color-base-bg">99+</text>
							<text v-else-if="orderNum.refunding > 0" class="order-num color-base-bg">{{ orderNum.refunding }}</text>
							<image :src="$util.img('upload/uniapp/member/index/order/default_order_5.png')" mode="aspectFit"></image>
						</view>
						<text class="order-name">{{ $lang('refunding') }}</text>
					</view>
				</view>
			</view>

			<!-- 会员卡 -->
			<view v-if="membercard" class="member-level" @click="$util.redirectTo('/otherpages/member/card_buy/card_buy')">
				<view class="member-level-box">
					<text class="iconfont iconhuiyuan"></text>
					<view class="info-wrap">
						<text class="font-size-tag">开通{{ membercard.level_name }}，立省更多</text>
					</view>
					<text class="memeber-tit"><text class="member-btn">立即开通</text></text>
				</view>
			</view>

			<!-- 常用功能模块 -->
			<view class="example-body" :style="{ background: defaultInfo.topStyle == 'default' || defaultInfo.menuStyle == 'palace' ? '#fff' : '#f7f7f7' }">
				<view class="example-body-head" :class="{ 'example-tit-palace': defaultInfo.menuStyle != 'palace' && defaultInfo.topStyle != 'default' }">
					<text class="example-tit">常用工具</text>
				</view>
				<uni-grid :column="4" :show-border="false" :square="false" v-if="defaultInfo.menuStyle == 'palace' && defaultInfo.topStyle != 'default'">
					<block v-for="(item, index) in defaultInfo.menuList" :key="index">
						<view @click="diyRedirect(item)" v-if="menuIsShow(item)">
							<uni-grid-item>
								<image class="image" :src="$util.img(item.img)" mode="aspectFill" />
								<text class="text">{{ item.text }}</text>
								<!-- <text class="text" v-if="item.tag=='fenxiao'">{{ fenxiaoWords.concept + '中心' }}</text> -->
							</uni-grid-item>
						</view>
					</block>
				</uni-grid>
				<uni-grid :column="4" :show-border="false" :square="false" v-if="defaultInfo.topStyle == 'default'">
					<!-- 签到 -->
					<view @click="redirectToLink('/otherpages/member/signin/signin')" v-if="addonIsExit.membersignin && signState == 1">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_sign.png')" mode="aspectFill" />
							<text class="text">签到</text>
						</uni-grid-item>
					</view>

					<!-- 个人资料 -->
					<view @click="redirectToLink('/otherpages/member/info/info')">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_person.png')" mode="aspectFill" />
							<text class="text">{{ $lang('personInfo') }}</text>
						</uni-grid-item>
					</view>

					<!-- 地址管理 -->
					<view @click="redirectToLink('/otherpages/member/address/address')">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_address.png')" mode="aspectFill" />
							<text class="text">{{ $lang('receivingAddress') }}</text>
						</uni-grid-item>
					</view>

					<!-- 账户 -->
					<view @click="redirectToLink('/otherpages/member/account/account')" v-if="addonIsExit.memberwithdraw && withdrawConfig && withdrawConfig.is_use">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_cash.png')" mode="aspectFill" />
							<text class="text">{{ $lang('accountList') }}</text>
						</uni-grid-item>
					</view>

					<!-- 优惠券 -->
					<view @click="redirectToLink('/otherpages/member/coupon/coupon')">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_discount.png')" mode="aspectFill" />
							<text class="text">{{ $lang('couponList') }}</text>
						</uni-grid-item>
					</view>

					<!-- 我的拼单 -->
					<view @click="redirectToLink('/promotionpages/pintuan/my_spell/my_spell')" v-if="addonIsExit.pintuan">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_store.png')" mode="aspectFill" />
							<text class="text">{{ $lang('mySpellList') }}</text>
						</uni-grid-item>
					</view>
					
					<!-- 我的拼团返利 -->
					<view @click="redirectToLink('/promotionpages/rebate/rebate/my_rebate')" v-if="addonIsExit.pinfan">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/my_rebate.png')" mode="aspectFill" />
							<text class="text">{{ $lang('myRebate') }}</text>
						</uni-grid-item>
					</view>

					<!-- 我的礼品 -->
					<view @click="redirectToLink('/otherpages/member/gift/gift')" v-if="addonIsExit.gift">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_gift.png')" mode="aspectFill" />
							<text class="text">{{ $lang('winningRecord') }}</text>
						</uni-grid-item>
					</view>

					<!-- 我的收藏 -->
					<view @click="redirectToLink('/otherpages/member/collection/collection')">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_like.png')" mode="aspectFill" />
							<text class="text">{{ $lang('myCollection') }}</text>
						</uni-grid-item>
					</view>

					<!-- 我的足迹 -->
					<view @click="redirectToLink('/otherpages/member/footprint/footprint')">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_toot.png')" mode="aspectFill" />
							<text class="text">{{ $lang('myTracks') }}</text>
						</uni-grid-item>
					</view>

					<!-- 兑换记录 -->
					<view @click="redirectToLink('/promotionpages/point/order_list/order_list')" v-if="addonIsExit.pointexchange">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_point_recond.png')" mode="aspectFill" />
							<text class="text">{{ $lang('exchangeOrder') }}</text>
						</uni-grid-item>
					</view>

					<!-- 核销台 -->
					<view v-if="authInfo.is_verifier" @click="redirectToLink('/otherpages/verification/index/index')">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_verification.png')" mode="aspectFill" />
							<text class="text">{{ $lang('verification') }}</text>
						</uni-grid-item>
					</view>

					<!-- 分销中心 -->
					<view @click="redirectToLink('/otherpages/fenxiao/index/index')" v-if="addonIsExit.fenxiao && fenxiaoBasicsConfig && fenxiaoBasicsConfig.level > 0">
						<uni-grid-item  v-if="memberInfo.is_fenxiao == 1 || fenxiaoBasicsConfig.is_apply > 0">
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_fenxiao.png')" mode="aspectFill" />
							<text class="text">{{ fenxiaoWords.concept + '中心' }}</text>
						</uni-grid-item>
					</view>

					<!-- 砍价 -->
					<view @click="redirectToLink('/promotionpages/bargain/my_bargain/my_bargain')" v-if="addonIsExit.bargain">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_bargain.png')" mode="aspectFill" />
							<text class="text">{{ $lang('myBargain') }}</text>
						</uni-grid-item>
					</view>

					<!-- 邀请有礼 -->
					<view @click="redirectToLink('/otherpages/member/invite_friends/invite_friends')" v-if="addonIsExit.memberrecommend && memberrecommend">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/default_memberrecommend.png')" mode="aspectFill" />
							<text class="text">{{ $lang('memberRecommend') }}</text>
						</uni-grid-item>
					</view>
					
					<!-- 预售 -->
					<view @click="redirectToLink('/promotionpages/presale/order_list/order_list')" v-if="addonIsExit.presale">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/my_presale.png')" mode="aspectFill" />
							<text class="text">{{ $lang('myPresale') }}</text>
						</uni-grid-item>
					</view>
					
					<!-- 礼品卡 -->
					<view @click="redirectToLink('/promotionpages/giftcard/my_giftcard/my_giftcard')" v-if="addonIsExit.giftcard">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/my_giftcard.png')" mode="aspectFill" />
							<text class="text">{{ $lang('myGiftcard') }}</text>
						</uni-grid-item>
					</view>					
					<!-- 我的瓜分卷 -->
					<view @click="redirectToLink('/promotionpages/guafen/guafen/my_guafen')" v-if="addonIsExit.divideticket">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/my_divideticket.png')" mode="aspectFill"/>
							<text class="text">{{ $lang('myDivideticket') }}</text>
						</uni-grid-item>
					</view>
					<!-- 我的瓜分红包 -->
					<view @click="redirectToLink('/otherpages/hongbao/my_hongbao/my_hongbao')" v-if="addonIsExit.hongbao">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/my_hongbao.png')" mode="aspectFill"/>
							<text class="text">{{ $lang('myHongbao') }}</text>
						</uni-grid-item>
					</view>
					<!-- 我的盲盒 -->
					<view @click="redirectToLink('/otherpages/blindBox/my_box/my_box')" v-if="addonIsExit.blindbox">
						<uni-grid-item>
							<image class="image" :src="$util.img('upload/uniapp/member/index/menu/my_blindbox.png')" mode="aspectFill"/>
							<text class="text">{{ $lang('myBlindBox') }}</text>
						</uni-grid-item>
					</view>
				</uni-grid>
				<view v-if="defaultInfo.menuStyle != 'palace' && defaultInfo.topStyle != 'default'" class="list-style">
					<block v-for="(item, index) in defaultInfo.menuList" :key="index">
						<view
							class="list-style-item"
							:class="defaultInfo.insertGap == 0 ? 'no-interval' : 'interval'"
							@click="diyRedirect(item)"
							v-if="menuIsShow(item)"
						>
							<image class="image" :src="$util.img(item.img)" mode="aspectFill" />
							<text class="text">{{ item.text }}</text>
							<text class="iconfont iconright"></text>
						</view>
					</block>
				</view>
			</view>
		</view>
		<view class="padding-bottom"><ns-copy-right></ns-copy-right></view>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
		<!-- 底部tabBar -->
		<diy-bottom-nav type="shop"></diy-bottom-nav>
		<ns-birthday-gift @getBirthday="getBirthday()" ref="birthdayGift"></ns-birthday-gift>
		<ns-new-gift @getData="getData()" ref="nsNewGift"></ns-new-gift>
		<!-- 条形码、二维码弹窗 -->
		<uni-popup ref="erWeiPopup" type="center">
			<view class="popupContent">
				<view class="popupContent-top" @click="obtain">
					<view class="popupContent-top-title">
						<view :style="defaultTextColor" class="iconfont iconerweima"></view>
						<view class="popupContent-top-title-txt">会员码</view>
					</view>
					<view class="popupContent-top-tiao">
						<image :src="$util.img(barcode)" mode=""></image>
					</view>  
					<view class="popupContent-top-erwei">
						<image :src="$util.img(QRcode)" mode=""></image>
					</view>
					<view class="popupContent-top-shauxin" @click="obtain">
						<text>动态码  {{dynamic_number}}</text>
						<i class="iconfont iconshuaxin"></i>
					</view>
					<view class="popupContent-top-text">如遇到扫码失败请将屏幕调至最亮重新扫码</view>
				</view>
			    <view class="popupContent-bottom">
					<i :style="defaultTextColor" class="iconfont iconfont-delect icon2guanbi" @click="close"></i>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import birthdayGift from '@/components/ns-birthday-gift/ns-birthday-gift.vue';
import nsNewGift from '@/components/ns-new-gift/ns-new-gift.vue' ;

import uniGrid from '@/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
import scroll from '@/common/js/scroll-view.js';
import nsCopyRight from '@/components/ns-copyright/ns-copyright.vue';
import fenxiaoWords from 'common/js/fenxiao-words.js';
import globalConfig from '@/common/js/golbalConfig.js';

export default {
	components: {
		nsNewGift,
		birthdayGift,
		uniGrid,
		uniGridItem,
		diyBottomNav,
		nsCopyRight
	},
	data() {
		return {
			token: '',
			memberInfo: {
				balance: 0,
				balance_money: 0,
				point: 0
			},
			couponNum: 0,
			orderNum: {
				waitPay: 0, //待付款
				readyDelivery: 0, //待发货
				waitDelivery: 0, //待收货
				waitEvaluate: 0, // 待评价
				refunding: 0 // 退款中
			},
			isVerification: true,
			copyrightLoad: 0,
			bottom_info: {},
			authInfo: {
				is_verifier: false
			},

			shopTop: false,
			scrollTop: 0,
			shopConfig: null,
			promoterInfo: null,
			withdrawConfig: null,
			fenxiaoBasicsConfig: null,
			defaultInfo: {
				topStyle: 'default',
				bgColor: '#ff454f',
				textColor: '#fff',
				bgImg: '',
				menuList: [],
				insertGap: '0',
				menuStyle: 'palace',
				level: 1
			},
			signState: 1, // 签到是否开启
			evaluateConfig: {
				evaluate_audit: 1,
				evaluate_show: 0,
				evaluate_status: 1
			},
			memberrecommend: 0,
			membercard: null,
			// 条形码/二维码图片
			QRcode:"",
			barcode:"",
			// 定时器清除
			time:null,
			scannings:null,
			// 扫码后执行下一步路由和参数
			routerParameter:"",
			// 动态码
			dynamic_number:""
		};
	},
	mixins: [scroll, fenxiaoWords, globalConfig],
	computed: {
		storeToken() {
			return this.$store.state.token;
		},
		defaultBgColor() {
			var val = '';
			if (this.defaultInfo.topStyle != 'default') {
				val = 'background:' + this.defaultInfo.bgColor;
			}
			return val;
		},
		defaultBgImg() {
			var defaultImg = '';
			if (this.defaultInfo.topStyle != 'default') {
				defaultImg = this.defaultInfo.bgImg ? this.$util.img(this.defaultInfo.bgImg) : '';
			} else {
				defaultImg = this.$util.img('upload/uniapp/member/index/member_bg.png');
			}
			return defaultImg;
		},
		defaultTextColor() {
			var textColor = '';
			if (this.defaultInfo.topStyle != 'default') {
				textColor = 'color:' + this.defaultInfo.textColor + ' !important';
			}
			return textColor;
		}
	},
	watch: {
		storeToken: async function(nVal, oVal) {
			if (this.addonIsExit.membersignin) {
				await this.getSignState();
			}
			await this.getMemberInfo();
			this.getOrderNum();
			this.getCouponNum();
			this.checkIsVerifier();
		}
	},
	onLoad() {
		uni.hideTabBar();
		if (this.addonIsExit.memberwithdraw) {
			this.getWithdrawConfig();
		}
		if (this.addonIsExit.fenxiao) {
			this.getFenxiaoBasicsConfig();
		}
		this.getEvaluateConfig();
	},
	
	async onReady() {
		if (this.addonIsExit.membersignin) {
			await this.getSignState();
		}
		await this.getDefaultInfo();
		if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
	},
	async onShow() {
		// 刷新多语言
		this.$langConfig.refresh();

		this.token = uni.getStorageSync('token');

		if (uni.getStorageSync('userInfo')) {
			this.memberInfo = uni.getStorageSync('userInfo');
		}
		if (this.token) {
			if (this.addonIsExit.membersignin) {
				await this.getSignState();
			}
			await this.getMemberInfo();
			this.getOrderNum();
			this.getCouponNum();
			this.checkIsVerifier();
			if (this.addonIsExit.birthdaygift) {
				this.getBirthdayGiftTo();
			}
			if (this.addonIsExit.scenefestival) {
				this.getHolidayGiftTo();
			}
		} else {
			this.initInfo();
		}

		if (this.addonIsExit.memberrecommend) {
			this.getMemberRecommend();
		}
		//记录分享关系
		if(uni.getStorageSync('token') && uni.getStorageSync('source_member')){
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}
	},
	methods: {
		//领取之后获取数据
		getData(){
			this.getCouponNum();
			this.getMemberInfo();
		},
		getBirthday(){
			this.getCouponNum();
			this.getMemberInfo();
		},
		// 签到是否开启
		async getSignState() {
			var res = await this.$api.sendRequest({
				url: '/api/membersignin/getSignStatus',
				async: false
			});
			if (res.code == 0) {
				this.signState = res.data.is_use;
			}
		},
		async getDefaultInfo() {
			var res = await this.$api.sendRequest({
				url: '/api/diyview/memberindex',
				async: false
			});
			if (res.code == 0) {
				this.defaultInfo.topStyle = res.data.topStyle;
				this.defaultInfo.bgColor = res.data.bgColor;
				this.defaultInfo.textColor = res.data.textColor;
				this.defaultInfo.bgImg = res.data.bgImg;
				this.defaultInfo.menuStyle = res.data.menuStyle;
				this.defaultInfo.menuList = res.data.menuList;
				this.defaultInfo.insertGap = res.data.insertGap;
				this.defaultInfo.level = res.data.level || 1;
			}
		},
		redirectToLink(url) {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open(url);
			} else {
				if(url == "/otherpages/fenxiao/index/index"){
					this.$api.sendRequest({
						url: '/fenxiao/api/fenxiao/detail',
						success: res => {
							if(res.data){
								if(res.data.status == 3){
									this.$util.showToast({
										title: '分销商已冻结'
									});
									return;
								}else{
									this.$util.redirectTo(url);
								}
							}else{
								this.$util.redirectTo(url);
							}
						},
					});
				}else{
					this.$util.redirectTo(url);
				}
			}
		},
		diyRedirect(data){
			if (data.url == '') {
				if (data.appid) {
					uni.navigateToMiniProgram({
						appId: data.appid,
						path: data.page
					})
				} else if (data.mobile) {
					uni.makePhoneCall({ phoneNumber: data.mobile });
				}
			} else if (data.url.indexOf('http') != -1) {
				this.$util.redirectTo('/otherpages/web/web?src=' + data.url);
			} else {
				this.redirectToLink(data.url);
			}
		},
		initInfo() {
			this.token = '';
			this.memberInfo = {
				balance: '0.00',
				balance_money: '0.00',
				point: 0
			};
			this.couponNum = 0;
			this.orderNum = {
				waitPay: 0, //待付款
				readyDelivery: 0, //待发货
				waitDelivery: 0, //待收货
				waitEvaluate: 0, // 待评价
				refunding: 0 // 退款中
			};
			this.authInfo = {
				is_verifier: false
			};
			uni.stopPullDownRefresh();
		},
		// 获取会员基础信息
		async getMemberInfo() {
			let res = await this.$api.sendRequest({
				url: '/api/member/info',
				async: false
			});
			if (res.code >= 0 && res.data) {
				this.token = uni.getStorageSync('token');
				this.memberInfo = res.data;
				uni.setStorageSync('userInfo', this.memberInfo);
				if (this.addonIsExit.supermember && this.memberInfo.member_level_type == 0) this.getMemberCardInfo();
			} else {
				this.token = '';
				this.initInfo();
				uni.removeStorageSync('token');
				uni.removeStorageSync('userInfo');
			}
			uni.stopPullDownRefresh();
		},
		// 下拉刷新
		onPullDownRefresh() {
			if (uni.getStorageSync('token')) this.getMemberInfo();
			else this.initInfo();
		},
		// 订单数量
		getOrderNum() {
			this.$api.sendRequest({
				url: '/api/order/num',
				data: {
					order_status: 'waitpay,waitsend,waitconfirm,waitrate,refunding'
				},
				success: res => {
					if (res.code == 0) {
						this.orderNum.waitPay = res.data.waitpay;
						this.orderNum.readyDelivery = res.data.waitsend;
						this.orderNum.waitDelivery = res.data.waitconfirm;
						this.orderNum.waitEvaluate = res.data.waitrate;
						this.orderNum.refunding = res.data.refunding;
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		// 优惠券数量
		getCouponNum() {
			this.$api.sendRequest({
				url: '/coupon/api/coupon/num',
				success: res => {
					if (res.code == 0) {
						this.couponNum = res.data;
					}
				}
			});
		},
		checkIsVerifier() {
			this.$api.sendRequest({
				url: '/api/verify/checkisverifier',
				success: res => {
					this.authInfo.is_verifier = res.code == 0;
					this.$forceUpdate();
				}
			});
		},
		jumpLevel() {
			if (uni.getStorageSync('token')) {
				this.$util.redirectTo('/otherpages/member/level/level');
			} else {
				this.$refs.login.open('/pages/member/index/index');
			}
		},
		/**
		 * 获取余额提现配置
		 */
		getWithdrawConfig() {
			this.$api.sendRequest({
				url: '/api/memberwithdraw/config',
				success: res => {
					if (res.code >= 0 && res.data) {
						this.withdrawConfig = res.data;
						this.$forceUpdate();
					}
				}
			});
		},
		/**
		 * 获取分销基本配置
		 */
		getFenxiaoBasicsConfig() {
			this.$api.sendRequest({
				url: '/fenxiao/api/config/basics',
				success: res => {
					if (res.code >= 0) {
						this.fenxiaoBasicsConfig = res.data;
						this.$forceUpdate();
					}
				}
			});
		},
		getEvaluateConfig() {
			this.$api.sendRequest({
				url: '/api/goodsevaluate/config',
				success: res => {
					if (res.code == 0) {
						var data = res.data;
						this.evaluateConfig = data;
					}
				}
			});
		},
		menuIsShow(data) {
			switch (data.tag) {
				case 'fenxiao':
					return this.addonIsExit.fenxiao == 1 && this.fenxiaoBasicsConfig && this.fenxiaoBasicsConfig.level > 0;
					break;
				case 'memberwithdraw':
					return this.withdrawConfig && this.withdrawConfig.is_use == 1;
					break;
				case 'membersignin':
					return this.signState == 1;
					break;
				case 'verifier':
					return this.authInfo.is_verifier;
					break;
				case 'memberrecommend':
					return this.addonIsExit.memberrecommend && this.memberrecommend;
					break;
				default:
					return true;
			}
		},
		getMemberRecommend() {
			this.$api.sendRequest({
				url: '/memberrecommend/api/memberrecommend/info',
				success: res => {
					if (res.code == 0 && res.data) {
						this.memberrecommend = 1;
					}
				}
			});
		},
		getMemberCardInfo() {
			this.$api.sendRequest({
				url: '/supermember/api/membercard/firstcard',
				success: res => {
					if (res.code == 0 && res.data) {
						this.membercard = res.data;
					}
				}
			});
		},
	    // 二维码弹窗打开
		codeView(){
			this.$refs.erWeiPopup.open()
			clearInterval(this.time)
			this.obtain()
			this.time=setInterval(()=>{
				this.obtain()
			},30000)
		},
		// 获取二维码
		obtain(){ 
			let _self = this;
			var res = this.$api.sendRequest({
				url: '/api/member/membereqrcode',
				data: {
					page:''
				},
				success:function(res){
					_self.barcode=res.bar_code;
					_self.QRcode=res.data.path;
					_self.routerParameter=res.data.url;
					_self.dynamic_number=res.dynamic_number;
				},
			});
		},
		// 关闭二维码弹窗
		close(){
			this.$refs.erWeiPopup.close()
			clearInterval(this.time)
		},
		uini(){
			this.$api.sendRequest({
				url: '/api/member/qrcodereduceaccount',
				data: {
					money: '1'
				},
				success: res => {
					console.log(res)
				},
				fail: err => {
					console.log(err)
				}
			})
		},
		getHolidayGiftTo(){
			this.$api.sendRequest({
				url: '/scenefestival/api/config/config',
				success: res => {
					if (res.code >= 0) {
						if(res.data[0]) {
							// console.log("00000000", res)
							if(res.data[0].flag == true && this.$refs.nsNewGift){
								this.$refs.nsNewGift.open();
							}
						}
					}
				},
			});
			
		},
		getBirthdayGiftTo() {
			this.$api.sendRequest({
				url: '/birthdaygift/api/Config/Config',
				success: res => {
					if (res.code >= 0) {
						if(res.data){
							if(this.$refs.birthdayGift && res.data.flag == true){
								// console.log("111111111", res)
								this.$refs.birthdayGift.open();
							} 
						}
					}
				},
			});
		},
		// getBirthdaygiftRecord(){
		// 	this.$api.sendRequest({
		// 		url: '/birthdaygift/api/Config/getRecord',
		// 		data: {
		// 		},
		// 		success: res => {
		// 			if (res.code >= 0) {
		// 				this.record = res.data;
		// 			}
		// 		},
				
		// 	});
		// }
	}
};
</script>

<style lang="scss">
@import '../public/css/index.scss';
/deep/.uni-scroll-view::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
}
</style>
<style scoped>
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>
