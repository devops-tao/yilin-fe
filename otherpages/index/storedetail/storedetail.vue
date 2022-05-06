<template>
	<scroll-view scroll-y :data-theme="themeStyle" class="diy-wrap" :style="{ background: bgColor }">
		<!-- #ifndef H5 -->
		<view class="page-header">
			<ns-navbar
					:is-back="!1"
					type="index"
					:globalS="diyData.global"
					:title="navTitle"
					:background="bgNav"
					:title-color="!bgUrl && (!bgColor || bgColor == '#ffffff') ? '#000000' : '#ffffff'"
					:border-bottom="false"
					z-index="1001"
				>
			</ns-navbar>
		</view>
		<!-- #endif -->
		<diy-index-page :value="topIndexValue" :minHeight="minHeight" :scrollHeight="scrollHeight" :scrollTopHeight="scrollTopHeight" :bgUrl="bgUrl" v-if="topIndexValue">
			<diy-group :diyData="diyData" :storeId="storeId" :height="scrollTopHeight"></diy-group>
		</diy-index-page>
		<scroll-view scroll-y="true"  :style="{ height: 'calc(100vh - headerHeight - 55px)'  }" v-else>
			<view class="bg-index" :style="'background:' + 'url(' + $util.img(bgUrl) + ') no-repeat 0 0/100%'">
				<diy-group :diyData="diyData" :storeId="storeId"></diy-group>
			</view>
		</scroll-view>
	
		<template v-if="diyData.global.popWindow && diyData.global.popWindow.count != -1 && diyData.global.popWindow.imageUrl">
			<view @touchmove.prevent.stop>
				<uni-popup ref="uniPopupWindow" type="center" class="wap-floating" :maskClick="false">
					<view class="image-wrap">
						<image :src="$util.img(diyData.global.popWindow.imageUrl)" mode="widthFix" @click="redirectTo(diyData.global.popWindow.link)"></image>
					</view>
					<text class="iconfont iconroundclose" @click="closePopupWindow"></text>
				</uni-popup>
			</view>
		</template>
	
		<loading-cover ref="loadingCover"></loading-cover>
		
		<!-- 底部tabBar -->
		<view class="page-bottom" v-if="openBottomNav"><diy-bottom-nav></diy-bottom-nav></view>
	</scroll-view>
</template>

<script>
import nsNavbar from '@/components/ns-navbar/ns-navbar.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
import globalConfig from '@/common/js/golbalConfig.js';
import diyIndexPage from '@/components/diy-index-page/diy-index-page.vue';
import diyGroup from '@/components/diy-group/diy-group.vue';
import { Weixin } from 'common/js/wx-jssdk.js';

export default {
	components: {
		uniPopup,
		diyBottomNav,
		diyIndexPage,
		diyGroup,
		nsNavbar
	},
	data() {
		return {
			diyData: {
				global: {
					title: '',
					popWindow: {
						imageUrl: '',
						count: -1,
						link: {}
					}
				}
				// value: []
			},
			navTitle:"",
			siteInfo: null,
			memberId: 0,
			name: '',
			storeId: 0, //首页展示的门店id
			latitude: null, // 纬度
			longitude: null, // 经度
			storeList: [],
			showStore: true,

			pageHeight: '0',
			headerHeight: '0',
			bottomHeight: '0',
			topIndexValue: null
		};
	},
	computed: {
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
		openBottomNav() {
			let str = false;
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.openBottomNav;
			}
			return str;
		},
		scrollHeight() {
			if (this.pageHeight != undefined && this.headerHeight != undefined && this.bottomHeight != undefined) {
				return 'calc(' + this.pageHeight + ' - ' + this.headerHeight + ' - ' + this.bottomHeight + ')';
			} else {
				return '100vh';
			}
		},
		minHeight(){
			if (this.pageHeight != undefined && this.headerHeight != undefined && this.bottomHeight != undefined) {
				return 'calc(100vh - ' + this.headerHeight + ' - ' + this.bottomHeight + ' - 80rpx)';
			} else {
				return '100vh';
			}
		},
		scrollTopHeight() {
			if (this.pageHeight != undefined && this.headerHeight != undefined && this.bottomHeight != undefined) {
				return 'calc(' + this.pageHeight + ' - ' + this.headerHeight + ' - ' + this.bottomHeight + ' - 80rpx)';
			} else {
				return '100vh';
			}
		}
	},
	onLoad(data) {
		if (!data.store_id) {
			this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
			return;
		}
		this.storeId = data.store_id;
		
		let location = this.$util.getLocation();
		if (location) {
			this.latitude = location.latitude;
			this.longitude = location.longitude;
		}
		this.name = 'DIY_STORE_' + this.storeId;
		this.getHeight();
		this.refresh();
	},
	onShow() {
		this.$langConfig.refresh();
		if (uni.getStorageSync('token')) {
			this.getMemberId();
		}
	},
	mixins: [globalConfig],
	methods: {
		//计算高度
		getHeight() {
			var self = this;
			//获取页面可用区域的高度
			uni.getSystemInfo({
				success: res => {
					this.pageHeight = res.windowHeight + 'px';
				}
			});
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.page-header')
					.boundingClientRect(data => {
						this.headerHeight = data.height + 'px';
					})
					.exec();
			});
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.page-bottom')
					.boundingClientRect(data => {
						this.bottomHeight = 56 + 'px';
					})
					.exec();
			});
		},
		getDiyInfo() {
			this.$api.sendRequest({
				url: '/api/diyview/info',
				data: {
					name: this.name
				},
				success: res => {
					if (res.code != 0 || !res.data) {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						// this.diyData = {};
						return;
					}

					let diyDatavalue = res.data;
					if (diyDatavalue.value) {
						this.diyData = JSON.parse(diyDatavalue.value);
						this.navTitle = this.diyData.global.title
						if (this.diyData.global.popWindow && this.diyData.global.popWindow.count != -1 && this.diyData.global.popWindow.imageUrl) {
							// 弹框形式，不弹出 -1，首次弹出 1，每次弹出 0
							setTimeout(() => {
								if (this.diyData.global.popWindow.count == 1) {
									var store_popwindow_count = uni.getStorageSync('store_popwindow_count');
									if (store_popwindow_count == '' || store_popwindow_count == 1) {
										this.$refs.uniPopupWindow.open();
										uni.setStorageSync('store_popwindow_count', 1);
									}
								} else if (this.diyData.global.popWindow.count == 0) {
									this.$refs.uniPopupWindow.open();
									uni.setStorageSync('store_popwindow_count', 0);
								}
							}, 500);
						}
						for (var i = 0; i < this.diyData.value.length; i++) {
							if (this.diyData.value[i].controller == 'TopCategory') {
								this.topIndexValue = this.diyData.value[i];
							}
						}
					}
					uni.stopPullDownRefresh();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		closePopupWindow() {
			this.$refs.uniPopupWindow.close();
			uni.setStorageSync('store_popwindow_count', -1);
		},
		refresh() {
			this.getDiyInfo();
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
			let query = 'name=' + this.name;
			if (this.memberId) query += '&source_member=' + this.memberId;
			return {
				title: '',
				query: query,
				imageUrl: ''
			};
		}
		// #endif
	}
};
</script>

<style lang="scss">
.diy-wrap {
	height: calc(100vh - 56px);
}
.bg-index {
	width: 100%;
	height: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
}

.uni-popup__wrapper-box {
	text-align: center;
	overflow: initial !important;
	background: none !important;
	vertical-align: middle;
	background: none;
}

.wap-floating {
	.image-wrap {
		width: 480rpx;

		image {
			width: 100%;
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
::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
}

</style>

<style scoped>
.wap-floating >>> .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none !important;
}
/deep/ .placeholder {
	height: 0;
}
</style>
