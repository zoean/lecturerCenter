<template>
	<div>
		<div class="main-table-warp" style="width: 885px;">
        <div class="condition-video-online-warp2">
                <div class="room-id">
                    <span>标题：</span>
                    <input type="text"  v-model="videoTitle">
                </div>
                <div class="select-warp2">
                    <span class="slect-tip">所属专辑：</span>
                    <select v-model="selectedAlbum">
                        <option value="">请选择专辑</option>
                        <option v-for="item in albumList" :value="item.albumId">{{item.albumName}}</option>
                    </select>
                </div>
                <span class="ok-btn" @click="getDate">
                    确定
                </span>
                
        </div>
			<v-table
				is-horizontal-resize
	            style="width:100%;"
	            :column-cell-class-name="columnCellClass"
	            :columns="columns"
	            :table-data="tableData"
	            :row-height="48"
				:title-row-height="50"
                :row-click="rowClickBack"
	            @on-custom-comp="customCompFunc" v-if="pageNum > 0"
	    	></v-table>
			<pagination class="center-pagination"
		        :page-num="pageNum"
		        :current-page="activePage"
		        @change="pagechange" v-if="pageNum > 1">
		    </pagination>
		</div>
        <div class="up-video-box" v-if="tableData.length <= 0">
            <p class="msg-tip">上传视频，让更多用户认识你！</p>
            <router-link class="b-up-btn" to="/uploadVideo">上传视频</router-link>
        </div>
        <layer>
        </layer>
    </div>
</template>

<script>
    import api from '@/api/index'
    import layer from '@/components/layer'
    import qs from 'qs'
    import {AIDEO_PLAY} from '@/utils/constant'
    import {ALBUM} from '@/utils/constant'
    export default{
    	components:{
            layer
        },
        data() {
            return {
            	pageNum:0,
            	activePage:1,
                tableData: [],
                videoTitle: '',
                selectedAlbum:'',
                albumList:[],
                columns: [
                    {field: 'createTime', title:'创建时间', width: 167, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'videoPic', title: '视频封面', width: 102, titleAlign: 'center',columnAlign:'center',isResize:true,
                    	formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return "<a target='_blank' href='"+rowData.videoPic+"' ><img src='"+rowData.videoPic+"'></a>"
                    }},
                    {field: 'videoName', title: '视频名称', width: 182, titleAlign: 'center',columnAlign:'center',isResize:true,
                        formatter:(rowData,rowIndex,pagingIndex,field)=>{
                                return "<a style='color:#cc0000;text-decoration: underline;' target='_blank' href='"+AIDEO_PLAY+"?vid="+rowData.aliyunVideoId+"' >"+rowData.videoName+"</a>";
                    }},
                    {field: 'videoTitle', title: '标题', width: 194, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'albumId', title: '所属专辑',width: 100, titleAlign: 'center',columnAlign:'center',isResize:true,
                        formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return "<p style='color:rgb(204, 0, 0);cursor: pointer'>"+rowData.albumName+"</p>"
                        }
                    },
                    {field: 'custome-adv', title: '操作',width: 134, titleAlign: 'center',columnAlign:'center',componentName:"tableOpa",isResize:false}
                ]
            }
        },
        methods:{
            //行点击回调
            rowClickBack(rowIndex, rowData, column){
                if(column.field == 'albumId'){
                    let param = {
                        albumId:rowData.albumId
                    }
                    this.$router.push({name:'details',query:param})
                }
            },
            //点击操作内容触发事件===查看详情
        	customCompFunc(params){
        		if (params.type === 'detaile'){
                    var item = params.rowData;
                    this.$store.commit('layer/updateTipData',{
                        showbox:'pattern-3',
                        con:[{
                          title:'创建时间：',
                          msg:item.createTime
                        },{
                          title:'所属专辑：',
                          msg:item.albumName
                        },{
                          title:'视频名称：',
                          msg:'<a href="'+this.AIDEO_PLAY+'?vid='+item.aliyunVideoId+'" target="_blank" style="color:#cc0000;text-decoration: underline;">'+item.videoName+'</a>'
                        },{
                          title:'标题：',
                          msg:item.videoTitle
                        },{
                          title:'简介：',
                          msg:item.videoRemark == "" ? "无" : item.videoRemark
                        }],
                    })
                    this.$store.dispatch('layer/show');
                }
        	},
        	pagechange(arg){
        		this.activePage = arg;
                this.getDate();
        	},
            columnCellClass(rowIndex,columnName,rowData){
            	if(columnName == "hobby"){
            		return 'title-cell-class-name';
            	}
            },
            getDate(){
                api.dateSetFn(qs.stringify({
                    pageSize: 20,
                    pageNum: this.activePage,
                    status:1,
                    videoSource: 1,
                    videoTitle: this.videoTitle,
                    albumId:this.selectedAlbum
                }))
                .then(response=>{
                    if(response.status == 200){
                        var data = response.data;
                        if(data.state == 0){
                            this.tableData = data.content.list;
                            this.tableData.map(item=>{
                                item.videoPic = this.$fun.getUrlVerify(item.videoPic)
                            })
                            this.pageNum = data.content.pages;
                            this.activePage = data.content.pageNum;
                        }else{
                            console.log(data.message);
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
            this.$store.dispatch('tableOpa/updateOpaList',[
                {content:'查看详情',style:{'color':'#cc0000'},type:'detaile',permissFlag:'album'}
            ])
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
            this.getDate();
        }
    }
</script>

<style lang="scss" type="text/css">
    .v-table-header-row{
        background-color: #f2f2f2;
        div{
        	span{
        		color:#4d9dfc;
        	}
        }
    }
    .record-warp{
        display: flex;
        padding: 35px 150px 40px;
        border-bottom: 1px solid #d2d2d2;
        .record-item{
            flex:1;
            p{
                @include basefont(18px, 20px, #333,center);
                span{
                    @include basefont(24px, 26px, #cc0000);
                }
            }
        }
    }
    .up-video-box{
        margin-top:92px;
        .msg-tip{
            @include basefont(20px, 24px, #333,center);
            margin-bottom: 45px;
        }
        .b-up-btn{
            @extend .btn;
            width: 200px;
            display: block;
            margin: 0 auto;
            height: 50px;
            line-height: 50px;
            font-size: 20px;
        }
    }
    .condition-video-online-warp2{
        @extend .clear;
        margin-bottom: 23px;
        margin-top: 22px;
    }
    .room-id{
            float: left;
            font-size: 0;
            margin-left: 22px;
            span{
                @include basefont(16px, 28px, #333);
            }
            input{
                box-sizing: border-box;
                @include basebox(180px, 28px, #fff, 1px solid #d6d6d6);
                @include basefont(16px, 28px, #333);
                padding:0 12px;
                &.bt-void-input{
                    width:180px;
                }
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
        .ok-btn{
            float: right;
            margin-top: -4px;
            @extend .btn;
        }
    
    
</style>
