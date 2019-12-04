<template>
	<div>
		<p class="go-back-btn" @click="$router.go(-1);">上传音频</p>
		<div class="fill-content">
			<div class="video-classify-show-box"  v-if="audioModel==1">
				<p class="m-img-text-title"><span>*</span> 专辑</p>
				<div class="select-warp2">
					<div style="margin-top:8px;" v-if="!showSelete"><span>暂无专辑</span><router-link to="/audioaddalbum" class="creat_btn">新建专辑</router-link></div>
                    <select v-model="albumId" @change="albumIdChange($event)" v-if="showSelete">
                        <option v-for="item in albumList" :value="item.id">{{item.title}}</option>
                    </select>
                </div> 
			</div>
			<div class="video-classify-show-box"  v-if="audioModel==2 || audioModel==3">
				<p class="m-img-text-title"><span>*</span> 专辑</p>
				<div class="select-warp2">
                    <span v-model="albumId">{{albumTitle}}</span>
                </div>
			</div>
			<aliyun-up-audio @getAliId="getAliId"></aliyun-up-audio>      
			<div class="video-classify-show-box">
				<p class="m-img-text-title" style="margin-top: 12px;"><span>*</span> 专辑内排序</p>
				<div class="select-warp2">
                    <input type="number" name="" class="sort" v-model="sort" onkeyup="value=parseInt(value.replace(/^[0][\*]*/g,''))"> 
                    <span class="sort-tips">数字越大排序越靠前</span>
                    <p class="zhu">当前专辑内共有<span style="padding:0 5px;" v-model="audioNum">{{audioNum}}</span>条内容(包含已上架，已下架，待审核的内容)</p>
                </div>   
			</div>
			<div class="video-title-box">
				<p class="m-img-text-title" style="margin-top: 12px;"><span>*</span> 标题</p>
				<div class="m-text-box">
					<input type="text" class="title-input" v-model="title" @blur="removeSensitive('title')">
					<p class="charact-limit"><span class="current">{{currentTitleLen}}</span><span class="maximal">/30</span></p>
				</div>
			</div>
			<div class="btn-list">
				<p class="up-cancel" @click="cancelFn">取消</p>
				<p class="up-submit" :class="{yes: isYes}" @click="getSelectImgData">提交审核</p>
			</div>
		</div>
		<div class="emphasize-content-box">
	    	<p class="title">注意事项： </p>
	    	<p class="content">1、上传的音频文件，大小在1G以内。</p>
	    	<p class="content">2、请勿上传违法违规音频；一经发现，将交由公安机关依法处理。</p>
	    </div>
	    <layer></layer>
	</div>
</template>

<script>
	import api from '@/api/index'
    import qs from 'qs'
    import layer from '@/components/layer'
	import {mapState} from 'vuex'
	import aliyunUpAudio from '@/components/aliyunUpAudio'
	import util from '@/utils/util'
	import {UPLOAD_MODIFY_FILE} from '@/utils/constant'
	export default {
		data(){
			return {
				albumList: [],
				tipData: null,
				isSave: true,
				isOk:true,
				keyWords:[],
				title:'',
				name:'',
				aliId:'',
				albumId:'',
				audioModel:'',
				albumTitle:'',
				sort:'',
				audioNum:''
			}
		},
		computed:{
			showSelete(){
        //当前视频是免费专辑且用户免费专辑个数为0，显示暂无专辑
		  		if(this.audioModel == 1 || this.albumList.length == 0){
		  			return true
		  		}else{
		  			return false
		  		}	
		  	},
		  	isYes(){
		  		if(this.sort != '' && this.albumId != '' && this.name != '' && this.title != '' && this.aliId != ''){
		  			return true;
		  		}else{
		  			return false;
		  		}
		  	},
		  	/**
		 * 计算文字限制
		 * @return {[type]} [description]
		 */
			currentTitleLen(){
				this.title = this.title.length>30?this.title.substring(0, 30):this.title
				return this.title.length
			}
		},
		methods:{
			getAliId(uploadInfo){
				this.aliId = uploadInfo.videoId
				this.name = uploadInfo.file.name
			},
			removeSensitive(arg){
				util.hasSensitiveWords.call(this,arg);
			},
			albumIdChange(event){
				this.$store.dispatch('video/updateAlbumId',event.target.value)
				this.audioNumFn(event.target.value);
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
            	var uploadType = this.$route.query.param;
				if(uploadType){
					api.audioEditFn(qs.stringify({
						albumId:this.albumId,
						name:this.name,
						title:this.title,
						aliId:this.aliId,
						id:this.id,
						sort:this.sort
					}))
					.then(response => {
						this.isOk = true;
					 	if(response.status == 200){
	                        var data = response.data;
	                        if(data.state == 0){
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

					api.creatAudioFn(qs.stringify({
						albumId:this.albumId,
						name:this.name,
						title:this.title,
						aliId:this.aliId,
						sort:this.sort
					}))
					.then(response => {
						this.isOk = true;
					 	if(response.status == 200){
	                        var data = response.data;
	                        if(data.state == 0){
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
			audioNumFn(id){//获取专辑内视频数量
				api.audioNumFn({
          albumId:id//传参
        })
        .then(response=>{
            if(response.status == 200){
                var data = response.data;
                if(data.state == 0){
                  this.audioNum = data.content                          
                  var params = this.$route.query.param;
                  if(params != undefined){                    
                    params = JSON.parse(params)
                    var status = params.status;
                      if(status != undefined && params.status != 3 ){//编辑音频排序为当前音频设置的排序，通过url参数拿
                        this.sort = params.sort;
                      }else{
                        this.sort = data.content + 1
                      }
                  }else{//上传音频排序默认为专辑内音频长度加1
                    this.sort = data.content + 1
                  }
                }
            }else{
                console.log("请求失败");
            }
        })
			},
			getLecturerAuthFn(){//是否拥有创建付费专辑权限
				api.audiogetAuthFn().then(res=>{
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
				api.audioalbumallFn({model:1})
	            .then(response=>{
	                if(response.status == 200){
                      var data = response.data;
	                    if(data.state == 0){
                          this.albumList = data.content; 
	                        if(this.$route.query){
                            var params = JSON.parse(this.$route.query.param)
                            this.albumId = params.albumId
                          }else{
                            this.albumId = this.albumList[0].id
                          }
							this.audioNumFn(this.albumId);
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
			getVideoTypeList(){//获取所有专辑列表
            	api.audioAlbumFn()
                .then(response=>{
                    if(response.status == 200){
                        var data = response.data;
                        if(data.state == 0){
							this.albumList = data.content;
							if(this.$route.query.uploadType == 2){
								this.albumId = this.$route.query.albumId
							}else{
								this.albumId = this.albumList[0].id
							}
							this.audioNumFn(this.albumId);
							if(this.albumList.length <= 0){
								this.$store.commit('layer/updateTipData',{
									showbox:'pattern-1',
									con:'你还没有创建过专辑，请创建专辑后再上传音频！'
								})
								this.$store.commit('layer/setSuccessCall',function(){
									this.$router.push({name:'audioaddalbum'})
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
						videoTitle:this.videoTitle,
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
			}
		},
		components:{
			layer,
			aliyunUpAudio
		},
		beforeRouteEnter(to, from, next){
			next();
		},
		created(){
			if(this.$fun.getBrowserInfo() == 'IE11以下'){
				this.$store.commit('layer/updateTipData',{
					showbox:'pattern-2',
					con:[{msg:'你的浏览器版本较低，建议使用最新版本浏览器，上传体验更好, 建议使用IE10以上版本、chrome或火狐浏览器'}]
				})
				this.$store.dispatch('layer/show');
			}
			if(this.$route.query.param){//编辑
        let params = JSON.parse(this.$route.query.param)
				this.title = params.title?params.title:''
				this.id = params.id ? params.id:''
				this.name = params.name ? params.name:''
				this.aliId = params.aliId ? params.aliId:''
				this.albumId = params.albumId ? params.albumId:''
				this.audioModel=params.audioModel ? params.audioModel:''//
        this.albumTitle=params.albumTitle ? params.albumTitle:''//
        this.sort=params.sort?params.sort:''//
				if(this.audioModel==1){//免费
          this.getmianAlbumList();//获取免费专辑列表
				}
				this.$store.commit('video/updateVideoName',this.name);
            	this.$store.commit('video/updateVideoId',this.aliId);
            	this.audioNumFn(this.albumId);
			}else{
				this.$store.commit('video/updateVideoName','');
            	this.$store.commit('video/updateVideoId','');
				this.audioModel=1//创建
				this.getVideoTypeList();//获取所有专辑列表
			}	
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
input[type="number"]{-moz-appearance:textfield;}

.fill-content{
	padding-left: 20px;
}
.video-title-box,.video-synopsis-box{
	display: flex;
	margin-bottom: 25px;
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
  .select-warp2{
    .sort-tips{
      color: red;
      padding-left: 5px;
      font-size: 12px;
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
