<template>
	<div>
		<p class="go-back-btn" @click="$router.go(-1);">上传专辑</p>
		<div class="fill-content">
			<div class="video-classify-show-box" v-if="dataObj.uploadType != 2 && lecturerAuth">
				<p class="m-img-text-title" style="margin-top: 12px;"><span>*</span>专辑类型：</p>
				<div class="select-warp2" style="margin-top:10px;">
                    <label><input type="radio"  name="mf" value="0" checked @click="checkType(0)"/>&nbsp;&nbsp;免费专辑</label>
                    <label style="margin-left:15px;"><input type="radio"  name="mf" value="1" @click="checkType(1)"/>&nbsp;&nbsp;付费专辑</label>
                </div>
			</div>
			<div v-if="mian_fu==1">
				<div class="video-synopsis-box">
					<p class="m-img-text-title"><span></span>课程简介：</p>
					<div class="m-textarea-box">
						<textarea class="synopsis-textarea" v-model="keRemark" placeholder="专辑简介，能帮助用户快速了解内容，增加用户观看概率！字数限制100字"></textarea>
						<p class="charact-limit"><span class="current">{{currentKeLen}}</span><span class="maximal">/{{keLimit}}</span></p>
					</div>
				</div>
				<div class="video-synopsis-box">
					<p class="m-img-text-title"><span></span>老师简介：</p>
					<div class="m-textarea-box">
						<textarea class="synopsis-textarea" v-model="teacherRemark" placeholder="老师简介，能帮助用户快速了解内容，增加用户观看概率！字数限制100字"></textarea>
						<p class="charact-limit"><span class="current">{{currentTeacherLen}}</span><span class="maximal">/{{teacherLimit}}</span></p>
					</div>
				</div>
				<div class="img-text-wrap">
					<div class="img-select-big-box" style="margin-top:20px;">
				    	<p class="m-img-text-title" style="margin-right:20px;">图片简介：</p>
				    	<div style="float:left;">
				    		<up-image-all2 :imgdata="imgdata" @imgUrlCallback="imgUrlCallback"></up-image-all2>	
				    		<p class="up-img-tip" style="float:left;">你可以上传JPG、JPEG、PNG文件,图片尺寸需大于400像素，<br>文件大小在3MB以内，最大支持3MB以内的文件</p>
				    	</div>
				    	<img :src="$fun.getUrlVerify(imgUrl1)" v-show="imgUrl1 != ''" style="width:140px; height:140px; display:block; clear:both; margin-left:110px;">
				    		
				    </div>
			    	
			    <!-- 	<up-image-all :imagesType="imagesType" :imgUrl="imgUrl1" size="3072" @callbackImg="(url)=>{callbackImg(1,url)}"></up-image-all> -->
				</div>
			</div>



			<div style="clear:both;"></div>
			<div class="video-classify-show-box" v-if="dataObj.uploadType != 2">
				<p class="m-img-text-title" style="margin-top: 12px;"><span>*</span>一级分类：</p>
				<div class="select-warp2">
                    <select v-model="typeOneId" @change="dataOneFn">
                    	<option value="">请选择一级分类</option>
                        <option v-for="item in labelList" :value="item.typeId">{{item.typeName}}</option>
                    </select>
                </div>
			</div>
			<div class="video-classify-show-box" v-if="dataObj.uploadType != 2">
				<p class="m-img-text-title" style="margin-top: 12px;"><span>*</span>二级分类：</p>
				<div class="select-warp2">
                    <select v-model="typeTwoId"  @change="dataTwoFn">
                    	<option value="">请选择二级分类</option>
                        <option v-for="item in labelList2" :value="item.typeId">{{item.typeName}}</option>
                    </select>
                </div>
			</div>

			<!--编辑时分类不可变-->
			<div class="video-title-box"  v-if="dataObj.uploadType == 2" style="margin-top:15px;">
				<p class="m-img-text-title" style="margin-top: 12px; float:left; text-align:left;"><span>*</span>选择分类：</p>
				<div class="m-text-box" style="border:none; float:left; margin-left:15px;">
					<p style="float:left; line-height:40px;">一级分类：<span>{{dataObj.typeOneName}}</span></p><p style="float:left; margin-left:15px; line-height:40px;">二级分类：<span>{{dataObj.typeTwoName}}</span></p>
				</div>
			</div>


			<div class="img-text-wrap">
				<div class="img-select-big-box" style="margin-top:20px;">
			    	<p class="m-img-text-title" style="margin-right:53px;"><span>*</span>封面：</p>
			    	<div style="float:left;"><up-image-all :imagesType="imagesType" :imgUrl="imgUrl2" size="3072" @callbackImg="(url)=>{callbackImg(2,url)}"></up-image-all></div>
			    	<p class="up-img-tip" style="float:left;">你可以上传JPG、JPEG、PNG文件,图片尺寸需大于400像素，<br>文件大小在500kb以内，最大支持1MB以内的文件</p>	
			    </div>
			</div>
			<div style="clear:both;"></div>
			<div class="video-title-box">
				<p class="m-img-text-title" style="margin-top: 12px;"><span>*</span>专辑名称：</p>
				<div class="m-text-box">
					<input type="text" class="title-input" v-model="albumName">
					<p class="charact-limit"><span class="current">{{currentTitleLen}}</span><span class="maximal">/{{inputLimit}}</span></p>
				</div>
			</div>
			<div class="video-synopsis-box">
				<p class="m-img-text-title"><span></span><span>*</span>专辑简介：</p>
				<div class="m-textarea-box">
					<textarea class="synopsis-textarea" v-model="videoRemark" placeholder="专辑简介，能帮助用户快速了解内容，增加用户观看概率！字数限制100字"></textarea>
					<p class="charact-limit"><span class="current">{{currentSynopsisLen}}</span><span class="maximal">/{{textareaLimit}}</span></p>
				</div>
			</div>
			<div class="img-select-big-box">
	    		<p class="m-img-text-title"><span>*</span> 选择标签：</p>
	    		<ul class="video-screenshot" style="padding: 0px 18px 0 18px;">
						<li class="selectLi" v-for="(item,key) in defaultImgs" :class="{active:defaultImgsSelect.indexOf(item.labelId) != -1}" @click="selectImg(3,key,item)" :key="key"><button type="button" class="selectBtn">{{item.labelName}}</button><span class="select-icon"></span></li>
					</ul>
				<!--<GeminiScrollbar class="default-img-warp" style="margin-top:0;">
					<ul class="video-screenshot" style="padding: 0px 18px 0 18px;">
						<li class="selectLi" v-for="(item,key) in defaultImgs" :class="{active:defaultImgsSelect.indexOf(item.labelId) != -1}" @click="selectImg(3,key,item)" :key="key"><button type="button" class="selectBtn">{{item.labelName}}</button><span class="select-icon"></span></li>
					</ul>
				</GeminiScrollbar> -->
		</div>
		<div class="tableText" style="clear:both;">最多选择2个标签</div>
		<div class="btn-list">
				<p class="up-cancel" @click="cancelFn">取消</p>
				<p class="up-submit" :class="{yes: isYes}" @click="saveData">保存</p>
			</div>
			<!--<select-img :dataObj="dataObj" ref="seleceimg"></select-img>-->
		</div>
	    <layer></layer>
	</div>
</template>

<script>
	import api from '@/api/index'
    import qs from 'qs'
    import layer from '@/components/layer'
	import util from '@/utils/util'
	import {UPLOAD_MODIFY_FILE} from '@/utils/constant'
	import upImageAll from '@/components/upImageAll'
	import upImageAll2 from '@/components/upImageAll2'
	export default {
		props:{
			dataObj:{
				type:Object,
				default:{}
			}
		},
		data(){
			return {
				imgdata:{
					type:'image/png,image/jpg,image/jpeg',
					size:3072,
					height:'',
					width:'',
					imgname:'上传图片',
					url:'/video/lecturerVideo/uploadFile.video'
				},
				imagesType:['image/png','image/jpg','image/jpeg'],
				defaultImgs:[],
				defaultImgsSelect:[],
				albumList: [],
				labelList: [],
				labelList2: [],
				isSave: true,
				typeOneId:'',
				typeTwoId:'',
				albumId:'',
				albumName:'',
				inputLimit:12,
				videoRemark:'',
				textareaLimit: 100,
				teacherRemark:'',
				teacherLimit: 100,
				keRemark:'',
				keLimit: 100,
				dataObj:{},
				imgUrl1:'',
				imgUrl2:'',
				mian_fu: '',
				lecturerAuth:true
			}
		},
		computed:{
			isYes(){
			if(this.mian_fu == 1){//付费
				if(this.dataObj.uploadType == 2){//编辑this.keRemark !='' && this.teacherRemark !='' && this.imgUrl1!='' && 
					if(this.imgUrl2 != '' && this.albumName != '' && this.videoRemark != '' && this.defaultImgsSelect.length > 0){
						return true;
					}else{
						return false;
					}
				}else{//创建this.keRemark !='' && this.teacherRemark !='' && this.imgUrl1 !='' && 
					if(this.imgUrl2 != '' && this.albumName != '' && this.videoRemark != '' && this.defaultImgsSelect.length > 0 && this.dataObj.typeId && this.dataObj.typeTwoId ){
						return true;
					}else{
						return false;
					}
				}
			}else{//免费
				if(this.dataObj.uploadType == 2){//编辑
					if(this.imgUrl2 != '' && this.albumName != '' && this.videoRemark != '' && this.defaultImgsSelect.length > 0){
						return true;
					}else{
						return false;
					}
				}else{//创建
					if(this.typeTwoId && this.imgUrl2 != '' && this.albumName != '' && this.videoRemark != '' && this.defaultImgsSelect.length > 0){
						return true;
					}else{
						return false;
					}
				}
			}
		},
			/**
		   * 计算文字限制=老师简介
		   */
			currentTeacherLen(){
				try{
					var len = this.teacherRemark.length;
					if(len > this.teacherLimit){
						this.teacherRemark = this.teacherRemark.substring(0,this.teacherLimit)
						return this.teacherLimit;
					}else{
						return len;
					}
				}catch(err){
					return 0;
				}	
			},
			/**
		   * 计算文字限制=课程简介
		   */
			currentKeLen(){
				try{
					var len = this.keRemark.length;
					if(len > this.keLimit){
						this.keRemark = this.keRemark.substring(0,this.keLimit)
						return this.keLimit;
					}else{
						return len;
					}
				}catch(err){
					return 0;
				}	
			},
			/**
		   * 计算文字限制=专辑简介
		   */
			currentSynopsisLen(){
				var len = this.videoRemark.length;
				if(len > this.textareaLimit){
						// this.$store.dispatch('video/updateVideoRemark',this.$store.state.video.videoRemark.substring(0, this.textareaLimit));
					this.videoRemark = this.videoRemark.substring(0,this.textareaLimit)
					return this.textareaLimit;
				}else{
					return len;
				}
			},
			/**
		 * 计算文字限制-专辑标题
		 */
			currentTitleLen(){
				var len = this.albumName.length;
				if(len > this.inputLimit){
					// this.$store.dispatch('video/updateVideoTitle',this.$store.state.video.videoTitle.substring(0, this.inputLimit));
					this.albumName = this.albumName.substring(0,this.inputLimit)
					return this.inputLimit;
				}else{
				 return len;
				}
			}
		},
		methods:{
			imgUrlCallback(url){
				//console.log(url)
				this.imgUrl1 = url

			},
			checkType(type){
				this.mian_fu = type
			},
			callbackImg(type,url){
				type == 1?this.imgUrl1 = url:this.imgUrl2 = url
			},
			/**
             * 根据一级分类id获取二级分类
             */
            dataOneFn(){    //@change="dataTwoFn"  一级分类change时触发
                api.dataTwoFn({//获取二级分类接口
                    typeId: this.typeOneId//传参
                })
                .then(response=>{
                    if(response.status == 200){
                        var data = response.data;
                        if(data.state == 0){
                            this.labelList2 = data.content;
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
                .catch(err => {

                })
				this.dataObj.typeId = this.typeOneId
				this.reloadChild(this.typeOneId)
			},
			dataTwoFn(){
				this.dataObj.typeTwoId = this.typeTwoId
				this.reloadChild(this.typeOneId,this.typeTwoId)
			},
			//请求标签集合
			reloadLbel(){
				api.getdataOneFn({typeId:this.typeOneId})
					.then(response=>{
						if(response.status == 200){
							var data = response.data;
							if(data.state == 0){
								this.defaultImgs = data.content;
							}
						}else{
							this.$store.commit('layer/updateTipData',{
								showbox:'pattern-2',
								con:[{msg:data.message}]
							})
							this.$store.dispatch('layer/show'); 
						}
					})
					.catch(err => {

					})
					this.dataObj.typeId = this.typeOneId
			},
			//重置标签集合
			reloadChild(typeOneId,typeTwoId){
				this.dataObj.typeId = typeOneId
				this.dataObj.typeTwoId = typeTwoId
				this.defaultImgsSelect = []
				this.reloadLbel()
			},
			//返回
			cancelFn(){
				this.$router.go(-1);
			},
			//保存
			saveData(){
				if(!this.isYes){
					return
				}
	
				this.$store.commit('layer/updateTipData',{
                    showbox:'pattern-1',
                    con:'是否确认保存？'
                })
                this.$store.dispatch('layer/show');
                this.$store.commit('layer/setSuccessCall',this.getSelectImgData)//保存
			},
			//保存
			getSelectImgData(){
				var params= {}
				if(this.mian_fu == 1){
					params.courseInfo = this.keRemark, //课程简介
					params.lecturerInfo = this.teacherRemark, //讲师简介
					params.coursePic = this.imgUrl1  //图片简介
				}
				if(this.dataObj.uploadType == 2){//编辑
					api.rePublishUpAlbumFn(qs.stringify(Object.assign({//重新上传专辑接口(编辑)
                        albumId:this.dataObj.albumId,//专辑id
                        typeOneId:this.dataObj.typeOneId,//一级分类
                        typeTwoId:this.dataObj.typeTwoId,//二级分类
                        albumName:this.albumName,//专辑名称
                        albumPic:this.imgUrl2,//封面
                        albumDesc:this.videoRemark,//专辑简介
                        type:this.mian_fu,//专辑类型（0免费1付费）
                        labelIds: this.defaultImgsSelect.join(',')//标签集合
                    },params))).then(response => {
                        if(response.status == 200){
							this.$store.commit('layer/updateTipData',{
								showbox:'pattern-2',
								con:[{msg:'专辑保存成功'}]
							})
							this.$store.dispatch('layer/show'); 
							this.$router.go(-1)
                        }else{
                            this.$store.commit('layer/updateTipData',{
								showbox:'pattern-2',
								con:[{msg:data.message}]
							})
							this.$store.dispatch('layer/show'); 
                        }
                    })
                    .catch(err => {
                    })
				}else{//创建
					api.saveAlbumUrlFn(qs.stringify(Object.assign({
						typeOneId:this.dataObj.typeId,//一级分类
                        typeTwoId:this.dataObj.typeTwoId,//二级分类
                        albumName:this.albumName,//专辑名称
                        albumPic:this.imgUrl2,//封面
                        albumDesc:this.videoRemark,//专辑简介
                        type:this.mian_fu,//专辑类型（0免费1付费）
                        labelIds: this.defaultImgsSelect.join(',')//标签集合
					},params))).then(response=>{
						if(response.status == 200){
							this.$router.go(-1)
                        }else{
                            this.$store.commit('layer/updateTipData',{
								showbox:'pattern-2',
								con:[{msg:data.message}]
							})
							this.$store.dispatch('layer/show'); 
                        }
					})
				}
				
			},
			selectImg(boxNumber, index, item){
				if(this.defaultImgsSelect.indexOf(item.labelId) == -1){
					if(this.defaultImgsSelect.length >= 2){
						return
					}else{
						this.defaultImgsSelect.push(item.labelId)
						//this.dataObj.labelList.push(item)
					}
				}else{
					this.defaultImgsSelect.splice(this.defaultImgsSelect.indexOf(item.labelId),1)
					//this.dataObj.labelList.splice(index,1)
				}
			},
		},
		
		components:{
			layer,
			upImageAll,
			upImageAll2
		},
		beforeRouteEnter(to, from, next){
			next();
		},
		created(){
			this.mian_fu = 0
			//console.log(this.mian_fu)
			//区分编辑新建
			if(this.$route.query.uploadType == 2){
				this.dataObj = this.$route.query
				this.keRemark=this.dataObj.courseInfo//课程简介
				this.teacherRemark=this.dataObj.lecturerInfo//讲师简介
				this.imgUrl1=this.dataObj.coursePic//图片简介
				this.dataObj.labelList = JSON.parse(this.$route.query.labelList)
				this.imgUrl2 = this.dataObj.albumPic//封面
				this.albumName = this.dataObj.albumName
				this.videoRemark = this.dataObj.albumDesc
				this.mian_fu=this.dataObj.mian_fu
				this.typeOneId=this.dataObj.typeOneId//一级分类
				this.defaultImgsSelect = this.dataObj.labelList.map(item=>{
					return item.labelId
				})
				this.reloadLbel()
			}else{
				this.dataObj = {
					uploadType:1,
					labelList:[]
				}
				api.getLecturerAuthFn().then(res=>{//获取是否拥有创建付费专辑权限
					if(res.status ==200){
						var data = res.data
						if(data.state == 0){
							if(data.content.auth == 1){
								this.lecturerAuth = true
							}else{
								this.lecturerAuth = false
							}
						}
					}
				})
			}
        api.dataOneFn()//获取一级分类接口
            .then(response=>{
                if(response.status == 200){
                    var data = response.data;
                    if(data.state == 0){
						this.labelList = data.content;
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
            .catch(err => {

			})
		}
	}
</script>

<style lang="scss" scoped type="text/css">
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
.video-title-box,.video-synopsis-box{
	display: flex;
	margin-bottom: 25px;
	margin-top:25px;
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
	float:left;
	span{
		color:#cc0000;
		position: absolute;
	    top: 2px;
		left: -10px;
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
