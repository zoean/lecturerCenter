<template>
   <ul class="header-title">
   	<router-link v-for="(item,index) in pathList" :to="item.path" active-class="active" class="header-item" tag="li"  :key="index">
   		{{item.title}}
   	</router-link>
   	<slot></slot>
   </ul>
</template>

<script>
export default {
	props:[
		"pathList"
	],
	methods:{
	}
}
</script>

<style lang="scss" type="text/css">
	.header-title{
		padding-left: 40px;
		border-bottom: 1px solid #d2d2d2;
		position: relative;
		@extend .clear;
		.header-item{
			user-select:none;
			float: left;
			@include basefont(16px, 62px, #333, center);
			padding: 0 10px;
			position: relative;
			cursor: pointer;
			margin-right: 55px;
			&:after{
				content: '';
				width: 100%;
				height: 1px;
				position: absolute;
				bottom:-1px;
				left:0;
				display: none;
			}
			&.active{
				color:#cc0000;
				&:after{
					display: block;
					background: #cc0000;
				}
			}
		}
	}
</style>
