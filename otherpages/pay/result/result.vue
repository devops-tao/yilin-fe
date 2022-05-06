<template>
	<view class="container" :data-theme="themeStyle">
		<template v-if="payInfo.pay_status != undefined">
			<template v-if="payInfo.pay_status">
				<image :src="$util.img('upload/uniapp/pay_success.png')" mode="widthFix" class="result-image"></image>
				<view class="msg">{{ $lang('paymentSuccess') }}</view>
				<view class="pay-amount">
					￥
					<text>{{ payInfo.pay_money }}</text>
				</view>
			</template>
			<template v-else>
				<image :src="$util.img('upload/uniapp/pay_fail.png')" mode="widthFix" class="result-image"></image>
				<view class="msg">{{ $lang('paymentFail') }}</view>
			</template>
			<view class="action">
				<!-- <view class="btn" @click="$util.redirectTo('/pages/member/index/index', {}, 'reLaunch')" v-if="token">
				{{ $lang('memberCenter') }}
			</view> -->
				<view v-if="token && paySource == 'recharge'" class="btn" @click="toRecharge()">充值记录</view>
				<view v-if="token && paySource == 'membercard'" class="btn" @click="toCard()">会员卡</view>
				<view v-if="token && paySource == 'presale'" class="btn" @click="toPresaleOrder()">查看订单</view>
				<view v-if="token && paySource == 'giftcard'" class="btn" @click="toOrder()">查看订单</view>
				<view v-if="token && paySource != 'recharge' && paySource != 'membercard' && paySource != 'presale' && paySource != 'giftcard'" class="btn" @click="toOrderDetail(payInfo.order_id)">查看订单</view>

				<view class="btn go-home color-base-bg color-base-border" @click="goHome()">{{ $lang('goHome') }}</view>
			</view>
			
			<!-- 消费奖励 -->
			<view class="consume-box" v-if="addonIsExit.memberconsume && consumeStatus == 1 && payInfo.pay_status">
				<view class="consume-head">
					<view class="consume-line"></view>
					<view class="consume-head-text">恭喜获得以下奖励</view>
					<view class="consume-line"></view>
					<view class="clear"></view>
				</view>
				<view class="consume-list">
					<view class="consume-item" v-if="consumeInfo.point_num > 0">
						<view class="consume-type">积分</view>
						<view class="consume-value color-base-text">{{ consumeInfo.point_num }}</view>
						<view class="consume-btn btn color-base-bg color-base-border" v-if="consumeInfo.return_point_status == 'pay'" @click="consume('point')">查看</view>
					</view>
					<view class="consume-item" v-if="consumeInfo.growth_num > 0">
						<view class="consume-type">成长值</view>
						<view class="consume-value color-base-text">{{ consumeInfo.growth_num }}</view>
						<view class="consume-btn btn color-base-bg color-base-border" v-if="consumeInfo.return_point_status == 'pay'" @click="consume('growth')">查看</view>
					</view>
					<view class="consume-item" v-if="consumeInfo.coupon_list.length > 0">
						<view class="consume-type">优惠券</view>
						<view class="consume-value color-base-text">{{ consumeInfo.coupon_list.length }}</view>
						<view class="consume-btn btn color-base-bg color-base-border" v-if="consumeInfo.return_point_status == 'pay'" @click="consume('coupon')">查看</view>
					</view>
					<view class="clear"></view>
				</view>
				<view class="consume-remark" v-if="consumeInfo.return_point_status == 'receive'">
					注：订单收货后即可获得
				</view>
				<view class="consume-remark" v-if="consumeInfo.return_point_status == 'complete'">
					注：订单完成后即可获得
				</view>
			</view>
			

			<ns-goods-recommend></ns-goods-recommend>
		</template>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			payInfo: {},
			outTradeNo: '',
			token: null,
			paySource: '',
			consumeInfo: {},
			consumeStatus:0,
		};
	},
	mixins: [globalConfig],
	onLoad(option) {
		if (option.code) this.outTradeNo = option.code;
		this.paySource = uni.getStorageSync('paySource');
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		if (uni.getStorageSync('token')) this.token = uni.getStorageSync('token');
		this.getPayInfo();
		this.getConsume();
	},
	methods: {
		consume(type) {
			// console.log("进入",type)
			switch(type){
				case 'point':
					this.$util.redirectTo('/otherpages/member/point_detail/point_detail', {});
					break;
				case 'growth':
					this.$util.redirectTo('/otherpages/member/level/level', {});
					break;
				case 'coupon':
					this.$util.redirectTo('/otherpages/member/coupon/coupon', {});
					break;
				default:
				this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
			}
		},
		getConsume(){
			this.$api.sendRequest({
				url: '/memberconsume/api/config/info',
				data: {
					out_trade_no: this.outTradeNo
				},
				success: res => {
					if (res.code >= 0 && res.data) {
						let reward = res.data.value;
						if (res.data.is_use && (reward.point_num > 0 || reward.growth_num > 0 || reward.coupon_list.length)) {
						   this.consumeStatus = res.data.is_use;
						   this.consumeInfo = res.data.value;
						} 
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		getPayInfo() {
			this.$api.sendRequest({
				url: '/api/pay/info',
				data: {
					out_trade_no: this.outTradeNo
				},
				success: res => {
					if (res.code >= 0 && res.data) {
						this.payInfo = res.data;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({
							title: '未获取到支付信息！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}, 1500);
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		goHome() {
			this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
		},
		toOrderDetail(id) {
			if (this.payInfo.order_type == 2) {
				this.$util.redirectTo('/pages/order/detail_pickup/detail_pickup', { order_id: id }, 'redirectTo');
			} else if (this.payInfo.order_type == 3) {
				this.$util.redirectTo('/pages/order/detail_local_delivery/detail_local_delivery', { order_id: id }, 'redirectTo');
			} else if (this.payInfo.order_type == 4) {
				this.$util.redirectTo('/otherpages/order/detail_virtual/detail_virtual', { order_id: id }, 'redirectTo');
			} else {
				this.$util.redirectTo('/pages/order/detail/detail', { order_id: id }, 'redirectTo');
			}
		},
		toOrder(id) {
			this.$util.redirectTo('/promotionpages/giftcard/order/order', 'redirectTo');
			uni.setStorageSync('paySource', 'giftcard');
		},
		toRecharge() {
			this.$util.redirectTo('/otherpages/recharge/order_list/order_list', {}, 'redirectTo');
			uni.setStorageSync('paySource', '');
		},
		toCard(){
			this.$util.redirectTo('/otherpages/member/card/card', {}, 'redirectTo');
			uni.setStorageSync('paySource', '');
		},
		toPresaleOrder(){
			this.$util.redirectTo('/promotionpages/presale/order_list/order_list', {}, 'redirectTo');
			uni.setStorageSync('paySource', '');
		}
	}
};
</script>

<style lang="scss">
.consume-box{
	padding: $padding;
	margin-top: 60rpx;
	width: 100%;
	.consume-line{
		background: $color-line;
		float: left;
		width: 20%;
		text-align: center;
		height: 2rpx;
		box-sizing: border-box;
		margin: 0 5%;
	}
	.consume-head-text{
		width: 40%;
		float: left;
		text-align: center;
		margin-top: -26rpx;
		color: $color-title;
		font-size: $font-size-toolbar;
	}
	.consume-item{
		background-color: #FFFFFF;
		float: left;
		width: 29%;
		margin-left: 3.25%;
		text-align: center;
		margin-top: 20rpx;
		padding: $padding 0;
		color: $color-title;
		font-size: $font-size-base;
		.consume-value{
			font-size:$font-size-toolbar;
		}
		.consume-btn{
			color: #fff;
			width: 100rpx;
			border-radius: 40rpx;
			margin: 4rpx auto;
		}
	}
	.consume-remark{
		color: $color-tip;
		font-size: $font-size-tag;
		padding: 10rpx 20rpx;
	}
}
.clear{
	clear: both;
}

.container {
	padding-top: 94rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.result-image {
		width: 168rpx;
		height: 120rpx;
	}
	.msg {
		font-size: $font-size-toolbar;
		margin-top: 66rpx;
		height: $font-size-toolbar;
		line-height: $font-size-toolbar;
	}
	.pay-amount {
		font-size: 30rpx;
		margin-top: 30rpx;
		font-weight: 600;
		height: 50rpx;
		line-height: 50rpx;

		text {
			font-size: 50rpx;
		}
	}
	.action {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		margin-top: 90rpx;

		.btn {
			font-size: $font-size-base;
			width: 240rpx;
			height: 80rpx;
			line-height: 76rpx;
			text-align: center;
			border-radius: 40rpx;
			border: 1px solid $color-tip;
			box-sizing: border-box;

			&:last-child {
				color: #ffffff;
				margin-left: 100rpx;
			}
		}
	}
}
</style>
