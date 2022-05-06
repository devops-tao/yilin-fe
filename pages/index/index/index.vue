<template>
	<view :data-theme="themeStyle" :style="{ backgroundColor: bgColor, backgroundImage: bgImg, minHeight: 'calc(100vh - 55px)' }" class="page_img">
		<!-- #ifndef H5 -->
		
		<view class="page-header">
			<ns-navbar
				:is-back="!1"
				:background="bgNav"
				:title-color="textNavColor"
				:border-bottom="false"
				:globalS="diyData.global"
				z-index="1001"
				:type="index"
				type="index"
				ref="topNav">
			</ns-navbar>
		</view>
		
		<!-- #endif -->

		<diy-index-page
			ref="indexPage"
			:value="topIndexValue"
			:minHeight="minHeight"
			:scrollHeight="scrollHeight"
			:scrollTopHeight="scrollTopHeight"
			:bgUrl="bgUrl"
			v-if="topIndexValue">
			<diy-group :diyData="diyData" :storeId="storeId" v-if="diyData.value" :height="scrollTopHeight"></diy-group>
			<view class="padding-bottom"><ns-copy-right></ns-copy-right></view>
		</diy-index-page>

		<scroll-view scroll-y="true" show-scrollbar="false" :style="{ height: 'calc(100vh - headerHeight - 55px)' }" v-else>
			<view class="bg-index" :style="backgroundUrl">
				<diy-group :diyData="diyData" v-if="diyData.value" :storeId="storeId"></diy-group>
				<view class="padding-bottom"><ns-copy-right></ns-copy-right></view>
			</view>
		</scroll-view>

		<template v-show="diyData.global.popWindow && diyData.global.popWindow.count != -1 && diyData.global.popWindow.imageUrl">
			<view @touchmove.prevent.stop>
				<uni-popup ref="uniPopupWindow" type="center" class="wap-floating" :maskClick="false">
					<view class="image-wrap">
						<image
							:src="$util.img(diyData.global.popWindow.imageUrl)"
							@click="redirectTo(diyData.global.popWindow.link)" mode="aspectFit"
						></image><!-- :style="{ height: (480 * diyData.global.popWindow.imgHeight) / diyData.global.popWindow.imgWidth + 'rpx' }" -->
					</view>
					<text class="iconfont iconroundclose" @click="closePopupWindow"></text>
				</uni-popup>
			</view>
		</template>

		<!-- 底部tabBar -->
		<view class="page-bottom" v-if="openBottomNav"><diy-bottom-nav type="shop" @callback="callback"></diy-bottom-nav></view>

		<!-- 收藏 -->
		<uni-popup ref="collectPopupWindow" type="top" class="wap-floating wap-floating-collect">
			<view v-if="showTip" class="collectPopupWindow" :style="{ marginTop: collectTop + statusBarHeight + 'px' }">
				<image :src="$util.img('/upload/uniapp/collect2.png')" mode="aspectFit"></image>
				<text @click="closeCollectPopupWindow">我知道了</text>
			</view>
		</uni-popup>
		
		<!-- <loading-cover ref="loadingCover"></loading-cover> -->
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
import WxMap from 'common/js/map-wx-jssdk.js';
import diyIndexPage from '@/components/diy-index-page/diy-index-page.vue';
import diyGroup from '@/components/diy-group/diy-group.vue';
import nsNavbar from '@/components/ns-navbar/ns-navbar.vue';
import { Weixin } from 'common/js/wx-jssdk.js';
import globalConfig from '@/common/js/golbalConfig.js';
import nsCopyRight from '@/components/ns-copyright/ns-copyright.vue';
let systemInfo = uni.getSystemInfoSync();
export default {
	components: {
		uniPopup,
		diyBottomNav,
		nsNavbar,
		diyIndexPage,
		diyGroup,
		nsCopyRight
	},
	data() {
		return {
			diyData: {
				global: {
					title: '',
					popWindow: {
						imageUrl: '',
						count: -1,
						link: {},
						imgWidth: '',
						imgHeight: ''
					}
				}
			},
			navTitle: '',
			siteInfo: null,
			memberId: 0,
			id: 0,
			store: {}, //首页展示的门店详情
			storeId: 0, //首页展示的门店id

			latitude: null, // 纬度
			longitude: null, // 经度
			isIphoneX: false,

			pageHeight: '0',
			headerHeight: '0',
			bottomHeight: '0',
			topIndexValue: null,
			statusBarHeight: systemInfo.statusBarHeight,
			collectTop: 44,
			showTip: false,
			mpCollect: false,
			showSkeleton: false,  //骨架屏显示隐藏
			shareTitle: '',
			shareImageurl: ''
		};
	},
	//下拉刷新
	async onPullDownRefresh() {
		await this.getDiyInfo();
	},
	watch: {
		storeId() {
			this.$forceUpdate();
		}
	},
	onLoad(data) {
		uni.hideTabBar();
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		// #ifdef MP-WEIXIN
			this.onShare()
		// #endif
		if (data.source_member) {
			uni.setStorageSync('source_member', data.source_member);
		}
		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('source_member') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
				});
			}
		}
		if (uni.getStorageSync('DIYVIEW_INDEX')) {
			this.diyData = JSON.parse(uni.getStorageSync('DIYVIEW_INDEX'));
		}
	},
	onHide() {
		// 清除限时秒杀定时器
		this.$store.commit('setDiySeckillInterval', null);
	},
	async onShow() {
		await this.refresh();
		this.getHeight();
		this.$store.commit('setDiySeckillInterval', 1);
		//记录分享关系
		if(uni.getStorageSync('token') && uni.getStorageSync('source_member')){
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}
	},
	mixins: [globalConfig],
	onPageScroll(e) {
		if (this.$refs.topNav) {
			if (e.scrollTop >= 20) {
				this.$refs.topNav.navTopBg();
			} else {
				this.$refs.topNav.unSetnavTopBg();
			}
		}
	},
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
		bgImg() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.topNavbg ? 'url(' + this.$util.img(this.diyData.global.bgUrl) + ')' : this.diyData.global.bgColor;
			}
			return str;
		},
		bgUrl() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.topNavbg ? 'transparent' : this.diyData.global.bgUrl;
			}
			return str;
		},
		bgNav() {
			if (this.diyData.global.topNavColor) {
				return { background: this.diyData.global.topNavColor };
			} else {
				return { background: '#ffffff' };
			}
		},
		backgroundUrl() {
			var str = this.bgUrl ? 'background:' + 'url(' + this.$util.img(this.bgUrl) + ') no-repeat 0 0/100%' : '';
			return str;
		},
		scrollHeight() {
			if (this.pageHeight != undefined && this.headerHeight != undefined && this.bottomHeight != undefined) {
				return 'calc(' + this.pageHeight + 'px - ' + this.headerHeight + ' - ' + this.bottomHeight + ')';
			} else {
				return '100vh';
			}
		},
		scrollTopHeight() {
			if (this.pageHeight != undefined && this.headerHeight != undefined && this.bottomHeight != undefined) {
				return 'calc(' + this.pageHeight + 'px - ' + this.headerHeight + ' - ' + this.bottomHeight + ' - 80rpx)';
			} else {
				return '100vh';
			}
		},
		textNavColor() {
			if (this.diyData.global.textNavColor) {
				return this.diyData.global.textNavColor;
			} else {
				return '#ffffff';
			}
		},
		openBottomNav() {
			let str = false;
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.openBottomNav;
			}
			return str;
		},
		minHeight() {
			if (this.pageHeight != undefined && this.headerHeight != undefined && this.bottomHeight != undefined) {
				return 'calc(100vh - ' + this.headerHeight + ' - ' + this.bottomHeight + ' - 80rpx)';
			} else {
				return '100vh';
			}
		},
		globalS() {
			return this.diyData.global;
		}
	},
	methods: {
		onShare(){
			this.$api.sendRequest({
				url: '/weapp/api/weapp/share',
				success: res => {
					let that = this
					if (res.code == 0) {
						var value = res.data
						for(let key in value){
							if(key = 'index'){
								that.shareTitle = value[key].title
								that.shareImageurl = that.$util.img(value[key].path)
							}
						}
					}
				}
			})
		},
		// 转换字符数值为真正的数值
		navbarHeight() {
			// #ifdef APP-PLUS || H5
			return this.collectTop ? this.collectTop : 44;
			// #endif
			// #ifdef MP
			// 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
			// 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
			// return menuButtonInfo.height + (menuButtonInfo.top - this.statusBarHeight) * 2;//导航高度
			let height = systemInfo.platform == 'ios' ? 44 : 48;
			return this.collectTop ? this.collectTop : height;
			// #endif
		},
		callback() {
			if (this.$refs.indexPage) {
				this.$refs.indexPage.initPageIndex();
			}
		},
		async refresh() {
			this.store = uni.getStorageSync('store') ? uni.getStorageSync('store') : {};
			if (this.store) this.storeId = this.store.store_id;

			this.$langConfig.refresh();

			if (uni.getStorageSync('token')) {
				this.getMemberId();
			}

			await this.getDiyInfo();
		},
		//计算高度
		getHeight() {
			var self = this;
			//获取页面可用区域的高度
			uni.getSystemInfo({
				success: res => {
					this.pageHeight = res.screenHeight;
				}
			});
			// #ifdef MP || APP-PLUS
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.page-header')
					.boundingClientRect(data => {
						this.headerHeight = data.height + 'px';
					})
					.exec();
			});
			// #endif
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.page-bottom')
					.boundingClientRect(data => {
						this.bottomHeight = 55 + 'px';
					})
					.exec();
			});
		},
		async getDiyInfo() {
			var name = 'DIYVIEW_INDEX';
			this.$api.sendRequest({
				url: '/api/diyview/info',
				data: {
					name: name
				},
				async: true,
				success: res => {
					if (res.code != 0 || !res.data) {
						// if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						this.diyData = {};
						return;
					}
					let diyDatavalue = res.data;
					// console.log(JSON.parse(diyDatavalue.value))
					//处理后台组件input输入单引号问题 -- 英文状态下
					// diyDatavalue.value = diyDatavalue.value.replace(/\@/g, "'");
					if (diyDatavalue.value) {
						uni.setStorageSync('DIYVIEW_INDEX', diyDatavalue.value);
						this.diyData = JSON.parse(diyDatavalue.value);
						this.$langConfig.title(this.diyData.global.title);
						this.navTitle = this.diyData.global.title;
						this.mpCollect = this.diyData.global.mpCollect;
						if (this.diyData.global.popWindow && this.diyData.global.popWindow.imageUrl) {
							// 弹框形式，首次弹出 1，每次弹出 0
							setTimeout(() => {
								if (this.diyData.global.popWindow.count == 1) {
									var index_popwindow_count = uni.getStorageSync('index_popwindow_count');
									if ((this.$refs.uniPopupWindow && index_popwindow_count == '') || (this.$refs.uniPopupWindow && index_popwindow_count == 1)) {
										this.$refs.uniPopupWindow.open();
										uni.setStorageSync('index_popwindow_count', 1);
									}
								} else if (this.diyData.global.popWindow.count == 0) {
									this.$refs.uniPopupWindow.open();
									uni.setStorageSync('index_popwindow_count', 0);
								}
							}, 500);
						}

						for (var i = 0; i < this.diyData.value.length; i++) {
							if (this.diyData.value[i].controller == 'TopCategory') {
								this.topIndexValue = this.diyData.value[i];
							}
						}

						// #ifdef MP
						//小程序收藏
						if (!uni.getStorageSync('isCollect') && this.diyData.global.mpCollect) {
							this.$refs.collectPopupWindow.open();
							this.showTip = true;
						}
						// #endif
					}
					uni.stopPullDownRefresh();
				}
			});
		},
		closePopupWindow() {
			this.$refs.uniPopupWindow.close();
			uni.setStorageSync('index_popwindow_count', -1);
		},
		closeCollectPopupWindow() {
			this.$refs.collectPopupWindow.close();
			uni.setStorageSync('isCollect', true);
		},
		redirectTo(link) {
			this.$util.diyRedirectTo(link);
		},
		getMemberId() {
			this.$api.sendRequest({
				url: '/api/member/id',
				success: res => {
					if (res.code >= 0) {
						this.memberId = res.data;
					}
				}
			});
		},
		// #ifdef MP-WEIXIN
		// 分享到微信朋友圈
		onShareTimeline() {
			this.$api.sendRequest({
				url: '/weapp/api/weapp/share',
				success: res => {
					if (res.code >= 0) {
						// console.log(res)
					}
				}
			});
			let query = '';
			if (this.memberId) query = 'source_member=' + this.memberId;
			return {
				title: '',
				query: query,
				imageUrl: ''
			};
		},
		// #endif
		/**
		 * 检测到路径为分享 建立上下级关系
		 */
		onSourceMember(id){
			this.$api.sendRequest({
				url:'/api/Member/alterShareRelation',
				data:{
					 share_member:id,
				},
				success:res=>{
					if(res.code >=0 ){
						uni.removeStorage({
							key:'source_member',
							success:res=>{
								console.log('删除成功',res)
							}
						})
					}
				}
			})
		},
	},
	onShareAppMessage() {
		return {
			title: this.shareTitle,
			path: '/pages/index/index/index',
			imageUrl: this.shareImageurl,
			success: res => {},
			fail: res => {}
		};
	},
	onReady() {
		// 微信公众号分享
		// #ifdef H5
		if (this.$util.isWeiXin()) {
			this.$api.sendRequest({
				url: '/wechat/api/wechat/share',
				data: {
					url: window.location.href
				},
				success: res => {
					if (res.code == 0) {
						var wxJS = new Weixin();
						wxJS.init(res.data.jssdk_config);

						let shareConfig = res.data.share_config,
							url = this.$config.h5Domain + '/pages/index/index/index';
						if (this.memberId) url += '?source_member=' + this.memberId;

						wxJS.setShareData({
							title: shareConfig.shop_param_1 + shareConfig.site_name,
							desc: shareConfig.shop_param_2 + '\r\n' + shareConfig.shop_param_3 + '\r\n' + '收藏热度：★★★★★',
							link: url,
							imgUrl: this.$util.img(shareConfig.headimg)
						});
					}
				}
			});
		}
		// #endif
	}
};
</script>

<style lang="scss">
.collectPopupWindow {
	position: relative;
	height: 113rpx;
	width: 510rpx;
	margin-left: calc(100% - 530rpx);

	image {
		width: 100%;
		height: 100%;
	}

	text {
		color: #ff4544 !important;
		font-size: 24rpx !important;
		position: absolute;
		top: 48rpx;
		right: 25rpx;
	}
}
.zhezhao {
	width: 100vw;
	height: 100vh;
	background-color: transparent;
}
image {
	max-width: 100% !important;
	max-height: 100% !important;
}
.diy-wrap {
	/* #ifdef H5 */
	height: calc(100vh - 44px);
	/* #endif */
	/* #ifdef MP-WEIXIN */
	height: 100vh;
	/* #endif */
}
.page_img {
	background-size: contain !important;
	background-repeat: no-repeat !important;
}
.bg-index {
	width: 100%;
	height: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
}

.wap-floating {
	.image-wrap {
		
		image {
			// width: 100%;
			// height: 100%;
			max-width:580rpx !important;
			max-height: 820rpx !important;
			border-radius: 40rpx;
		}
	}

	text {
		display: block;
		font-size: 60rpx;
		color: #ffffff;
		text-align: center;
	}
}

.wap-floating-collect .uni-popup__mask {
	background: transparent;
}

::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
}

.popup-box {
	width: 450rpx;
	background: #ffffff;
	border-radius: $border-radius;
	overflow: hidden;

	.close_title {
		width: 100%;
		text-align: center;
		height: 70rpx;
		line-height: 70rpx;
		font-size: $font-size-base;
	}

	.close_content {
		width: 100%;
		max-height: 500rpx;
		padding: $padding;
		box-sizing: border-box;
	}

	.close_content_box {
		width: 100%;
		max-height: 460rpx;
		line-height: 1.3;
	}
}

.noStore-text {
	color: #000000 !important;
}

.isStore-top {
	margin-bottom: 10rpx;
}
.keep-on-record {
	text-align: center;
	padding-bottom: 20rpx;
	image {
		width: 150rpx;
		height: 60rpx;
	}
}
/deep/::-webkit-scrollbar {
	width: 0;
	height: 0;
	background-color: transparent;
	display: none;
}
</style>

<style scoped>
.wap-floating >>> .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none !important;
}

/* .noStore-bg /deep/ .search-box {
	background: #ffffff;
}

.noStore-bg /deep/ .single-graph {
	background: #ffffff;
} */
/deep/ .placeholder {
	height: 0;
}
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>
