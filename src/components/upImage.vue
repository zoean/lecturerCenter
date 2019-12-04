<template>
	<div class="img-text-wrap">
		<div class="video-title-box">
			<p class="m-img-text-title" style="margin-top: 12px;"><span>*</span> 标题</p>
			<div class="m-text-box">
				<input type="text" class="title-input" v-model="videoTitle" @blur="removeSensitive('videoTitle')">
				<p class="charact-limit"><span class="current">{{currentTitleLen}}</span><span class="maximal">/{{inputLimit}}</span></p>
			</div>
		</div>
		<div class="video-synopsis-box">
			<p class="m-img-text-title"><span>*</span> 简介</p>
			<div class="m-textarea-box">
				<textarea class="synopsis-textarea" v-model="videoRemark" placeholder="视频简介，能帮助用户快速了解内容，增加用户观看概率！字数限制100字" @blur="removeSensitive('videoRemark')"></textarea>
				<p class="charact-limit"><span class="current">{{currentSynopsisLen}}</span><span class="maximal">/{{textareaLimit}}</span></p>
			</div>
		</div>
	    <div class="img-select-big-box">
	    	<p class="m-img-text-title"><span>*</span> 封面</p>
	    	<div class="select-img-warp">
	    		<div class="up-img-box">
	    			<p class="subcontent-title" :class="{active: 1==imgRegionPlace}">
	    				<span></span>
	    				上传自定义封面
	    			</p>
	    			<div class="user-select-img-box">
	    				<a class="select-img-btn" @click="toggleShow();selectImg(1,1,'')">选择文件</a>
							<my-upload field="img"
						        @crop-success="cropSuccess"
						        @crop-upload-success="cropUploadSuccess"
						        @crop-upload-fail="cropUploadFail"
						        v-model="show"
								:width="560"
								:langExt="mLangExt"
								:noCircle="isNoCircle"
								:height="315"
								:maxSize="1024"
								url="/video/lecturerVideo/uploadFile.video"
								:params="params"
								:headers="headers"
								img-format="png">
							</my-upload>
					</div>
	    		</div>
	    		<!-- 上传后回显图片 -->
	    		<img :src="imgDataUrl" class="user-up-img-show" v-if="imgDataUrl!=''">
	    		<p class="up-img-tip">你可以上传JPG、JPEG、GIF、PNG或BMP文件,图片尺寸需大于400像素，文件大小在500kb以内，最大支持1MB以内</p>
	    		<p class="subcontent-title" :class="{active: 2==imgRegionPlace && !isDefImg}">
					<span></span>
					视频截图
				</p>
				<div class="zdy-select-img-box">
					<ul class="video-screenshot">
						<li v-for="(item,key) in videoCutImgList" :class="{active:'2_'+key == imgRegion && !isDefImg}" @click="selectImg(2,key,item)"><img :src="item" alt="">	
							<span class="select-icon"></span>
						</li>
					</ul>
				</div>
				<p class="subcontent-title" :class="{active: 3==imgRegionPlace}">
					<span></span>
					从封面库选择
				</p>
				<input type="hiddent" :value="videoId" style="display:none;">
				<GeminiScrollbar class="default-img-warp">
					<ul class="video-screenshot" style="padding: 15px 15px 0 15px;">
						<li v-for="(item,key) in defaultImgs" :class="{active:'3_'+key == imgRegion}" @click="selectImg(3,key,item.picUrl)"><img :src="item.picUrl" alt=""><span class="select-icon"></span></li>
					</ul>
				</GeminiScrollbar>
	    	</div>
	    </div>
	    <layer></layer>
    </div>
</template>

<script>

import defaultImg from "../images/defaultImg.png"
import myUpload from '@/plugin/vue-image-crop-upload/upload-2';
import {mapState} from 'vuex'
import api from '@/api/index'
import qs from 'qs'
import layer from '@/components/layer'
import util from '@/utils/util'
export default {
	data(){
		return {
			defaultImgs:[],
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
			},
			inputLimit: 30,
			textareaLimit: 100,
			isDefImg:true,
			videoCutImgList:[defaultImg,defaultImg,defaultImg,defaultImg,defaultImg],
			keyWords:[],
			upImgUrl:util.UP_IMG_URL
		}
	},
	components: {
		'my-upload': myUpload,
		layer
	},
	computed:{
		...mapState('video',{
			videoPic: state => state.videoPic,
			imgRegion : state => state.imgRegion,
			videoId: state =>state.videoId
		}),
		//在上传区域显示图片
		imgDataUrl(){
			if(this.imgRegion.split('_')[0] == 1){
				return this.videoPic;
			}
			return '';
		},
		/**
		 * 引用vuex数据做双向数据绑定
		 * @type {Object}
		 */
		videoTitle : {
		    get () {
		    	//console.log(this.$store.state.video.videoTitle+"aaa");
		      return this.$store.state.video.videoTitle
		    },
		    set (value) {
	      		this.$store.commit('video/updateVideoTitle', value)
		    }
	  	},
	  	videoRemark : {
		    get () {
		      return this.$store.state.video.videoRemark
		    },
		    set (value) {
		      this.$store.commit('video/updateVideoRemark', value)
		    }
	  	},
		/**
		 * 选中区域
		 * @DateTime 2018-08-01
		 * @return   {[type]}   返回选中区域
		 */
		imgRegionPlace(){
			if(this.imgRegion != ''){
				//切割图片坐标，返回选中区域
				return this.imgRegion.split('_')[0];
			}else{
				//返回0表示没有选中区域
				return 1;
			}
		},
		/**
		 * 计算文字限制
		 * @return {[type]} [description]
		 */
		currentTitleLen(){
			var len = this.$store.state.video.videoTitle.length;
			if(len > this.inputLimit){
				this.$store.dispatch('video/updateVideoTitle',this.$store.state.video.videoTitle.substring(0, this.inputLimit));
				return this.inputLimit;
			}else{
				return len;
			}
		},
		/**
		 * 计算文字限制
		 * @return {[type]} [description]
		 */
		currentSynopsisLen(){
			var len = this.$store.state.video.videoRemark.length;
			if(len > this.textareaLimit){
					this.$store.dispatch('video/updateVideoRemark',this.$store.state.video.videoRemark.substring(0, this.textareaLimit));
				return this.textareaLimit;
			}else{
				return len;
			}
		}
	},
	watch:{
		/**
		 * 视频ID如果有值就要去请求视频截图
		 * @param  {[type]} newVal 视频id
		 * @return {[type]}        [description]
		 */
		videoId(newVal){
			//无ID不请求
			if(newVal == ''){
				return
			}
			var count = 0;
			var timer = setInterval(()=>{
				if(count == 30){
					clearInterval(timer)
				}
				api.coverImgListFn(qs.stringify({
					videoId:newVal
				}))
				.then(response=>{
					if(response.status == 200){
		                var data = response.data;
		                if(data.state == 0){
		                	this.isDefImg = false;
		                	if(data.obj.snapshots != undefined && data.obj.snapshots.length>0){
		                		this.videoCutImgList = data.obj.snapshots;
		                		clearInterval(timer)
		                	}
		                }
		            }else{
		                console.log("请求失败");
		            }
				})
				.catch(err => {

				})
				count++;
			},1000);
		}
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
				console.log('-------- crop success --------');
				
			},
			/**
			 * upload success
			 *
			 * [param] jsonData   服务器返回数据，已进行json转码
			 * [param] field
			 */
			cropUploadSuccess(jsonData, field){
				console.log('-------- upload success --------');
				console.log(jsonData);
				if(jsonData.state == 0) {
					this.$store.commit('video/updateImgRegion','1_1');
					this.$store.commit('video/updateVideoPic',jsonData.content);
				}
				console.log('field: ' + field);
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
			/**
			 * 选择封面图
			 * @DateTime 2018-08-01
			 * @param    {[type]}   boxNumber 区域
			 * @param    {[type]}   index     在该区域位置
			 * @param    {[type]}   imgUrl    地址
			 */
			selectImg(boxNumber, index, imgUrl){
				if(this.isDefImg && boxNumber==2){
					return ;
				}
				this.$store.commit('video/updateImgRegion',boxNumber+'_'+index);
				this.$store.commit('video/updateVideoPic',imgUrl);
			},
			removeSensitive(arg){
				util.hasSensitiveWords.call(this,arg);
			},
	},
	mounted(){
		api.defImgListFn()
		.then(response=>{
			if(response.status == 200){
                var data = response.data;
                if(data.state == 0){
                    this.defaultImgs = data.content.list;
                }
            }else{
                console.log("请求失败");
            }
		})
		.catch(err => {

		})
		/**
		 * 请求获取关键字
		 */
		api.keyWordFn()
		.then(response => {
			if(response.status == 200){
                var data = response.data;
                if(data.state == 0){
                    this.keyWords = data.content.content.split('|');
                }
            }else{
                console.log("请求失败");
            }
		})
		.catch(err => {
			console.log(err)
		})
	}
}
</script>

<style lang="scss" type="text/css" scoped>
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
	height: 79px;
	margin-top: 18px;
	margin-left: 15px;
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
.img-select-big-box{
	display: flex;
	.select-img-warp{
		margin-left: 20px;
		.up-img-box{
			display: flex;
			align-items: center;
			@extend .clear;
			.select-img-btn{
				@extend .btn;
				background: none;
				border:1px solid #5ca5fc;
				color:#5ca5fc;
				margin-left: 25px;
				margin-right: 25px;
				display: block;
			}
		}
		.up-img-tip{
			margin: 15px 0 20px;
			@include basefont(14px, 16px, #a0a0a0, left);
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
			width: 142px;
			height: 82px;
			box-sizing: border-box;
			position: relative;
			margin-right:16px;
			margin-bottom:18px;
			&:nth-child(5n){
				margin-right:0;
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
				border: 1px solid #5ca5fc;
				.select-icon{
					display: block;
					position: absolute;
					right: 0;
					bottom: 0;
					@include basebox(28px, 26px, url('../images/select-img.png') no-repeat);
				}
			}
		}
	}
	.default-img-warp{
		@include basebox(822px, 216px, #fff, 1px solid #999999, 5px);
		box-sizing: border-box;
		margin-top: 20px;
	}
}
</style>
