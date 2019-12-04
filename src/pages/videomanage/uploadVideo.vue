<template>
	<div>
		<p class="go-back-btn" @click="$router.go(-1);">上传视频</p>
		<div class="fill-content">
			<div class="video-classify-show-box" v-if="this.$route.query.model ==0 || this.$route.query.uploadType!=2">
				<p class="m-img-text-title" style="margin-top: 12px;"><span>*</span> 专辑</p>
				<div class="select-warp2">
					<div style="margin-top:8px;" v-if="!showSelete"><span>暂无专辑</span><router-link to="/uploadAlbum" class="creat_btn">新建专辑</router-link></div>
                    <select v-model="albumId" @change="albumIdChange($event)"  v-if="showSelete">
                        <option v-for="item in albumList" :value="item.albumId">{{item.albumName}}</option>
                    </select>
                </div>
			</div>
			<div class="video-classify-show-box" v-if="this.$route.query.model == 1 || this.$route.query.model == 2">
				<p class="m-img-text-title" style="margin-top: 12px;"><span>*</span> 专辑</p>
				<div class="select-warp2">
                    <span  style="display:inline-block; padding-top:10px;">{{this.$route.query.albumName}}</span>
                </div>
			</div>
			<aliyun-up-video></aliyun-up-video>
      <div class="video-classify-show-box">
				<p class="m-img-text-title" style="margin-top: 12px;"><span>*</span> 专辑内排序</p>
				<div class="select-warp2">
          <input type="number" name="" class="sort" v-model="sort" @input="selectSort($event)" onkeyup="value=parseInt(value.replace(/^[0][\*]*/g,''))">
          <span class="sort-tips">数字越大排序越靠前</span>
          <p class="zhu">当前专辑内共有<span style="padding:0 5px;" v-model="videoNum">{{videoNum}}</span>条内容(包含已上架，已下架，待审核的内容)</p>
        </div>
			</div>
			<select-img></select-img>			 
			<div class="btn-list">
				<p class="up-cancel" @click="cancelFn">取消</p>
				<p class="up-submit" :class="{yes: isYes}" @click="getSelectImgData">提交审核</p>
			</div>
		</div>
		
		<div class="emphasize-content-box">
	    	<p class="title">注意事项： </p>
	    	<p class="content">1、上传的视频文件，大小在5G以内。</p>
	    	<p class="content">2、请勿上传违法违规视频；一经发现，将交由公安机关依法处理。</p>
	    </div>
	    <layer></layer>
	</div>
</template>

<script>
	import api from '@/api/index'
    import qs from 'qs'
    import layer from '@/components/layer'
	import selectImg from '@/components/upImage'
	import {mapState} from 'vuex'
	import aliyunUpVideo from '@/components/aliyunUpVideo'
	import util from '@/utils/util'
	import {UPLOAD_MODIFY_FILE} from '@/utils/constant'
	export default {
		data(){
			return {
				//albumId:'',
				albumList: [],
				tipData: null,
				isSave: true,
				isOk:true,
				keyWords:[],
				quanxian:false,
				videoNum:''
			}
		},
		computed:{
			...mapState('video', {
			    albumId: state => state.albumId,
			    videoName:state => state.videoName,
				videoTitle:state => state.videoTitle,
				videoRemark:state => state.videoRemark,
				videoPic:state => state.videoPic,
				videoId: state => state.videoId,
				sort:state => state.sort
		  	}),
		  	showSelete(){
		  		if(this.albumList.length == 0){
		  			return false
		  		}else{
		  			return true
		  		}	
		  	},
		  	isYes(){
		  		console.log("sort--"+this.sort+"albumId--"+this.albumId+"videoName--"+this.videoName+"videoTitle--"+this.videoTitle+"videoPic--"+this.videoPic+"videoId--"+this.videoId+"videoRemark--"+this.videoRemark);
		  		if(this.albumId != '' && this.videoName != '' && this.videoTitle != '' && this.videoPic != '' && this.videoId != '' && this.videoRemark != '' && this.sort != ''){
		  			return true;
		  		}else{
		  			return false;
		  		}
		  	}
		},
		methods:{
			selectSort(event){
        this.$store.dispatch('video/updateVideoSort',event.target.value)
			},
			albumIdChange(event){
				this.$store.dispatch('video/updateAlbumId',event.target.value)
				this.videoNumFn(event.target.value);
			},
			selectTypeId(typeId){
				if(this.typeId == typeId){
					this.$store.dispatch('video/updateTypeId','')
				}else{
					this.$store.dispatch('video/updateTypeId',typeId)
				}
			},
			cancelFn(){
				this.isSave = false;
				this.$router.go(-1);
			},
			getSelectImgData(data){
				this.isOk = false;
				if(this.isYes){
					if(util.hasSensitiveWords.call(this,'videoTitle')){
	            		return ;
	            	}
	            	if(util.hasSensitiveWords.call(this,'videoRemark')){
	            		return ;
	            	}
					this.$store.commit('layer/updateTipData',{
	                    showbox:'pattern-1',
	                    con:'提交后不能修改，确定要提交吗？'
	                })
	                this.$store.dispatch('layer/show');
	                this.$store.commit('layer/setSuccessCall',this.callbackFn)
				}
			},
			/**
			 *	弹出框关闭执行的回调
			 * @return {[type]} [description]
			 */
			callbackFn(){
            	this.isSave = false; 
            	if(this.isOk){
            		return ;
            	}
            	var uploadType = this.$route.query.uploadType;
				if(uploadType == UPLOAD_MODIFY_FILE){
					api.rePublishUpVideoFn(qs.stringify({//重新上传视频接口
						albumId:this.albumId,
						videoName:this.videoName,
						videoTitle:this.videoTitle,
						videoRemark:this.videoRemark,
						aliyunVideoId:this.videoId,
						videoPic:this.videoPic,
						vid: this.$route.query.vid,
						status:1,
						videoSource:1,
						uploadChannel: 1,
						sort:this.$store.state.video.sort
					}))
					.then(response => {
						this.isOk = true;
					 	if(response.status == 200){
	                        var data = response.data;
	                        if(data.state == 0){
	                        	var storage=window.localStorage;
								storage.removeItem('uploadMsg');
								
	                           this.$router.go(-1);
	                        }else{
	                            console.log(data.msg);
	                        }
	                    }else{
	                        console.log("请求失败");
	                    }
					})
					.catch(err => {
						this.isOk = true;
					})
				}else{
					api.publishUpVideoFn(qs.stringify({
						albumId:this.albumId,
						videoName:this.videoName,
						videoTitle:this.videoTitle,
						videoRemark:this.videoRemark,
						aliyunVideoId:this.videoId,
						videoPic:this.videoPic,
						status:1,
						videoSource:1,
						uploadChannel: 1,
						sort:this.sort
					}))
					.then(response => {
						this.isOk = true;
					 	if(response.status == 200){
	                        var data = response.data;
	                        if(data.state == 0){
	                        	var storage=window.localStorage;
								storage.removeItem('uploadMsg');
	                            this.$router.go(-1);
	                        }else{
	                            console.log(data.msg);
	                        }
	                    }else{
	                        console.log("请求失败");
	                    }
					})
					.catch(err => {
						this.isOk = true;
					})
				}
			},
			videoNumFn(id){//获取专辑内视频数量
				api.videoNumFn({
                    albumId:id//传参
                })
                .then(response=>{
                    if(response.status == 200){
                        var data = response.data;
                        //console.log(data);
                        if(data.state == 0){
                          this.videoNum = data.content
                          var uploadType = this.$route.query.uploadType;
                          var status = this.$route.query.status;
                          //本次操作为编辑并且视频不是未通过审核状态
                          if(uploadType !== undefined && uploadType == 2 && status != 3){//编辑视频排序为当前视频设置的排序，通过url参数拿
                            this.$store.commit('video/updateVideoSort',this.$router.query.sort);
                          }else{//上传视频排序默认为专辑内视频长度加1
                            this.$store.commit('video/updateVideoSort',data.content + 1);
                          }
                        }
                    }else{
                        console.log("请求失败");
                    }
                })
			},
			getLecturerAuthFn(){//是否拥有创建付费专辑权限
				api.getLecturerAuthFn().then(res=>{
					if(res.status ==200){
						var data = res.data
						if(data.state == 0){
							if(data.content.auth == 1){
								console.log("有权限");
								this.getVideoTypeList();//所有专辑
							}else{
								console.log("无权限");
								this.getmianAlbumList();//免费专辑
							}
						}
					}
				})
			},
			getmianAlbumList(){//获取免费专辑列表
				api.zhuanyiFn()
	            .then(response=>{
	                if(response.status == 200){
                      var data = response.data;
	                    if(data.state == 0){
	                        this.albumList = data.content; 
							//回显专辑名称
	                        if(this.$route.query.uploadType == 2){
								//this.albumId = this.$route.query.albumId
								this.$store.dispatch('video/updateAlbumId',this.$route.query.albumId)
							}else{
								//this.albumId = this.albumList[0].albumId
								this.$store.dispatch('video/updateAlbumId',this.albumList[0].albumId)	
							}
							this.videoNumFn(this.albumId);
	                    }else{
	                        this.$store.commit('layer/updateTipData',{
	                            showbox:'pattern-2',
	                            con:[{msg:data.message}]
	                        })
	                        this.$store.dispatch('layer/show');
	                    }
	                }else{
	                    console.log("请求失败");
	                }
	            })
			},
			getVideoTypeList(){
			/**
             * 获取所有专辑列表
             */
            	api.datealbumListFn()
                .then(response=>{
                    if(response.status == 200){
                        var data = response.data;
                        if(data.state == 0){
							this.albumList = data.content;
							//回显专辑名称
							if(this.$route.query.uploadType == 2){
								//this.albumId = this.$route.query.albumId
								this.$store.dispatch('video/updateAlbumId',this.$route.query.albumId)	
							}else{
								//this.albumId = this.albumList[0].albumId	
								this.$store.dispatch('video/updateAlbumId',this.albumList[0].albumId)	
							}
							this.videoNumFn(this.albumId);
							if(this.albumList.length <= 0){
								this.$store.commit('layer/updateTipData',{
									showbox:'pattern-1',
									con:'你还没有创建过专辑，请创建专辑后再上传视频！'
								})
								this.$store.commit('layer/setSuccessCall',function(){
									this.$router.push({name:'uploadAlbum'})
								}.bind(this));
								this.$store.commit('layer/setCancelCall',function(){
									this.$router.go(-1)
								}.bind(this));
								this.$store.dispatch('layer/show');
							}
                        }else{
                            console.log(data.message);
                        }
                    }else{
                        console.log("请求失败");
                    }
                })
                .catch(err => {

                })
			},
			saveData(){
				if(this.isSave){
					var storage=window.localStorage;
					var uploadMsg = qs.stringify(storage.getItem('uploadMsg'));
					if(uploadMsg == "") uploadMsg={};
					var obj ={
						albumId: this.albumId,
						imgRegion: this.$store.state.video.imgRegion,
						videoTitle:this.videoTitle,
						videoRemark:this.videoRemark,
						videoPic:this.videoPic,
						videoId: this.videoId == '' ? '' : this.videoId,
						videoName: this.videoId == '' ? '' : this.videoName,
						sort:this.sort == '' ? '' : this.sort
					}
					uploadMsg[this.$route.query.vid] = obj;
					storage.setItem('uploadMsg',qs.stringify(uploadMsg))
				}
				this.$store.commit('video/initVideoState');
				if (util.checkIE()) {
					window.removeEventListener('hashchange',this.saveData,false);
				}else{
					window.removeEventListener('popstate',this.saveData,false);
				}
			},
			initData(){
				var storage=window.localStorage;
				var uploadType = this.$route.query.uploadType;
				//修改后重新上传
				if(uploadType == 2){
					//this.getLecturerAuthFn();//判断权限
					this.$store.commit('video/updateAlbumId',this.$route.query.albumId);
					this.$store.commit('video/updateVideoTitle',this.$route.query.videoTitle);
					this.$store.commit('video/updateVideoRemark',this.$route.query.videoRemark);
					this.$store.commit('video/updateVideoId',this.$route.query.aliyunVideoId);
					this.$store.commit('video/updateVideoName',this.$route.query.videoName);
					this.$store.commit('video/updateVideoSort',this.$route.query.sort);
					this.$store.commit('video/updateVideoPic',this.$route.query.videoPic == undefined ? '' : this.$route.query.videoPic);
					//this.$store.commit('video/updateVideoSort',this.$route.query.sort == undefined ? '' : this.$route.query.sort);
					this.videoNumFn(this.$route.query.albumId);
					if(this.$route.query.videoPic != undefined){
						this.$store.commit('video/updateImgRegion','1_1');
					}
					if(this.$route.query.model == 0){
						this.getmianAlbumList();
					}else{
						this.getVideoTypeList();
					}
				}else{
					this.$store.commit('video/updateAlbumId','');
					this.$store.commit('video/updateImgRegion','');
					this.$store.commit('video/updateVideoTitle','');
					this.$store.commit('video/updateVideoRemark','');
					this.$store.commit('video/updateVideoPic','');
					this.$store.commit('video/updateVideoId','');
					this.$store.commit('video/updateVideoName','');
					this.$store.commit('video/updateVideoSort','');
					this.getVideoTypeList();
				}

			}
		},
		components:{
			layer,
			selectImg,
			aliyunUpVideo
		},
		beforeRouteEnter(to, from, next){
			next();
		},
		mounted(){
			if(this.$fun.getBrowserInfo() == 'IE11以下'){
				this.$store.commit('layer/updateTipData',{
					showbox:'pattern-2',
					con:[{msg:'你的浏览器版本较低，建议使用最新版本浏览器，上传体验更好, 建议使用IE10以上版本、chrome或火狐浏览器'}]
				})
				this.$store.dispatch('layer/show');
			}
			//this.getVideoTypeList();
			this.initData();
			if (util.checkIE()) {
				window.addEventListener('hashchange',this.saveData,false);
			}else{
				window.addEventListener('popstate',this.saveData,false);
			}
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

<style lang="scss" scoped type="text/css">
.creat_btn{
	width: 90px;
    height: 28px;
    display: inline-block;
    border:1px solid #4d9dfc;
    border-radius:5px;
    text-align: center;
    line-height: 28px;
    color: #4d9dfc;
    font-size: 16px;
    margin-left: 26px;
}
.sort-tips{
  color: red;
  padding-left: 5px;
  font-size: 12px;
}
.zhu{color:#bfc0c2; font-size:14px; margin-top:10px;}
.sort{
	position: relative;
	@include basebox(180px, 40px, #fff, 1px solid #999999, 5px);
    overflow: hidden;
	box-sizing: border-box;
	text-align:center;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button{
   -webkit-appearance: none !important;
   margin: 0;
}
.fill-content{
	padding-left: 20px;
}
.go-back-btn{
	@include basebox(100%, 62px);
	@include basefont(18px, 62px, #333);
	border-bottom: 1px solid #d2d2d2;
	text-indent: 35px;
	background: url('../../images/icon_03.png') no-repeat 17px center;
	background-size: 10px 16px;
	cursor: pointer;
}
.video-name-show-box{
	display: flex;
	margin-top: 30px;
	.video-name-show{
		margin-left: 20px;
		@include basefont(16px, 26px, #cc0000);
		background: url('../../images/icon_07.png') no-repeat left center;
		background-size: 32px 26px;
		text-indent: 40px;
		text-decoration: underline;
	}
}
.video-room-show-box{
	display: flex;
	margin-top: 17px;
	.video-room-show{
		margin-left: 20px;
		@include basefont(16px, 26px, #333);
	}
}
.video-classify-show-box{
	display: flex;
	flex-wrap:wrap;
	margin-top: 18px;
	.classify-list{
		display: flex;
		margin-left: 20px;
		.classify-item{
			@include basebox(100px, 40px, #fff, 1px solid #999999,5px);
			@include basefont(16px, 38px, #333);
			text-align: center;
			line-height: 40px;
			margin-right: 40px;
			margin-bottom: 10px;
			user-select: none;
			cursor: pointer;
			&.active{
				border: 1px solid #6ea6f6;
				background: #d7e7ff;
			}
		}
	}
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
.emphasize-content-box{
	padding-top: 23px;
	padding-left: 30px;
	padding-bottom: 20px;
	.title{
		@include basefont(16px, 28px, #cc0000, left);
	}
	.content{
		@include basefont(14px, 28px, #333, left);
	}
}
.select-warp2{
            float: left;
            margin-left:20px;
            @extend .clear;
            &.mar-left{
                margin-left: 42px;
                select{
                    width: 140px;
                }
            }
            .select-tip{
                float: left;
                @include basefont(16px, 28px, #333);
            }
            select{
                @include basebox(100px, 28px, #fff, 1px solid #d6d6d6);
                box-sizing: border-box;
            }
        }
</style>
