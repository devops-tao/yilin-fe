<template>
	<view>
		<view
			class="graphic-nav"
			:style="{
				background: value.backgroundColor,
				marginTop: value.marginTop * 2 + 'rpx',
				borderRadius: value.navRadius == 'fillet' ? '10rpx' : '0rpx'
			}"
		>
			<!-- <block v-if="value.scrollSetting == 'horizontal-scroll'">
				<scroll-view scroll-x="true" class="nav-scroll" enhanced="true" show-scrollbar="false">
					<view v-for="(item, index) in value.list" :key="index" class="text-item" @click="redirectTo(item.link)" :style="{marginLeft: index==0?0:value.padding*2 + 'rpx'}">
						<image v-if="item.imageUrl" :src="$util.img(item.imageUrl)" mode="widthFix"></image>
						<text class="font-size-tag" v-if="item.title" :style="{ color: value.textColor?value.textColor:'rgba(0,0,0,0)' }">{{ item.title }}</text>
					</view>
				</scroll-view>
			</block>
			<block v-else>
				<view class="nav-no-scroll">
					<view v-for="(item, index) in value.list" :key="index" class="text-item" @click="redirectTo(item.link)">
						<view class="text-item-img" v-if="value.selectedTemplate == 'imageNavigation' && item.imageUrl">
							<image v-if="Number(item.imgWidth) >= Number(item.imgHeight)" :src="$util.img(item.imageUrl)" style="width: 70rpx;" mode="widthFix"></image>
							<image v-else :src="$util.img(item.imageUrl)" :style="{width: Number(item.imgWidth)/Number(item.imgHeight)*70 + 'rpx'}" style="height: 70rpx;"></image>
						</view>
						
						<text class="font-size-sub" v-if="item.title" :style="{ color: value.textColor?value.textColor:'rgba(0,0,0,0)', marginTop: value.selectedTemplate == 'imageNavigation' ? '20rpx' : '' }">{{ item.title }}</text>
					</view>
				</view>
			</block> -->
			<block>
				<view class="nav-no-scroll">
					<view
						v-for="(item, index) in value.list"
						:key="index"
						class="text-item"
						:style="{ width: 'calc(100% / ' + value.showType + ')' }"
						@click="redirectTo(item.link)"
					>
						<view class="text-item-img" v-if="value.selectedTemplate == 'imageNavigation' && item.imageUrl">
							<!-- <image v-if="Number(item.imgWidth) >= Number(item.imgHeight)" :src="$util.img(item.imageUrl)" style="width: 70rpx; height: 70rpx;" mode="aspectFit"></image>
							<image
								v-else
								:src="$util.img(item.imageUrl)"
								:style="{ width: (Number(item.imgWidth) / Number(item.imgHeight)) * 70 + 'rpx' }"
								style="height: 70rpx;"
							></image> -->
							<image :src="$util.img(item.imageUrl)" style="width: 90rpx; height: 90rpx;" mode="aspectFit"></image>
						</view>

						<text
							class="font-size-sub"
							v-if="item.title"
							:style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)', marginTop: value.selectedTemplate == 'imageNavigation' ? '20rpx' : '' }"
						>
							{{ item.title }}
						</text>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
// 图文导航
export default {
	name: 'diy-graphic-nav',
	props: {
		value: {
			type: Object
		}
	},
	data() {
		return {
			pageWidth: ''
		};
	},
	created() {
		this.getWidth();
	},
	computed: {
		padding() {
			return this.value.padding == 0 ? 8 : this.value.padding;
		}
	},
	methods: {
		redirectTo(link) {
			this.$util.diyRedirectTo(link);
		},
		getWidth() {
			var self = this;
			//获取页面可用区域的宽度
			uni.getSystemInfo({
				success: res => {
					this.pageWidth = res.screenWidth;
				}
			});
		}
	}
};
</script>

<style>
.graphic-nav {
	overflow: hidden;
	padding: 22rpx 0;
}

.graphic-nav .nav-no-scroll {
	/* padding: 10rpx 0; */
	display: flex;
	flex-wrap: wrap;
	padding: 0 10rpx;
}

.graphic-nav .nav-no-scroll .text-item {
	/* display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-around;
		align-content: center;
		align-items: center;
		box-sizing: border-box; */
	text-align: center;
	line-height: 1;
	padding: 16rpx 10rpx;
	box-sizing: border-box;
}

.graphic-nav .nav-no-scroll .text-item .text-item-img {
	width: 90rpx;
	height: 90rpx;
	line-height: 90rpx;
	display: inline-block;
}

.graphic-nav .nav-no-scroll .text-item image {
	/* margin-bottom: 10rpx; */
	/* width: 100%; */
}

.graphic-nav .nav-no-scroll .text-item text {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.graphic-nav .nav-scroll {
	white-space: nowrap;
	width: 100%;
}

.graphic-nav .nav-scroll .text-item {
	display: inline-block;
	width: 20%;
	text-align: center;
}

.graphic-nav .nav-scroll .text-item image {
	width: 80%;
}

.graphic-nav .nav-scroll .text-item text {
	display: block;
}

/deep/.uni-scroll-view::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
}
</style>
