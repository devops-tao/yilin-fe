import htmlParser from '@/common/js/html-parser';
import {
	Weixin
} from '@/common/js/wx-jssdk.js';

export default {
	data() {
		return {
			skuId: 0,

			// 商品详情
			goodsSkuDetail: {
				goods_id: 0,
				goods_service: [],
			},

			cartCount: 0, // 购物车商品数量
			whetherCollection: 0,

			// 媒体,图片,视频

			// 解决每个商品SKU图片数量不同时，无法切换到第一个，导致轮播图显示不出来
			swiperInterval: 1,
			swiperAutoplay: false,
			swiperCurrent: 1,
			switchMedia: 'img',

			couponList: [], //优惠券列表
			couponBtnSwitch: false, //获取优惠券防止重复提交

			token: "",
			isIphoneX: false, //判断手机是否是iphoneX以上

			poster: "-1", //海报
			posterMsg: "", //海报错误信息
			posterHeight: 0,

			//满减活动
			manjian: {
				type: 0,
				manjian_name: "",
				rule_json: null
			},
			//评价
			goodsEvaluate: [{
				member_headimg: '',
				member_name: '',
				content: '',
				images: [],
				create_time: 0,
				sku_name: ''
			}],
			//组合套餐
			bundling: [{
				bundling_goods: {
					bl_name: '',
					sku_image: ''
				}
			}],
			memberId: 0,
			contactData: {
				title: '',
				path: '',
				img: ''
			},

			detailTab: 0,
			service: null,
			//是否开启预览，0：不开启，1：开启
			preview: 0,
			// 是否可分享到好物圈
			goodsCircle: false,
			levelInfo: {},
			showFenxiao: 0,
			evaluateConfig: {
				evaluate_audit: 1,
				evaluate_show: 0,
				evaluate_status: 1
			},
			kefuConfig: {},
			membercard: null, // 会员卡信息
			isCommunity: false, //社群弹窗
			bundlingType : false,
			videoContext: ''
		}
	},
	computed: {
		showDiscount() {
			var flag = false;
			if (
				this.preview == 0 &&
				this.addonIsExit.discount &&
				this.goodsSkuDetail.promotion_type == 1 &&
				this.goodsSkuDetail.discountTimeMachine &&
				(!this.goodsSkuDetail.member_price ||
					(this.goodsSkuDetail.member_price > 0 && Number(this.goodsSkuDetail.member_price) > Number(this.goodsSkuDetail.discount_price))
				)
			) {
				flag = true;
			}
			return flag;
		},
		memberCardDiscount() {
			let discount = 0,
				showPrice = this.goodsSkuDetail.member_price > 0 && Number(this.goodsSkuDetail.member_price) < Number(this.goodsSkuDetail
					.discount_price) ? this.goodsSkuDetail.member_price : this.goodsSkuDetail.discount_price;
			if (this.membercard && this.membercard.member_price > 0 && (parseFloat(showPrice) > parseFloat(this.membercard.member_price))) {
				discount = parseFloat(showPrice) - parseFloat(this.membercard.member_price);
			}
			return discount.toFixed(2);
		}
	},
	onLoad(data) {
		this.skuId = data.sku_id || 0;
		this.preview = data.preview || 0;
		this.isIphoneX = this.$util.uniappIsIPhoneX()
		this.getService();
		
		if (data.source_member){
			uni.setStorageSync('source_member', data.source_member);
		}
		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('sku_id') != -1) this.skuId = item.split('-')[1];
					if (item.indexOf('m') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
					if (item.indexOf('is_test') != -1) uni.setStorageSync('is_test', 1);
				});
			}
		}
	},
	async onShow() {
		// 刷新多语言
		this.$langConfig.refresh();

		//登录后查询
		this.token = uni.getStorageSync('token');

		if (this.token != '' && this.preview == 0) {
			this.getCartCount();
			this.getMemberId();
		}

		this.getKekuConfig();
		//同步获取商品详情
		await this.getGoodsSkuDetail();

		// 开启预览，禁止任何操作和跳转
		if (this.preview == 0) {
			//修改商品信息
			this.modifyGoodsInfo();

			this.getCoupon();

			this.getManjian();

			// 评价设置
			this.getEvaluateConfig();
			
			this.videoContext = uni.createVideoContext('goodsVideo');

			//组合套餐
			this.getBundling();

			this.$store.dispatch('getAddonIsexit').then(data => {
				this.showFenxiao = data.fenxiao;
				this.showKefu = data.servicer;
				if (this.showFenxiao != 0) {
					this.getFenxiaoGoodsDetail()
				}
			});
		}
		//记录分享关系
		if(uni.getStorageSync('token') && uni.getStorageSync('source_member')){
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}
	},
	onHide() {
		this.couponBtnSwitch = false;
	},
	methods: {
		SetSkuid(val){
			this.skuId = val;
			this.getBundling();
		},
		//联系客服
		goConnect() {
			if (uni.getStorageSync('token')) {
				let typeId = this.goodsSkuDetail.goods_promotion[0]
				let data = {
					sku_id: this.goodsSkuDetail.sku_id
				}
				
				if (typeId) {
					// 砍价
					if (typeId.bargain_id) {
						data.type = 'bargain'
						data.type_id = typeId.bargain_id
					}
					// 限时折扣
					if (typeId.discount_id) {
						data.type = 'discount'
						data.type_id = typeId.discount_id
					}
				}
				
				// #ifdef MP
					this.$util.redirectTo('/otherpages/chat/room/room', data)
					return false;
				// #endif
				
				// #ifndef MP
					if (this.kefuConfig.system == 1) {
						this.$util.redirectTo('/otherpages/chat/room/room', data)
						return false;
					}
					if (this.kefuConfig.open == 1) {
						this.$util.redirectTo('/otherpages/webview/webview', {
							link: encodeURIComponent(this.kefuConfig.open_url)
						})
						return false;
					}
				// #endif
			} else {
				this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.goodsSkuDetail.sku_id);
				return;
			}
		},
		//请求佣金详情
		getFenxiaoGoodsDetail() {
			this.$api.sendRequest({
				url: '/fenxiao/api/goods/detail',
				data: {
					sku_id: this.skuId,
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.levelInfo = res.data
					}
				}
			});
		},
		// 获取商品详情
		async getGoodsSkuDetail(skuId) {
			this.skuId = skuId || this.skuId;
			let res = await this.$api.sendRequest({
				url: '/api/goodssku/detail',
				async: false,
				data: {
					sku_id: this.skuId,
				}
			});
			let data = res.data;
			if (data.goods_sku_detail != null) {
				if (data.goods_sku_detail.promotion_type == 'presale' && (data.goods_sku_detail.end_time - res.timestamp) > 0) {
					this.$util.redirectTo('/promotionpages/presale/detail/detail', {id: data.goods_sku_detail.presale_id, sku_id: this.skuId}, 'reLaunch');
					return;
				}
				this.goodsSkuDetail = data.goods_sku_detail;
				this.goodsSkuDetail.preview = this.preview;

				if (this.skuId == 0) this.skuId = this.goodsSkuDetail.sku_id;

				//媒体
				if (this.goodsSkuDetail.video_url) this.switchMedia = "video";

				if (this.goodsSkuDetail.sku_images) this.goodsSkuDetail.sku_images = this.goodsSkuDetail.sku_images.split(",");
				else this.goodsSkuDetail.sku_images = [];

				// 多规格时合并主图
				if (this.goodsSkuDetail.goods_spec_format && this.goodsSkuDetail.goods_image) {
					this.goodsSkuDetail.goods_image = this.goodsSkuDetail.goods_image.split(",");
					this.goodsSkuDetail.sku_images = this.goodsSkuDetail.sku_images.concat(this.goodsSkuDetail.goods_image);
				}

				this.goodsSkuDetail.unit = this.goodsSkuDetail.unit || "件";

				// 当前商品SKU规格
				if (this.goodsSkuDetail.sku_spec_format) this.goodsSkuDetail.sku_spec_format = JSON.parse(this.goodsSkuDetail.sku_spec_format);

				// 商品属性
				if (this.goodsSkuDetail.goods_attr_format) {
					let goods_attr_format = JSON.parse(this.goodsSkuDetail.goods_attr_format);
					this.goodsSkuDetail.goods_attr_format = this.$util.unique(goods_attr_format, "attr_id");
					for (var i = 0; i < this.goodsSkuDetail.goods_attr_format.length; i++) {
						for (var j = 0; j < goods_attr_format.length; j++) {
							if (this.goodsSkuDetail.goods_attr_format[i].attr_id == goods_attr_format[j].attr_id && this.goodsSkuDetail.goods_attr_format[
									i].attr_value_id != goods_attr_format[j].attr_value_id) {
								this.goodsSkuDetail.goods_attr_format[i].attr_value_name += "、" + goods_attr_format[j].attr_value_name;
							}
						}
					}
				}

				// 商品SKU格式
				if (this.goodsSkuDetail.goods_spec_format) this.goodsSkuDetail.goods_spec_format = JSON.parse(this.goodsSkuDetail.goods_spec_format);

				this.$langConfig.title(this.goodsSkuDetail.goods_name);

				// 商品详情
				if (this.goodsSkuDetail.goods_content) this.goodsSkuDetail.goods_content = htmlParser(this.goodsSkuDetail.goods_content);

				// 限时折扣
				if (this.goodsSkuDetail.promotion_type == 1 && this.addonIsExit.discount) {
					//检测倒计时
					if ((this.goodsSkuDetail.end_time - res.timestamp) > 0) {
						this.goodsSkuDetail.discountTimeMachine = this.$util.countDown(this.goodsSkuDetail.end_time - res.timestamp);
					} else {
						this.goodsSkuDetail.promotion_type = 0;
					}
				}
				if (this.goodsSkuDetail.promotion_type == 1 && this.goodsSkuDetail.discountTimeMachine) {
					if (this.goodsSkuDetail.member_price > 0 && Number(this.goodsSkuDetail.member_price) <= Number(this.goodsSkuDetail
							.discount_price)) {
						this.goodsSkuDetail.show_price = this.goodsSkuDetail.member_price;
					} else {
						this.goodsSkuDetail.show_price = this.goodsSkuDetail.discount_price;
					}
				} else {
					if (this.goodsSkuDetail.member_price > 0) {
						this.goodsSkuDetail.show_price = this.goodsSkuDetail.member_price;
					} else {
						this.goodsSkuDetail.show_price = this.goodsSkuDetail.price;
					}
				}

				this.contactData = {
					title: this.goodsSkuDetail.sku_name,
					path: '/pages/goods/detail/detail?sku_id=' + this.skuId,
					img: this.$util.img(this.goodsSkuDetail.sku_image, {
						size: 'big'
					})
				}

				if (this.token != '' && this.preview == 0) {
					this.getWhetherCollection();

					if (this.addonIsExit.supermember) {
						this.getMemberInfo();
					}
				}

				this.setWechatShare();

				if (this.$refs.goodsPromotion) this.$refs.goodsPromotion.refresh(this.goodsSkuDetail.goods_promotion);

				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();

				// #ifdef MP-WEIXIN
				this.goodsSyncToGoodsCircle();
				// #endif
			} else {
				this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
			}
		},
		/**
		 * 刷新商品详情数据
		 * @param {Object} goodsSkuDetail
		 */
		refreshGoodsSkuDetail(goodsSkuDetail) {
			Object.assign(this.goodsSkuDetail, goodsSkuDetail);
			this.goodsSkuDetail.unit = this.goodsSkuDetail.unit || "件";
			if (this.$refs.goodsPromotion) this.$refs.goodsPromotion.refresh(this.goodsSkuDetail.goods_promotion);

			// 解决轮播图数量不一致时，切换到第一个
			if (this.swiperCurrent > this.goodsSkuDetail.sku_images.length) {
				this.swiperAutoplay = true;
				this.swiperCurrent = 1;
				setTimeout(() => {
					this.swiperAutoplay = false;
				}, 40);
			}
		},
		refreshLevelInfo(data){
			this.$refs.refLeverInfo.levelInfo.commission_money = data.commission_money;
		},
		goHome() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
		},
		goCart() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			this.$util.redirectTo('/pages/goods/cart/cart', {}, 'reLaunch');
		},
		choiceSku() {
			this.$refs.goodsSku.show("buy_now", () => {
				this.getCartCount();
			});
		},
		// 加入购物车
		joinCart() {
			if (!uni.getStorageSync('token') && this.preview == 0) {
				this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.skuId);
				return;
			}
			if(this.goodsSkuDetail.is_virtual == 1){
				this.$refs.goodsSku.show("buy_now", () => {
					this.getCartCount();
				});
			}else{
				this.$refs.goodsSku.show("join_cart", () => {
					this.getCartCount();
				});
			}
		},
		// 立即购买
		buyNow() {
			if (!uni.getStorageSync('token') && this.preview == 0) {
				this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.skuId);
				return;
			}
			this.$refs.goodsSku.show("buy_now", () => {
				this.getCartCount();
			});
		},
		swiperChange(e) {
			this.swiperCurrent = e.detail.current + 1;
		},


		//-------------------------------------优惠券-------------------------------------

		getCoupon() {
			this.$api.sendRequest({
				url: "/coupon/api/coupon/goodsCoupon",
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					let data = res.data;
					if (data) {
						this.couponList = data;
					}
				}
			});
		},

		// 打开优惠券弹出层
		openCouponPopup() {
			this.$refs.couponPopup.open();
		},
		// 关闭优惠券弹出层
		closeCouponPopup() {
			this.$refs.couponPopup.close();
		},
		// 领取优惠券
		receiveCoupon(couponTypeId) {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			if (this.couponBtnSwitch) return;
			this.couponBtnSwitch = true;
			if (this.token) {
				this.$api.sendRequest({
					url: '/coupon/api/coupon/receive',
					data: {
						coupon_type_id: couponTypeId,
						get_type: 2 //获取方式:1订单2.直接领取3.活动领取
					},
					success: res => {
						var data = res.data;
						let msg = res.message;
						if (res.code == 0) {
							msg = '领取成功';
						}
						this.$util.showToast({
							title: msg,
						});
						this.couponBtnSwitch = false;
						// this.$refs.couponPopup.close();
						if (res.data.is_exist) {
							this.refreshCoupon(couponTypeId)
						}
					},
				});
			} else {
				this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.skuId);
				this.couponBtnSwitch = false;
			}
		},
		//更新优惠券信息
		refreshCoupon(couponTypeId) {
			for (let i in this.couponList) {
				var info = this.couponList[i]
				if (couponTypeId == info.coupon_type_id) {
					info.is_lingqu = 1
				}
			}
			this.$forceUpdate()
		},
		//-------------------------------------服务-------------------------------------

		openMerchantsServicePopup() {
			this.$refs.merchantsServicePopup.open();
		},
		closeMerchantsServicePopup() {
			this.$refs.merchantsServicePopup.close();
		},



		//-------------------------------------属性-------------------------------------

		openAttributePopup() {
			this.$refs.attributePopup.open();
		},
		closeAttributePopup() {
			this.$refs.attributePopup.close();
		},

		//-------------------------------------属性-------------------------------------



		//-------------------------------------评价-------------------------------------
		//商品评论列表
		getGoodsEvaluate() {
			this.$api.sendRequest({
				url: "/api/goodsevaluate/firstinfo",
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					let data = res.data;
					if (data) {
						this.goodsEvaluate = data;
						this.goodsEvaluate.forEach((item, index) => {
							if (this.goodsEvaluate[index].images) this.goodsEvaluate[index].images = this.goodsEvaluate[index].images.split(",");
							if (this.goodsEvaluate[index].is_anonymous == 1) this.goodsEvaluate[index].member_name = this.goodsEvaluate[index].member_name.replace(
								this.goodsEvaluate[index].member_name.substring(1, this.goodsEvaluate[index].member_name.length - 1), '***')
						})
						// if (this.goodsEvaluate.images) this.goodsEvaluate.images = this.goodsEvaluate.images.split(",");
						// if (this.goodsEvaluate.is_anonymous == 1) this.goodsEvaluate.member_name = this.goodsEvaluate.member_name.replace(
						// this.goodsEvaluate.member_name.substring(1, this.goodsEvaluate.member_name.length - 1), '***')
					}
				}
			});
		},

		// 预览评价图片
		previewEvaluate(index, img_index, field) {
			var paths = [];
			for (let i = 0; i < this.goodsEvaluate[index][field].length; i++) {
				paths.push(this.$util.img(this.goodsEvaluate[index][field][i]));
			}
			// console.log(paths,'123')
			uni.previewImage({
				current: img_index,
				urls: paths
			});
		},


		//-------------------------------------关注-------------------------------------

		//获取用户是否关注
		getWhetherCollection() {
			this.$api.sendRequest({
				url: "/api/goodscollect/iscollect",
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					this.whetherCollection = res.data;
				}
			});
		},

		editCollection() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转

			if (this.token) {

				//未关注添加关注
				if (this.whetherCollection == 0) {
					this.$api.sendRequest({
						url: "/api/goodscollect/add",
						data: {
							sku_id: this.skuId,
							goods_id: this.goodsSkuDetail.goods_id,
							sku_name: this.goodsSkuDetail.sku_name,
							sku_price: this.goodsSkuDetail.show_price,
							sku_image: this.goodsSkuDetail.sku_image
						},
						success: res => {
							var data = res.data;
							if (data > 0) {
								this.whetherCollection = 1;
							}
						}
					});
				} else {
					//已关注取消关注
					this.$api.sendRequest({
						url: "/api/goodscollect/delete",
						data: {
							goods_id: this.goodsSkuDetail.goods_id
						},
						success: res => {
							var data = res.data;
							if (data > 0) {
								this.whetherCollection = 0;
							}
						}
					});
				}
			} else {
				this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.skuId);
			}
		},
		//获取购物车数量
		getCartCount() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			this.$store.dispatch('getCartNumber').then((e) => {
				this.cartCount = e;
			})
		},
		//更新商品信息
		modifyGoodsInfo() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			//更新商品点击量
			this.$api.sendRequest({
				url: "/api/goods/modifyclicks",
				data: {
					sku_id: this.skuId
				},
				success: res => {}
			});

			//添加足迹
			this.$api.sendRequest({
				url: "/api/goodsbrowse/add",
				data: {
					goods_id: this.goodsSkuDetail.goods_id,
					sku_id: this.skuId
				},
				success: res => {}
			});
		},

		//-------------------------------------满减-------------------------------------

		//获取满减信息
		getManjian() {
			this.$api.sendRequest({
				url: "/manjian/api/manjian/info",
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					let data = res.data;
					if (data) {
						this.manjian = data;
						let limit = data.type == 0 ? '元' : '件';
						Object.keys(data.rule_json).forEach((key) => {
							var item = data.rule_json[key];
							if(item.coupon_data){
								for(var i=0;i<item.coupon_data.length;i++){
									item.coupon_data[i].coupon_num = item.coupon_num[i]
								}
							}
							item.limit = data.type == 0 ? parseFloat(item.limit).toFixed(2) : parseInt(item.limit);
							// 满减
							if (item.discount_money != undefined) {
								if (this.manjian.manjian == undefined) {
									this.manjian.manjian = '满' + item.limit + limit + '减' + item.discount_money + '元';
								} else {
									this.manjian.manjian += '；满' + item.limit + limit + '减' + item.discount_money + '元';
								}
							}
							// 满送
							if (item.point != undefined || item.coupon != undefined) {
								let text = '';
								if (item.point != undefined) {
									text = '送' + item.point + '积分';
								}
								if (item.coupon != undefined && item.coupon_data != undefined) {
									item.coupon_data.forEach((couponItem, couponIndex) => {
										if (couponItem.type == 'discount') {
											if (text == '') text = '送'+ item.coupon_num[couponIndex] +'张' + parseFloat(couponItem.discount) + '折优惠券';
											else text += '、送'+ item.coupon_num[couponIndex] +'张' + parseFloat(couponItem.discount) + '折优惠券';
										} else {
											if (text == '') text = '送'+ item.coupon_num[couponIndex] +'张' + parseFloat(couponItem.money) + '元优惠券';
											else text += '、送'+ item.coupon_num[couponIndex] +'张' + parseFloat(couponItem.money) + '元优惠券';
										}
									})
								}
								if (this.manjian.mansong == undefined) {
									this.manjian.mansong = '满' + item.limit + limit + text;
								} else {
									this.manjian.mansong += '；' + '满' + item.limit + limit + text;
								}
							}
							// 包邮
							if (item.free_shipping != undefined) {
								if (this.manjian.free_shipping == undefined) {
									this.manjian.free_shipping = '满' + item.limit + limit + '包邮';
								} else {
									this.manjian.free_shipping += '；满' + item.limit + limit + '包邮';
								}
							}
						})
					}
				}
			});
		},
		onCommunity(){
			this.isCommunity = true
		},
		onCloseCommunity(){
			this.isCommunity = false
		},
		openManjianPopup() {
			this.$refs.manjianPopup.open();
		},
		closeManjianPopup() {
			this.$refs.manjianPopup.close();
		},


		//-------------------------------------组合套餐-------------------------------------

		//获取当前商品关联的组合套餐
		getBundling() {
			this.$api.sendRequest({
				url: "/bundling/api/bundling/lists",
				data: {
					sku_id: this.skuId
				},
				success: res => {
					this.bundling = res.data;
					if (res.data && res.data.length) {
						
						for (var i = 0; i < this.bundling[0].bundling_goods.length; i++) {
							if (this.bundling[0].bundling_goods[i].sku_id == this.skuId) {
								this.bundlingType = true;
								break;
							}else{
								this.bundlingType = false;
							}
						}
						
						for (var i = 0; i < this.bundling.length; i++) {
							for (var j = 0; j < this.bundling[i].bundling_goods.length; j++) {
								if (this.bundling[i].bundling_goods[j].sku_id == this.skuId) {
									this.bundling[i].bundling_goods.splice(j, 1);
								}
							}
						}
					}
				}
			});
		},
		// 打开组合套餐弹出层
		openBundlingPopup() {
			this.$refs.bundlingPopup.open();
		},
		// 关闭组合套餐弹出层
		closeBundlingPopup() {
			this.$refs.bundlingPopup.close();
		},


		//-------------------------------------分享-------------------------------------
		// 打开分享弹出层
		openSharePopup() {
			this.$refs.sharePopup.open();
		},
		// 关闭分享弹出层
		closeSharePopup() {
			this.$refs.sharePopup.close();
		},
		//-------------------------------------海报-------------------------------------

		// 打开海报弹出层
		openPosterPopup() {
			this.getGoodsPoster();
			this.$refs.sharePopup.close();
			this.$refs.posterPopup.open();
			if (this.poster != '-1') {
				setTimeout(() => {
					let view = uni.createSelectorQuery().in(this).select(".poster-layer .image-wrap");
					view.fields({
						size: true,
					}, data => {
						let posterWhith = data.width;
						let ratio = parseFloat((740 / posterWhith).toFixed(2));
						if (this.token != '') {
							this.posterHeight = parseInt(1318 / ratio);
						} else {
							this.posterHeight = parseInt(1100 / ratio);
						}
					}).exec();
				}, 100);
			}
		},
		// 关闭海报弹出层
		closePosterPopup() {
			this.$refs.posterPopup.close();
		},
		//生成海报
		getGoodsPoster() {
			//活动海报信息
			let qrcode_param = {
				sku_id: this.skuId
			};
			if (this.memberId) qrcode_param.source_member = this.memberId;

			this.$api.sendRequest({
				url: "/api/goods/poster",
				data: {
					page: '/pages/goods/detail/detail',
					qrcode_param: JSON.stringify(qrcode_param)
				},
				success: res => {
					if (res.code == 0) {
						this.poster = res.data.path + "?time=" + new Date().getTime();
					} else {
						this.posterMsg = res.message;
					}
				}
			});
		},
		// 预览图片
		previewMedia(index) {
			var paths = [];
			for (let i = 0; i < this.goodsSkuDetail.sku_images.length; i++) {
				paths.push(this.$util.img(this.goodsSkuDetail.sku_images[i], {
					size: 'big'
				}));
			}
			uni.previewImage({
				current: index,
				urls: paths,
				// longPressActions: {
				// 	itemList: ['发送给朋友', '保存图片', '关注'],
				// 	success: function(data) {
				// 		console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				// 	},
				// 	fail: function(err) {
				// 		console.log(err.errMsg);
				// 	}
				// }
			});
		},
		imageError() {
			this.goodsSkuDetail.sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		swiperImageError(index) {
			this.goodsSkuDetail.sku_images[index] = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		bundlingImageError(index, goods_index) {
			this.bundling[index].bundling_goods[goods_index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		// #ifdef MP || APP-PLUS
		//小程序中保存海报
		saveGoodsPoster() {

			let url = this.$util.img(this.poster);
			// this.$util.showToast({
			// 	title: "saveGoodsPoster:"+ url
			// });
			uni.downloadFile({
				url: url,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								this.$util.showToast({
									title: "保存成功"
								});
							},
							fail: () => {
								this.$util.showToast({
									title: "保存失败，请稍后重试"
								});
							}
						});
					}
				},

				fail: (e) => {
					// this.$util.showToast({
					// 	title: "fail:" + JSON.stringify(e)
					// });
				}
			});
		},
		// #endif
		getMemberId() {
			this.$api.sendRequest({
				url: "/api/member/id",
				success: res => {
					if (res.code >= 0) {
						this.memberId = res.data;
						this.setWechatShare();
					}
				}
			});
		},
		getService() {
			this.$api.sendRequest({
				url: '/api/goods/aftersale',
				success: res => {
					if (res.code == 0 && res.data) {
						this.service = res.data;
					}
				}
			});
			
		},
		fenxiao() {
			this.$refs.fenxiaoPopup.show()
		},
		/**
		 * 设置微信公众号分享
		 */
		setWechatShare() {
			// 微信公众号分享
			// #ifdef H5
			if (this.$util.isWeiXin()) {
				this.$api.sendRequest({
					url: '/wechat/api/wechat/share',
					data: {
						url: window.location.href
					},
					success: res => {
						if (res.code == 0) {
							var wxJS = new Weixin();
							wxJS.init(res.data.jssdk_config);

							let shareConfig = res.data.share_config,
								url = this.$config.h5Domain + '/pages/goods/detail/detail?sku_id=' + this.skuId;
							if (this.memberId) url += '&source_member=' + this.memberId;

							wxJS.setShareData({
								title: this.goodsSkuDetail.sku_name,
								desc: shareConfig.goods_param_1 + '：' + this.$lang('common.currencySymbol') + this.goodsSkuDetail.discount_price +
									'\r\n' + shareConfig.goods_param_2 + '\r\n' + '收藏热度：★★★★★',
								link: url,
								imgUrl: this.$util.img(this.goodsSkuDetail.sku_image, {
									size: 'big'
								})
							})
						}
					}
				})
			}
			// #endif
		},
		// #ifdef MP-WEIXIN
		/**
		 *	将商品同步到微信圈子 
		 */
		goodsSyncToGoodsCircle() {
			this.$api.sendRequest({
				url: '/goodscircle/api/goods/sync',
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					if (res.code == 0) {
						this.goodsCircle = true;
					}
				}
			})
		},
		
		/**
		 * 将商品推荐到微信圈子
		 */
		openBusinessView() {
			if (wx.openBusinessView) {
				wx.openBusinessView({
					businessType: 'friendGoodsRecommend',
					extraData: {
						product: {
							item_code: this.goodsSkuDetail.goods_id,
							title: this.goodsSkuDetail.sku_name,
							image_list: this.goodsSkuDetail.sku_images.map((ele) => {
								return this.$util.img(ele);
							})
						}
					},
					success: function(res) {
						console.log('success', res);
					},
					fail: function(res) {
						console.log('fail', res);
					}
				})
			}
		},
		// #endif
		getEvaluateConfig() {
			this.$api.sendRequest({
				url: '/api/goodsevaluate/config',
				success: res => {
					if (res.code == 0) {
						var data = res.data;
						this.evaluateConfig = data;
						if (this.evaluateConfig.evaluate_show == 1) {
							//商品评论
							this.getGoodsEvaluate();
						}
					}
				}
			});
		},
		copyUrl() {
			let text = '【' + this.goodsSkuDetail.sku_name + '】发现好物，一起来看看吧。' + this.$config.h5Domain +
				'/pages/goods/detail/detail?sku_id=' + this.skuId;
			if (this.memberId) text += '&source_member=' + this.memberId;
			this.$util.copy(text, () => {
				this.closeSharePopup();
			});
		},
		/**
		 * 分享到微信朋友圈
		 */
		openFriendPopup(){
			console.log("分享朋友圈");
			
		},
		getKekuConfig() {
			this.$api.sendRequest({
				url: '/api/config/servicer',
				success: res => {
					if (res.code == 0) {
						this.kefuConfig = res.data;
						if (this.kefuConfig.system && !this.addonIsExit.servicer) this.kefuConfig.system = 0;
					}
				}
			});
		},
		toGoodsDetail(item) {
			this.$util.redirectTo('/pages/goods/detail/detail', {
				sku_id: item
			});
		},
		toComoDetail(id) {
			this.$util.redirectTo('/promotionpages/combo/detail/detail', {
				bl_id: id
			});
		},
		toEvaluateDetail(id) {
			this.$util.redirectTo('/otherpages/goods/evaluate/evaluate', {
				goods_id: id
			});
		},
		/**
		 * 获取会员信息
		 */
		getMemberInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0 && res.data && res.data.member_level_type == 0) this.getMemberCardInfo();
				}
			});
		},
		getMemberCardInfo() {
			this.$api.sendRequest({
				url: '/supermember/api/membercard/recommendcard',
				data: {
					sku_id: this.goodsSkuDetail.sku_id
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.membercard = res.data;
					}
				}
			});
		},
		showImg(e){
			//拿到图片的路径里面的内容放在我们数组中
			let contentimg=e.target.dataset.nodes;
			let arrImg=[];
			for(var i=0;i<contentimg.length;i++){
				var img = contentimg[i].children;
				if(Array.isArray(img)){
					for(var j=0;j<img.length;j++){
						if(img[j].attrs && img[j].name == "img"){
							if(img[j].attrs.src){
								arrImg.push(img[j].attrs.src)
							}
						}
					}
				}
			}
			//最后一步就是把我们的所有图片放在预览的api中就可以了
			uni.previewImage({
				current:arrImg,
				urls:arrImg,
			})
		},
		
		/**
		 * 检测到路径为分享 建立上下级关系
		 */
		onSourceMember(id){
			this.$api.sendRequest({
				url:'/api/Member/alterShareRelation',
				data:{
					 share_member:id,
				},
				success:res=>{
					if(res.code >=0 ){
						uni.removeStorage({
							key:'source_member',
							success:res=>{
								console.log('删除成功',res)
							}
						})
					}
				}
			})
		},
	}
}
