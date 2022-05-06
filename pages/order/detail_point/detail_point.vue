<template>
	<view class="detail-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<!-- 订单状态 -->
		<view class="status-wrap color-base-bg" :style="{ backgroundImage: 'url(' + $util.img('upload/uniapp/order/status-wrap-bg.png') + ')' }">
			<view class="order-status-left">
				<image v-if="orderData.order_status == 0" :src="$util.img('/upload/uniapp/order/order-icon.png')"></image>
				<image v-if="orderData.order_status == 1" :src="$util.img('/upload/uniapp/order/order-icon-received.png')"></image>
				<image v-if="orderData.order_status == -1" :src="$util.img('/upload/uniapp/order/order-icon-close.png')"></image>
				<view class="status-name">
					<view class="status-name">
						{{ orderData.order_status == 0 ? '待支付' : orderData.order_status == 1 ? '已完成' : orderData.order_status == -1 ? '已关闭' : '' }}
					</view>
				</view>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap" style="margin-top: -69rpx">
			<view class="site-body">
				<view class="goods-wrap">
					<view @click="goDetail(orderData.exchange_goods_id)" class="goods-img">
						<image :src="exchangeImage(orderData)" @error="imageError()" mode="aspectFill"></image>
					</view>
					<view class="goods-info">
						<view @click="goDetail(orderData.exchange_goods_id)" class="goods-name">{{ orderData.exchange_name }}</view>
						<view class="goods-sub-section">
							<view>
								<text class="goods-price color-base-text">
									<text>
										<text>{{ orderData.point }}积分</text>
										<text v-if="orderData.price > 0">
											+
											<text class="unit">{{ $lang('common.currencySymbol') }}</text>
											{{ orderData.price }}
										</text>
									</text>
								</text>
							</view>
							<view>
								<text>
									<text class="iconfont iconclose"></text>
									{{ orderData.num }}
								</text>
							</view>
						</view>
						<view class="goods-action">
							<block v-if="orderData.is_enable_refund">
								<view @click="goRefund(goodsItem.order_goods_id)" v-if="goodsItem.refund_status == 0 || goodsItem.refund_status == -1">
									<view class="order-box-btn">{{ orderData.order_status == 10 ? '申请售后' : '申请退款' }}</view>
								</view>
							</block>
							<view @click="goRefundDetail(goodsItem.order_goods_id)" v-if="goodsItem.refund_status != 0 && goodsItem.refund_status != -1">
								<view class="order-box-btn">{{ orderData.order_status == 10 ? '查看售后' : '查看退款' }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 订单概况 -->
		<view class="order-summary">
			<view class="order-cell">
				<text class="tit">订单编号：</text>
				<view class="box">
					<text class="color-title">{{ orderData.order_no }}</text>
					<view class="copy" @click="$util.copy(orderData.order_no)">复制</view>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">订单交易号：</text>
				<view class="box">
					<text class="color-title">{{ orderData.out_trade_no }}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">创建时间：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.create_time) }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.close_time > 0">
				<text class="tit">关闭时间：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.close_time) }}</text>
				</view>
			</view>
			<!-- 联系客服 -->
			<view class="kefu">
				<!-- #ifdef MP -->
				<!-- <button type="default" hover-class="none" open-type="contact" v-if="kefuConfig.weapp == 1">
					<text class="iconfont iconziyuan"></text>
					<text>联系客服</text>
				</button>
				<view v-else-if="kefuConfig.system == 1" @click="goConnect">
					<text class="iconfont iconziyuan"></text>
					<text>联系客服</text>
				</view> -->
				<!-- #endif -->
				<view v-if="kefuConfig.system == 1" @click="goConnect">
					<text class="iconfont iconziyuan"></text>
					<text>联系客服</text>
				</view>
				<!-- #ifndef MP -->
				<!-- <view v-if="kefuConfig.open == 1" @click="goConnect">
					<text class="iconfont iconziyuan"></text>
					<text>联系客服</text>
				</view>
				<view v-else-if="kefuConfig.system == 1" @click="goConnect">
					<text class="iconfont iconziyuan"></text>
					<text>联系客服</text>
				</view> -->
				<!-- #endif -->
			</view>
		</view>

		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell" v-if="orderData.point > 0">
				<text class="tit">使用积分</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text>{{ orderData.point }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.delivery_price > 0">
				<text class="tit">运费</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="unit font-size-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.delivery_price }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.order_money > 0">
				<view class="box align-right">
					<text>实付金额：</text>
					<text class="color-base-text">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text class="font-size-base">{{ orderData.order_money }}</text>
					</text>
				</view>
			</view>

			<view class="order-action" v-if="orderData.order_status == 0 && orderData.type == 1">
				<view class="order-box-btn" @click="orderClose()">关闭</view>
				<view class="order-box-btn color-base-bg color-base-border color-text-white" @click="openChoosePayment()">支付</view>
			</view>
		</view>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :payMoney="orderData.order_money" @confirm="orderPay(orderData)"></ns-payment>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import nsPayment from '@/components/payment/payment.vue';

export default {
	mixins: [globalConfig],
	data() {
		return {
			isIphoneX: false,
			orderId: 0,
			orderData: {
				action: []
			},
			action: {
				icon: ''
			},
			storeDetail: {},
			kefuConfig: {
				weapp: '',
				system: '',
				open: '',
				open_url: ''
			}
		};
	},
	components: {
		nsPayment
	},
	onLoad(option) {
		if (option.order_id) this.orderId = option.order_id;
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();

		this.isIphoneX = this.$util.uniappIsIPhoneX();

		if (uni.getStorageSync('token')) {
			this.getOrderData();
		} else {
			this.$util.redirectTo('/otherpages/login/login/login', { back: '/pages/order/detail_point/detail_point?order_id=' + this.orderId });
		}
		this.getKekuConfig();
	},
	methods: {
		//联系客服
		goConnect() {
			let that = this;
			if (uni.getStorageSync('token')) {
				let data = {
					order_id: that.orderData.order_id
				};
				that.$util.redirectTo('/otherpages/chat/room/room', data);
				return false;
				// #ifdef MP
				// if (this.kefuConfig.system == 1) {
				// 	that.$util.redirectTo('/otherpages/chat/room/room', data);
				// 	return false;
				// }
				// #endif
				// #ifndef MP

				// if (this.kefuConfig.open == 1) {
				// 	that.$util.redirectTo('/otherpages/webview/webview', { link: encodeURIComponent(this.kefuConfig.open_url) });
				// 	return false;
				// }
				// if (this.kefuConfig.system == 1) {
				// 	that.$util.redirectTo('/otherpages/chat/room/room', data);
				// 	return false;
				// }
				// #endif
			} else {
				this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + that.orderData.sku_id);
				return;
			}
		},
		getKekuConfig() {
			this.$api.sendRequest({
				url: '/api/config/servicer',
				success: res => {
					if (res.code == 0) {
						this.kefuConfig = res.data;
						// if (this.kefuConfig.system && !this.addonIsExit.servicer) this.kefuConfig.system = 0;
					}
				}
			});
		},
		goRefund(id) {
			this.$util.redirectTo('/otherpages/order/refund/refund', { order_goods_id: id });
		},
		goRefundDetail(id) {
			this.$util.redirectTo('/otherpages/order/refund_detail/refund_detail', { order_goods_id: id });
		},
		goDetail(id) {
			this.$util.redirectTo('/promotionpages/point/detail/detail', { id: id });
		},
		navigateBack() {
			this.$util.goBack();
		},
		getOrderData() {
			this.$api.sendRequest({
				url: '/pointexchange/api/order/info',
				data: {
					order_id: this.orderId
				},
				success: res => {
					uni.stopPullDownRefresh();
					if (res.code >= 0) {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						this.orderData = res.data;
						if (this.orderData.delivery_store_info != '') this.orderData.delivery_store_info = JSON.parse(this.orderData.delivery_store_info);
					} else {
						this.$util.showToast({
							title: '未获取到订单信息！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/order/list/list');
						}, 1500);
					}
				},
				fail: res => {
					uni.stopPullDownRefresh();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		/**
		 * 下拉刷新
		 */
		onPullDownRefresh() {
			this.getOrderData();
		},
		orderClose() {
			uni.showModal({
				title: '提示',
				content: '确定关闭此次兑换？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/pointexchange/api/order/close',
							data: {
								order_id: this.orderData.order_id
							},
							success: res => {
								if (res.code >= 0) {
									this.$util.showToast({ title: '关闭成功' });
									this.getOrderData();
								}
							}
						});
					}
				}
			});
		},
		// 显示选择支付方式弹框
		openChoosePayment() {
			this.$refs.choosePaymentPopup.open();
		},
		orderPay() {
			this.$refs.choosePaymentPopup.getPayInfo(this.orderData.out_trade_no);
		},
		exchangeImage(data) {
			switch (data.type) {
				case 1:
					return this.$util.img(data.exchange_image, { size: 'mid' });
					break;
				case 2:
					return data.exchange_image ? this.$util.img(data.exchange_image) : this.$util.img('upload/uniapp/point/coupon.png');
					break;
				case 3:
					return data.exchange_image ? this.$util.img(data.exchange_image) : this.$util.img('upload/uniapp/point/hongbao.png');
					break;
			}
		},
		imageError() {
			switch (this.orderData.type) {
				case 2:
					this.orderData.exchange_image = this.$util.img('upload/uniapp/point/coupon.png');
					break;
				case 3:
					this.orderData.exchange_image = this.$util.img('upload/uniapp/point/hongbao.png');
					break;
				default:
					this.orderData.exchange_image = this.$util.getDefaultImage().default_goods_img;
			}
			this.$forceUpdate();
		},
		// 显示选择支付方式弹框
		openChoosePayment() {
			this.$refs.choosePaymentPopup.open();
		}
	},
	filters: {
		abs(value) {
			return Math.abs(parseFloat(value)).toFixed(2);
		}
	}
};
</script>

<style lang="scss">
@import '../public/css/detail.scss';
</style>
