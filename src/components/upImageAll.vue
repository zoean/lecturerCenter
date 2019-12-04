<template>

	    	<div class="select-img-warp">
	    		<div class="up-img-box">
	    			<div class="user-select-img-box" style="float:left;">
	    				<a class="select-img-btn" @click="toggleShow()">选择文件</a>
							<my-upload field="img"
						        @crop-success="cropSuccess"
						        @crop-upload-success="cropUploadSuccess"
						        @crop-upload-fail="cropUploadFail"
						        v-model="show"
								:width="400"
								:langExt="mLangExt"
								:noCircle="isNoCircle"
								:height="400"
								url="/video/lecturerVideo/uploadFile.video"
								:params="params"
								:maxSize="size"
								:headers="headers"
								img-format="jpg"
								:img-before-filetype='imagesType'>
							</my-upload>
					</div>
					
	    		</div>
	    		<!-- 上传后回显图片 -->
	    		<img :src="imgUrl" class="user-up-img-show" v-if="imgUrl!=''">
	    		
	    	</div>

</template>

<script>

import defaultImg from "../images/defaultImg.png"
import myUpload from '@/plugin/vue-image-crop-upload/upload-2';
import api from '@/api/index'
import qs from 'qs'
import layer from '@/components/layer'
export default {
	props:{
			imgUrl:{
				type:String,
				default:''
			},
			size:{
				type:Number,
				default:1024
			},
			imagesType:{
				type:Array,
				default:[]
			}
		},
	data(){
		return {
			show: false,
			params: {
				token: '123456798',
				name: 'avatar'
			},
			headers: {
				smail: '*_~'
			},
			isNoCircle: true,
			mLangExt:{
					preview:'封面预览'
			}
			// imgUrl:''
		}
	},
	components: {
		'my-upload': myUpload,
		layer
	},
	methods:{
			
			toggleShow() {
				this.show = !this.show;
			},
            /**
			 * crop success
			 *
			 * [param] imgDataUrl
			 * [param] field
			 */
			cropSuccess(imgDataUrl, field){
				// console.log(imgDataUrl)
				// console.log(field)
			},
			/**
			 * upload success
			 *
			 * [param] jsonData   服务器返回数据，已进行json转码
			 * [param] field
			 */
			cropUploadSuccess(jsonData, field){
				console.log('-------- upload success --------');
				this.imgUrl = jsonData.content
				this.$emit('callbackImg',jsonData.content)
				if(jsonData.state == 0) {
					this.$store.commit('video/updateImgRegion','1_1');
					this.$store.commit('video/updateVideoPic',jsonData.content);
				}
			},
			/**
			 * upload fail
			 *
			 * [param] status    server api return error status, like 500
			 * [param] field
			 */
			cropUploadFail(status, field){
				console.log('-------- upload fail --------');
				console.log(status);
				console.log('field: ' + field);
			},
			callbackImg(url){
				console.log(url)
			}
	},
	mounted(){
		// if(this.dataObj.uploadType == 2){
		// 	this.imgUrl = this.imgUrl	
		// }
		console.log(this.imagesType)
	}
}
</script>

<style lang="scss" scoped type="text/css">
.tableText{
	font-size:12px;
	color:red;
	margin-left:120px
}
.btn-list{
	display: flex;
	margin-left: 46px;
	padding: 37px 218px;
	p{
		@include basebox(120px, 46px, #fff, 1px solid #4d9dfc,5px);
		box-sizing:border-box;
		@include basefont(16px, 44px, #4d9dfc, center);
		margin-right: 70px;
	}
	.up-cancel{
		cursor: pointer;
	}
	.up-submit{
		background:#999999;
		border-color:#999999;
		color:#fff;
		&.yes{
			background:#4d9dfc;
			border-color:#4d9dfc;
			cursor: pointer;
		}
	}
}
.vicp-step3{
	margin-top: 20px;
}
.img-select-big-box .vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area{
	margin-top: 20px;
}
.img-select-big-box .vue-image-crop-upload .vicp-wrap .vicp-close .vicp-icon4{
	width: 25px;
	height: 25px;
	background:url('../images/closelayer_03.png') no-repeat;
    transition: none;
	&:after{
		content: '';
		width: 0px;
		height: 0px;
	}
	&:before{
		content: '';
		width: 0px;
		height: 0px;
	}
}
.img-select-big-box .vue-image-crop-upload .vicp-wrap .vicp-close{
	right: 10px;
    top: 15px;
}
.img-select-big-box .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-right .vicp-preview .vicp-preview-item{
	margin-right: 42px;
}
.img-select-big-box .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range{
	margin: 20px 0 10px 0;
}
.img-select-big-box .vue-image-crop-upload .vicp-wrap{
    padding: 35px 30px 20px;
}
.img-select-big-box .vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-right .vicp-preview .vicp-preview-item{
	width: 150px;
}

.vue-image-crop-upload .vicp-wrap .vicp-operate a:hover{
	background:#4d9dfc !important;
	color:#fff !important;
}
.vue-image-crop-upload .vicp-wrap .vicp-operate a{
	background:#4d9dfc !important;
	color:#fff !important;
}
.user-up-img-show{
	width: 140px;
	height: 140px;
	margin-top: 18px;
}
.gm-scrollbar.-vertical{
    top: 13px;
    background:#eeeeee;
}
.gm-scrollbar {
    position: absolute;
    right: 10px;
    bottom: 13px;
    z-index: 1;
    border-radius: 3px;
}
.gm-scrollbar.-vertical .thumb{
	background:#4d9dfc;
}
.m-img-text-title{
    white-space: nowrap;
	@include basefont(16px, 18px, #333, center);
	text-indent: 10px;
	position: relative;
	margin-top:6px;
	span{
		color:#cc0000;
		position: absolute;
	    top: 2px;
		left: -10px;
	}
}
.charact-limit{
	position: absolute;
	right: 9px;
	bottom: 0px;
	span{
		@include basefont(16px, 38px, #999999, left);
	}
	.current{
		
	}
	.maximal{

	}
}
.m-textarea-box{
	margin-left: 20px;
	position: relative;
	@include basebox(540px, 212px, #fff, 1px solid #999999, 5px);
	padding: 0 4px;
    overflow: hidden;
	box-sizing: border-box;
	.synopsis-textarea{
		width: 532px;
		height: 100%;
		@include basefont(16px, 38px, #333, left);
		resize:none;
		overflow: auto;
	}
}
.m-text-box{
    margin-left: 20px;
	position: relative;
	@include basebox(540px, 40px, #fff, 1px solid #999999, 5px);
    overflow: hidden;
	box-sizing: border-box;
	.title-input{
		@include basebox(530px, 38px, #fff);
		padding: 0 4px;
		@include basefont(16px, 38px, #333, left);

	}
}
::-ms-clear,::-ms-reveal{display:none;}
.video-title-box,.video-synopsis-box{
	display: flex;
	margin-bottom: 25px;
}

	.select-img-warp{
		.up-img-box{
			display: flex;
			align-items: center;
			@extend .clear;
			.select-img-btn{
				@extend .btn;
				background: none;
				color:#5ca5fc;
				margin-right: 25px;
				display: block;
				border:1px solid #5ca5fc;
			}
		}
		.up-img-tip{
			margin: 15px 0 20px 0px;
			@include basefont(14px, 16px, #a0a0a0, left);
			float:left;
		}
		.zdy-select-img-box{
			margin-top: 16px;
			margin-bottom: 16px;
			padding-left:15px;
		}
	}
	.subcontent-title{
		display: flex;
		@include basefont(14px, 16px, #333, left);
	    text-indent: 6px;
    	text-align: right;
		&.active{
			span{
				border:1px solid #5ca5fc;
				&:after{
					background: #5ca5fc;
				}
			}
		}
		span{
			position: relative;
			width: 14px;
			height: 14px;
			border:1px solid #9c9c9c;
			border-radius: 50%;
			&:after{
				position: absolute;
				top:4px;
				left:4px;
				width: 4px;
				height: 4px;
				border-radius: 50%;
				content: ' ';

			}
		}
	}
	.video-screenshot{
		display: flex;
		flex-wrap: wrap;
		li{
			width: 98px;
			height: 38px;
			box-sizing: border-box;
			position: relative;
			margin-right:20px;
			margin-bottom:14px;
			border-radius: 3px;
			border:1px solid #999999;
			.selectBtn{
				width:98px;
				height:33px;
				background:none;
				text-align: center;
				line-height: 38px;
				border-radius: 3px;
				border:none;
			}
			img{
				display: block;
				width: 100%;
				height: 100%;
			}
			.select-icon{
				display: none;
			}
			&.active{
				border: 1px solid #6ea6f6;
				background:#d7e7ff;
				
			}
		}
	}
	.default-img-warp{
		@include basebox(822px, 216px, #fff, 1px solid #fff, 5px);
		box-sizing: border-box;
	}

</style>
