<template>
	<div class="up-video-box" style="margin-top:20px;">
		<p class="m-img-text-title" style="margin-top: 3px;"><span>*</span> 视频</p>
		<div class="up-video-operation">
			<a :href="videoPlay+'?vid='+videoId"  target="_blank" class="video-name-show" v-if="fileName!=''">{{fileName}} <span v-show="!isProgress" class="up-cancel" @click.stop.prevent="cancelUpload"></span></a>
			<div class="progress-box" v-if="isProgress">
				<p class="progress">
					<span class="speed" :style="{width: loadedPercent}"></span>
				</p>
				<span class="cur-speed-num">{{loadedPercent}}</span>
				<span class="up-cancel" @click="cancelUpload"></span>
			</div>
			<div class="up-btn-box">
				<!-- <form action=""></form> -->
					<input type="file" name="file" id="file" @click="reupload" @change="addFile($event)" ref='upFile' class="inputfile" />
					<label for="file" v-show="isShowBtn && fileName == '' && videoId == ''">{{btnName}}</label>
			</div>
			<p class="err-text" v-show="errText != ''">
				{{errText}}
			</p>
			<layer-box></layer-box>
		</div>
		<p class="up-video-tip">支持格式：mp4、wmv、flv、mkv、mvb、3gp、ts、avi、mov、mpeh、mpg</p>
	</div>
</template>
<script>
	import api from '@/api/index'
    import qs from 'qs'
    import {mapState} from 'vuex'
   	import layerT from '@/components/layer'
   	import {AIDEO_PLAY} from '@/utils/constant'
	export default {
		data(){
			return {
				uploader:null,
				isProgress:false,
				loadedPercent:'0%',
				btnName:'上传视频',
				errText:'',
				isShowBtn: true,
				videoPlay: AIDEO_PLAY,
				tipData: ''
			}
		},
		computed:{
			...mapState('video', {
			    fileName: state => state.videoName,
			    videoId:state => state.videoId
		  	})
		},
		components:{
			layerBox:layerT
		},
		methods:{
			initData(){
				this.$store.commit('video/updateVideoName','');
            	this.$store.commit('video/updateVideoId','');
				this.isProgress = false;
				this.loadedPercent = '0%';
			},
			tipCancelCall(){
				this.uploader.startUpload();
			},
			/**
			 * 取消上传
			 * @return {[type]} [description]
			 */
			cancelUpload(){
                this.$store.commit('layer/updateTipData',{
                    showbox:'pattern-1',
                    con:'确定要删除视频吗？'
                });
                this.$store.commit('layer/setSuccessCall',function(){
                	this.isShowBtn = true;
                	this.cancelFile('上传视频');
                	this.$refs.upFile.value = '';
                }.bind(this));
                this.$store.commit('layer/setCancelCall',function(){
                	this.uploader.startUpload();
                }.bind(this));
                this.$store.dispatch('layer/show');
                this.uploader.stopUpload();
			},
			reupload(){
				if(this.btnName == '重新上传'){
					this.uploader.startUpload();
					return ;
				}
			},
			/**
			 * 添加文件
			 * @param {[object]} event 时间对象
			 */
			addFile(event){
				if(event.target.files.length > 0 && event.target.files[0].size > 5368709120){
					this.errText = '文件最大为5G'
					return ;
				}
				var file = event.target.files[0];
				var supportFormat = '.mp4、.wmv、.flv、.mkv、.mvb、.3gp、.ts、.avi、.mov、.mpeh、.mpg';
				var flag = false;
				var fileSuffix =  /\.[^\.]+$/.exec(file.name)[0].toLowerCase();
				flag = supportFormat.split('、').some(function(value,key,arry){
					return fileSuffix == value;
				})
				if(!flag){
					this.errText = '不支持这种文件格式，请上传视频文件'
					return ;
				}
				var userData = '{"Vod":{"UserData":{"IsShowWaterMark":"false","Priority":"7"}}}';
				this.uploader.addFile(event.target.files[0], null, null, null, userData);
				this.uploader.startUpload();
			},
			/**
			 * 取消文件上传
			 * @param {[string]} arg 按钮名称
			 * @return void
			 */
			cancelFile(arg){
				this.uploader.stopUpload();
				this.uploader.cleanList();
				// 删除上传列表内文件
				this.uploader.deleteFile(0);
				this.btnName=arg;
				this.initData();
			},
			/**
			 * 获取上传凭证
			 * @param  {[string]}   fileName 文件名称
			 * @param  {Function} fn       回调函数
			 * @return {[type]}            void
			 */
            getVoucher(fileName,fn){
                api.getVoucherFn(qs.stringify({
                    fileName:fileName,
                    title:"呱呱财经"
                }))
                .then(response => {
                    if(response.status == 200){
                        var data = response.data;
                        if(data.state == 0){
                            if(fn != undefined){
                                fn.call(data.obj);
                            }
                        }else{
                            console.log(data.msg);
                        }
                    }else{
                        console.log("请求失败");
                    }
                })
                .catch(err => {

                })
            },
            /**
             * 更新上传凭证
             * @param  {[type]}   vid 视频id
             * @param  {Function} fn  回调函数
             * @return {[type]}       [description]
             */
            refreshVoucher(vid,fn){
            	api.refreshUploadFn(qs.stringify({
                    videoId:vid,
                }))
                .then(response => {
                    if(response.status == 200){
                        var data = response.data;
                        if(data.state == 0){
                            if(fn != undefined){
                                fn.call(data.obj);
                            }
                        }else{
                            console.log(data.msg);
                        }
                    }else{
                        console.log("请求失败");
                    }
                })
                .catch(err => {

                })
            }
		},
		created(){
			var that = this;
			this.uploader = new AliyunUpload.Vod({
	            // 文件上传失败
	            'onUploadFailed': function (uploadInfo, code, message) {
	                console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message,message);
	                if(code == 'RequestError'){
	                	var errMes = message.match(/\((.+?)\)/g);
	                	if(RegExp.$1 == 'connected: false, keepalive socket: false'){
	                		that.isShowBtn = true;
	                		that.btnName = '重新上传';
	                		that.errText = '当前网络异常，上传已中断 请检查网络后重新上传';
	                	}
	                }
	            },
	            // 文件上传完成
	            'onUploadSucceed': function (uploadInfo) {
	                console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
					that.$store.commit('video/updateVideoId',uploadInfo.videoId);
	                that.isShowBtn = false;
	                that.isProgress = false;
	            },
	            // 文件上传进度 
	            'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
	                that.loadedPercent = (loadedPercent * 100.00).toFixed(2) + "%";
	            },
	            // STS临时账号会过期，过期时触发函数
	            'onUploadTokenExpired': function (uploadInfo) {
	                console.log("onUploadTokenExpired");
                 	that.refreshVoucher(uploadInfo.videoId,function(){
                    	that.uploader.resumeUploadWithAuth(this.auth);
                    })
	            },
	            onUploadCanceled:function(uploadInfo)
	            {
	                console.log("onUploadCanceled:file:" + uploadInfo.file.name);
	            },
	            // 开始上传
	            'onUploadstarted': function (uploadInfo) {
	            	that.isProgress = true;
	            	that.isShowBtn = false;
	            	that.$store.commit('video/updateVideoName',uploadInfo.file.name);
					that.errText = '';
					console.log( this.auth, this.uploadAddress,this.videoId)
					console.log(uploadInfo)
                    if(!uploadInfo.videoId)//这个文件没有上传异常
	                    {
                         	that.getVoucher(that.fileName,function(){
	                        	that.uploader.setUploadAuthAndAddress(uploadInfo, this.auth, this.uploadAddress,this.videoId);
	                        })
	                    }
	                    else//如果videoId有值，根据videoId刷新上传凭证
	                    {
	                        //获取上传凭证后，调用setUploadAuthAndAddress
	                        that.refreshVoucher(uploadInfo.videoId,function(){
	                        	that.uploader.setUploadAuthAndAddress(uploadInfo, this.auth, this.uploadAddress);
	                        })
	                    }
	                console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
	            },
	            'onUploadEnd':function(uploadInfo){
	            	that.isProgress = false;
	                //console.log("onUploadEnd: uploaded all the files",uploadInfo);
	            }
	        });
		}
	}
</script>
<style lang="scss" scoped type="text/css">
.up-video-box{
	display: flex;
	flex-wrap: wrap;
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
.up-video-operation{
	display: flex;
	align-items:center;
	align-content:center;
	.video-name-show{
		margin-left: 20px;
		@include basefont(16px, 26px, #cc0000);
		background: url('../images/icon_07.png') no-repeat left center;
		background-size: 32px 26px;
		text-indent: 40px;
	    text-decoration: underline;
        position: relative;
	    .up-cancel{
			@include basebox(20px, 20px, #999, none,50%);
			position: absolute;
			right: -30px;
    		top: 3px;
			cursor: pointer;
			&:after{
				content:' ';
				width: 2px;
				height: 10px;
				background:#fff;
				position: absolute;
			    top: 5px;
			    left: 9px;
			    transform: rotateZ(-48deg);
			}
			&:before{
				content:' ';
				width: 2px;
				height: 10px;
				background:#fff;
				position: absolute;
			    top: 5px;
			    left: 9px;
			    transform: rotateZ(48deg);
			}
		}
	}
	.up-btn-box{
		margin-left: 20px;
		.inputfile{
		 	width: 0.1px; 
		    height: 0.1px; 
		    opacity: 0; 
		    overflow: hidden; 
		    position: absolute; 
		    z-index: -1;
		 }
	 	.inputfile + label {
	    	display: block;
			@include basebox(120px, 40px, #4d9dfc, 1px solid #4d9dfc,3px);
			box-sizing:border-box;
			@include basefont(16px, 38px, #fff, center);
		 	cursor: pointer;
		}
		.inputfile:focus + label,
		.inputfile + label:hover {
		    background-color: #4d9dfc;
		}
	}
	.progress-box{
		display: flex;
		align-item: center;
		margin-left:25px;
		.progress{
			@include basebox(128px, 18px, #fff, 1px solid #4d9dfc,10px);
			overflow: hidden;
			box-sizing: border-box;
			font-size: 0;
			.speed{
				width: 2%;
				display: inline-block;
				height: 100%;
				background:#4d9dfc;
			    border-radius: 6px;
			    transition: width 1s linear;
			}
		}
		.cur-speed-num{
			@include basefont(16px, 18px, #4d9dfc, center);
			margin-left: 10px;
		}
		.up-cancel{
			@include basebox(20px, 20px, #999, none,50%);
			position: relative;
			margin-left: 15px;
			cursor: pointer;
			&:after{
				content:' ';
				width: 2px;
				height: 10px;
				background:#fff;
				position: absolute;
			    top: 5px;
			    left: 9px;
			    transform: rotateZ(-48deg);
			}
			&:before{
				content:' ';
				width: 2px;
				height: 10px;
				background:#fff;
				position: absolute;
			    top: 5px;
			    left: 9px;
			    transform: rotateZ(48deg);
			}
		}
	}
	.err-text{
		width: 250px;
		height: 40px;
		margin-left: 17px;
		@include basefont(14px, 16px, #cc0000, left);
		padding-top: 4px;
		display: flex;
    	align-content: center;
    	align-items: center;
	}
	
}
.up-video-tip{
	margin: 12px 0 22px 64px;
	width: 100%;
	@include basefont(14px, 16px, #999999, left);
}
</style>