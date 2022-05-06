import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import Http from '../common/js/http.js'

const store = new Vuex.Store({
	state: {
		siteState: 1,
		showToastValue: {
			title: '', //标题
			icon: '', //图标
			duration: 1500 //时间
		},
		tabbarList: {},
		cartNumber: 0, //购物车数量
		themeStyle: '',
		Development: 1,
		addonIsExit: {
			bundling: 0,
			coupon: 0,
			discount: 0,
			fenxiao: 0,
			gift: 0,
			groupbuy: 0,
			manjian: 0,
			memberconsume: 0,
			memberrecharge: 0,
			memberregister: 0,
			membersignin: 0,
			memberwithdraw: 0,
			memberrecommend: 0,
			pintuan: 0,
			pointexchange: 0,
			seckill: 0,
			store: 0,
			topic: 0,
			bargain: 0,
			membercancel: 0,
			servicer: 0,
			supermember: 0,
			giftcard: 0,
			divideticket:0,
			scenefestival: 0,
			birthdaygift : 0,
			pinfan:0
		},
		sourceMember: 0, // 来源会员
		authInfo: {}, // 授权信息
		paySource: '',
		token: null,
		diySeckillInterval: null,
		isGoodsGroupChange: 0, // 首页多商品组组件 -- 分类切换时改变
		groupTitle: '', // 首页多商品组组件 -- 被点击的商品组标题
		shareConfiguration: {},  //分享配置
		flRefresh: 0,
	},
	mutations: {
		setSiteState(state, siteStateVal) {
			state.siteState = siteStateVal;
		},
		setCartNumber(state, cartNumber) {
			state.cartNumber = cartNumber
		},
		setThemeStyle(state, ThemeStyle) {
			state.themeStyle = ThemeStyle
		},
		setAddonIsexit(state, addonIsExit) {
			state.addonIsExit = Object.assign(state.addonIsExit, addonIsExit);
		},
		updateShowToastValue(state, value) {
			state.showToastValue = value;
		},
		setTabbarList(state, value) {
			state.tabbarList = value;
		},
		setToken(state, value) {
			state.token = value;
		},
		setAuthinfo(state, value) {
			state.authInfo = value;
		},
		setSourceMember(state, value) {
			state.sourceMember = value;
		},
		setPaySource(state, value) {
			state.paySource = value;
		},
		setDiySeckillInterval(state, value) {
			state.diySeckillInterval = value;
		},
       setIsGoodsGroupChange(state, value) {
			state.isGoodsGroupChange = value;
		},
		setGroupTitle(state, value) {
			state.groupTitle = value;
		},
		shareConfigurationse(state,value) {
			state.shareConfiguration = value
		},
		setflRefresh(state, flRefreshVal) {
			state.flRefresh = flRefreshVal;
		},
	},
	actions: {
    init() {
			if (uni.getStorageSync('setThemeStyle')) {
				this.commit('setThemeStyle', uni.getStorageSync('setThemeStyle'))
			}
			if (uni.getStorageSync('memberAddonIsExit')) {
				this.commit('setAddonIsexit', uni.getStorageSync('memberAddonIsExit'))
			}
			if (uni.getStorageSync('bottomNav')) {
				this.commit('setTabbarList', uni.getStorageSync('bottomNav'))
			}
			return new Promise((resolve, reject) => {
				Http.sendRequest({
					url: '/api/config/init',
					success: res => {
						var data = res.data;
						if (data) {

							this.commit('setCartNumber', data.cart_count);

							this.commit('setThemeStyle', data.style_theme);
							uni.setStorageSync('setThemeStyle', data.style_theme);

							uni.setStorageSync('memberAddonIsExit', data.addon_is_exit);
							this.commit('setAddonIsexit', data.addon_is_exit);

							this.commit('setTabbarList', data.diy_bottom_nav);

							uni.setStorageSync('default_img', JSON.stringify(data.default_img));

							uni.setStorageSync('copyright', JSON.stringify(data.copyright));

							resolve(data);
						}
					}
				});
			})
		},
		//查询购物车数量
		getCartNumber() {
			if (uni.getStorageSync("token")) {
				return new Promise((resolve, reject) => {
					Http.sendRequest({
						url: '/api/cart/count',
						success: res => {
							if (res.code == 0) {
								this.commit('setCartNumber', res.data)
								resolve(res.data)
							}
						}
					});
				})
			} else {
				this.commit('setCartNumber', 0);
			}
		},
        //获取分享配置
		shareConfigurationse(state){
			Http.sendRequest({
				url: '/weapp/api/weapp/share',
				success: res => {
					if (res.code >= 0) {
						// state.shareConfiguration = '11'
						this.commit('shareConfiguration', '111');
					}
				}
			});
		},
		getThemeStyle() {
			if (uni.getStorageSync('setThemeStyle')) {
				this.commit('setThemeStyle', uni.getStorageSync('setThemeStyle'))
			}
			Http.sendRequest({
				url: '/api/diyview/style',
				success: res => {
					if (res.code == 0) {
						this.commit('setThemeStyle', res.data.style_theme);
						uni.setStorageSync('setThemeStyle', res.data.style_theme);
					}
				}
			});
		},
		// 获取插件是否安装
		getAddonIsexit() {
			if (uni.getStorageSync('memberAddonIsExit')) {
				this.commit('setAddonIsexit', uni.getStorageSync('memberAddonIsExit'))
			}
			return new Promise((resolve, reject) => {
				Http.sendRequest({
					url: '/api/addon/addonisexit',
					success: res => {
						if (res.code == 0) {
							uni.setStorageSync('memberAddonIsExit', res.data);
							this.commit('setAddonIsexit', res.data)
							resolve(res.data)
						}
					}
				});
			});
		},
		getTabbarList() {
			if (uni.getStorageSync('bottomNav')) {
				this.commit('setTabbarList', uni.getStorageSync('bottomNav'))
			}
			return new Promise((resolve, reject) => {
				Http.sendRequest({
					url: '/api/diyview/bottomNav',
					success: res => {
						let data = res.data;
						if (data && data.value && data.value.length) {
							this.commit('setTabbarList', JSON.parse(data.value));
							uni.setStorageSync('bottomNav', data.value);
							resolve(res.data)
						}
					}
				});
			});
		},
        // 获取默认图
		defaultImg() {
			Http.sendRequest({
				url: '/api/config/defaultimg',
				success: res => {
					let data = res.data;
					if (res.code == 0 && data) {
						uni.setStorageSync('default_img', JSON.stringify(data));
					}
				}
			});
		},
	}
})
export default store
