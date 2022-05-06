<template>
	<view :data-theme="themeStyle">
		<view scroll-y="true" class="goods-detail" :class="isIphoneX ? 'active' : ''">
			<view class="goods-container">
				<!-- 商品媒体信息 -->
				<view class="goods-media">
					<!-- #ifdef H5 -->
					<cover-view class="share">
						<view class="share_left">
							<text class="iconfont iconback_light" @click="$util.goBack()"></text>
						</view>
						<view class="share_right" v-if="preview == 0">
							<text class="follow iconfont iconfenxiang2" @click="openSharePopup()"></text>
							<text class="iconfont" @click="editCollection()" :class="whetherCollection == 1 ? 'iconlikefill color-base-text' : 'iconguanzhu'"></text>
						</view>
					</cover-view>
					<!-- #endif -->
					
					<!-- 商品图片 -->
					<view class="goods-img" :class="{ show: switchMedia == 'img' }">
						<swiper class="swiper" @change="swiperChange" :interval="swiperInterval" :autoplay="swiperAutoplay" autoplay="true" interval="4000" circular="true">
							<swiper-item v-for="(item, index) in goodsSkuDetail.sku_images" :key="index" :item-id="'goods_id_' + index">
								<view class="item" @click="previewMedia(index)">
									<image :src="$util.img(item, { size: 'big' })" @error="swiperImageError(index)" mode="aspectFit" />
								</view>
							</swiper-item>
						</swiper>
						<view class="img-indicator-dots">
							<text>{{ swiperCurrent }}</text>
							<text v-if="goodsSkuDetail.sku_images">/{{ goodsSkuDetail.sku_images.length }}</text>
						</view>
					</view>
					<!-- 商品视频 -->
					<view class="goods-video" :class="{ show: switchMedia == 'video' }">
						<video  id="goodsVideo" :src="$util.img(goodsSkuDetail.video_url)" :poster="$util.img(goodsSkuDetail.sku_image, { size: 'big' })" objectFit="cover"></video>
					</view>

					<!-- 切换视频、图片 -->
					<view class="media-mode" v-if="goodsSkuDetail.video_url != ''">
						<text :class="{ 'color-base-bg': switchMedia == 'video' }" @click="switchMedia = 'video'">{{ $lang('video') }}</text>
						<text :class="{ 'color-base-bg': switchMedia == 'img' }" @click="switchMedia = 'img',videoContext.pause();">{{ $lang('image') }}</text>
					</view>
				</view>

				<!-- 限时折扣 -->
				<view
					v-if="showDiscount && goodsSkuDetail.discountTimeMachine"
					class="goods-promotion"
					:style="{ backgroundImage: 'url(' + $util.img('upload/uniapp/goods/detail_promotion_left_bg.png') + ')' }"
				>
					<view class="price-info">
						<view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_discount_tag.png')" mode="aspectFit"></image></view>
						<!-- <view class="sale-num">已售{{ goodsSkuDetail.sale_num }} {{ goodsSkuDetail.unit }}</view> -->
						<view class="sale-num">已售{{ goodsSkuDetail.sale_num }}</view>
					</view>

					<view class="countdown" :style="{ backgroundImage: 'url(' + $util.img('upload/uniapp/goods/detail_promotion_right_bg.png') + ')' }">
						<view class="txt">距结束仅剩</view>
						<view class="clockrun">
							<uni-count-down
								:day="goodsSkuDetail.discountTimeMachine.d"
								:hour="goodsSkuDetail.discountTimeMachine.h"
								:minute="goodsSkuDetail.discountTimeMachine.i"
								:second="goodsSkuDetail.discountTimeMachine.s"
								color="#fff"
								splitorColor="#FF4644"
								backgroundColor="#FF4644"
							/>
						</view>
					</view>
				</view>

				<view class="group-wrap padding-top">
					<view class="goods-module-wrap">
						<text class="price-symbol color-base-text">{{ $lang('common.currencySymbol') }}</text>
						<template v-if="showDiscount">
							<text class="price color-base-text">{{ goodsSkuDetail.discount_price }}</text>
						</template>
						<template v-else>
							<text class="price color-base-text">{{ goodsSkuDetail.price }}</text>
							<view class="member-price-wrap" v-if="goodsSkuDetail.member_price > 0">
								<text class="unit">{{ $lang('common.currencySymbol') }}</text>
								<text class="money">{{ goodsSkuDetail.member_price }}</text>
								<view class="img-wrap"><image :src="$util.img('upload/uniapp/index/VIP.png')" mode="aspectFit"></image></view>
							</view>
						</template>
						<view class="market-price-wrap">
							<text class="unit" v-if="(showDiscount && goodsSkuDetail.price > 0) || goodsSkuDetail.market_price > 0">{{ $lang('common.currencySymbol') }}</text>
							<text class="money" v-if="showDiscount && goodsSkuDetail.price > 0">{{ goodsSkuDetail.price }}</text>
							<text class="money" v-else-if="goodsSkuDetail.market_price > 0">{{ goodsSkuDetail.market_price }}</text>
						</view>
						<!-- #ifdef MP -->
						<view class="follow-and-share" v-if="preview == 0">
							<text class="follow iconfont iconfenxiang2" @click="openSharePopup()"></text>
							<text class="share iconfont" @click="editCollection()" :class="whetherCollection == 1 ? 'iconlikefill color-base-text' : 'iconguanzhu'"></text>
						</view>
						<!-- #endif -->
					</view>
					<view class="goods-module-wrap info">
						<text class="sku-name-wrap">{{ goodsSkuDetail.goods_name }}</text>
						<text class="introduction color-base-text" v-if="goodsSkuDetail.introduction">{{ goodsSkuDetail.introduction }}</text>
						<view class="logistics-wrap">
							<block v-if="!goodsSkuDetail.is_virtual">
								<text v-if="goodsSkuDetail.is_free_shipping">快递 包邮</text>
								<text v-else>快递 买家承担</text>
							</block>
							<!-- <text>销量 {{ goodsSkuDetail.sale_num }} {{ goodsSkuDetail.unit }}</text> -->
							<text>销量 {{ goodsSkuDetail.sale_num }}</text>
						</view>
						<!-- 会员卡 -->
						<view class="member-card-wrap" @click="$util.redirectTo('/otherpages/member/card_buy/card_buy')" v-if="membercard">
							<text class="iconfont iconhuiyuan"></text>
							<view class="info">
								开通{{ membercard.level_name }}
								<text v-if="memberCardDiscount > 0">预计可省{{ memberCardDiscount }}元</text>
								<text v-else>省更多！</text>
							</view>
							<text class="btn">立即开通</text>
						</view>
					</view>
				</view>

				<!-- 当前商品参与的营销活动入口 -->
				<view class="group-wrap"><ns-goods-promotion ref="goodsPromotion" promotion="discount"></ns-goods-promotion></view>

				<view class="group-wrap"><ns-fenxiao-goods-detail v-if="skuId" :skuId="skuId" ref="refLeverInfo"></ns-fenxiao-goods-detail></view>

				<view class="newdetail margin-bottom">
					<!-- 已选规格 -->
					<view class="item selected-sku-spec" v-if="goodsSkuDetail.sku_spec_format" @click="choiceSku">
						<view class="label">选择</view>
						<view class="box">
							<text v-for="(item, index) in goodsSkuDetail.sku_spec_format" :key="index">{{ item.spec_name }}/{{ item.spec_value_name }}</text>
						</view>
						<text class="iconfont iconright"></text>
						<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
					</view>
					<view class="item coupon" v-if="preview == 0 && couponList.length" @click="openCouponPopup()">
						<view class="label">领券</view>
						<view class="coupon-list">
							<view class="coupon-item color-base-border" v-for="(item, index) in couponList" :key="index">
								<view class="color-base-text" v-if="item.money > 0">满{{ $util.numberFixed(item.at_least) }}减{{ $util.numberFixed(item.money) }}</view>
								<view class="color-base-text" v-if="item.discount > 0">满{{ $util.numberFixed(item.at_least) }}享{{ $util.numberFixed(item.discount, 1) }}折</view>
							</view>
						</view>
						<text class="iconfont iconright"></text>
						<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
					</view>
					<view class="item free" v-if="manjian.rule_json !== null && addonIsExit.manjian" @click="openManjianPopup()">
						<view class="label">促销</view>
						<text class="free-tip color-base-text color-base-border">满减</text>
						<text class="font-size-base value">{{ manjian.manjian_name }}</text>
						<text class="iconfont iconright"></text>
						<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
					</view>
					<view class="item goods-attribute" @click="openAttributePopup()" v-if="goodsSkuDetail.goods_attr_format && goodsSkuDetail.goods_attr_format.length > 0">
						<view class="label">属性</view>
						<view class="box">
							<text v-for="(item, index) in goodsSkuDetail.goods_attr_format" :key="index" v-if="index < 2">{{ item.attr_name }}: {{ item.attr_value_name }}</text>
						</view>
						<text class="iconfont iconright"></text>
						<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
					</view>
					<view class="item service" @click="openMerchantsServicePopup()" v-if="goodsSkuDetail.goods_service.length">
						<view class="label">服务</view>
						<view class="list-wrap">
							<view class="item-wrap" v-for="(item, index) in goodsSkuDetail.goods_service" :key="index" v-if="index < 3">
								<text class="iconfont icondui color-base-text"></text>
								<text>{{ item.service_name }}</text>
							</view>
						</view>
						<text class="iconfont iconright"></text>
						<!-- <view class="img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
					</view>
				</view>

				<!-- 商品属性 -->
				<view @touchmove.prevent.stop>
					<uni-popup ref="attributePopup" type="bottom">
						<view class="goods-attribute-popup-layer popup-layer">
							<view class="head-wrap" @click="closeAttributePopup()">
								<text>商品属性</text>
								<text class="iconfont iconclose"></text>
							</view>
							<scroll-view scroll-y class="goods-attribute-body">
								<view class="item" v-for="(item, index) in goodsSkuDetail.goods_attr_format" :key="index">
									<text class="attr-name">{{ item.attr_name }}</text>
									<text class="value-name">{{ item.attr_value_name }}</text>
								</view>
							</scroll-view>
							<view class="button-box"><button type="primary" @click="closeAttributePopup()">确定</button></view>
						</view>
					</uni-popup>
				</view>

				<template v-if="preview == 0">
					<!-- 优惠券 -->
					<view @touchmove.prevent.stop v-if="couponList.length">
						<uni-popup ref="couponPopup" type="bottom">
							<view class="goods-coupon-popup-layer popup-layer">
								<view class="head-wrap" @click="closeCouponPopup()">
									<text>优惠券</text>
									<text class="iconfont iconclose"></text>
								</view>
								<scroll-view class="coupon-body" scroll-y>
									<view
										class="coupon-item ns-gradient-diy-goods-list"
										:class="{ disabled: item.is_lingqu != undefined }"
										v-for="(item, index) in couponList"
										:key="index"
										:data-theme="themeStyle"
									>
										<view class="coupon-info">
											<view
												class="info-wrap"
												:style="{
													backgroundImage:
														'url(' +
														(item.is_lingqu != undefined
															? $util.img('/upload/uniapp/coupon/bg_lingqu_gary.png')
															: $util.img('/upload/uniapp/coupon/bg_lingqu.png')) +
														')'
												}"
											>
												<view class="coupon-money">
													<template v-if="item.type == 'reward'">
														<text class="unit">{{ $lang('common.currencySymbol') }}</text>
														<text class="money">{{ parseFloat(item.money) }}</text>
													</template>
													<template v-else-if="item.type == 'discount'">
														<text class="money">{{ parseFloat(item.discount) }}</text>
														<text class="unit">折</text>
													</template>
													<view class="at-least">
														<template v-if="item.at_least > 0">
															满{{ item.at_least }}可用
														</template>
														<template v-else>
															无门槛
														</template>
													</view>
												</view>
											</view>
											<view class="desc-wrap">
												<view class="coupon-name">{{ item.coupon_name }}</view>
												<view v-if="item.type == 'discount' && item.discount_limit > 0" class="limit">最多可抵￥{{ item.discount_limit }}</view>
												<view class="time font-size-goods-tag" v-if="item.validity_type == 0">有效期：{{ $util.timeStampTurnTime(item.end_time) }}</view>
												<view class="time font-size-goods-tag" v-else>领取之日起{{ item.fixed_term }}天内有效</view>
											</view>

											<button type="primary" v-if="item.is_lingqu != undefined" @click="receiveCoupon(item.coupon_type_id)" disabled>已领取</button>
											<button type="primary" v-else @click="receiveCoupon(item.coupon_type_id)">领取</button>
										</view>
									</view>
								</scroll-view>
								<view class="button-box"><button type="primary" @click="closeCouponPopup()">确定</button></view>
							</view>
						</uni-popup>
					</view>

					<!-- 促销 -->
					<view @touchmove.prevent.stop v-if="addonIsExit.manjian">
						<uni-popup ref="manjianPopup" type="bottom">
							<view class="manjian-popup-layer popup-layer">
								<view class="head-wrap" @click="closeManjianPopup()">
									<text>促销</text>
									<text class="iconfont iconclose"></text>
								</view>
								<scroll-view scroll-y class="manjian-body">
									<view class="item" v-if="manjian.manjian != undefined" style="display: flex;">
										<view class="free-tip color-base-text color-base-border">满减</view>
										<text class="font-size-base">{{ manjian.manjian }}</text>
									</view>
									<view class="item" v-if="manjian.mansong != undefined">
										<text class="free-tip color-base-text color-base-border">满送</text>
										<text class="font-size-base">{{ manjian.mansong }}</text>
									</view>
									<view class="item" v-if="manjian.free_shipping != undefined" style="display: flex;">
										<view class="free-tip color-base-text color-base-border">包邮</view>
										<text class="font-size-base">{{ manjian.free_shipping }}</text>
									</view>
								</scroll-view>
								<view class="button-box"><button type="primary" @click="closeManjianPopup()">确定</button></view>
							</view>
						</uni-popup>
					</view>

					<!-- 商品服务 -->
					<view @touchmove.prevent.stop>
						<uni-popup ref="merchantsServicePopup" type="bottom">
							<view class="goods-merchants-service-popup-layer popup-layer">
								<view class="head-wrap" @click="closeMerchantsServicePopup()">
									<text>{{ $lang('service') }}</text>
									<text class="iconfont iconclose"></text>
								</view>
								<scroll-view scroll-y>
									<view class="item" :class="{ 'empty-desc': !item.desc }" v-for="(item, index) in goodsSkuDetail.goods_service" :key="index">
										<view class="iconfont icondui color-base-text"></view>
										<view class="info-wrap">
											<text class="title">{{ item.service_name }}</text>
											<text class="describe" v-if="item.desc">{{ item.desc }}</text>
										</view>
									</view>
								</scroll-view>
								<view class="button-box"><button type="primary" @click="closeMerchantsServicePopup()">确定</button></view>
							</view>
						</uni-popup>
					</view>
				</template>

				<!-- 组合套餐 -->
				<view v-if="preview == 0 && bundling.length && bundling[0].bl_name && addonIsExit.bundling">
					<view class="group-wrap" @click="openBundlingPopup()">
						<view class="goods-cell" @click="openBundlingPopup()">
							<view class="box">
								<text class="tit">组合套餐</text>
								<text>{{ bundling[0].bl_name }}</text>
							</view>
							<text class="iconfont iconright"></text>
							<!-- <view class="more-img-wrap"><image :src="$util.img('upload/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
						</view>
						<scroll-view class="combo-goods-wrap color-tip" scroll-x="true">
							<view class="goods-wrap">
								<view class="goods-item" @click="toGoodsDetail(skuId)" v-if="bundlingType == true">
									<view class="combo-img">
										<image :src="$util.img(goodsSkuDetail.sku_image, { size: 'mid' })" @error="imageError()" />
										<view class="price-wrap">
											<text class="unit">{{ $lang('common.currencySymbol') }}</text>
											<text class="price">{{ goodsSkuDetail.price }}</text>
										</view>
									</view>
									<text class="name">{{ goodsSkuDetail.goods_name }}</text>
								</view>
								<block v-for="(item, index) in bundling[0].bundling_goods" :key="index">
									<template v-if="index < 3">
										<view class="goods-item" @click="toGoodsDetail(item.sku_id)">
											<view class="combo-img">
												<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="bundlingImageError(0, index)" />
												<view class="price-wrap">
													<text class="unit">{{ $lang('common.currencySymbol') }}</text>
													<text class="price">{{ item.price }}</text>
												</view>
											</view>
											<text class="name">{{ item.sku_name }}</text>
										</view>
									</template>
								</block>
							</view>
						</scroll-view>
					</view>

					<view @touchmove.prevent.stop>
						<uni-popup ref="bundlingPopup" type="bottom">
							<view class="bundling-popup-layer popup-layer">
								<view class="head-wrap" @click="closeBundlingPopup()">
									<text>组合套餐</text>
									<text class="iconfont iconclose"></text>
								</view>
								<scroll-view scroll-y class="bundling-body">
									<view class="bundling-view">
										<block v-for="(item, index) in bundling" :key="index">
											<view class="bundling-item">
												<view class="title" @click="toComoDetail(item.bl_id)">
													<text>{{ item.bl_name }}</text>
													<text class="iconfont iconright"></text>
												</view>
												<scroll-view scroll-x>
													<view class="goods-wrap">
														<view class="goods-item" @click="toGoodsDetail(skuId)">
															<view class="combo-img">
																<image :src="$util.img(goodsSkuDetail.sku_image, { size: 'mid' })" @error="imageError()" />
																<view class="price-wrap">
																	<text class="unit">{{ $lang('common.currencySymbol') }}</text>
																	<text class="price">{{ goodsSkuDetail.price }}</text>
																</view>
															</view>
															<text class="name">{{ goodsSkuDetail.goods_name }}</text>
														</view>
														<block v-for="(goods, goods_index) in item.bundling_goods" :key="goods_index">
															<template v-if="goods_index < 3">
																<view class="goods-item" @click="toGoodsDetail(goods.sku_id)">
																	<view class="combo-img">
																		<image :src="$util.img(goods.sku_image, { size: 'mid' })" @error="bundlingImageError(index, goods_index)" />
																		<view class="price-wrap">
																			<text class="unit">{{ $lang('common.currencySymbol') }}</text>
																			<text class="price">{{ goods.price }}</text>
																		</view>
																	</view>
																	<text class="name">{{ goods.sku_name }}</text>
																</view>
															</template>
														</block>
													</view>
												</scroll-view>
												<view class="bundling-price-wrap">
													<text class="label">套餐价</text>
													<text class="unit color-base-text">{{ $lang('common.currencySymbol') }}</text>
													<text class="price color-base-text">{{ item.bl_price }}</text>
													<button type="primary" size="mini" @click="toComoDetail(item.bl_id)">立即购买</button>
												</view>
											</view>
										</block>
									</view>
								</scroll-view>
							</view>
						</uni-popup>
					</view>
				</view>
				
				<view class="detail-community" v-if="goodsSkuDetail.qr_data  &&  goodsSkuDetail.qr_data.qr_state==1">
					<view class="community-box">
						<image :src="$util.img('/upload/uniapp/goods/detail_erweiImage.png')" mode="aspectFill"></image>
						<view class="community-content">
							<view class="community-title">{{goodsSkuDetail.qr_data.qr_name}}</view>
							<view class="community-txt">{{goodsSkuDetail.qr_data.community_describe}}</view>
						</view>
					</view>
					<view class="community-btn" @click="onCommunity()">添加</view>
				</view>
				
				<!-- 促销 -->
				<view class="community-model" @touchmove.prevent.stop @click.stop="onCloseCommunity()"  v-show="isCommunity">
					<view class="community-model-content" @click.stop>
						<view class="community-model-content-radius">
							<view>添加社群</view>
						</view>
						<view class="community-model-content-draw" v-if="goodsSkuDetail.qr_data && goodsSkuDetail.qr_data.qr_img">
							<image :src="goodsSkuDetail.qr_data.qr_img !='' && goodsSkuDetail.qr_data.qr_state==1 ? $util.img(goodsSkuDetail.qr_data.qr_img) : $util.img('/upload/uniapp/goods/detail_erweiImage.png')" mode="aspectFill" show-menu-by-longpress="true"></image>
						</view>
						<view class="community-model-content-text">长按识别二维码，添加社群</view>
					</view>
					<view class="community-model-close" @click.stop="onCloseCommunity()"><text class="iconfont iconclose"></text></view>
				</view>

				<!-- 商品评价 -->
				<view class="group-wrap" v-if="preview == 0 && evaluateConfig.evaluate_show == 1">
					<view class="goods-evaluate" @click="toEvaluateDetail(goodsSkuDetail.goods_id)">
						<view class="tit" >
							<!-- <view class="tit" :class="{ active: goodsEvaluate.content }"> -->
							<view>
								<text class="color-title font-size-toolbar">
									评价
									<text class="font-size-base">({{ goodsSkuDetail.evaluate }})</text>
								</text>
								<text class="evaluate-item-empty" v-if="!goodsSkuDetail.evaluate">暂无评价</text>
								<view class="evaluate-item-empty" v-else>
									<text class="font-size-tag">查看全部</text>
									<text class="iconfont iconright font-size-tag"></text>
								</view>
							</view>
						</view>
						<view class="evaluate-item" v-for="(item,index) in goodsEvaluate" :key="index" v-if="item.content">
							<view class="evaluator">
								<view class="evaluator-info">
									<view class="evaluator-face">
										<image
											v-if="item.member_headimg"
											:src="$util.img(item.member_headimg)"
											@error="item.member_headimg = $util.getDefaultImage().default_headimg"
											mode="aspectFill"
										/>
										<image
											v-else
											:src="$util.getDefaultImage().default_headimg"
											@error="item.member_headimg = $util.getDefaultImage().default_headimg"
											mode="aspectFill"
										/>
									</view>
									<text class="evaluator-name"v-if="item.member_name.length > 2 && item.is_anonymous == 1">{{ item.member_name[0] }}***{{item.member_name[item.member_name.length - 1]}}</text>
									<text class="evaluator-name"v-else>{{ item.member_name }}</text>
								</view>
								<text class="time color-tip">{{ $util.timeStampTurnTime(item.create_time) }}</text>
							</view>
							<view class="cont margin-top">{{ item.content }}</view>
							<scroll-view scroll-x="true">
								<view class="evaluate-img" v-if="item.images">
									<view class="img-box" v-for="(img, img_index) in item.images" :key="img_index" @click="previewEvaluate(index, img_index, 'images')">
										<image :src="$util.img(img)" mode="aspectFill" />
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>

				<!-- 详情 -->
				<view class="goods-detail-tab">
					<view class="detail-tab" v-if="service">
						<view class="tab-item" :class="detailTab == 0 && service.is_display == 1 ? 'active color-base-text' : ''" @click="detailTab = 0">商品详情</view>
						<view v-if="service.is_display == 1" class="tab-item" :class="detailTab == 1 ? 'active color-base-text' : ''" @click="detailTab = 1">售后保障</view>
					</view>

					<view class="detail-content" :class="detailTab == 1 ? 'active' : ''">
						<view class="detail-content-item" v-show="detailTab == 0">
							<view class="goods-details" v-if="goodsSkuDetail.goods_content">
								<rich-text :nodes="goodsSkuDetail.goods_content" @click="showImg($event)" :data-nodes="goodsSkuDetail.goods_content"></rich-text>
							</view>
							<view class="goods-details active" v-else>该商家暂无上传相关详情哦！</view>
						</view>
						<block v-if="service">
							<view class="detail-content-item" v-show="detailTab == 1 && service.is_display == 1">
								<view class="goods-details" v-if="service.content">
									<rich-text :nodes="service.content" @click="showImg($event)" :data-nodes="service.content"></rich-text>
								</view>
								<view class="goods-details active" v-else>该商品暂无相关售后哦！</view>
							</view>
						</block>
					</view>
				</view>

				<view v-if="preview == 0"><nsGoodsRecommend ref="goodrecommend"></nsGoodsRecommend></view>

				<!-- SKU选择 -->
				<ns-goods-sku
					ref="goodsSku"
					@refresh="refreshGoodsSkuDetail"
					@levelInfo="refreshLevelInfo"
					:goods-detail="goodsSkuDetail"
					:max-buy="goodsSkuDetail.max_buy"
					:min-buy="goodsSkuDetail.min_buy"
					v-on:GetSkuid="SetSkuid"
				></ns-goods-sku>

				<!-- 海报 -->
				<view @touchmove.prevent.stop>
					<uni-popup ref="posterPopup" type="bottom" class="poster-layer">
						<template v-if="poster != '-1'">
							<view>
								<view class="image-wrap">
									<image :src="$util.img(poster)" :show-menu-by-longpress="true" />
								</view>
								<!-- #ifdef MP || APP-PLUS  -->
								<view class="save" @click="saveGoodsPoster()">保存图片</view>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<view class="save">长按保存图片</view>
								<!-- #endif -->
							</view>
							<view class="close iconfont iconclose" @click="closePosterPopup()"></view>
						</template>
						<view v-else class="msg">{{ posterMsg }}</view>
					</uni-popup>
				</view>

				<!-- 分享弹窗 -->
				<view @touchmove.prevent.stop>
					<uni-popup ref="sharePopup" type="bottom" class="share-popup">
						<view>
							<view class="share-title">分享</view>
							<view class="share-content">
								<!-- #ifdef MP -->
								<view class="share-box">
									<button class="share-btn" :plain="true" open-type="share">
										<view class="iconfont iconiconfenxianggeihaoyou"></view>
										<text>分享给好友</text>
									</button>
								</view>
								<!-- #endif -->
								
								<!-- #ifdef MP-WEIXIN -->
								<view class="share-box" v-if="goodsCircle">
									<button class="share-btn" :plain="true" @click="openBusinessView">
										<view class="iconfont iconhaowuquan"></view>
										<text>分享到好物圈</text>
									</button>
								</view>
								<!-- #endif -->
								
								<!-- #ifdef MP-WEIXIN -->
<!-- 								<view class="share-box" @click="openFriendPopup">
									<button class="share-btn" :plain="true">
										<view class="iconfont iconpengyouquan"></view>
										<text>分享到朋友圈</text>
									</button>
								</view> -->
								<!-- #endif -->
								
								<view class="share-box" @click="openPosterPopup">
									<button class="share-btn" :plain="true">
										<view class="iconfont iconpengyouquan"></view>
										<text>生成分享海报</text>
									</button>
								</view>
								<!-- #ifdef H5 -->
								<view class="share-box" @click="copyUrl">
									<button class="share-btn" :plain="true">
										<view class="iconfont iconfuzhilianjie"></view>
										<text>复制链接</text>
									</button>
								</view>
								<!-- #endif -->
							</view>
							<view class="share-footer" @click="closeSharePopup"><text>取消分享</text></view>
						</view>
					</uni-popup>
				</view>
			</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>

		<!-- 商品底部导航 -->
		<ns-goods-action :safeArea="isIphoneX">
			<template v-if="goodsSkuDetail.goods_state == 1">
				<ns-goods-action-icon text="首页" icon="iconshouye1" @click="goHome" />
				 
				<!-- #ifdef MP -->
					<ns-goods-action-icon text="客服" icon="iconkefu1"  open-type="contact" :send-data="contactData" v-if="kefuConfig.system == 0 && kefuConfig.weapp == 1" />
					<ns-goods-action-icon text="客服" icon="iconkefu1" @click="goConnect" v-else-if="kefuConfig.system == 1" />
				<!-- #endif -->
				<!-- #ifndef MP -->
					<ns-goods-action-icon text="客服" icon="iconkefu1" @click="goConnect" v-if="kefuConfig.system == 0 && kefuConfig.open == 1" />
					<ns-goods-action-icon text="客服" icon="iconkefu1" @click="goConnect" v-else-if="kefuConfig.system == 1" />
				<!-- #endif -->

				<ns-goods-action-icon text="购物车" icon="icongouwuche2" :corner-mark="cartCount > 0 ? cartCount + '' : ''" @click="goCart" />
				<block v-if="goodsSkuDetail.stock == 0 && !goodsSkuDetail.sku_spec_format">
					<ns-goods-action-button class="goods-action-button active3" disabled-text="库存不足" :disabled="true" />
					<!-- <ns-goods-action-button v-if="goodsSkuDetail.sku_spec_format" class="goods-action-button active3" disabled-text="库存不足" :disabled="true" @click="joinCart" /> -->
					<!-- <ns-goods-action-button v-else class="goods-action-button active3" disabled-text="库存不足" :disabled="true" /> -->
				</block>
				<block 
				v-else-if="goodsSkuDetail.is_limit == 1 && goodsSkuDetail.limit_type == 2 && goodsSkuDetail.max_buy != 0 
										&& goodsSkuDetail.purchased_num >= goodsSkuDetail.max_buy">
										<!-- (goodsSkuDetail.is_limit == 1 && goodsSkuDetail.limit_type == 1 && goodsSkuDetail.max_buy != 0) -->
					<ns-goods-action-button class="goods-action-button active3" disabled-text="已达最大限购数量" :disabled="true" />
				</block>
				<block v-else>
					<ns-goods-action-button
						class="goods-action-button"
						:class="goodsSkuDetail.is_virtual == 0 ? 'active1' : ''"
						text="加入购物车"
						background="color-join-cart"
						@click="joinCart"
						v-if="goodsSkuDetail.is_virtual == 0"
					/>
					<ns-goods-action-button class="goods-action-button" :class="goodsSkuDetail.is_virtual == 0 ? 'active2' : 'active4'" text="立即购买" @click="buyNow" />
				</block>
			</template>
			<template v-else>
				<ns-goods-action-button class="goods-action-button active3" disabled-text="该商品已下架" :disabled="true" />
			</template>
		</ns-goods-action>
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
	</view>
</template>

<script>
import nsGoodsAction from '@/components/ns-goods-action/ns-goods-action.vue';
import nsGoodsActionIcon from '@/components/ns-goods-action-icon/ns-goods-action-icon.vue';
import nsGoodsActionButton from '@/components/ns-goods-action-button/ns-goods-action-button.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import nsGoodsSku from '@/components/ns-goods-sku/ns-goods-sku.vue';
import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
import uniCountDown from '@/components/uni-count-down/uni-count-down.vue';
import detail from '../public/js/detail.js';
import scroll from '@/common/js/scroll-view.js';
import nsFenxiaoGoodsDetail from '@/components/ns-fenxiao-goods-detail/ns-fenxiao-goods-detail.vue';
import nsGoodsPromotion from '@/components/ns-goods-promotion/ns-goods-promotion.vue';
import globalConfig from '@/common/js/golbalConfig.js';
import toTop from '@/components/toTop/toTop.vue';

export default {
	components: {
		nsGoodsAction,
		nsGoodsActionIcon,
		nsGoodsActionButton,
		uniPopup,
		nsGoodsSku,
		nsGoodsRecommend,
		uniCountDown,
		nsFenxiaoGoodsDetail,
		nsGoodsPromotion,
		toTop
	},
	data() {
		return {
			kefuConfig: {
				weapp: '',
				system: '',
				open: '',
				open_url: ''
			}
		};
	},
	mixins: [detail, scroll, globalConfig],
	/**
	 * 自定义分享内容
	 * @param {Object} res
	 */
	onShareAppMessage(res) {
		var path = '/pages/goods/detail/detail?sku_id=' + this.skuId;
		if (this.memberId) path += '&source_member=' + this.memberId;
		return {
			title: this.goodsSkuDetail.sku_name,
			imageUrl: this.$util.img(this.goodsSkuDetail.sku_image, {
				size: 'big'
			}),
			path: path,
			success: res => {},
			fail: res => {}
		};
	},
	// #ifdef MP-WEIXIN
	// 分享到微信朋友圈
	onShareTimeline() {
		let query = 'sku_id=' + this.skuId;
		if (this.memberId) query += '&source_member=' + this.memberId;
		return {
			title: this.goodsSkuDetail.sku_name,
			query: query,
			imageUrl: this.$util.img(this.goodsSkuDetail.sku_image, {
				size: 'big'
			})
		};
	}
	// #endif
};
</script>
<style lang="scss">
@import '@/common/css/main.scss';
@import './../../../common/css/goods_detail.scss';
@import '../public/css/detail.scss';
</style>
<style scoped>
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
/deep/ .action-icon-wrap .iconfont.iconshouye1 {
	font-size: 40rpx;
}
/deep/ .uni-video-cover {
	background: none;
}

/deep/ .uni-video-cover-duration {
	display: none;
}

/deep/ .uni-video-cover-play-button {
	border-radius: 50%;
	border: 4rpx solid #fff;
	width: 120rpx;
	height: 120rpx;
	background-size: 30%;
}

.poster-layer >>> .uni-popup__wrapper-box {
	max-height: initial !important;
}

/deep/ .sku-layer .uni-popup__wrapper-box {
	overflow-y: initial !important;
}

.goods-promotion .countdown .clockrun >>> .uni-countdown__number {
	min-width: 32rpx;
	height: 32rpx;
	text-align: center;
	line-height: 32rpx;
	border-radius: 4px;
	display: inline-block;
	padding: 4rpx;
	margin: 0;
	border: none;
}

.goods-promotion .countdown .clockrun >>> .uni-countdown__splitor {
	width: 10rpx;
	height: 32rpx;
	line-height: 36rpx;
	text-align: center;
}

.goods-promotion .countdown .clockrun >>> .uni-countdown__splitor.day {
	width: initial;
}

/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	max-height: unset !important;
}

/deep/ .goods-action-button.active1 {
	padding-left: 10px;
}

/deep/ .goods-action-button.active2 {
	padding-right: 10px;
}

/deep/ .goods-action-button.active3 {
	padding: 0 10px;
}

/deep/ .goods-action-button.active4 {
	padding: 0 10px;
}
/deep/ .uni-popup__wrapper.bottom {
	border-radius: 24rpx 24rpx 0 0;
}

/deep/ .goods-action-button.active1 .action-buttom-wrap {
	height: 72rpx;
	line-height: 72rpx;
	border-top-left-radius: 72rpx;
	border-bottom-left-radius: 72rpx;
}

/deep/ .goods-action-button.active2 .action-buttom-wrap {
	height: 72rpx;
	line-height: 72rpx;
	border-top-right-radius: 72rpx;
	border-bottom-right-radius: 72rpx;
}

/deep/ .goods-action-button.active3 .action-buttom-wrap {
	height: 72rpx;
	line-height: 72rpx;
	border-radius: 72rpx;
	margin: 20rpx 0;
}

/deep/ .goods-action-button.active4 .action-buttom-wrap {
	height: 72rpx;
	line-height: 72rpx;
	border-radius: 72rpx;
}

[data-theme='theme-pink'] >>> .active1 .action-buttom-wrap text {
	color: #303133;
}

[data-theme='theme-golden'] >>> .active1 .action-buttom-wrap text {
	color: #303133;
}
</style>
