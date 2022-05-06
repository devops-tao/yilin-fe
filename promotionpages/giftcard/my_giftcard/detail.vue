<template>
	<view class="">
		<view class="card-item margin-bottom">
			<view class="card-content" :style="{background:$util.img(giftcardDetail.card_cover)?'url(' + $util.img(giftcardDetail.card_cover) + ') no-repeat 0 0/100% 100%':'url(https://cs.b2c.niuteam.cn/upload/uniapp/giftcard/detail/gitcard_default3.png) no-repeat 0 0/100% 100%' }">
				<view class="card-name">{{giftcardDetail.card_name}}</view>
				<view class="card-use">礼品卡权益</view>
				<view class="card-num" v-if="giftcardDetail.balance>0.00 && giftcardDetail.point>0 && giftcardDetail.goods_num>0">￥{{giftcardDetail.balance}}+{{giftcardDetail.point}}积分+商品*{{giftcardDetail.goods_num}}</view>
				<view class="card-num" v-else-if="giftcardDetail.balance>0.00 && giftcardDetail.point==0">￥{{giftcardDetail.balance}}</view>
				<view class="card-num" v-else-if="giftcardDetail.balance==0.00 && giftcardDetail.point>0">{{giftcardDetail.point}} 积分</view>
				<view class="card-num" v-else-if="giftcardDetail.balance==0.00 && giftcardDetail.point==0 && giftcardDetail.goods_num>0">商品*{{giftcardDetail.goods_num}}</view>
				
				<view class="card-num" v-else-if="giftcardDetail.balance>0.00 && giftcardDetail.point>0 && giftcardDetail.goods_num==0">￥{{giftcardDetail.balance}}+{{giftcardDetail.point}}积分</view>
				<view class="card-num" v-else-if="giftcardDetail.balance>0.00 && giftcardDetail.point==0 && giftcardDetail.goods_num>0">￥{{giftcardDetail.balance}}+商品*{{giftcardDetail.goods_num}}</view>
				<view class="card-num" v-else-if="giftcardDetail.balance==0.00 && giftcardDetail.point>0 && giftcardDetail.goods_num>0">{{giftcardDetail.point}}积分+商品*{{giftcardDetail.goods_num}}</view>
			</view>
		</view>
		
		<view class="card-warn">
			<view class="warn">!</view>
			<view class="content">礼品卡不支持退款，请在有效期内使用!</view>
		</view>

		<view class="card-info">
			<view class="info info1">礼品卡名称：<span>{{giftcardDetail.card_name}}</span></view>
			<view class="info2" style=" padding: 20rpx 0;">
				<view class="info">销售价：<span>￥{{giftcardDetail.selling_price}}</span></view>
				<view class="info" v-if="giftcardDetail.time_type == 1">有效期：<span>永久有效</span></view>
				<view class="info" v-else-if="giftcardDetail.time_type == 2">有效期：<span>有效期限至
						{{$util.timeStampTurnTime(giftcardDetail.youxiao_time) }}</span></view>
				<view class="info" v-else-if="giftcardDetail.time_type == 3">
					有效期：<span>领取后 {{giftcardDetail.youxiao_day}} 天有效</span></view>
			</view>
			<view class="info">购买数量：
				<uni-number-box class="num-input" :value="num" @change="change" size="small" :min="1" :max="max_buy || giftcardDetail.card_count" />
			</view>
			<view class="info info3" style="border: none;">库存：<span>{{giftcardDetail.card_count}}</span></view>
		</view>
		
		<view class="giftcard-goods" v-if="giftcardDetail.goods_list">
			<view class="giftcard-goods-list">
				<view class="giftcard-goods-item" v-for="( item , index ) in giftcardDetail.goods_list" :key="index">
					<view class="giftcart-goods-img">
						<image :src="goodsImg(item.sku_image)"></image>
					</view>
					<view class="giftcard-info-wrap">
						<view class="info-title">
							{{ item.sku_name }}
						</view>
						<view class="info-price">
							<view class="unit color-base-text">￥</view>
							<view class="price color-base-text">{{ item.price }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="bottom">
			<view class="bottom-left">
				合计：<span>￥{{num * giftcardDetail.selling_price}}</span>
			</view>
			<view class="bottom-right">
				<button type="primary" size="mini" @click="openChoosePayment()">立即购买</button>
			</view>
		</view>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" 
		:payMoney="payMoney" @confirm="gotoBuy" 
		:isBalance="is_balance"
		@useBalance="useBalance"
		:balanceDeduct="giftcardDetail.selling_price > 0 && giftcardDetail.member_info.balance_total ? balanceDeduct : '0'"
		></ns-payment>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
	import nsPayment from '@/components/payment/payment.vue';

	export default {
		components: {
			nsPayment,
		},
		data() {
			return {
				order: 1,
				giftcardDetail: {},
				max_buy: 0,
				num: 1,
				id: '',
				isSub: false,
				is_balance: 0 ,
				payMoney: 1 ,
			};
		},
		onLoad(option) {
			var id = option.id
			this.getData(id)
			this.id = option.id
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		// beforeUnmount() {
		// 	console.log(this.giftcardDetail.selling_price)
		// },
		methods: {
			goodsImg(imgStr) {
				let imgs = imgStr.split(',');
				return imgs[0] ? this.$util.img(imgs[0], {
					size: 'mid'
				}) : this.$util.getDefaultImage().default_goods_img;
			},
			getData(id) {
				this.$api.sendRequest({
					url: '/giftcard/api/giftcard/giftcardDetail',
					data: {
						id: id
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.giftcardDetail = res.data;
							this.max_buy = parseFloat(res.data.max_buy);
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						}
					},
					fail: res => {}
				});
			},
			change(value) {
				this.num = value;
			},
			// 显示选择支付方式弹框
			openChoosePayment() {
				if(this.payMoney!=0){
					this.payMoney = this.giftcardDetail.selling_price * this.num;
				}
				if(!uni.getStorageSync('token')){
					this.$refs.login.open('/promotionpages/giftcard/my_giftcard/detail?id='+this.id);
					return false;
				}else{
					if(this.giftcardDetail.card_count == 0) {
						this.$util.showToast({
							title: '库存不足'
						});
					} else {
						uni.setStorageSync('paySource', 'giftcard');
						this.$refs.choosePaymentPopup.open();
						// #ifdef MP-WEIXIN
						this.subscribeMessage();
						// #endif
					}
				}
			},
			/**
			 * 微信订阅消息
			 */
			subscribeMessage() {
				this.$api.sendRequest({
					url: '/weapp/api/weapp/messagetmplids',
					data: {
						keywords: 'ORDER_PAY,ORDER_DELIVERY,ORDER_TAKE_DELIVERY'
					},
					success: res => {
						if (res.data.length) {
							uni.requestSubscribeMessage({
								tmplIds: res.data,
								success: (res) => {},
								fail: (res) => {
									console.log('fail', res)
								}
							})
						}
					}
				})
			},
			gotoBuy() {
				this.$api.sendRequest({
					url: '/giftcard/api/giftcard/createorder',
					data: {
						id: this.id,
						selling_price: this.giftcardDetail.selling_price,
						num: this.num,
						order_total_price: this.num * this.giftcardDetail.selling_price,
						is_balance: this.is_balance
					},
					success: res => {
						if (res.data && res.code == 0) {
							if (this.payMoney == 0) {
								this.$util.redirectTo('/otherpages/pay/result/result', {
									code: res.data
								}, 'redirectTo');
							} else {
								uni.setStorageSync('paySource', 'giftcard');
								this.out_trade_no = res.data;
								this.$refs.choosePaymentPopup.getPayInfo(res.data);
								this.isSub = false;
							}	
						} else {
							this.isSub = false; 
							uni.hideLoading();
							this.$util.showToast({
								title: res.message
							});
						}
					}
				})
			},
			// 使用余额
			useBalance() {
				if (this.is_balance) {
					this.is_balance = 0;
				}else{
					this.payMoney = 0;
					this.is_balance = 1;
				}
				
				// this.orderCalculate();
				this.$forceUpdate();
			},
			
		},
		watch:{
			is_balance:function(newval,oldval){
				if(newval == 0){
					this.payMoney = this.giftcardDetail.selling_price * this.num
				}else{
					if(this.giftcardDetail.member_info.balance_total - this.giftcardDetail.selling_price >= 0){
						this.payMoney = 0;
					}else{
						this.payMoney = this.giftcardDetail.selling_price - this.giftcardDetail.member_info.balance_total
					}
				}
			}
		},
		computed: {
			// 余额抵扣
			balanceDeduct() {
				if(this.giftcardDetail.is_balance == 1){
					if (this.giftcardDetail.member_info.balance_total <= parseFloat(this.giftcardDetail.selling_price).toFixed(2)) {
						return parseFloat(this.giftcardDetail.member_info.balance_total).toFixed(2);
					} else {
						return parseFloat(this.giftcardDetail.selling_price).toFixed(2) * this.num;
					}
				}
			},
		},
	};
</script>

<style lang="scss">

	.card-item {
		padding: 54rpx 30rpx 34rpx 30rpx;
		background: url("https://cs.b2c.niuteam.cn/upload/uniapp/giftcard/detail/index.png") no-repeat 0 0/100% 50%;
		.card-content {
			padding: 30rpx 50rpx;
			border-radius: 15rpx;

			.card-name {
				margin-bottom: 50rpx;
				font-size: 48rpx;
				color: #fff;
			}

			.card-use {
				color: #fff;
			}

			.card-num {
				margin-top: 30rpx;
				line-height: 20rpx;
				color: #fff;
			}
		}
	}

	.card-info {
		margin: 20rpx 30rpx;
		padding: 10rpx 30rpx;
		background: #fff;

		.info {
			padding: 24rpx 0;
			border-bottom: 1rpx solid #f5f5f5;

			.num-input {
				margin-left: 46rpx;
			}
		}

		.info1 {

			span {
				margin-left: 30rpx;
			}
		}

		.info2 {
			span {
				margin-left: 80rpx;
			}
		}

		.info3 {
			span {
				margin-left: 100rpx;
			}
		}
	}

	.bottom {
		position: fixed;
		bottom: 0rpx;
		width: 800rpx;
		height: 80rpx;
		display: flex;
		background: #fff;
		padding: 20rpx;

		.bottom-left {
			width: 400rpx;
			line-height: 80rpx;

			span {
				color: #ff4544;
				font-size: 35rpx;
				font-weight: 600;
			}
		}

		.bottom-right {
			width: 400rpx;

			button {
				width: 320rpx;
				height: 80rpx;
				line-height: 80rpx;
			}
		}
	}
	
	// goodsList
	.giftcard-goods{
		margin: 20rpx 30rpx;
		.giftcard-goods-list{
			padding-bottom: 120rpx;
		}
		.giftcard-goods-item{
			display: flex;
			margin: 20rpx 0;
			background-color: #fff;
			padding: 26rpx;
			border-radius: 10rpx;
			image{
				height: 200rpx;
				width: 200rpx;
				margin-right: 20rpx ;
			}
			.giftcard-info-wrap{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.info-title{	
					word-break: break-all;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2; /* 这里是超出几行省略 */
					overflow: hidden;
				}
				// .info-price{
				// 	display: flex;
				// 	justify-content: flex-end;
				// }
				.price,.unit{
					display: inline-block;
				}
				.price{
					font-size: 32rpx;
					font-weight: bold;
				}
			}
		}
	}
	.card-warn{
		margin: 20rpx 30rpx;
		display: flex;
		height: 80rpx;
		background:#fff1e5;
		padding:0 20rpx;
		border-radius: 10rpx;
		position: relative;
		.warn{
			background-color: #fa5b14;
			border-radius: 50%;
			height: 40rpx;
			width: 40rpx;
			line-height: 40rpx;
			color: #fff;
			text-align: center;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
		}
		.content{
			line-height: 80rpx;
			color:#fa5b14 ;
			margin-left: 50rpx;
		}
	}

	
	/deep/.decrease {
		margin-right: 10rpx !important;
	}
	
	/deep/.increase {
		margin-left: 10rpx !important;
	}
	/deep/.uni-input-input {
		background: #fff !important;
		border: 2rpx solid #eeeeee !important;
		width: 92% !important;
	}
	/deep/.uni-numbox__value.small {
		border: none !important;
	}
	/deep/ .uni-numbox__value {
		background-color:none !important;
	}
</style>
