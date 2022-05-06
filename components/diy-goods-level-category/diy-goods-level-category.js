export default {
	data() {
		return {
			categoryAdvImage: '',
			isLoadingCate: false,
			join_cart: 'join_cart',
			goodsList: [], //商品列表
			isAll: false, //判断是否已经达到最大值
			isToken: false,
			page_size: 10,
			page_num: 1,
			isNetwork: 1, //是否可以继续请求
			isLoading: false,
			goodsSkuDetail: {},
			currentRoute: '',
			token: '',
			cartFlag: false //添加商品数量时，防止重复点击
		}
	},
	props: {
		value: {
			type: Object
		}
	},
	computed: {
		storeToken() {
			this.isAll = false;
			return this.$store.state.token;
		},
		addonIsExit() {
			return this.$store.state.addonIsExit
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.getGoodsList();
			}
		}
	},
	methods: {
		// 变更购物车数量
		cartNumChange(type, goods) {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/pages/goods/category/category');
				return;
			}

			let cartData = {
					num: 1,
					cart_id: goods.cart_id,
					sku_id: goods.sku_id
				},
				cartUrl = "", //类型 add--新增商品  edit--修改商品数量  delete--删除商品
				actionType,
				maxBuy = goods.max_buy,
				stock = maxBuy > 0 ? (maxBuy - goods.purchased_num) : goods.stock;
				console.log(goods,'goods')
				if(goods.is_limit == 1 && goods.limit_type == 1 && maxBuy > 0) {
					stock = maxBuy
					console.log('333')
				}
				console.log(stock,'0.0..00')
			var minBuy = 1;
			if (goods.min_buy > 1) minBuy = goods.min_buy;
			cartData.num = minBuy; // 最少购买量

			goods.unit = goods.unit || "件";

			if (type == 'add') {

				// 检测是否第一次加入购物车
				if (goods.cart_id) {
					actionType = "edit";
					cartUrl = '/api/cart/edit';
				} else {
					actionType = "add";
					cartUrl = '/api/cart/add';
				}
				if (stock == 0) {
					this.$util.showToast({
						title: '库存不足'
					});
					return;
				} else if (goods.cart_id && goods.num < stock) {
					cartData.num = ++goods.num;
				} else {
					if (goods.is_limit == 1 && goods.limit_type == 2 && maxBuy > 0 && goods.purchased_num > 0) {
						this.$util.showToast({
							title: '该商品每人限购' + maxBuy + goods.unit + '，您已购买了' + goods.purchased_num + goods.unit
						});
						return;
					}

					if (goods.is_limit == 1 && goods.limit_type == 2 && maxBuy > 0 && goods.num > 0 && goods.num + cartData.num > maxBuy) {
						var diff = maxBuy - goods.num;
						if (diff > 0) {
							this.$util.showToast({
								title: '该商品每人限购' +
									maxBuy +
									goods.unit +
									'，购物车已加入了' +
									goods.num +
									goods.unit +
									'，还能购买' +
									diff +
									goods.unit
							});
						} else {
							this.$util.showToast({
								title: '该商品每人限购' + maxBuy + goods.unit
							});
						}
						return;
					}
				}

			} else if (type == 'minus') {
				cartData.num = goods.num - 1 ? goods.num - 1 : 0;
				cartUrl = cartData.num > 0 ? '/api/cart/edit' : '/api/cart/delete';
				actionType = cartData.num > 0 ? 'edit' : 'delete';
			}

			if (this.cartFlag) return false;
			this.cartFlag = true;

			this.shopDataChange(cartData);

			this.$api.sendRequest({
				url: cartUrl,
				data: cartData,
				success: res => {
					if (res.code >= 0) {
						if (res.data > 0) {
							this.$store.dispatch('getCartNumber');
							if (actionType == "edit") {
								this.cartFlag = false;
								return false;
							}
							cartData.cart_id = actionType == "add" ? res.data : '';
							if (actionType == 'add') {
								this.$util.showToast({
									title: '加入购物车成功'
								});
							}
						} else {
							cartData.num = goods.num;
							this.$util.showToast({
								title: res.message
							});
						}
						this.shopDataChange(cartData);
					}

					this.cartFlag = false;
				}
			});

		},
		shopDataChange(data) {
			if (this.value.level != 3) {
				for (var i = 0; i < this.goodsList.length; i++) {

					var item = this.goodsList[i];
					if (data.sku_id == item.sku_id) {

						item.num = data.num;
						item.cart_id = data.cart_id;

					}
				}

			} else {
				var categoryList = this.cateList[this.oneIndex].child_list[this.twoIndex].child_list;
				for (var i = 0; i < categoryList.length; i++) {
					if (this.threeIndex.indexOf(i) != -1) {
						for (var k = 0; k < categoryList[i].goods_list.length; k++) {
							if (data.sku_id == categoryList[i].goods_list[k].sku_id) {
								categoryList[i].goods_list[k].num = data.num;
								categoryList[i].goods_list[k].cart_id = data.cart_id;
							}
						}
					}
				}
			}
			this.$forceUpdate();
		},
		// 获取商品详情
		async getGoodsSkuDetail(skuId) {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open(this.currentRoute);
				return;
			}

			let res = await this.$api.sendRequest({
				url: '/api/goodssku/getInfoForCategory',
				async: false,
				data: {
					sku_id: skuId,
				}
			});
			let data = res.data;
			if (data) {
				this.goodsSkuDetail = data;

				if (this.skuId == 0) this.skuId = this.goodsSkuDetail.sku_id;

				this.goodsSkuDetail.unit = this.goodsSkuDetail.unit || "件";

				this.goodsSkuDetail.show_price = this.goodsSkuDetail.discount_price;

				// 当前商品SKU规格
				if (this.goodsSkuDetail.sku_spec_format) this.goodsSkuDetail.sku_spec_format = JSON.parse(this.goodsSkuDetail.sku_spec_format);

				// 商品SKU格式
				if (this.goodsSkuDetail.goods_spec_format) this.goodsSkuDetail.goods_spec_format = JSON.parse(this.goodsSkuDetail.goods_spec_format);

				this.$refs.goodSkuNew.show("join_cart", this.goodsSkuDetail, () => {
					this.getCartCount();
				});
			} else {
				this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
			}
		},
		// 刷新商品sku详情数据
		refreshGoodsSkuDetail(goodsSkuDetail) {
			Object.assign(this.goodsSkuDetail, goodsSkuDetail);
		},
		//获取购物车数量
		getCartCount() {
			this.$store.dispatch('getCartNumber').then((e) => {
				this.cartCount = e;
			})
		},
		//跳转商品详情
		toDetail(skuId) {
			this.$util.redirectTo('/pages/goods/detail/detail', {
				sku_id: skuId
			})
		},
		goodsImageError(index, num) {
			this.goodsList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		diyRedirectTo(link) {
			if (link == null || link == '' || (!link.wap_url && !link.appid && !link.mobile)) return;
			if (link.wap_url.indexOf('http') != -1 || link.wap_url.indexOf('http') != -1) {
				// #ifdef MP-WEIXIN
				this.redirectTo('/otherpages/web/web?src=' + link.wap_url);
				// #endif
				// #ifdef H5
				location.href = link.wap_url;
				// #endif
			} else if (link.appid) {
				uni.navigateToMiniProgram({
					appId: link.appid,
					path: link.page
				})
			} else if (link.mobile) {
				uni.makePhoneCall({
					phoneNumber: link.mobile,
					fail: res => {
						console.log(res)
					}
				});
			} else {
				this.$util.redirectTo(link.wap_url);
			}
		},
	}
}
