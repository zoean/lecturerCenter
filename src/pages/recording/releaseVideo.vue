<template>
	<div>
		<p class="go-back-btn" @click="$router.go(-1);">发布视频</p>
		<div class="fill-content">
			<div class="video-name-show-box">
				<p class="m-img-text-title" style="margin-top: 4px;"><span></span> 视频</p>
				<a :href="$fun.getUrlVerify(videoPlay)+'?vid='+videoId" target="_blank" class="video-name-show">{{videoName}}</a>
			</div>
			<div class="video-room-show-box">
				<p class="m-img-text-title" style="margin-top: 4px;"><span></span> 房间</p>
				<p class="video-room-show">{{$route.query.roomId}}</p>
			</div>
			<div class="video-classify-show-box">
				<p class="m-img-text-title" style="margin-top: 12px;">专辑</p>
                    <select v-model="albumId" class="classify-list" @change="videoNumFn(albumId)">
                        <option value="">请选择专辑</option>
                        <option v-for="item in albumList" :value="item.albumId">{{item.albumName}}</option>
                    </select>
				<!-- <p class="m-img-text-title" style="margin-top: 12px;"><span></span> 分类</p>
				<ul class="classify-list">
					<li class="classify-item " v-for="item in videoTypeList" :class="{active:item.typeId == typeId}" @click="selectTypeId(item.typeId)">{{item.typeName}}</li>
				</ul>
				<p class="classify-tip"><span>提示：</span>如你进行选择分类的操作，则发布后将不归为直播回看类的视频</p> -->
			</div>
			<p class="classify-tip"><span>提示：</span>如你进行选择专辑的操作，则发布后将不归为直播回看类的视频</p>
      <div class="video-classify-show-box" v-if="this.albumId != ''">
				<p class="m-img-text-title" style="margin-top: 12px;"><span>*</span> 专辑内排序</p>
				<div class="select-warp2">
          <input type="number" name="" class="sort" v-model="sort" onkeyup="value=parseInt(value.replace(/^[0][\*]*/g,''))">
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
		<layer></layer>
	</div>
</template>

<script>
	import api from '@/api/index'
    import qs from 'qs'
    import layer from '@/components/layer'
	import selectImg from '@/components/upImage'
	import {mapState} from 'vuex'
	import {AIDEO_PLAY} from '@/utils/constant'
	import util from '@/utils/util'
	export default {
		data(){
			return {
				videoTypeList: [],
				albumList: [],
				albumId: '',
				tipData:null,
				isSave: true,
				videoPlay: AIDEO_PLAY,
				isOk:true,
        keyWords:[],
        videoNum:'',
        sort: ''
			}
		},
		components:{
			layer,
			selectImg
		},
		computed:{
			...mapState('video', {
			    typeId: state => state.typeId,
			    videoName:state => state.videoName,
				videoTitle:state => state.videoTitle,
				videoRemark:state => state.videoRemark,
				videoPic:state => state.videoPic,
				videoId: state => state.videoId
		  	}),
		  	isYes(){
		  		if(this.videoTitle != '' && this.videoPic != '' && this.videoRemark != '' && this.sort != ''){
		  			return true;
		  		}else{
		  			return false;
		  		}
		  	}
		},
		methods: {
			// selectTypeId(typeId){
			// 	if(this.typeId == typeId){
			// 		this.$store.dispatch('video/updateTypeId','')
			// 	}else{
			// 		this.$store.dispatch('video/updateTypeId',typeId)
			// 	}
			// },
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
	            		return;
	            	}
					this.$store.commit('layer/updateTipData',{
	                    showbox:'pattern-1',
	                    con:'提交后不能修改，确定要提交吗？',
	                })
	                this.$store.commit('layer/setSuccessCall',function(){
	                	this.isSave = false;
	                	if(this.isOk){
	                		return;
	                	}
	                	api.publishVideoFn(qs.stringify({
							vid:this.$route.query.vid,
							// typeId:this.typeId,
							albumId:this.albumId,
							videoName:this.videoName,
							videoTitle:this.videoTitle,
							videoRemark:this.videoRemark,
							aliyunVideoId:this.videoId,
							videoPic:this.videoPic,
							status:1,
							videoSource:0,
              uploadChannel: 2,
              sort: this.sort
						}))
						.then(response => {
							this.isOk = true;
						 	if(response.status == 200){
		                        var data = response.data;
		                        if(data.state == 0){
		                        	var storage=window.localStorage;
									storage.removeItem('releaseMsg_'+this.typeId);
		                            this.$router.push({path:'/recording/unpublished'});
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
	                }.bind(this))
	                this.$store.dispatch('layer/show');
				}
			},
			/**
			 * 获取视频标签
			 * @return void
			 */
			getVideoTypeList(){
				api.videoTypeListFn()
				.then(response=>{
					if(response.status == 200){
                        var data = response.data;
                        if(data.state == 0){
                            this.videoTypeList = data.content;
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
				var storage=window.localStorage;
				var releaseMsg = qs.stringify(storage.getItem('releaseMsg_'+this.$route.query.typeId));
				if(releaseMsg == "") releaseMsg={};
				var obj ={
					typeId: this.typeId,
					imgRegion: this.$store.state.video.imgRegion,
					videoTitle:this.videoTitle,
					videoRemark:this.videoRemark,
					videoPic:this.videoPic
				}
				releaseMsg[this.$route.query.vid] = obj;
				storage.setItem('releaseMsg',qs.stringify(releaseMsg))
				this.$store.commit('video/initVideoState');
				if (util.checkIE()) {
					window.removeEventListener('hashchange',this.saveData,false);
				}else{
					window.removeEventListener('popstate',this.saveData,false);
				}
			},
			initData(){
				var storage=window.localStorage;
				var releaseMsg = qs.parse(storage.getItem('releaseMsg_'+this.$route.query.typeId));
				var obj = releaseMsg[this.$route.query.vid];
				if(obj!=undefined){
					this.$store.commit('video/updateTypeId',obj.typeId);
					this.$store.commit('video/updateImgRegion',obj.imgRegion);
					this.$store.commit('video/updateVideoTitle',obj.videoTitle);
					this.$store.commit('video/updateVideoRemark',obj.videoRemark);
					this.$store.commit('video/updateVideoPic',obj.videoPic);
				}else{
					this.$store.commit('video/updateTypeId',this.$route.query.typeId == undefined ? '' : this.$route.query.typeId);
					this.$store.commit('video/updateVideoTitle',this.$route.query.videoTitle == undefined ? '' : this.$route.query.videoTitle);
					this.$store.commit('video/updateVideoRemark',this.$route.query.videoRemark == undefined ? '' : this.$route.query.videoRemark);
					this.$store.commit('video/updateVideoPic',this.$route.query.videoPic == undefined ? '' : this.$route.query.videoPic);
					if(this.$route.query.videoPic != undefined){
						this.$store.commit('video/updateImgRegion','1_1');
					}
				}
      },
      videoNumFn(id){//获取专辑内视频数量
        api.videoNumFn({
          albumId: id
        }).then(response => {          
          if(response.status == 200){
            var data = response.data;
            if(data.state == 0){
              this.videoNum = data.content;
              this.sort = data.content + 1;
            }
          }
        })
      }
		},
		mounted(){
			/**
             * 获取专辑列表
             */
            api.datealbumListFn()
                .then(response=>{
                    if(response.status == 200){
                        var data = response.data;
                        if(data.state == 0){
                            this.albumList = data.content;
                        }else{
                            console.log(data.message);
                        }
                    }else{
                        console.log("请求失败");
                    }
                })
                .catch(err => {

                })
			this.getVideoTypeList();
			this.initData();
			if (util.checkIE()) {
				window.addEventListener('hashchange',this.saveData,false);
			}else{
				window.addEventListener('popstate',this.saveData,false);
			}
			this.$store.commit('video/updateVideoName',this.$route.query.videoName);
			this.$store.commit('video/updateVideoId',this.$route.query.aliyunVideoId);

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
		margin-top:11px;
		border: 1px solid
	    // width: 800px;
		// .classify-item{
		// 	@include basebox(100px, 40px, #fff, 1px solid #999999,5px);
		// 	@include basefont(16px, 38px, #333);
		// 	text-align: center;
		// 	line-height: 40px;
		// 	margin-right: 40px;
		// 	margin-bottom: 10px;
		// 	user-select: none;
		// 	cursor: pointer;
		// 	&.active{
		// 		border: 1px solid #6ea6f6;
		// 		background: #d7e7ff;
		// 	}
		// }
	}
  .select-warp2{    
    float: left;
    margin-left: 20px;
    .sort-tips{
      color: red;
      padding-left: 5px;
      font-size: 12px;
    }
    .zhu{
      color:#bfc0c2; 
      font-size:14px; 
      margin-top:10px;
    }
    .sort{
      position: relative;
      @include basebox(180px, 40px, #fff, 1px solid #999999, 5px);
      overflow: hidden;
      box-sizing: border-box;
      text-align:center;
    }
  }
}
.classify-tip{
		@include basefont(12px, 14px, #333);
	    margin-left: 64px;
	    margin-bottom: 13px;
		margin-top: 10px;
		span{
			color:#cc0000;
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
</style>
