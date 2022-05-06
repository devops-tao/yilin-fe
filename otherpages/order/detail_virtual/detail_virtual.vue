<template>
	<view class="detail-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<!-- 订单状态 -->
		<view class="status-wrap color-base-bg" :style="{ backgroundImage: 'url(' + $util.img('upload/uniapp/order/status-wrap-bg.png') + ')' }">
			<view class="order-status-left">
				<image :src="$util.img(action.icon)"></image>
				<view class="status-name">
					<view>{{ orderData.order_status_name }}</view>
				</view>
			</view>
			<view class="order-time" v-if="orderData.order_status == 0" id="action-date">
				剩余时间：
				<uni-count-down
					:day="orderData.discountTimeMachine.d"
					:hour="orderData.discountTimeMachine.h"
					:minute="orderData.discountTimeMachine.i"
					:second="orderData.discountTimeMachine.s"
					color="#fff"
					splitorColor="#fff"
				/>
			</view>
		</view>

		<view class="virtual-mobile-wrap" v-if="!orderData.virtual_goods">
			<view class="font-size-base">预留手机</view>
			<view class="color-tip font-size-tag">{{ orderData.mobile }}</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap" :style="orderData.virtual_goods ? 'margin-top: -69rpx;' : ''">
			<view class="site-body">
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderData.order_goods" :key="goodsIndex">
					<view class="goods-img" @click="goDetail(goodsItem.sku_id)">
						<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imageError(goodsIndex)" mode="aspectFill"></image>
					</view>
					<view class="goods-info">
						<view @click="goDetail(goodsItem.sku_id)" class="goods-name">{{ goodsItem.sku_name }}</view>
						<view class="sku" v-if="goodsItem.sku_spec_format">
							<view class="goods-spec">
								<block v-for="(x, i) in goodsItem.sku_spec_format" :key="i">
									{{ x.spec_value_name }} {{ i < goodsItem.sku_spec_format.length - 1 ? '; ' : '' }}
								</block>
							</view>
						</view>
						<view class="goods-sub-section">
							<view>
								<text class="goods-price color-base-text">
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									<text class="font-size-base">{{ goodsItem.price }}</text>
								</text>
							</view>
							<view>
								<text class="font-size-base">
									<text class="iconfont iconclose"></text>
									{{ goodsItem.num }}
								</text>
							</view>
						</view>
						<view class="goods-action" v-if="orderData.virtual_goods">
							<block >
								<view @click="goRefund(goodsItem.order_goods_id)" v-if="orderData.virtual_goods.is_veirfy == 0">
									<view class="order-box-btn">申请退款</view>
								</view>
							</block>
							<view @click="goRefundDetail(goodsItem.order_goods_id)" v-if="orderData.virtual_goods.is_veirfy == 2">
								<view class="order-box-btn">查看退款</view>
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
			<block v-if="orderData.pay_status > 0">
				<view class="hr"></view>
				<view class="order-cell">
					<text class="tit">支付方式：</text>
					<view class="box">
						<text class="color-title">{{ orderData.pay_type_name }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">支付时间：</text>
					<view class="box">
						<text class="color-title">{{ $util.timeStampTurnTime(orderData.pay_time) }}</text>
					</view>
				</view>
			</block>
			<view class="order-cell" v-if="orderData.buyer_message != ''">
				<text class="tit">买家留言：</text>
				<view class="box">
					<text class="color-title">{{ orderData.buyer_message }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.promotion_type_name != ''">
				<text class="tit">活动优惠：</text>
				<view class="box">
					<text class="color-title">{{ orderData.promotion_type_name }}</text>
				</view>
			</view>
			<block v-if="orderData.is_invoice > 0">
				<view class="hr"></view>
				<view class="order-cell">
					<text class="tit">发票类型：</text>
					<view class="box">
						<text class="color-title">{{ orderData.invoice_type ==1 ? '纸质发票' : '电子发票'  }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">发票抬头类型：</text>
					<view class="box">
						<text class="color-title">{{ orderData.invoice_title_type ==1 ? '个人' : '企业' }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">发票抬头：</text>
					<view class="box">
						<text class="color-title">{{ orderData.invoice_title }}</text>
					</view>
				</view>
				
				<view class="order-cell">
					<text class="tit">发票内容：</text>
					<view class="box">
						<text class="color-title">{{ orderData.invoice_content }}</text>
					</view>
				</view>
				<view class="order-cell" v-if="orderData.invoice_type ==1">
					<text class="tit">发票邮寄地址：</text>
					<view class="box">
						<text class="color-title">{{ orderData.invoice_full_address }}</text>
					</view>
				</view>
				<view class="order-cell" v-else>
					<text class="tit">发票接收邮件：</text>
					<view class="box">
						<text class="color-title">{{ orderData.invoice_email }}</text>
					</view>
				</view>
			</block>
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
			
		
		<block v-if="orderData.virtual_goods && orderData.goods_class == 2 && orderData.virtual_goods.is_veirfy == 0">
			<view class="verify-code-wrap">
				<view class="code">
					<image :src="$util.img(orderData.virtualgoods_barcode)" class="barcode" mode="widthFix"></image>
					<image :src="$util.img(orderData.virtualgoods)" class="qrcode" mode="widthFix"></image>
					<text>请将条形码或二维码出示给核销员</text>
				</view>
				<view class="hr"></view>
				<view class="wrap">
					<text class="font-size-base virtual-code">{{ orderData.virtual_code }}</text>
					<view class="copy" @click="$util.copy(orderData.virtual_code)">复制</view>
				</view>
			</view>
			
			<view class="verify-info-wrap">
				<view class="head">核销信息</view>
				<view class="order-cell">
					<text class="tit">核销次数</text>
					<view class="box align-right">
						<text class="color-title">
							剩余{{ orderData.virtual_goods.total_verify_num - orderData.virtual_goods.verify_num }}次/共{{ orderData.virtual_goods.total_verify_num }}次
						</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">有效期</text>
					<view class="box align-right">
						<text class="color-title" v-if="orderData.virtual_goods.expire_time > 0">
							{{ $util.timeStampTurnTime(orderData.virtual_goods.expire_time) }}
						</text>
						<text v-else>永久有效</text>
					</view>
				</view>
			</view>
			
			<view class="verify-info-wrap">
				<view class="head">核销记录</view>
				<view v-if="orderData.virtual_goods.verify_record.length">
					<view v-for="(item, index) in orderData.virtual_goods.verify_record" :key="index" class="record-item">
						<view class="order-cell">
							<text class="tit">核销人</text>
							<view class="box align-right">
								<text class="color-title">
									{{ item.verifier_name }}
								</text>
							</view>
						</view>
						<view class="order-cell">
							<text class="tit">核销时间</text>
							<view class="box align-right">
								<text class="color-title">
									{{ $util.timeStampTurnTime(item.verify_time) }}
								</text>
							</view>
						</view>
					</view>
				</view>
				<view class="record-empty" v-else>暂无核销记录</view>
			</view>
		</block>
			
		<block v-if="orderData.virtual_goods && orderData.goods_class == 3">
			<view class="verify-info-wrap carmichael">
				<view class="head">卡密信息</view>
				<view v-for="(item, index) in orderData.virtual_goods" :key="index" class="record-item">
					<view class="order-cell">
						<text class="tit">卡号：</text>
						<view class="box">
							<text class="color-title">
								{{ item.card_info.cardno }}
							</text>
							<view class="copy" @click="$util.copy(item.card_info.cardno)">复制</view>
						</view>
					</view>
					<view class="order-cell">
						<text class="tit">密码：</text>
						<view class="box">
							<text class="color-title">
								{{ item.card_info.password }}
							</text>
							<view class="copy" @click="$util.copy(item.card_info.password)">复制</view>
						</view>
					</view>
				</view>
			</view>	
		</block>

		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">商品金额</text>
				<view class="box align-right">
					<text class="color-title">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						{{ orderData.goods_money }}
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.member_card_money > 0">
				<text class="tit">会员卡</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.member_card_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.invoice_money > 0">
				<text class="tit">
					税费
					<text class="color-base-text">({{ orderData.invoice_rate }}%)</text>
				</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.invoice_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.invoice_delivery_money > 0">
				<text class="tit">发票邮寄费</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.invoice_delivery_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.adjust_money != 0">
				<text class="tit">订单调整</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator" v-if="orderData.adjust_money < 0">-</text>
						<text class="operator" v-else>+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.adjust_money | abs }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.promotion_money > 0">
				<text class="tit">优惠</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.promotion_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.coupon_money > 0">
				<text class="tit">优惠券</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.coupon_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.balance_money > 0">
				<text class="tit">使用余额</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.balance_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.point_money > 0">
				<text class="tit">积分抵扣</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.point_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell">
				<view class="box align-right">
					<text>实付金额：</text>
					<text class="color-base-text">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text class="font-size-base">{{ orderData.pay_money }}</text>
					</text>
				</view>
			</view>

			<view class="order-action" :class="{ 'bottom-safe-area': isIphoneX }" v-if="orderData.action.length > 0">
				<view class="order-box-btn white" v-if="evaluateConfig.evaluate_status == 1 && orderData.is_evaluate == 1" @click="operation('memberOrderEvaluation')">
					<text v-if="orderData.evaluate_status == 0">评价</text>
					<text v-else-if="orderData.evaluate_status == 1">追评</text>
				</view>
				<view
					class="order-box-btn"
					:class="operationItem.action == 'orderPay' ? 'color-base-bg color-base-border' : 'white'"
					v-for="(operationItem, operationIndex) in orderData.action"
					:key="operationIndex"
					@click="operation(operationItem.action)"
				>
					{{ operationItem.title }}
				</view>
			</view>
			<view
				class="order-action"
				:class="{ 'bottom-safe-area': isIphoneX }"
				v-else-if="orderData.action.length == 0 && orderData.is_evaluate == 1 && evaluateConfig.evaluate_status == 1"
			>
				<view class="order-box-btn white" @click="operation('memberOrderEvaluation')">
					<text v-if="orderData.evaluate_status == 0">评价</text>
					<text v-else-if="orderData.evaluate_status == 1">追评</text>
				</view>
			</view>
		</view>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :payMoney="orderData.pay_money" @confirm="pay"></ns-payment>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import orderMethod from './../../../pages/order/public/js/orderMethod.js';
import nsPayment from '@/components/payment/payment.vue';

export default {
	data() {
		return {
			isIphoneX: false,
			orderId: 0,
			orderData: {
				action: [],
				virtual_goods: {
					is_veirfy: 0,
					verify_record: []
				}
			},
			action: {
				icon: ''
			},
			kefuConfig: {
				weapp: '',
				system: '',
				open: '',
				open_url: ''
			},
			evaluateConfig: {
				evaluate_audit: 1,
				evaluate_show: 0,
				evaluate_status: 1
			}
		};
	},
	mixins: [globalConfig, orderMethod],
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
			this.getEvaluateConfig();
			this.getOrderData();
		} else {
			this.$util.redirectTo('/otherpages/login/login/login', { back: '/otherpages/order/detail_virtual/detail_virtual?order_id=' + this.orderId });
		}
		this.getKekuConfig();
	},
	methods: {
		//联系客服
		goConnect() {
			if (uni.getStorageSync('token')) {
				let data = {
					order_id: this.orderId
				};
				this.$util.redirectTo('/otherpages/chat/room/room', data);
				return false;
				// #ifdef MP
				// if (this.kefuConfig.system == 1) {
				// 	this.$util.redirectTo('/otherpages/chat/room/room', data);
				// 	return false;
				// }
				// #endif
				// #ifndef MP

				// if (this.kefuConfig.open == 1) {
				// 	this.$util.redirectTo('/otherpages/webview/webview', { link: encodeURIComponent(this.kefuConfig.open_url) });
				// 	return false;
				// }
				// if (this.kefuConfig.system == 1) {
				// 	this.$util.redirectTo('/otherpages/chat/room/room', data);
				// 	return false;
				// }
				// #endif
			} else {
				this.$refs.login.open('/pages/goods/detail_virtual/detail_virtual?sku_id=' + this.orderData.sku_id);
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
		goDetail(id) {
			this.$util.redirectTo('/pages/goods/detail/detail', { sku_id: id });
		},
		goRefund(id) {
			this.$util.redirectTo('/otherpages/order/refund/refund', { order_goods_id: id });
		},
		goRefundDetail(id) {
			this.$util.redirectTo('/otherpages/order/refund_detail/refund_detail', { order_goods_id: id });
		},
		getOrderData() {
			this.$api.sendRequest({
				url: '/api/order/detail',
				data: {
					order_id: this.orderId
				},
				success: res => {
					
					uni.stopPullDownRefresh();
					if (res.code >= 0) {
						let date = (Date.parse(new Date()))/1000
						res.data.discountTimeMachine = this.$util.countDown((res.data.create_time + res.data.auto_close) - date);
						this.orderData = res.data;
						this.orderData.order_goods.forEach(v => {
							if (v.sku_spec_format) {
								v.sku_spec_format = JSON.parse(v.sku_spec_format);
							} else {
								v.sku_spec_format = [];
							}
						});
						this.action = JSON.parse(res.data.order_status_action);
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
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
		operation(action) {
			switch (action) {
				case 'orderPay': // 支付
					this.orderPay(this.orderData);
					break;
				case 'orderClose': //关闭
					this.orderClose(this.orderData.order_id, () => {
						this.getOrderData();
					});
					break;
				case 'memberOrderEvaluation': //评价
					this.$util.redirectTo('/otherpages/order/evaluate/evaluate', { order_id: this.orderData.order_id });
					break;
			}
		},
		imageError(index) {
			this.orderData.order_goods[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
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
@import './../../../pages/order/public/css/detail.scss';
</style>
