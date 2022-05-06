export default {
	data() {
		return {
			info: null,
			timeMachine: null,
			page: 1,
			goodsList: [],
			cart:{},
			totalPrice: 0.00,
			totalNum: 0,
			goodsSkuDetail:null,
			skuList: [],
			cartShow: false,
			isSub: false,
			token:null
		};
	},
	onLoad(data) {
		if (data.id) this.id = data.id;
		if (option.scene) {
			var sceneParams = decodeURIComponent(option.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('id') != -1) this.id = item.split('-')[1];
				});
			}
		}
		this.getBaleInfo();
		this.getMemberId();
	},
	onShow() {
		
		/* // 刷新多语言
		this.$langConfig.refresh();
		if (uni.getStorageSync('token')) {
			this.getBaleInfo();
			this.getMemberId();
		} else {
			this.$util.redirectTo('/otherpages/login/login/login', { back: '/promotionpages/bale/detail/detail?id=' + this.id });
		} */
	},
	methods: {
		/**
		 * 查询活动信息
		 */
		getBaleInfo(){
			this.$api.sendRequest({
				url: '/bale/api/bale/detail',
				data: {
					bale_id: this.id
				},
				success: res => {
					if (res.code == 0) {
						this.info = res.data;
						if(this.info){
							if (this.info.status == 1) {
								this.timeMachine = this.$util.countDown(this.info.end_time - res.timestamp);
							}else if(this.info.status == 2){
								this.$util.showToast({title: '该活动已关闭'});
								setTimeout(() => {
									this.$util.redirectTo('/pages/index/index/index');
								}, 1500);
							}
						} else {
							this.$util.showToast({title: '未找到活动'});
							setTimeout(() => {
								this.$util.redirectTo('/pages/index/index/index');
							}, 1500);
						}
						
					} else {
						this.$util.showToast({title: '未找到活动'});
						setTimeout(() => {
							this.$util.redirectTo('/pages/index/index/index');
						}, 1500);
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			})
		},
		/**
		 * 查询会员id
		 */
		getMemberId() {
			this.$api.sendRequest({
				url: '/api/member/id',
				success: res => {
					if (res.code >= 0) {
						this.memberId = res.data;
					}
				}
			});
		},
		/**
		 * 查询商品列表
		 * @param {Object} mescroll
		 */
		getGoodsList(mescroll) {
			this.$api.sendRequest({
				url: '/api/goodssku/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					goods_id_arr: this.info.goods_ids
				},
				success: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					let newArr = []
					let msg = res.message;
					if (res.code == 0 && res.data) {
						if(res.data.page_count == 0){
							this.emptyShow = true
						}
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						})
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
					this.goodsList = this.goodsList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					//联网失败的回调
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		imageError(index) {
			this.goodsList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		/**
		 * 单规格数量增加
		 * @param {Object} data
		 */
		singleSkuPlus(data){
			if (this.cart['goods_' + data.goods_id ] != undefined) {
				var num = this.cart['goods_' + data.goods_id ].num;
				if ((num + 1) > data.stock) {
					this.$util.showToast({title: '库存不足'});
					return;
				}
				this.cart['goods_' + data.goods_id ].num += 1;
				this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ].num += 1;
			} else {
				this.cart['goods_' + data.goods_id ] = {
					num: 1
				}
				this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ] = data;
				this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ].num = 1;
			}
			this.totalNum += 1;
			this.cart = Object.assign({}, this.cart)
		},
		/**
		 * 单规格数量减少
		 * @param {Object} data
		 */
		singleSkuReduce(data){
			if (this.cart['goods_' + data.goods_id ] != undefined) {
				var num = this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ].num;
				this.cart['goods_' + data.goods_id ].num -= 1;
				this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ].num -= 1;
				this.totalNum -= 1;
				if ((num - 1) == 0) {
					delete this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ];
					if (Object.keys(this.cart['goods_' + data.goods_id ]).length == 1) {
						delete this.cart['goods_' + data.goods_id ];
					}
				}
				this.cart = Object.assign({}, this.cart)
			}
		},
		/**
		 * 多规格选择
		 */
		manySkuSelect(data){
			this.$api.sendRequest({
				url: '/api/goodssku/detail',
				data: {
					sku_id: data.sku_id
				},
				success: res => {
					if (res.code == 0 && res.data.goods_sku_detail != null) {
						
						this.goodsSkuDetail = res.data.goods_sku_detail;
						this.goodsSkuDetail.bale_id = this.id;
						if (this.goodsSkuDetail.sku_spec_format) this.goodsSkuDetail.sku_spec_format = JSON.parse(this.goodsSkuDetail.sku_spec_format);
						if (this.goodsSkuDetail.goods_spec_format) this.goodsSkuDetail.goods_spec_format = JSON.parse(this.goodsSkuDetail.goods_spec_format);
						this.goodsSkuDetail.sku_images = this.goodsSkuDetail.sku_images.split(",");
						this.goodsSkuDetail.unit = this.goodsSkuDetail.unit || "件";
						this.goodsSkuDetail.show_price = this.goodsSkuDetail.price;
						this.goodsSkuDetail.activity_sku_ids = this.info.sku_ids.split(',');
						
						setTimeout(() => {
							this.$refs.goodsSku.show("bale", () => {
							});
						}, 100)
					} 
				}
			})
		},
		refreshGoodsSkuDetail(goodsSkuDetail) {
			Object.assign(this.goodsSkuDetail, goodsSkuDetail);
		},
		joinCart(data){	
			if (this.cart['goods_' + data.goods_id ] != undefined) {
				if (this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ] != undefined) {
					this.cart['goods_' + data.goods_id ].num += (data.num - this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ].num);
					this.totalNum += (data.num - this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ].num);
					this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ].num = data.num;
				} else {
					this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ] = data.detail;
					this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ].num = data.num;
					this.cart['goods_' + data.goods_id ].num += data.num;
					this.totalNum += data.num;
				}
			} else {
				this.cart['goods_' + data.goods_id ] = {
					num: data.num
				}
				this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ] = data.detail;
				this.cart['goods_' + data.goods_id ]['sku_' + data.sku_id ].num = data.num;
				this.totalNum += data.num;
			}
			this.cart = Object.assign({}, this.cart)
			this.$refs.goodsSku.hide();
		},
		openCartPopup(){
			if(!this.skuList.length) return;
			this.cartShow = !this.cartShow;
		},
		closeCartPopup(){
			this.cartShow = false;
		},
		clearCart(){
			this.cart = {};
			this.totalNum = 0;
			this.closeCartPopup();
		},
		submit(){
			if (!uni.getStorageSync('token')) {
				setTimeout(() => {
					this.$refs.login.open('/promotionpages/bale/detail/detail?id=' + this.id);
				});
			}else{
				if (this.isSub) return;
				this.isSub = true;
				let sku = [];
				this.skuList.forEach((item) => {
					sku.push({sku_id: item.sku_id, num: item.num})
				})
				uni.setStorage({
					key: 'baleOrderCreateData',
					data: {
						bale_id: this.id,
						sku_list_json: JSON.stringify(sku)
					},
					success: () => {
						this.isSub = false;
						this.$util.redirectTo('/promotionpages/bale/payment/payment');
					}
				});
			}
		}
	},
	filters: {
		/**
		 * 金额格式化输出
		 * @param {Object} money
		 */
		moneyFormat(money) {
			return parseFloat(money).toFixed(2);
		},
		/**
		 * 输出规格
		 * @param {Object} money
		 */
		sku(data){
			let sku = '';
			if (data) {
				sku = data.sku_name.replace(data.goods_name, '');
			}
			return sku;
		}
	},
	watch:{
		cart: {
			deep:true,
			handler: function(newV, oldV) {
				let sku_list = [],
					start = 1;
				for(let key in this.cart){
					let goods = this.cart[key];
					
					for(let skuKey in goods){
						if (skuKey.indexOf('num') == -1) {
							let item = goods[skuKey];
								item.start = start;
								item.end = start + item.num;
							sku_list.push(goods[skuKey]);
							
							start += item.num;
						}
					}
				}
				this.skuList = sku_list;
			}
		},
		totalNum: function(newV){
			if (newV > 0) {
				if (newV % this.info.num == 0) {
					this.totalPrice = this.info.price * (newV / this.info.num); 
				} else {
					let multiple = Math.floor(newV / this.info.num),
						money = parseFloat(multiple * this.info.price),
						num = multiple * this.info.num;
					
					for (let i = 0; i < newV % this.info.num;i ++) {
						num += 1;
						for (let j = 0; j < this.skuList.length; j++) {
							let item = this.skuList[j];
							if (num >= item.start && num < item.end){
								money += parseFloat(item.price);
								break;
							}
						}
					}
					this.totalPrice = money;
				}
			} else {
				this.totalPrice = 0;
			}
		}
	},
	/**
	 * 自定义分享内容
	 */
	onShareAppMessage() {
		var path = '/promotionpages/bargain/launch/launch?id=' + this.id;
		if (this.memberId) path += '&source_member=' + this.memberId;
		return {
			title: '嘿！朋友就差你这一刀了，帮一下忙呗~',
			imageUrl: this.$util.img(this.info.sku_image, { size: 'big' }),
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
}
