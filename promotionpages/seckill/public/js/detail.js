import htmlParser from '@/common/js/html-parser';
import {
	Weixin
} from '@/common/js/wx-jssdk.js';

export default {
	data() {
		return {
			seckill_id: 0,
			skuId: 0,

			// 商品详情
			goodsSkuDetail: {
				goods_id: 0,
				goods_service: []
			},

			cartCount: 0, // 购物车商品数量
			whetherCollection: 0,

			// 媒体,图片,视频
			swiperCurrent: 1,
			switchMedia: 'img',

			//评价数量
			token: "",
			isIphoneX: false, //判断手机是否是iphoneX以上

			poster: "-1", //海报
			posterMsg: "", //海报错误信息
			posterHeight: 0,

			//评价
			goodsEvaluate: {
				member_headimg: '',
				member_name: '',
				content: '',
				images: [],
				create_time: 0,
				sku_name: ''
			},
			memberId: 0,
			contactData: {
				title: '',
				path: '',
				img: ''
			},

			// 解决每个商品SKU图片数量不同时，无法切换到第一个，导致轮播图显示不出来
			swiperInterval: 1,
			swiperAutoplay: false,
			swiperCurrent: 1,
			switchMedia: 'img',
			detailTab: 0,
			service: {},
			// 是否可分享到好物圈
			goodsCircle: false,
			evaluateConfig: {
				evaluate_audit: 1,
				evaluate_show: 0,
				evaluate_status: 1
			},
			kefuConfig: {},
			isCommunity: false, //社群弹窗
			videoContext: ''
		}
	},
	async onLoad(data) {
		this.seckill_id = data.seckill_id || 0;
		if(data.id){
			this.seckill_id = data.id;
		}
		this.isIphoneX = this.$util.uniappIsIPhoneX()
		if (data.source_member) uni.setStorageSync('source_member', data.source_member);
		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('id') != -1) this.seckill_id = item.split('-')[1];
					if (item.indexOf('m') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
				});
			}
		}
		this.getService();
		
		//同步获取商品详情
		await this.getGoodsSkuDetail();
		// 评价设置
		this.getEvaluateConfig();
	},
	onShow() {

		// 刷新多语言
		this.$langConfig.refresh();

		//登录后查询
		this.token = uni.getStorageSync('token');

		if (this.token != '') {
			this.getCartCount();
			this.getMemberId();
		}
		this.getKekuConfig();
		//修改商品信息
		this.modifyGoodsInfo();
		this.videoContext = uni.createVideoContext('goodsVideo');
		//记录分享关系
		if(uni.getStorageSync('token') && uni.getStorageSync('source_member')){
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}
	},
	methods: {
		//联系客服
		goConnect() {
			if (uni.getStorageSync('token')) {
				let data = {
					sku_id: this.goodsSkuDetail.sku_id,
					type: 'seckill',
					type_id: this.goodsSkuDetail.seckill_id
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
		// 获取秒杀商品详情
		async getGoodsSkuDetail() {
			let res = await this.$api.sendRequest({
				url: '/seckill/api/seckillgoods/detail',
				async: false,
				data: {
					seckill_id: this.seckill_id
				},
			});
			
			let data = res.data;
			if (data.goods_sku_detail != null) {
				this.goodsSkuDetail = data.goods_sku_detail;
				this.shopInfo = data.shop_info;
				this.skuId = this.goodsSkuDetail.sku_id;
			
				let time = new Date(res.timestamp * 1000);
				let currentTime = time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds();
				if (this.goodsSkuDetail.seckill_start_time <= currentTime && currentTime < this.goodsSkuDetail.seckill_end_time) {
					this.goodsSkuDetail.discountTimeMachine = this.$util.countDown(this.goodsSkuDetail.seckill_end_time - currentTime);
				} else if (this.goodsSkuDetail.seckill_start_time > currentTime && currentTime < this.goodsSkuDetail.seckill_end_time) {
					this.$util.showToast({
						title: "限时秒杀活动还未开始",
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/goods/detail/detail', {
							sku_id: this.goodsSkuDetail.sku_id
						}, 'redirectTo');
					}, 1000);
				} else if (currentTime < this.goodsSkuDetail.seckill_start_time && currentTime > this.goodsSkuDetail.seckill_end_time) {
					this.$util.showToast({
						title: "限时秒杀活动已结束",
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/goods/detail/detail', {
							sku_id: this.goodsSkuDetail.sku_id
						}, 'redirectTo');
					}, 1000);
				}
			
				this.goodsSkuDetail.show_price = this.goodsSkuDetail.seckill_price;
			
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
			
				this.goodsSkuDetail.save_price = (this.goodsSkuDetail.price - this.goodsSkuDetail.seckill_price) > 0 ? (this.goodsSkuDetail
					.price - this.goodsSkuDetail.seckill_price).toFixed(2) : 0;
			
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
			
				this.contactData = {
					title: this.goodsSkuDetail.sku_name,
					path: '/promotionpages/seckill/detail/detail?seckill_id=' + this.seckill_id,
					img: this.$util.img(this.goodsSkuDetail.sku_image, {
						size: 'big'
					})
				}
			
				this.setWechatShare();
			
				if (this.token != '') {
					this.getWhetherCollection();
				}
			
				// if (this.$refs.goodsPromotion) this.$refs.goodsPromotion.refresh(this.goodsSkuDetail.goods_promotion);
			
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
			// if (this.$refs.goodsPromotion) this.$refs.goodsPromotion.refresh(this.goodsSkuDetail.goods_promotion);

			// 解决轮播图数量不一致时，切换到第一个
			if (this.swiperCurrent > this.goodsSkuDetail.sku_images.length) {
				this.swiperAutoplay = true;
				this.swiperCurrent = 1;
				setTimeout(() => {
					this.swiperAutoplay = false;
				}, 40);
			}
		},
		goHome() {
			this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
		},
		goCart() {
			this.$util.redirectTo('/pages/goods/cart/cart', {}, 'reLaunch');
		},
		// 秒杀
		seckill() {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/promotionpages/seckill/detail/detail?seckill_id=' + this.seckill_id);
				return;
			}
			this.$refs.goodsSku.show("seckill", () => {
				this.getCartCount();
			});
		},
		swiperChange(e) {
			this.swiperCurrent = e.detail.current + 1;
		},
		//添加福利群
		onCommunity(){
			this.isCommunity = true
		},
		onCloseCommunity(){
			this.isCommunity = false
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
						});
						// if (this.goodsEvaluate.images) this.goodsEvaluate.images = this.goodsEvaluate.images.split(",");
						// if (this.goodsEvaluate.is_anonymous == 1) this.goodsEvaluate.member_name = this.goodsEvaluate.member_name.replace(
						// 	this.goodsEvaluate.member_name.substring(1, this.goodsEvaluate.member_name.length - 1), '***')
					}
				}
			});
		},

		// 预览评价图片
		previewEvaluate(index, field) {
			var paths = [];
			for (let i = 0; i < this.goodsEvaluate[field].length; i++) {
				paths.push(this.$util.img(this.goodsEvaluate[field][i]));
			}
			uni.previewImage({
				current: index,
				urls: paths,
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
				this.$refs.login.open('/promotionpages/seckill/detail/detail?seckill_id=' + this.seckill_id);
			}
		},
		//获取购物车数量
		getCartCount() {
			this.$store.dispatch('getCartNumber').then((e) => {
				this.cartCount = e;
			});
		},
		//更新商品信息
		modifyGoodsInfo() {
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
							this.posterHeight = parseInt(1240 / ratio);
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
				id: this.goodsSkuDetail.goods_id
			};
			if (this.memberId) qrcode_param.source_member = this.memberId;
			this.$api.sendRequest({
				url: "/seckill/api/seckillgoods/poster",
				data: {
					page: '/promotionpages/seckill/detail/detail',
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
				urls: paths
			});
		},
		swiperImageError(index) {
			this.goodsSkuDetail.sku_images[index] = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		// #ifdef MP
		//小程序中保存海报
		saveGoodsPoster() {
			let url = this.$util.img(this.poster);
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

		//售后保障查询
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
								url = this.$config.h5Domain + '/promotionpages/seckill/detail/detail?seckill_id=' + this.seckill_id;
							if (this.memberId) url += '&source_member=' + this.memberId;

							wxJS.setShareData({
								title: this.goodsSkuDetail.sku_name,
								desc: '秒杀价' + '：' + this.$lang('common.currencySymbol') + this.goodsSkuDetail.seckill_price + '\r\n' +
									shareConfig.goods_param_2 + '\r\n' + '收藏热度：★★★★★',
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
			let text = this.$config.h5Domain + '/promotionpages/seckill/detail/detail?seckill_id=' + this.seckill_id;
			if (this.memberId) text += '&source_member=' + this.memberId;
			this.$util.copy(text, () => {
				this.closeSharePopup();
			});
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
		toEvaluateList(e) {
			this.$util.redirectTo('/otherpages/goods/evaluate/evaluate', {
				goods_id: e
			});
		},
		showImg(e){
			//拿到图片的路径里面的内容放在我们数组中
			let contentimg=e.target.dataset.nodes;
			let arrImg=[];
			for(var i=0;i<contentimg.length;i++){
				var img = contentimg[i].children
				for(var j=0;j<img.length;j++){
					if(img[j].attrs){
						if(img[j].attrs.src){
							arrImg.push(img[j].attrs.src)
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
	}
}
