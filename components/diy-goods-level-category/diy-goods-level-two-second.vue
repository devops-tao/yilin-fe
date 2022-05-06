<template>
	<view class="category-level">
		<view class="category-level-box" v-if="cateList.length && isLoadingCate">
			<nsSearch></nsSearch>
			<view class="category-goods">
				<scroll-view scroll-y="true" class="oneScroll">
					<view
						class="oneScroll-item using-hidden"
						v-for="(item, index) in cateList"
						:key="index"
						:class="{ 'active color-base-text color-base-bg-before': item.category_id_1 == oneCategoryId }"
						@click="selectOneCategory(item.category_id_1, index, true)"
					>
						{{ item.short_name ? item.short_name : item.category_name }}
					</view>
				</scroll-view>
				<view class="twoScroll">
					<view class="category-cate-top"></view>
					<scroll-view scroll-y="true" :style="{ height: 'calc(100% - ' + height + ' )' }">
						<image
							class="cate-adv"
							v-if="categoryAdvImage"
							:src="$util.img(categoryAdvImage)"
							@error="categoryAdvImage = $util.img('/upload/uniapp/default_ad.png')"
							@click="diyRedirectTo(linkUrl)"
							mode="widthFix"
						></image>
						<view class="twoScroll-list" v-if="twoCateList.length">
							<view class="twoScroll-item" v-for="(item, index) in twoCateList" :key="index" @click="toListDetail(item.category_id_2)">
								<image v-if="item.image" class="twoScroll-item-image" :src="$util.img(item.image)" @error="cateImageError(index)" mode="aspectFit"></image>
								<image v-else class="twoScroll-item-image" :src="$util.getDefaultImage().default_goods_img" mode="aspectFit"></image>
								<text class="using-hidden twoScroll-item-text">{{ item.short_name ? item.short_name : item.category_name }}</text>
							</view>
						</view>
						<ns-empty v-else :isIndex="!1" :fixed="!1" text="暂无商品分类"></ns-empty>
					</scroll-view>
				</view>
			</view>
		</view>
		<ns-empty v-else :isIndex="!1" :fixed="!1"></ns-empty>
	</view>
</template>

<script>
import nsSearch from '@/components/ns-search/ns-search.vue';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			isLoadingCate: false,
			categoryAdvImage: '', //广告位
			cateList: [], //所有分类
			twoCateList: [], //二级分类
			height: 0,
			oneCategoryId: 0,
			TwoCategoryId: 0,
			linkUrl: ''
		};
	},
	components: {
		nsSearch
	},
	mixins: [globalConfig],
	props: {
		value: {
			type: Object
		}
	},
	created() {
		this.getCategoryList();
	},
	methods: {
		getCategoryList() {
			this.isLoadingCate = false;
			this.$api.sendRequest({
				url: '/api/goodscategory/tree',
				data: {
					level: this.value.level,
					template: this.value.template
				},
				success: res => {
					this.isLoadingCate = true;
					if (res.code != 0) {
						this.$util.showToast({
							title: res.message
						});
						return false;
					}
					if (res.code == 0 && res.data.length) {
						this.cateList = res.data;
						this.categoryAdvImage = this.cateList[0].image_adv;
						this.oneCategoryId = this.cateList[0].category_id_1;

						if(this.cateList[0].link_url){
							this.linkUrl = JSON.parse(this.cateList[0].link_url);
						}

						if (res.data[0].child_list) {
							this.twoCateList = res.data[0].child_list;
							if (res.data[0].child_list[0]) this.TwoCategoryId = res.data[0].child_list[0].category_id_2;
						}

						this.$nextTick(function() {
							const query = uni.createSelectorQuery().in(this);
							query
								.select('.category-cate-top')
								.boundingClientRect(data => {
									this.height = data.height + 'px';
								})
								.exec();
						});
					}

					this.$emit('netFinish', true);
				}
			});
		},
		toListDetail(id) {
			let url = '/pages/goods/list/list',
				data = {
					category_id: id
				};

			this.$util.redirectTo(url, data);
		},
		selectOneCategory(onecateId, index) {
			this.oneCategoryId = onecateId;
			this.categoryAdvImage = this.cateList[index].image_adv;

			this.linkUrl = "";
			if(this.cateList[index].link_url){
				this.linkUrl = JSON.parse(this.cateList[index].link_url);
			}

			this.twoCateList = this.cateList[index].child_list ? this.cateList[index].child_list : [];
			if (this.twoCateList.length) {
				this.TwoCategoryId = this.twoCateList[0].category_id_2;
				this.TwoCategoryIndex = 0;
			} else {
				this.TwoCategoryId = 0;
			}

			this.$nextTick(function() {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.category-cate-top')
					.boundingClientRect(data => {
						this.height = data.height + 'px';
					})
					.exec();
			});
		},
		cateImageError(index) {
			this.twoCateList[index].image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
</script>
<style lang="scss">
@import '@/components/diy-goods-level-category/diy-goods-level-category.scss';
.twoScroll-list {
	padding: 0 34rpx;
	overflow: hidden;
	.twoScroll-item {
		margin: 0 60rpx 40rpx 0;
		width: 114rpx;
		display: inline-block;
		text-align: center;
		line-height: 1;
		.twoScroll-item-image {
			width: 114rpx;
			height: 114rpx;
			margin-bottom: 20rpx;
		}
		.twoScroll-item-text {
			font-size: $font-size-sub;
			color: $color-title;
		}
		&:nth-child(3n + 3) {
			margin-right: 0;
		}
	}
}
</style>
