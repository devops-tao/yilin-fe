<template>
	<view>
		<view class="card-item margin-bottom">
			<view class=""  v-if="cardinfo.elect_status==0">
				<view class="card-content" :style="{background:cardinfo.card_cover?'url(' + $util.img(cardinfo.card_cover) + ') no-repeat 0 0/100% 100%':'url(https://cs.b2c.niuteam.cn/upload/uniapp/giftcard/detail/gitcard_default3.png) no-repeat 0 0/100% 100%' }">
					<view class="content-head">
						<view class="card-name">{{cardinfo.card_name}}</view>
						<view class="use-orno"v-if="cardinfo.elect_status == 0">待使用</view>
						<view class="use-orno"v-else-if="cardinfo.elect_status == 1">已使用</view>
						<view class="use-orno"v-else-if="cardinfo.elect_status == 2">已过期</view>
					</view>
					<view class="card-use">礼品卡权益</view>
					<view class="card-num" v-if="cardinfo.balance>0.00 && cardinfo.point>0">￥{{cardinfo.balance}}+{{cardinfo.point}}积分+商品*{{cardinfo.goods_num}}</view>
					<view class="card-num" v-else-if="cardinfo.balance>0.00 && cardinfo.point==0">￥{{cardinfo.balance}}</view>
					<view class="card-num" v-else-if="cardinfo.balance==0.00 && cardinfo.point>0">{{cardinfo.point}} 积分</view>
					<view class="card-num" v-else-if="cardinfo.balance==0.00 && cardinfo.point==0 && cardinfo.goods_num>0">商品*{{cardinfo.goods_num}}</view>
					
					<view class="card-num" v-else-if="cardinfo.balance>0.00 && cardinfo.point>0 && cardinfo.goods_num==0">￥{{cardinfo.balance}}+{{cardinfo.point}}积分</view>
					<view class="card-num" v-else-if="cardinfo.balance>0.00 && cardinfo.point==0 && cardinfo.goods_num>0">￥{{cardinfo.balance}}+商品*{{cardinfo.goods_num}}</view>
					<view class="card-num" v-else-if="cardinfo.balance==0.00 && cardinfo.point>0 && cardinfo.goods_num>0">{{cardinfo.point}}积分+商品*{{cardinfo.goods_num}}</view>
					<view class="card-id">NO.{{cardinfo.number}}</view>
				</view>
			</view>
			<view class="card-box" v-else>
				<view class="card-content hasuse-card-content card-box1"  :style="{background:cardinfo.card_cover?'url(' + $util.img(cardinfo.card_cover) + ') no-repeat 0 0/100% 100%':'url(https://cs.b2c.niuteam.cn/upload/uniapp/giftcard/detail/gitcard_default3.png) no-repeat 0 0/100% 100%' }"></view>
				<view class="card-box2"></view>
				<view class="card-content card-box3">
					<view class="content-head">
						<view class="card-name">{{cardinfo.card_name}}</view>
						<view class="use-orno"v-if="cardinfo.elect_status == 0">待使用</view>
						<view class="use-orno"v-else-if="cardinfo.elect_status == 1">已使用</view>
						<view class="use-orno"v-else-if="cardinfo.elect_status == 2">已过期</view>
					</view>
					<view class="card-use">礼品卡权益</view>
					<view class="card-num" v-if="cardinfo.balance>0.00 && cardinfo.point>0 && cardinfo.goods_num>0">￥{{cardinfo.balance}}+{{cardinfo.point}}积分+商品*{{cardinfo.goods_num}}</view>
					<view class="card-num" v-else-if="cardinfo.balance>0.00 && cardinfo.point==0">￥{{cardinfo.balance}}</view>
					<view class="card-num" v-else-if="cardinfo.balance==0.00 && cardinfo.point>0"> {{cardinfo.point}} 积分</view>
					<view class="card-num" v-else-if="cardinfo.balance==0.00 && cardinfo.point==0 && cardinfo.goods_num>0">商品*{{cardinfo.goods_num}}</view>
					
					<view class="card-num" v-else-if="cardinfo.balance>0.00 && cardinfo.point>0 && cardinfo.goods_num==0">￥{{cardinfo.balance}}+{{cardinfo.point}}积分</view>
					<view class="card-num" v-else-if="cardinfo.balance>0.00 && cardinfo.point==0 && cardinfo.goods_num>0">￥{{cardinfo.balance}}+商品*{{cardinfo.goods_num}}</view>
					<view class="card-num" v-else-if="cardinfo.balance==0.00 && cardinfo.point>0 && cardinfo.goods_num>0">{{cardinfo.point}}积分+商品*{{cardinfo.goods_num}}</view>
					<view class="card-id">NO.{{cardinfo.number}}</view>
				</view>
			</view>

		</view>

		<view class="card-info">
			<view class="info aaa">礼品卡编号：<span>{{cardinfo.number}}</span></view>
			<view class="info info1 aaa">礼品卡来源：
			<span v-if="cardinfo.source_from == 1">购买电子卡</span>
			<span v-else>他人赠送</span>
			</view>
			<view class="info bbb">持有人：<span>{{cardinfo.member_name}}</span></view>
			<view class="info ccc" style="border: none;" v-if="cardinfo.balance>0.00 && cardinfo.point>0 && cardinfo.goods_num>0">兑换权益：<span>￥{{cardinfo.balance}}+{{cardinfo.point}}积分+商品*{{cardinfo.goods_num}}</span></view>
			<view class="info ccc" style="border: none;" v-else-if="cardinfo.balance>0.00 && cardinfo.point==0">兑换权益：<span>￥{{cardinfo.balance}}</span></view>
			<view class="info ccc" style="border: none;" v-else-if="cardinfo.balance==0.00 && cardinfo.point>0">兑换权益：<span>{{cardinfo.point}} 积分</span></view>
			<view class="info ccc" style="border: none;" v-else-if="cardinfo.balance==0.00 && cardinfo.point==0 && cardinfo.goods_num>0">兑换权益：<span>商品*{{cardinfo.goods_num}}</span></view>
			
			<view class="info ccc" style="border: none;" v-else-if="cardinfo.balance>0.00 && cardinfo.point>0 && cardinfo.goods_num==0">兑换权益：<span>￥{{cardinfo.balance}}+{{cardinfo.point}}积分</span></view>
			<view class="info ccc" style="border: none;" v-else-if="cardinfo.balance>0.00 && cardinfo.point==0 && cardinfo.goods_num>0">兑换权益：<span>￥{{cardinfo.balance}}+商品*{{cardinfo.goods_num}}</span></view>
			<view class="info ccc" style="border: none;" v-else-if="cardinfo.balance==0.00 && cardinfo.point>0 && cardinfo.goods_num>0">兑换权益：<span>{{cardinfo.point}}积分+商品*{{cardinfo.goods_num}}</span></view>
			
			
			<!-- <view class="info ccc" style="border: none;">兑换权益：<span>￥{{cardinfo.balance}} + {{cardinfo.point}}积分</span></view> -->
<!-- 			<view class="info ccc" style="border: none;" v-if="cardinfo.balance>0.00 && cardinfo.point>0">兑换权益：<span>￥{{cardinfo.balance}} + {{cardinfo.point}}积分</span></view>
			<view class="info ccc" style="border: none;" v-else-if="cardinfo.balance>0.00 && cardinfo.point==0">兑换权益：<span>￥{{cardinfo.balance}}</span></view>
			<view class="info ccc" style="border: none;" v-else-if="cardinfo.balance==0.00 && cardinfo.point>0">兑换权益：<span> {{cardinfo.point}} 积分</span></view> -->
		</view>

		<view class="card-info2">
			<view class="info info2">获取时间：<span>{{$util.timeStampTurnTime(cardinfo.create_time) }}</span></view>
			<!-- <view class="info" v-if="cardinfo.time_type == 1">有效期：<span>永久有效</span></view>
			<view class="info" v-else-if="cardinfo.time_type == 2">有效期：<span>{{$util.timeStampTurnTime(cardinfo.youxiao_time) }}</span></view>
			<view class="info info3" v-else-if="cardinfo.time_type == 3">
				有效期：<span>领取后{{cardinfo.youxiao_day}}天</span></view> -->
			
			<view class="info">使用时间：
			<span v-if="cardinfo.use_time == 0">未使用</span>
			<span v-else>已使用</span>
			</view>
			<view class="info" style="border: none;" v-if="cardinfo.time_type==1">过期时间：<span>永久有效</span></view>
			<view class="info" style="border: none;" v-else-if="cardinfo.time_type==2">过期时间：<span>有效期至 {{this.$util.timeStampTurnTime(cardinfo.youxiao_time)}}</span></view>
			<view class="info" style="border: none;" v-else>过期时间：<span>有效期至 {{this.$util.timeStampTurnTime((cardinfo.create_time)+(cardinfo.youxiao_day)*24*60*60)}} </span></view>
		</view>
		<view class="giftcard-goods" v-if="cardinfo.goods_list">
			<view class="giftcard-goods-list">
				<view class="giftcard-goods-item" v-for="( item , index ) in cardinfo.goods_list" :key="index">
					<view class="giftcart-goods-img">
						<image :src="goodsImg(item.sku_image)"></image>
					</view>
					<view class="giftcard-info-wrap">
						<view class="info-title">
							{{ item.sku_name }}
						</view>
						<view class="info-stock">
							库存:{{ item.stock }}
						</view>
						<view class="info-price">
							<view class="unit color-base-text">￥</view>
							<view class="price color-base-text">{{ item.price }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="bottom" v-if="cardinfo.elect_status == 0">
			<view class="bottom-left">
				<button type="primary" size="mini" @click="gotopresent(id)">转赠他人</button>
			</view>
			<view class="bottom-right">
				<button type="primary" size="mini" @click="openusepopup(cardinfo.giftcard_id,id,cardinfo)">立即使用</button>
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
	
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components: {
			uniPopup,
		},
		data() {
			return {
				cardinfo:{},
				id:'',
				stort_type: false
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
		methods: {
			goodsImg(imgStr) {
				let imgs = imgStr.split(',');
				return imgs[0] ? this.$util.img(imgs[0], {
					size: 'mid'
				}) : this.$util.getDefaultImage().default_goods_img;
			},
			getData(id) {
				this.$api.sendRequest({
					url: '/giftcard/api/giftcard/giftcardinfo',
					data: {
						id: id
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.cardinfo = res.data;
							if(this.cardinfo.goods_list.length > 0){
								this.cardinfo.goods_list.forEach(v => {
									if(v.stock == 0){
										this.stort_type = true;
									}
								});
							}
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						}
					},
					fail: res => {}
				});
			},
			gotopresent(id) {
				this.$util.redirectTo('/promotionpages/giftcard/present/present', {id: id})
			},
			openusepopup(giftcard_id,id,cardinfo) {
				if(this.stort_type){
					this.$util.showToast({
						title: "有商品暂无库存"
					});
					return false;
				}
				let _this = this;
				if (this.cardinfo.goods_list.length>0) {
					let giftcard_sku_id = [];
					cardinfo.goods_list.forEach(siteItem => {
						giftcard_sku_id.push(siteItem.sku_id)
					});
					uni.setStorage({
						key: 'orderCreateData',
						data: {
							sku_id: giftcard_sku_id.toString() ,
							num:1
						},
						success: () => {
							this.$util.redirectTo('/promotionpages/giftcard/payment/payment',{ giftcard_id:giftcard_id , id:id })
						}
					});
				}else{
					uni.showModal({
						title:'提示',
						content:'确定要使用该礼品卡吗',
						success: (res) => {
							if(res.confirm){
								this.$api.sendRequest({
									url:'/giftcard/api/giftcard/use',
									data: {  
										id: id,
										giftcard_id:giftcard_id	
									},
									success: res => {
										_this.$util.showToast({
											title: res.message
										});
										this.$router.go(0);
									}
								})
							}
						}
					})
				}
		}
	}
};
	
</script>

<style lang="scss">
	.hasuse-card-content{
		-webkit-filter: grayscale(100%);
		filter: grayscale(100%);
	}
	.card-box{
		position: relative;
		border-radius: 20rpx;
	}
	.card-box1{
		height: 296rpx;
	}
	.card-box2{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%; 
		height: 100%;
		background-color:  #efefef; 
		opacity: 0.8; 
		border-radius: 20rpx;
		z-index: 200;
	}
	.card-box3{
		position: absolute;
		width: 85%; 
		top: 0; 
		color: gray !important; 
		z-index: 300;
	}
	.card-item {
		padding: 54rpx 30rpx 34rpx 30rpx ; 
		background: url("https://cs.b2c.niuteam.cn/upload/uniapp/giftcard/detail/index.png") no-repeat top left/100% 50%;
		
		.card-content {
			padding: 30rpx 50rpx;
			border-radius: 20rpx;
			-moz-background-size:100% 100%;
			.content-head {
				display: flex;
				justify-content: space-between;
				margin-bottom: 30rpx;

				.card-name {
					font-size: 48rpx;
					color: #fff;
					overflow: hidden;
					max-height: 160rpx;
					width: 85%;
				}

				.use-orno {
					color: #fff;
				}
			}

			.card-use {
				color: #fff;
			}

			.card-num {
				margin-top: 20rpx;
				line-height: 20rpx;
				color: #fff;
			}

			.card-id {
				margin-top: 40rpx;
				color: #fff;
			}
		}
	}

	.card-info {
		padding: 15rpx 30rpx;
		margin: 10rpx 30rpx;
		background: #fff;
		border-radius: 10rpx;

		.info {
			padding: 20rpx 0;
			border-bottom: 1rpx solid #f5f5f5;
		}

		.aaa {
			span {
				margin-left: 30rpx;
			}
		}

		.bbb {
			span {
				margin-left: 82rpx;
			}
		}
		
		.ccc {
			span {
				margin-left: 52rpx;
			}
		}
	}

	.card-info2 {
		padding: 15rpx 30rpx;
		margin: 20rpx 30rpx;
		background: #fff;
		border-radius: 10rpx;

		.info {
			padding: 20rpx 0;
			border-bottom: 1rpx solid #f5f5f5;
		}
		
		.info3 {
			span {
				margin-left: 80rpx;
			}
		}

		span {
			margin-left: 52rpx;
		}
	}
	
	.bottom {
		position: fixed;
		bottom: 0rpx;
		width: 800rpx;
		height: 130rpx;
		display: flex;
		background: #fff;
		padding: 0 20rpx 0 300rpx;
	
		.bottom-left {
			margin: 30rpx 20rpx 30rpx 0;
			button {
				background: #fff;
				color: #000;
				border: 1rpx solid #d9d9d9;
				border-radius: 50rpx;
				width: 200rpx;
				height: 70rpx;
				line-height: 70rpx;
			}
		}
	
		.bottom-right {
			margin: 30rpx 0;
			button {
				width: 200rpx;
				height: 70rpx;
				line-height: 70rpx;
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
				.info-stock{
					font-size: 24rpx;
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
</style>
