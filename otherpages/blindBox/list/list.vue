<template>
	<view :data-theme="themeStyle" :class="isIphoneX ? 'iphone-x' : ''">
		<view class="ns-adv" >
			<ns-adv keyword="NS_BLINDBOX"></ns-adv>
			<view class="my_box_category-big my_box_category">
				<view class="category-item" @click="categoryChange('0')">
					<view class="item-con" :class="boxStatus == 0 ? 'active color-base-text color-base-bg-before' : ''">全部</view>
				</view>
				<scroll-view class="coupon-all" :scroll-x="true" :show-scrollbar="false">
					<view class="my_box_category">
						<view class="category-item" v-for="(item, index) in categoryList" :key="index" @click="categoryChange(item.category_id)">
							<view class="item-con" :class="item.category_id == boxStatus ? 'active color-base-text color-base-bg-before' : ''">{{ item.category_name }}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<mescroll-uni ref="mescroll" :top="adv.length > 0 ? '500' : '190'" @getData="getDate">
			<block slot="list">
				<view class="goods-list double-column" v-if="list.length>0">
					<view class="goods-item margin-bottom" v-for="(items,indexs) in list" :key="indexs" @click="toDetail(items.blindbox_id)">
						<view class="goods-img">
							<image v-if="items.blindbox_images != ''" :src="$util.img(items.blindbox_images)" @error="imageError(indexs)" mode="aspectFit"></image>
							<image v-else :src="$util.img('upload/uniapp/blindBox/default.png')" ></image>
						</view>
						<view class="info-wrap">
							<view class="name-wrap">
								<view class="goods-name">{{items.blindbox_name}}</view>
							</view>
							<view class="discount-price">
								<text class="unit color-base-text font-size-tag">￥<text class="price color-base-text font-size-toolbar">{{items.price}}</text></text>
								<!-- <text class="delete-price font-size-tag color-tip">
									<text class="unit">￥</text>555
								</text> -->
							</view>
						</view>
					</view>
				</view>
				<view v-else><ns-empty :isIndex="!1" text="暂无数据"></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import nsAdv from '@/components/ns-adv/ns-adv.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		mixins: [globalConfig],
		components: {
			nsAdv
		},
		data() {
			return {
				boxStatus: 0,
				list:[],
				categoryList:[],
				showEmpty: false,
				isIphoneX: false, //判断手机是否是iphoneX以上
				state: 1,
				adv : {}
			};
		},
		onLoad() {
			this.getCategory()
			this.isIphoneX = this.$util.uniappIsIPhoneX();
		},
		onShow() {
			this.getAdvList();
			if (!this.addonIsExit.blindbox) {
				this.$util.showToast({
					title: '商家未开启盲盒',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}		
		},
		methods:{
			getAdvList() {
				this.$api.sendRequest({
					url:'/api/adv/detail',
					data:{
						keyword: 'NS_BLINDBOX',
					},
					success:res=>{
						if(res.code == 0){
							var data = res.data.adv_list;
							for(var index in data){
								if(data[index].adv_url) data[index].adv_url = JSON.parse(data[index].adv_url);
							}
							this.adv = res.data.adv_list;
						}
						console.log(this.adv)
					}
				})
			},
			getCategory(){
				this.$api.sendRequest({
					url: "/blindbox/api/goods/categoryList",
					success: res => {
						if (res.code >= 0) {
							this.categoryList = res.data;
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			getDate(mescroll) {
				this.showEmpty = false;
				this.$api.sendRequest({
					url: '/blindbox/api/goods/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						category_id:this.boxStatus,
					},
					success: res => {
						this.showEmpty = true;
						let newArr = [];
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({title: res.message});
						}
						mescroll.endSuccess(newArr.length);//设置列表数据
						if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
						this.list = this.list.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
				});
			},
			categoryChange(e) {
				this.boxStatus = e;
				this.$refs.mescroll.refresh();
			},
			toDetail(e){
				this.$util.redirectTo('/otherpages/blindBox/index/index', {
					blindbox_id: e
				});
			},
			imageError(index) {
				this.list[index].blindbox_images = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
		},
	}
</script>

<style lang="scss">
	.ns-adv {
		padding: $margin-updown $margin-both 0;
		overflow: hidden;
		line-height: 1;
		background-color: #fff;
		margin-bottom: 20rpx;
		.my_box_category-big{
			margin-top: 40rpx;
		}
		.my_box_category {
			line-height: 1;
			width: 100%;
			display: flex;
			//justify-content: space-between;
			z-index: 999;
			box-sizing: border-box;
			.category-item {
				text-align: center;
				margin: 0 20rpx;
				white-space: nowrap;
				.item-con {
					display: inline-block;
					height: 88rpx;
					font-size: 30rpx;
					position: relative;
					line-height: 88rpx;
				}
				.item-con.active:after {
					content: '';
					display: block;
					text-align: center;
					width:100%;
					height: 4rpx;
					border-radius: 10rpx;
					position: absolute;
					left: 0;
					bottom: 0;
				}
			}
		}
	}
	// 商品列表双列样式
	.goods-list.double-column {
		display: flex;
		flex-wrap: wrap;
		margin: 0 $margin-both;
		.goods-item {
			flex: 1;
			position: relative;
			background-color: #fff;
			flex-basis: 48%;
			max-width: calc((100% - 30rpx) / 2);
			margin-right: $margin-both;
			margin-bottom: $margin-updown;
			border-radius: $border-radius;
			&:nth-child(2n) {
				margin-right: 0;
			}
			.goods-img {
				position: relative;
				overflow: hidden;
				padding-top: 100%;
				border-top-left-radius: $border-radius;
				border-top-right-radius: $border-radius;
				background-color: #fff;
				image {
					height: 332rpx;
					width:100%;
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
				}
			}
			.info-wrap {
				padding: 0 26rpx 26rpx 26rpx;
				.goods-name {
					font-size: $font-size-base;
					line-height: 1.3;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					word-break: break-word;
					margin-top: 20rpx;
					height: 68rpx;
				}
				.discount-price {
					display: inline-block;
					font-weight: bold;
					line-height: 1;
					margin-top: 16rpx;
					.unit {
						margin-right: 6rpx;
					}
					.delete-price {
						text-decoration: line-through;
						flex: 1;
						font-weight: normal;
						.unit {
							margin-right: 6rpx;
						}
					}
				}
			}
		}
	}
</style>
<style lang="scss" scoped>
	/deep/ .fixed{
		top: 40vh;
	}
	/deep/ .coupon-all{
		width: 85%;
	}
</style>