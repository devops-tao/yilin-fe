<template>
	<view class="diy-seckill" v-if="timeList.length > 1 || (timeList.length == 1 && dataList.length)" :style="{ backgroundColor: value.backgroundColor, marginTop: value.marginTop * 2 + 'rpx' }">
		<template v-if="value.style == 1">
			<view class="marketing-wrap marketing-wrap-1">
				<image :src="$util.img('/upload/uniapp/bargain/' + value.bgSelect + '.png')" mode="widthFix"></image>

				<view class="marketimg-box">
					<view class="marketimg-box-title">
						<view class="marketimg-box-title-left">
							<template v-for="(item, index) in value.list" v-if="item.style == 1">
								<image :src="$util.img(item.imageUrl)"></image>
							</template>
							<!-- <image v-if="value.list.imageUrl" :src="$util.img(value.list.imageUrl)" mode="widthFix"></image> -->

							<view class="seckill-title-time color-base-border" v-if="isNow">
								<view class="seckill-title-name">距离结束</view>
								<view class="seckill-H">{{ seckillH ? seckillH : '00' }}</view>
								<view class="symbol">:</view>
								<view class="seckill-I">{{ seckillI ? seckillI : '00' }}</view>
								<view class="symbol">:</view>
								<view class="seckill-S">{{ seckillS ? seckillS : '00' }}</view>
							</view>
						</view>

						<view class="marketimg-box-title-right" :class="value.bgSelect" @click="toMore()">
							<text>更多秒杀</text>
							<text class="iconfont iconright"></text>
						</view>
					</view>

					<view class="seckill-time-list">
						<scroll-view class="seckil-nav" scroll-x="true" scroll-with-animation :scroll-into-view="'a' + seckillId">
							<!-- active 是选中之后的样式 -->
							<view class="nav-item" :id="'a' + item.id" :class="seckillId == item.id ? 'active' : ''" v-for="(item, key) in timeList" :key="key" @click="ontabtap(item.id, key)">
								<view class="nav-item-con">
									<view class="nav-title">{{ transformSeckillTime(item.seckill_start_time) }}</view>
									<view class="nav-content" :class="seckillId == item.seckill_id ? 'active' : ''" v-if="key > index">敬请期待</view>
									<view class="nav-content" :class="seckillId == item.seckill_id ? 'active' : ''" v-if="key == index && !item.isNow">即将开始</view>
									<view class="nav-content" :class="seckillId == item.seckill_id ? 'active' : ''" v-if="key == index && item.isNow">抢购中</view>
									<view class="nav-content" :class="seckillId == item.seckill_id ? 'active' : ''" v-if="key < index">已结束</view>
								</view>
							</view>
						</scroll-view>
					</view>

					<view class="marketimg-box-con" v-if="value.changeType == 1" @click="isEnd(seckillIndex < index && timeList[index].isNow)">
						<scroll-view class="marketimg-box-con-scroll" :scroll-x="true" :show-scrollbar="false">
							<view v-if="!dataList.length" style="z-index: 1 !important;">
								<ns-empty :fixed="!1" :isIndex="!1" text="该时间段暂无商品"></ns-empty>
							</view>

							<view v-else class="marketimg-box-con-item" v-for="(dataItem, i) in dataList" :key="i" @click="toDetail(dataItem.id, index)">
								<view class="wrap">
									<view class="img-box">
										<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(i)"></image>
										<!-- <image :src="$util.img(dataItem.sku_image, { size: 'mid' })" mode="aspectFit" @error="imageError(i)"></image> -->
									</view>
									<view class="content">
										<view class="title">{{ dataItem.goods_name }}</view>
										<view class="price-box color-base-text">
											￥
											<text class="original-price">{{ dataItem.seckill_price }}</text>
										</view>
										<view class="num">￥{{ dataItem.price }}</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>

					<view class="marketimg-box-con" v-if="value.changeType == 2" @click="isEnd(seckillIndex < index && timeList[index].isNow)">
						<swiper class="marketimg-swiper" style="height: 340rpx;" :autoplay="false" :current="current" @change="changeCurrent">
							<swiper-item class="swiper-item" v-if="!dataList.length" style="z-index: 1 !important;">
								<ns-empty :fixed="!1" :isIndex="!1" text="该时间段暂无商品"></ns-empty>
							</swiper-item>

							<swiper-item v-else class="swiper-item" v-for="i in Math.ceil(dataList.length / 3)" :key="i">
								<view class="item" style="overflow: hidden;">
									<!-- #ifdef MP-WEIXIN -->
									<block v-for="(dataItem, dataIndex) in dataList" :key="dataIndex" v-if="dataIndex < (i + 1) * 3 && dataIndex >= i * 3">
										<view class="marketimg-box-con-item marketimg-box-con-item_two" @click="toDetail(dataItem.id, dataIndex)">
											<view class="img-box">
												<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(dataIndex)"></image>
												<!-- <image :src="$util.img(dataItem.sku_image, { size: 'mid' })" mode="aspectFit" @error="imageError(dataIndex)"></image> -->
											</view>
											<view class="content">
												<view class="title">{{ dataItem.goods_name }}</view>
												<view class="price-box color-base-text">
													￥
													<text class="original-price">{{ dataItem.seckill_price }}</text>
												</view>
												<view class="num">￥{{ dataItem.price }}</view>
											</view>
										</view>
									</block>
									<!-- #endif -->
									<!-- #ifndef MP-WEIXIN -->
									<block v-for="(dataItem, dataIndex) in dataList" :key="dataIndex" v-if="dataIndex < i * 3 && dataIndex >= (i - 1) * 3">
										<view class="marketimg-box-con-item marketimg-box-con-item_two" @click="toDetail(dataItem.id, dataIndex)">
											<view class="img-box">
												<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(dataIndex)"></image>
												<!-- <image :src="$util.img(dataItem.sku_image, { size: 'mid' })" mode="aspectFit" @error="imageError(dataIndex)"></image> -->
											</view>
											<view class="content">
												<view class="title">{{ dataItem.goods_name }}</view>
												<view class="price-box color-base-text">
													￥
													<text class="original-price">{{ dataItem.seckill_price }}</text>
												</view>
												<view class="num">￥{{ dataItem.price }}</view>
											</view>
										</view>
									</block>
									<!-- #endif -->
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
		</template>

		<template v-if="dataList.length > 0 && (value.style == 2 || value.style == 3)">
			<view class="marketing-wrap marketing-wrap-two" :class="'marketing-wrap-'+ value.style">
				<view class="marketimg-box">
					<view class="marketimg-box-title marketimg-box-title-2" v-if="value.style == 2">
						<view class="marketimg-box-title-left">
							<template v-for="(item, index) in value.list" v-if="item.style == 2">
								<image :src="$util.img(item.imageUrl)"></image>
							</template>
							<!-- <image :src="$util.img('upload/uniapp/seckill/title1.png')"></image> -->

							<view class="seckill-title-time" v-if="isNow">
								<view class="seckill-title-name">距离结束</view>
								<view class="seckill-H">{{ seckillH ? seckillH : '00' }}</view>
								<view class="symbol">:</view>
								<view class="seckill-I">{{ seckillI ? seckillI : '00' }}</view>
								<view class="symbol">:</view>
								<view class="seckill-S">{{ seckillS ? seckillS : '00' }}</view>
							</view>
						</view>

						<view class="marketimg-box-title-right" @click="toMore()">
							<text>更多秒杀</text>
							<text class="iconfont iconright"></text>
						</view>
					</view>
					
					<view class="marketimg-box-title marketimg-box-title-3" v-if="value.style == 3">
						<view class="marketimg-box-title-left">
							<template v-for="(item, index) in value.list" v-if="item.style == 3">
								<image :src="$util.img(item.imageUrl)"></image>
							</template>
							<!-- <image :src="$util.img('upload/uniapp/seckill/title2.png')"></image> -->
					
							<view class="seckill-title-time" v-if="isNow">
								<view class="seckill-title-name">距离结束</view>
								<view class="seckill-H">{{ seckillH ? seckillH : '00' }}</view>
								<view class="symbol">:</view>
								<view class="seckill-I">{{ seckillI ? seckillI : '00' }}</view>
								<view class="symbol">:</view>
								<view class="seckill-S">{{ seckillS ? seckillS : '00' }}</view>
							</view>
						</view>
					</view>

					<view class="marketimg-box-con" @click="isEnd(seckillIndex < index && timeList[index].isNow)">
						<view class="marketimg-box-con-item" v-for="(dataItem, i) in dataList" :key="i" @click="toDetail(dataItem.id, index)">
							<view class="wrap">
								<view class="img-box">
									<image :src="goodsImg(dataItem.goods_image)" mode="aspectFit" @error="imageError(i)"></image>
									<!-- <image :src="$util.img(dataItem.sku_image, { size: 'mid' })" mode="aspectFit" @error="imageError(i)"></image> -->
								</view>
								<view class="content">
									<view class="top">
										<view class="title">{{ dataItem.goods_name }}</view>
										<view class="progress">
											<view class="left">
												<view class="box">
													<view class="con" :style="{'width': Math.floor((dataItem.sale_num / (dataItem.goods_stock + dataItem.sale_num))*240) + 'rpx'}"></view>
												</view>
											</view>
											<view class="right">已抢{{ (dataItem.sale_num / (dataItem.goods_stock + dataItem.sale_num) * 100).toFixed(2) }}%</view>
										</view>
									</view>
									
									<view class="bot">
										<view class="price-box">
											<text class="unit color-base-text">￥</text>
											<text class="seckill-price color-base-text">{{ dataItem.seckill_price }}</text>
											<text class="original-price">￥{{ dataItem.price }}</text>
										</view>
										<button class="btn color-base-bg">立即抢购</button>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					
					<view class="marketimg-box-title-right" @click="toMore()" v-if="value.style == 3">
						<text>更多秒杀</text>
						<text class="iconfont iconright"></text>
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		name: 'diy-seckill',
		props: {
			value: {
				type: Object
			}
		},
		mixins: [globalConfig],
		data() {
			return {
				seckillId: 0,
				seckillIndex: null, //选中时间块的index
				index: null, //当前正在抢购的index,
				timeList: [],
				dataList: [],
				isNow: false,
				seckillH: '',
				seckillI: '',
				seckillS: '',
				seckillName: '',
				current: 0, //当前的swiper
				seckillInterval: null
			};
		},
		created() {
			this.getTimeList();
			//设置秒杀状态
			this.$store.commit('setDiySeckillInterval', 1);
		},
		watch: {
			diySeckillInterval(val, old) {
				if (val == 0) {
					clearInterval(this.seckillInterval);
				} else if (val == 1) {
					this.getTimeList();
				}
			}
		},
		methods: {
			changeCurrent(e) {
				this.current = e.detail.current;
			},
			//时间转换
			transformSeckillTime(time) {
				time = parseFloat(time);
				var hour = parseInt(time / 3600);
				var minute = parseInt((time % 3600) / 60);
				var second = parseInt(time % 60);

				if (hour < 10) hour = '0' + hour;
				if (minute < 10) minute = '0' + minute;
				if (second < 10) second = '0' + second;

				return hour + ':' + minute;
			},
			goodsImg(imgStr) {
				let imgs = imgStr.split(',');
				return imgs[0] ? this.$util.img(imgs[0], {
					size: 'mid'
				}) : this.$util.getDefaultImage().default_goods_img;
			},
			isEnd(isShow) {
				if (!isShow) return;
				this.$util.showToast({
					title: '限时秒杀活动已结束'
				});
			},
			getTimeList() {
				clearInterval(this.seckillInterval);
				this.seckillId = 0;
				this.isNow = false;
				this.seckillH = '';
				this.seckillI = '';
				this.seckillS = '';
				this.$api.sendRequest({
					url: '/seckill/api/seckill/lists',
					success: res => {
						let data = res.data;
						let time = new Date(res.timestamp * 1000); //当前时间

						let newTimes = time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds(); //获取当前时间 时分秒的时间戳
						if (!(data.list instanceof Array)) {
							var tempArr = Object.values(data.list);
						} else {
							var tempArr = data.list;
						}
						tempArr.forEach((v, k) => {
							if (v.seckill_start_time <= newTimes && newTimes < v.seckill_end_time) {
								this.seckillId = v.id;
								this.index = k;
								this.seckillIndex = k;
								// this.seckillName = v.name;
								this.isNow = true;
								v.isNow = true;
							} else {
								v.isNow = false;
							}
						});

						if (!this.seckillId) {
							for (let i = 0; i < tempArr.length; i++) {
								if (newTimes < tempArr[i].seckill_start_time && i == 0) {
									this.seckillId = tempArr[i].id;
									this.index = i;
									this.seckillIndex = i;
								} else if (newTimes < tempArr[i].seckill_start_time && newTimes > tempArr[i - 1].seckill_end_time && i != 0) {
									this.seckillId = tempArr[i].id;
									this.index = i;
									this.seckillIndex = i;
								} else if (i == tempArr.length - 1 && newTimes > tempArr[i].seckill_end_time) {
									this.seckillId = tempArr[i].id;
									this.index = i;
									this.seckillIndex = i;
								}
							}
						}

						if (this.isNow && tempArr.length) {
							var self = this;
							this.seckillInterval = setInterval(function() {
								let currTime = new Date();
								let newTimes = currTime.getHours() * 60 * 60 + currTime.getMinutes() * 60 + currTime.getSeconds();
								var obj = self.$util.countDown(tempArr[self.index].seckill_end_time - newTimes);
								self.seckillH = obj.h;
								self.seckillI = obj.i;
								self.seckillS = obj.s;
								if (self.seckillH == '00' && self.seckillI == '00' && self.seckillS == '00') {
									var timeout = setTimeout(function() {
										self.$store.commit('setDiySeckillInterval', 0);
										self.isNow = false;
										self.seckillH = '';
										self.seckillI = '';
										self.seckillS = '';
										self.index = 1;
										clearTimeout(timeout);
									}, 2000);
								}
							}, 1000);
						}
						this.timeList = tempArr;
						if (this.seckillId) {
							this.getDataList(this.seckillId);
						}
					}
				});
			},
			getDataList(seckillId) {
				var page_size = 10;
				if (this.value.style == 2 || this.value.style == 3) {
					page_size = this.value.goodsCount;
				}
				
				this.$api.sendRequest({
					url: '/seckill/api/seckillgoods/page',
					data: {
						seckill_time_id: seckillId,
						page_size: page_size
					},
					success: res => {
						var data = res.data;
						if (data.list) {
							this.dataList = data.list;
						}
					}
				});
			},
			ontabtap(e, f) {
				this.seckillId = e;
				this.seckillIndex = f;
				this.current = 0;
				this.getDataList(this.seckillId);
			},
			toMore() {
				this.$util.redirectTo('/promotionpages/seckill/list/list');
			},
			toDetail(id, index) {
				if (this.seckillIndex < this.index) {
					this.$util.showToast({
						title: '秒杀活动已结束！'
					});
					return;
				}
				if (this.seckillIndex > this.index) {
					this.$util.showToast({
						title: '秒杀活动还未开启，敬请期待！'
					});
					return;
				}

				if (this.isNow) {
					this.$util.redirectTo('/promotionpages/seckill/detail/detail', {
						seckill_id: id
					});
				} else {
					this.$util.showToast({
						title: '活动还未开始，敬请期待'
					});
				}
			},
			imageError(index) {
				this.dataList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		},
		onPageHide() {
			clearInterval(this.seckillInterval);
		}
	};
</script>

<style lang="scss">
	@import '@/components/diy-seckill/diy-seckill.scss';
	
	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}

	/deep/.uni-scroll-view ::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none;
		width: 0;
		height: 0;
		color: transparent;
		background: transparent;
	}

	/deep/::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
		background: transparent;
	}

	/deep/ .empty {
		height: 332rpx;
	}
</style>
