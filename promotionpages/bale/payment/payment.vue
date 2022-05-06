<template>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		
		
		<template v-if="orderPaymentData.is_virtual == 0">
			<view class="address-box" v-if="orderPaymentData.delivery.delivery_type != 'store'">
				<view class="info-wrap" v-if="orderPaymentData.member_address" @click="selectAddress">
					<view class="icon-wrap"><text class="iconfont icondizhi"></text></view>
					<view class="content">
						<text class="name font-size-base">{{ orderPaymentData.member_address.name ? orderPaymentData.member_address.name : '' }}</text>
						<text class="font-size-base">{{ orderPaymentData.member_address.mobile ? orderPaymentData.member_address.mobile : '' }}</text>
						<text class="cell-more iconfont iconright"></text>
						<view class="desc-wrap">
							{{ orderPaymentData.member_address.full_address ? orderPaymentData.member_address.full_address : '' }}
							{{ orderPaymentData.member_address.address ? orderPaymentData.member_address.address : '' }}
						</view>
					</view>
				</view>
				<view class="empty-wrap" v-else @click="selectAddress">
					<view class="icon-wrap"><view class="iconfont icondizhi empty"></view></view>
					<view class="info">请设置收货地址</view>
					<view class="cell-more"><view class="iconfont iconright"></view></view>
				</view>
		
				<!-- 外卖配送 -->
				<view class="local-box" v-if="orderPaymentData.delivery.delivery_type == 'local'">
					<view class="order-cell">
						<text class="tit">配送时间</text>
						<view class="box">
							<text v-if="timeInfo.showTime">{{ timeInfo.start_time + '-' + timeInfo.end_time }}</text>
							<text v-if="deliveryWeek">
								<template v-if="timeInfo.showTime">
									（
								</template>
								{{ deliveryWeek }}
								<template v-if="timeInfo.showTime">
									）
								</template>
							</text>
							<!-- <text v-if="!canLocalDelicery">（休息中）</text> -->
						</view>
					</view>
					
					<block v-if="orderPaymentData.member_address">
						<view class="pick-block" @click="localtime">
							<view class="font-size-base">送达时间</view>
							<view class="time-picker">
								<text>{{ orderCreateData.buyer_ask_delivery_title }}</text>
								<text class="iconfont iconright cell-more"></text>
							</view>
						</view>
					</block>
				</view>
			</view>
		
			<view class="mobile-wrap" v-if="orderPaymentData.delivery.delivery_type == 'store' && storeInfo.currStore">
				<view class="form-group">
					<text class="iconfont icondianhua2"></text>
					<text class="text">预留手机</text>
					<input type="number" maxlength="11" placeholder="请输入您的手机号码" placeholder-class="color-tip placeholder" class="input" v-model="member_address.mobile" />
				</view>
			</view>
		
			<!-- 配送方式 -->
			<view class="delivery-mode" v-if="orderPaymentData.shop_goods_list.express_type.length > 1">
				<view class="head">
					<text class="iconfont iconwuliu"></text>
					<text>配送方式</text>
				</view>
				<view class="action">
					<button
						v-for="(deliveryItem, deliveryIndex) in orderPaymentData.shop_goods_list.express_type"
						:key="deliveryIndex"
						:type="deliveryItem.name == orderPaymentData.delivery.delivery_type ? 'primary' : 'default'"
						@click="selectDeliveryType(deliveryItem)"
						size="mini"
					>
						{{ deliveryItem.title }}
					</button>
				</view>
			</view>
		
			<!-- 选择门店 -->
			<view class="store-box" v-if="orderPaymentData.delivery.delivery_type == 'store'">
				<block  v-if="storeInfo.currStore">
					<view @click="openSiteDelivery" class="store-info">
						<view v-if="storeInfo.currStore.store_image" class="icon img"><image :src="$util.img(storeInfo.currStore.store_image)" mode="aspectFill"></image></view>
						<view v-else class="icon"><view class="iconfont iconmendian"></view></view>
						<view class="info-wrap">
							<view class="title">
								<text>{{ storeInfo.currStore.store_name }}</text>
								<view class="cell-more iconfont iconright"></view>
							</view>
							<view class="store-detail">
								<view v-if="storeInfo.currStore.open_date">营业时间：{{ storeInfo.currStore.open_date }}</view>
								<view>地址：{{ storeInfo.currStore.full_address }} {{ storeInfo.currStore.address }}</view>
							</view>
						</view>
					</view>
					<view class="store-time">
						<view class="left">自提时间</view>
						<view class="right" @click="storetime">
							{{orderCreateData.buyer_ask_delivery_title}}
							<text class="iconfont iconright"></text>
						</view>
					</view>
				</block>
				<view v-else class="empty">当前无自提门店，请选择其它配送方式</view>
			</view>
		</template>

		<!-- 虚拟商品展示 -->
		<view class="mobile-wrap" v-if="orderPaymentData.is_virtual == 1">
			<view class="icon"><view class="iconfont iconshouji1 ns-font-size-xx-lg"></view></view>
			<view class="mobile-info">
				<view class="tips ns-text-color ns-font-size-sm">购买虚拟类商品需填写您的手机号，以方便商家与您联系</view>
				<view class="form-group">
					<view class="form-item">
						<text class="text">手机号码</text>
						<input
							type="number"
							value=""
							maxlength="11"
							placeholder="请输入您的手机号码"
							placeholder-class="ns-text-color-gray placeholder"
							class="input"
							v-model="orderCreateData.member_address.mobile"
						/>
					</view>
				</view>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-body">
				<!-- 商品 -->
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderPaymentData.shop_goods_list.goods_list" :key="goodsIndex">
					<view @click="navigateTo(goodsItem.sku_id)" class="goods-img">
						<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imageError(goodsIndex)" mode="aspectFill"></image>
					</view>
					
					<view class="goods-info">
						<view @click="navigateTo(goodsItem.sku_id)" class="goods-name">{{ goodsItem.sku_name }}</view>
						<view class="sku " v-if="goodsItem.sku_spec_format">
							<view class="goods-spec">
								<block v-for="(x,i) in goodsItem.sku_spec_format" :key="i" >{{ x.spec_value_name }} {{i < goodsItem.sku_spec_format.length-1 ?'；':''}}</block>
							</view>
						</view>
						<view class="goods-sub-section">
							<view>
								<text class="goods-price ns-text-color">
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									{{ goodsItem.price }}
								</text>
							</view>
							<view>
								<text>
									<text class="font-size-tag">x</text>
									<text class="font-size-base">{{ goodsItem.num }}</text>
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="site-footer">
				<!-- <block v-if="orderPaymentData.is_virtual == 0">
					<view class="order-cell">
						<text class="tit">配送方式</text>
						<block v-if="orderPaymentData.shop_goods_list.express_type.length">
							<view class="box" @click="openSiteDelivery">
								<text class="ns-text-color-gray">{{ orderPaymentData.delivery.delivery_type_name }}</text>
							</view>
							<text class="iconfont iconright"></text>
						</block>
						<block v-else-if="!orderPaymentData.member_address">
							<view class="box"><text class="ns-text-color">请先填写收货地址</text></view>
						</block>
						<block v-else>
							<view class="box"><text class="ns-text-color">商家未配置配送方式</text></view>
						</block>
					</view>
				</block> -->
				<view class="order-cell order-invoice-cell" v-if="orderPaymentData.shop_goods_list.invoice">
					<text class="tit">发票</text>
					<view class="box text-overflow" @click="openPopup('invoicePopup')">
						<text v-if="orderCreateData.is_invoice == 1">{{ orderCreateData.invoice_type == 1 ? '纸质' : '电子' }}发票({{ orderCreateData.invoice_content }})</text>
						<text v-else>无需发票</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="order-cell">
					<text class="tit">活动优惠</text>
					<view class="box text-overflow" @click="openSitePromotion"><text class="ns-text-color-gray">打包一口价</text></view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="order-cell">
					<text class="tit">买家留言</text>
					<view class="box">
						<input
							type="text"
							value=""
							placeholder="留言前建议先与商家协调一致"
							class="ns-text-color-gray"
							placeholder-class="ns-text-color-gray"
							v-model="orderCreateData.buyer_message"
						/>
					</view>
				</view>
			</view>
		</view>

		<!-- 付款台 -->
		
		
<!-- 		<view class="order-checkout" v-if="(orderPaymentData.order_money > 0 && orderPaymentData.member_account.balance_total > 0) || orderPaymentData.shop_goods_list.invoice">
			<view class="order-cell" v-if="orderPaymentData.order_money > 0 && orderPaymentData.member_account.balance_total > 0">
				<text class="tit">使用余额可抵扣<text class="ns-text-color ns-margin-left ns-font-size-sm">¥{{balanceDeduct}}</text></text>
				<view class="box align-right"></view>
				<ns-switch class="balance-switch" @change="useBalance" :checked="orderCreateData.is_balance == 1"></ns-switch>
			</view>
			<view class="order-cell order-invoice-cell" v-if="orderPaymentData.shop_goods_list.invoice">
				<text class="tit">发票</text>
				<view class="box text-overflow" @click="openPopup('invoicePopup')">
					<text v-if="orderCreateData.is_invoice == 1" class="ns-text-color-gray">
						{{ orderCreateData.invoice_type == 1 ? '纸质' : '电子' }}发票({{ orderCreateData.invoice_content }})
					</text>
					<text v-else class="ns-text-color-gray">无需发票</text>
				</view>
				<text class="iconfont iconright"></text>
			</view>
		</view> -->

		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">商品金额</text>
				<view class="box color-title">
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.goods_money | moneyFormat }}</text>
					<!-- <text class="ns-text-color-black">
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						{{ orderPaymentData.goods_money | moneyFormat }}
					</text> -->
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.is_virtual == 0 && orderPaymentData.delivery_money > 0">
				<text class="tit">运费</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">+</text>
						<text class="unit">{{ $lang('common.currencySymbol') }}</text>
						<text class="money">{{ orderPaymentData.delivery_money | moneyFormat }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderCreateData.is_invoice && orderPaymentData.invoice_money > 0">
				<text class="tit">
					税费
					<text class="ns-text-color">({{ orderPaymentData.shop_goods_list.invoice.invoice_rate }}%)</text>
				</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">+</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderPaymentData.invoice_money | moneyFormat }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderCreateData.is_invoice && orderPaymentData.invoice_delivery_money > 0">
				<text class="tit">发票邮寄费</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">+</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderPaymentData.invoice_delivery_money | moneyFormat }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.promotion_money > 0">
				<text class="tit">优惠</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">-</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderPaymentData.promotion_money | moneyFormat }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.coupon_money > 0">
				<text class="tit">优惠券</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">-</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderPaymentData.coupon_money | moneyFormat }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.balance_money > 0">
				<text class="tit">使用余额</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">-</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderPaymentData.balance_money | moneyFormat }}</text>
					</text>
				</view>
			</view>
		</view>
		
		<view class="error-message" v-if="orderPaymentData.delivery && orderPaymentData.delivery.delivery_type == 'local' && orderPaymentData.shop_goods_list.delivery && orderPaymentData.shop_goods_list.delivery.error && orderPaymentData.shop_goods_list.delivery.error !== ''">{{orderPaymentData.shop_goods_list.delivery.error_msg}}</view>
		<view class="order-submit" :class="{ 'bottom-safe-area': isIphoneX }">
			<view class="order-settlement-info">
				<text class="ns-text-color-gray ns-margin-right">共{{ orderPaymentData.goods_num }}件</text>
				<text>合计：</text>
				<text class="ns-text-color">
					{{ $lang('common.currencySymbol') }}
					<text class="money">{{ orderPaymentData.pay_money | moneyFormat }}</text>
				</text>
			</view>
			<view class="submit-btn">
				<button v-if="createBtn()" type="primary" size="mini" @click="openChoosePayment()">提交订单</button>
				<button v-else class="no-submit"  size="mini">
					<block v-if="orderPaymentData.delivery && orderPaymentData.delivery.delivery_type == 'local' && orderPaymentData.shop_goods_list.delivery && orderPaymentData.shop_goods_list.delivery.error && orderPaymentData.shop_goods_list.delivery.start_money > orderPaymentData.shop_goods_list.goods_money">
						差{{ orderPaymentData.shop_goods_list.delivery.start_money-orderPaymentData.shop_goods_list.goods_money | moneyFormat }}起送
					</block>
					<block v-else>提交订单</block>
				</button>
			</view>
		</view>

		<!-- 发票弹窗 -->
<!-- 		<uni-popup ref="invoicePopup" type="bottom">
			<view :style="orderCreateData.is_invoice == 1 ?  'height: 83vh;' : 'height: 48vh;'" class="invoice-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<view><text class="tit">发票</text></view>
					<view class="align-right"><text class="iconfont iconclose uni-bold" @click="closeInvoicePopup()"></text></view>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="invoice-cell is-invoice" v-if="orderPaymentData.shop_goods_list.invoice">
							<text class="tit">需要发票</text>
							<view class="option-grpup">
								<view class="option-item" :class="{ 'ns-bg-color active': orderCreateData.is_invoice == 0 }" @click="changeIsInvoice">不需要</view>
								<view class="option-item" :class="{ 'ns-bg-color active': orderCreateData.is_invoice == 1 }" @click="changeIsInvoice">需要</view>
							</view>
						</view>
						<block v-if="orderCreateData.is_invoice == 1">
							<view class="invoice-cell">
								<text class="tit">发票类型</text>
								<view class="option-grpup">
									<view class="option-item" :class="{ 'ns-bg-color active': orderCreateData.invoice_type == 1 }" @click="changeInvoiceType(1)">纸质</view>
									<view class="option-item" :class="{ 'ns-bg-color active': orderCreateData.invoice_type == 2 }" @click="changeInvoiceType(2)">电子</view>
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">抬头类型</text>
								<view class="option-grpup">
									<view class="option-item" :class="{ 'ns-bg-color active': orderCreateData.invoice_title_type == 1 }" @click="changeInvoiceTitleType(1)">个人</view>
									<view class="option-item" :class="{ 'ns-bg-color active': orderCreateData.invoice_title_type == 2 }" @click="changeInvoiceTitleType(2)">企业</view>
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">发票信息</text>
								<view class="invoice-form-group">
									<input type="text" placeholder="请填写抬头名称" v-model.trim="orderCreateData.invoice_title" />
									<input v-if="orderCreateData.invoice_title_type == 2" type="text" placeholder="请填写纳税人识别号" v-model.trim="orderCreateData.taxpayer_number" />
									<input type="text" placeholder="请填写邮寄地址" v-model.trim="orderCreateData.invoice_full_address" v-if="orderCreateData.invoice_type == 1" />
									<input type="text" placeholder="请填写邮箱" v-model.trim="orderCreateData.invoice_email" v-if="orderCreateData.invoice_type == 2" />
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">发票内容</text>
								<view class="option-grpup">
									<view
										:key="index"
										v-for="(item, index) in orderPaymentData.shop_goods_list.invoice.invoice_content_array"
										:class="{ 'ns-bg-color active': item == orderCreateData.invoice_content }"
										@click="changeInvoiceContent(item)"
										class="option-item"
									>
										{{ item }}
									</view>
								</view>
							</view>
						</block>
						<view class="invoice-tops ns-text-color-gray">发票内容将以根据税法调整，具体请以展示为准，发票内容显示详细商品名 称及价格信息</view>
					</view>
				</scroll-view>
				<view class="popup-footer" @click="saveInvoice" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn ns-bg-color">保存</view></view>
			</view>
		</uni-popup> -->
		<uni-popup ref="invoicePopup" type="bottom">
			<view :style="orderCreateData.is_invoice == 1 ? 'height: 83vh;' : 'height: 48vh;'" class="invoice-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">发票</text>
					<text class="iconfont iconclose" @click="closeInvoicePopup()"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="invoice-cell" v-if="orderPaymentData.shop_goods_list.invoice">
							<text class="tit">需要发票</text>
							<view class="option-grpup">
								<view class="option-item" :class="{ 'color-base-bg active': orderCreateData.is_invoice == 0 }" @click="changeIsInvoice">不需要</view>
								<view class="option-item" :class="{ 'color-base-bg active': orderCreateData.is_invoice == 1 }" @click="changeIsInvoice">需要</view>
							</view>
						</view>
						<block v-if="orderCreateData.is_invoice == 1">
							<view class="invoice-cell">
								<text class="tit">发票类型</text>
								<view class="option-grpup">
									<view class="option-item" :class="{ 'color-base-bg active': orderCreateData.invoice_type == item }" @click="changeInvoiceType(item)" v-for="(item, index) in orderPaymentData.shop_goods_list.invoice.invoice_type" :key="index">{{item == 1?'纸质':'电子'}}</view>
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">抬头类型</text>
								<view class="option-grpup">
									<view class="option-item" :class="{ 'color-base-bg active': orderCreateData.invoice_title_type == 1 }" @click="changeInvoiceTitleType(1)">
										个人
									</view>
									<view class="option-item" :class="{ 'color-base-bg active': orderCreateData.invoice_title_type == 2 }" @click="changeInvoiceTitleType(2)">
										企业
									</view>
								</view>
							</view>
							<!-- <view class="invoice-cell is-invoice" @click="changeIsTaxInvoice()">
								<text class="tit">需要增值税专用发票</text>
								<view class="box"></view>
								<switch color="#FF4544" class="balance-switch" :checked="orderCreateData.is_tax_invoice == 1" />
							</view> -->
							<view class="invoice-cell">
								<text class="tit">发票信息</text>
								<view class="invoice-form-group">
									<input type="text" placeholder="请填写抬头名称" v-model.trim="orderCreateData.invoice_title" />
									<input
										v-if="orderCreateData.invoice_title_type == 2"
										type="text"
										placeholder="请填写纳税人识别号"
										v-model.trim="orderCreateData.taxpayer_number"
									/>
									<input type="text" placeholder="请填写邮寄地址" v-model.trim="orderCreateData.invoice_full_address" v-if="orderCreateData.invoice_type == 1" />
									<input type="text" placeholder="请填写邮箱" v-model.trim="orderCreateData.invoice_email" v-if="orderCreateData.invoice_type == 2" />
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">发票内容</text>
								<view class="option-grpup">
									<view
										:key="index"
										v-for="(item, index) in orderPaymentData.shop_goods_list.invoice.invoice_content_array"
										:class="{ 'color-base-bg active': item == orderCreateData.invoice_content }"
										@click="changeInvoiceContent(item)"
										class="option-item content"
									>
										{{ item }}
									</view>
								</view>
							</view>
						</block>
						<view class="invoice-tops">发票内容将以根据税法调整，具体请以展示为准，发票内容显示详细商品名 称及价格信息</view>
					</view>
				</scroll-view>
				<view class="popup-footer" @click="saveInvoice" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn color-base-bg">确定</view></view>
			</view>
		</uni-popup>
		<!-- 优惠券弹窗 -->
		<uni-popup ref="couponPopup" type="bottom">
			<view class="coupon-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<view><text class="tit">优惠券</text></view>
					<view class="align-right"><text class="iconfont iconclose uni-bold" @click="closePopup('couponPopup')"></text></view>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view
						class="coupon-item"
						v-for="(couponItem, couponIndex) in orderPaymentData.shop_goods_list.coupon_list"
						:key="couponIndex"
						@click="selectCoupon(couponItem)"
					>
						<view class="iconfont" :class="orderPaymentData.coupon.coupon_id == couponItem.coupon_id ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'"></view>
						<view class="circular"></view>
						<view class="coupon-info">
							<view class="coupon-money" v-if="couponItem.type == 'reward'">
								<text class="ns-text-color">{{ parseFloat(couponItem.money) }}</text>
								<text class="unit ns-text-color">元</text>
							</view>
							<view class="coupon-money" v-if="couponItem.type == 'discount'">
								<text class="ns-text-color">{{ parseFloat(couponItem.discount) }}</text>
								<text class="unit ns-text-color">折</text>
							</view>
							<view class="info">
								<view>{{ couponItem.coupon_name }}</view>
								<view class="ns-text-color-gray ns-font-size-sm" v-if="couponItem.at_least > 0">
									满{{ couponItem.at_least }}可用
									<text class="ns-text-color-gray ns-font-size-sm" v-if="couponItem.type == 'discount' && couponItem.discount_limit > 0">
										(最多可抵{{ couponItem.discount_limit }})
									</text>
								</view>
								<view class="ns-text-color-gray ns-font-size-sm" v-else>任意金额可用</view>
								<view class="ns-text-color-gray ns-font-size-sm">有效期：{{ $util.timeStampTurnTime(couponItem.end_time) }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn ns-bg-color" @click="popupConfirm('couponPopup')">确定</view></view>
			</view>
		</uni-popup>

		<!-- 活动优惠弹窗 -->
		<uni-popup ref="sitePromotionPopup" type="bottom">
			<view class="promotion-popup popup">
				<view class="popup-header">
					<view><text class="tit">活动优惠</text></view>
					<view class="align-right"><text class="iconfont iconclose uni-bold" @click="closePopup('sitePromotionPopup')"></text></view>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="order-cell">
							<text class="tit"><text class="promotion-mark ns-gradient-promotionpages-topics-payment" :data-theme="themeStyle">一口价</text></text>
							<view class="box align-right">
								<text class="ns-text-color">{{ orderPaymentData.bale_info.price }}</text>元任选{{ orderPaymentData.bale_info.num }}件
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn ns-bg-color" @click="closePopup('sitePromotionPopup')">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 门店列表弹窗 -->
		<uni-popup ref="deliveryPopup" type="bottom">
			<view class="delivery-popup popup">
				<view class="popup-header">
					<view><text class="tit">已为您甄选出附近所有相关门店</text></view>
					<view class="align-right"><text class="iconfont iconclose uni-bold" @click="closePopup('deliveryPopup')"></text></view>
				</view>
				<view class="popup-body store-popup" :class="{ 'safe-area': isIphoneX }">
					<view class="delivery-cell delivery-cont">
						<view class="pickup-point" v-for="(item, index) in storeInfo.storeList" :key="index" @click="selectPickupPoint(item)">
							<view class="delivery-detail">
								<view class="name" :class="item.store_id == orderPaymentData.delivery.store_id ? 'ns-text-color' : ''">
									<text>{{ item.store_name }}</text>
									<text v-if="item.distance">({{ item.distance }}km)</text>
								</view>
								<view class="info">
									<view :class="item.store_id == orderPaymentData.delivery.store_id ? 'ns-text-color' : ''" class="ns-font-size-sm">营业时间：{{ item.open_date }}</view>
									<view :class="item.store_id == orderPaymentData.delivery.store_id ? 'ns-text-color' : ''" class="ns-font-size-sm">地址：{{ item.full_address }}{{ item.address }}</view>
								</view>
							</view>
							<view class="icon" v-if="item.store_id == orderPaymentData.delivery.store_id"><text class="iconfont iconyuan_checked ns-text-color"></text></view>
						</view>
						<view v-if="!storeInfo.storeList">所选择收货地址附近没有可以自提的门店</view>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 支付密码弹窗 -->
		<uni-popup ref="payPassword" :custom="true">
			<view class="pay-password">
				<block v-if="orderPaymentData.member_account.is_pay_password == 0">
					<view class="title">为了您的账户安全,请先设置您的支付密码</view>
					<view class="tips">可到"个人中心","个人资料","支付密码"中设置</view>
					<view class="btn ns-bg-color ns-border-color" @click="setPayPassword">立即设置</view>
					<view class="btn white ns-text-color ns-border-color" @click="noSet">暂不设置</view>
				</block>
				<block v-else>
					<view class="title">请输入支付密码</view>
					<view class="password-wrap">
						<myp-one :maxlength="6" :is-pwd="true" @input="input" ref="input" :auto-focus="isFocus" type="box"></myp-one>
						<view class="align-right"><text class="ns-text-color ns-font-size-sm forget-password" @click="setPayPassword">忘记密码</text></view>
					</view>
				</block>
			</view>
		</uni-popup>
		<loading-cover ref="loadingCover"></loading-cover>
		
		<ns-payment
			ref="choosePaymentPopup"
			:isBalance="orderCreateData.is_balance"
			@useBalance="useBalance"
			:isPayPassWord="orderPaymentData.member_account.is_pay_password"
			:balanceDeduct="orderPaymentData.order_money > 0 && orderPaymentData.member_account.balance_total > 0 ? balanceDeduct : '0'"
			:payMoney="orderPaymentData.pay_money"
			@confirm="orderCreate"
		></ns-payment>
		
		<ns-show-toast></ns-show-toast>
		
		<!-- 门店自提、同城配送时间选择 -->
		<TimePopup @selectTime='selectTime' ref="TimePopup"></TimePopup>
		
	</view>
</template>

<script>
import payment from '../public/js/payment.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import mypOne from '@/components/myp-one/myp-one.vue';
import globalConfig from '@/common/js/golbalConfig.js';
import nsShowToast from '@/components/ns-show-toast/ns-show-toast.vue';
import nsSwitch from '@/components/ns-switch/ns-switch.vue';
import nsPayment from '@/components/payment/payment.vue';
import TimePopup from '@/components/ns-selectTime/ns-selectTime.vue';

export default {
	components: {
		uniPopup,
		nsShowToast,
		mypOne,
		nsSwitch,
		nsPayment,
		TimePopup
	},
	data() {
		return {};
	},
	onLoad() {},
	mixins: [payment, globalConfig]
};
</script>

<style lang="scss">
@import './../../../common/css/order_parment.scss';
</style>
<style scoped>
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none;
	max-height: unset !important;
	overflow-y: hidden !important;
}
>>> .uni-popup__wrapper {
	border-radius: 20rpx 20rpx 0 0;
}
>>> .uni-popup {
	z-index: 8;
}
</style>
