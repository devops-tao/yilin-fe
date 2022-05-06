<template>
	<view :style="{marginTop: value.marginTop + 'px'}">
		<view class="">
			<scroll-view scroll-x="true" :scroll-into-view="'a' + cateIndex">
				<view
					v-for="(item, index) in value.list"
					class="scroll-item"
					:class="{'active': index == cateIndex}"
					:id="'a' + index"
					:key="index"
					@click="changeCateIndex(item, index)"
				>
					<view class="item-wrap">
						<view class="split-line" v-if="index > 0"></view>
						<view class="cate">
							<view class="name" :style="{color: index == cateIndex ? value.nsSelectColor : ''}">{{ item.title }}</view>
							<view class="desc" :style="{background: index == cateIndex && item.desc ? value.selectColor : ''}">{{ item.desc }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- <diy-goods-list v-if="goodsValue" :value="goodsValue"></diy-goods-list> -->
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import diyGoodsList from '@/components/diy-goods-list/diy-goods-list.vue';

	export default {
		name: 'diy-many-goods-list',
		components: {
			diyGoodsList
		},
		props: {
			value: {
				type: Object,
				default: () => {
					return {};
				}
			},
			diyData: {},
			position: {
				type: Number,
				default: -1
			}
		},
		data() {
			return {
				cartList: [],

				cateIndex: 0, // 当前选中的分类id
				categoryId: -1, // 当前分类id，来源为'category'时
				goodsIdArr: [], // 当前分类下的商品id集合，来源为'diy'时
				
				goodsValue: {}, // 商品列表数据
				isGroupChange: 0, // 切换菜分类改变
			};
		},
		mixins: [globalConfig],
		created() {
			if (this.value.list[0].sources == 'category') {
				this.categoryId = this.value.list[0].categoryId;
				this.goodsIdArr = [];
			} else {
				this.goodsIdArr = this.value.list[0].goodsId;
				this.categoryId = -1;
			}
			
			// this.diyData.value.forEach((v, k) => {
				// if (k == (this.position + 1) && v.controller == "GoodsList") {
				// 	this.goodsValue = v;
				// }
				// if (this.value.title == v.groupTitle && v.controller == "GoodsList") {
					// this.goodsValue = v;
				// }
			// })
			
			// this.goodsValue.sources = this.value.list[0].sources;
			// this.goodsValue.categoryId = this.value.list[0].categoryId;
			// this.goodsValue.categoryName = this.value.list[0].categoryName;
			// this.goodsValue.goodsId = this.value.list[0].goodsId;
		},
		methods: {
			// 分类
			changeCateIndex(item, index) {
				this.cateIndex = index;
				this.isGroupChange = this.isGroupChange == 0 ? 1 : 0;
				this.$store.commit('setIsGoodsGroupChange', this.cateIndex);
				this.$store.commit('setGroupTitle', this.value.title);
				if (item.sources == 'category') {
					this.categoryId = item.categoryId;
					this.goodsIdArr = [];
					// this.goodsValue.sources = 'category';
					// this.goodsValue.categoryId = this.categoryId;
					// this.goodsValue.goodsId = this.goodsIdArr;
				} else {
					this.goodsIdArr = item.goodsId;
					this.categoryId = -1;
					// this.goodsValue.sources = 'diy';
					// this.goodsValue.categoryId = this.categoryId;
					// this.goodsValue.goodsId = this.goodsIdArr;
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.scroll-cate {
		margin: 0 -30rpx;
	}
	
	scroll-view {
		width: 100%;
		white-space: nowrap;
		box-sizing: border-box;
		padding: 40rpx 0;
		
		.scroll-item {
			display: inline-block;
			text-align: center;
			vertical-align: top;
			
			.item-wrap {
				display: flex;
				align-items: center;
			}
			
			.split-line {
				display: inline-block;
				width: 1rpx;
				height: 30rpx;
				background-color: #E5E5E5;
				margin: 0 35rpx;
			}
			
			&.active {
				.name {
					font-weight: bold;
				}
				
				.desc {
					color: #FFFFFF;
					border-radius: 20rpx;
				}
			}
			
			.name {
				font-size: 32rpx;
				color: $color-title;
				line-height: 1;
			}
			
			.desc {
				font-size: $font-size-tag;
				color: $color-tip;
				height: 36rpx;
				line-height: 36rpx;
				margin-top: 10rpx;
				min-width: 120rpx;
			}
		}
	}
</style>
