<template>
	<scroll-view scroll-y="true" :data-theme="themeStyle" class="diy-wrap" :style="{ backgroundColor: backgroundColor, background: backgroundStyleImage}">
		<!-- #ifndef H5 -->
		<ns-navbar :is-back="!1" :background="bgNav" :title-color="textNavColor" :border-bottom="false" :globalS="diyData.global"
		 z-index="1001" :type="index" type="index" ref="topNav"></ns-navbar>
		<view class="page-header"></view>
		<!-- #endif -->
		<diy-index-page :value="topIndexValue" :scrollHeight="scrollHeight" :scrollTopHeight="scrollTopHeight" :bgUrl="bgUrl"
		 v-if="topIndexValue">
			<diy-group :diyData="diyData" :storeId="storeId" :height="scrollTopHeight"></diy-group>
		</diy-index-page>
		<scroll-view scroll-y="true" v-else :style="{ height: scrollHeight }">
			<view class="bg-index" :style="'background:' + 'url(' + $util.img(bgUrl) + ') no-repeat 0 0/100%'">
				<diy-group :diyData="diyData" :storeId="storeId"></diy-group>
			</view>
		</scroll-view>

		<template v-if="diyData.global.popWindow && diyData.global.popWindow.count != -1 && diyData.global.popWindow.imageUrl">
			<view @touchmove.prevent.stop>
				<uni-popup ref="uniPopupWindow" type="center" class="wap-floating" :maskClick="false">
					<view class="image-wrap">
						<image :src="$util.img(diyData.global.popWindow.imageUrl)" mode="aspectFit" @click="redirectTo(diyData.global.popWindow.link)"></image>
					</view>
					<text class="iconfont iconroundclose" @click="closePopupWindow"></text>
				</uni-popup>
			</view>
		</template>
		
		<!-- 底部tabBar -->
		<view class="page-bottom" v-if="openBottomNav">
			<diy-bottom-nav :name="name"></diy-bottom-nav>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</scroll-view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	import diyIndexPage from '@/components/diy-index-page/diy-index-page.vue';
	import diyGroup from '@/components/diy-group/diy-group.vue';
	import nsNavbar from '@/components/ns-navbar/ns-navbar.vue';
	export default {
		components: {
			uniPopup,
			diyIndexPage,
			diyGroup,
			diyBottomNav,
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
				},
				navTitle: '',
				siteInfo: null,
				memberId: 0,
				name: '',
				pageHeight: '0',
				headerHeight: '0',
				bottomHeight: '0',
				topIndexValue: null,
				storeId: 0, //展示的门店id
				backgroundColor: "#f8f8f8",
				backgroundImage: ""
			};
		},
		computed: {
			backgroundStyleImage(){
				let str = '';
				if(this.backgroundImage){
					str = 'url(' + this.$util.img(this.backgroundImage) + ') no-repeat 0 0/100%';
				}
				return str;
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
				if (this.diyData && this.diyData.global) {
					return {
						background: this.diyData.global.topNavColor
					};
				} else {
					return {
						background: '#ffffff'
					};
				}
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
			minHeight() {
				if (this.pageHeight != undefined && this.headerHeight != undefined && this.bottomHeight != undefined) {
					return 'calc(100vh - ' + this.headerHeight + ' - ' + this.bottomHeight + ' - 80rpx)';
				} else {
					return '100vh';
				}
			},
			globalS() {
				return this.diyData.global
			},
		},
		mixins: [globalConfig],
		//下拉刷新
		async onPullDownRefresh() {
			await this.refresh();
		},
		async onLoad(data) {
			this.name = data.name || '';
			if (this.name) {
				this.$langConfig.refresh();
				await this.refresh();

				if (data.source_member) uni.setStorageSync('source_member', data.source_member);
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
			} else {
				this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
			}
			this.getHeight();
		},
		onShow() {
			if (uni.getStorageSync('token')) {
				this.getMemberId();
			}

			this.store = uni.getStorageSync('store') ? uni.getStorageSync('store') : {};
			if (this.store) this.storeId = this.store.store_id;
			
			//记录分享关系
			if(uni.getStorageSync('token') && uni.getStorageSync('source_member')){
				this.$util.onSourceMember(uni.getStorageSync('source_member'));
			}
		},
		watch: {
			storeId() {
				this.$forceUpdate();
			}
		},
		methods: {
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
				this.$api.sendRequest({
					url: '/api/diyview/info',
					data: {
						name: this.name
					},
					async: true,
					success: res => {
						if (res.code != 0 || !res.data) {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
							this.diyData = {};
							return;
						}
						let diyDatavalue = res.data;
						if (diyDatavalue.value) {
							this.diyData = JSON.parse(diyDatavalue.value);
							this.backgroundImage = this.diyData.global.bgUrl;
							this.backgroundColor = this.diyData.global.bgColor;
							this.$langConfig.title(this.diyData.global.title);
							this.navTitle = this.diyData.global.title;
							if (this.diyData.global.popWindow && this.diyData.global.popWindow.count != -1 && this.diyData.global.popWindow
								.imageUrl) {
								// 弹框形式，不弹出 -1，首次弹出 1，每次弹出 0
								setTimeout(() => {
									if (this.diyData.global.popWindow.count == 1) {
										var diy_popwindow_count = uni.getStorageSync('diy_popwindow_count');
										if (diy_popwindow_count == '' || diy_popwindow_count == 1) {
											this.$refs.uniPopupWindow.open();
											uni.setStorageSync('diy_popwindow_count', 1);
										}
									} else if (this.diyData.global.popWindow.count == 0) {
										this.$refs.uniPopupWindow.open();
										uni.setStorageSync('diy_popwindow_count', 0);
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
				uni.setStorageSync('diy_popwindow_count', -1);
			},
			async refresh() {
				await this.getDiyInfo();
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
		},
		onShareAppMessage(res) {
			var title = '';
			if (this.siteInfo) title = this.siteInfo.title;
			var path = '/otherpages/diy/diy/diy?name=' + this.name;
			if (this.memberId) path += '&source_member=' + this.memberId;
			return {
				title: title,
				path: path,
				success: res => {},
				fail: res => {}
			};
		}
	};
</script>

<style lang="scss">
	.diy-wrap{
		height: 100vh;
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
	.wap-floating>>>.uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
		background: none !important;
	}

	/deep/ .placeholder {
		height: 0;
	}
</style>
