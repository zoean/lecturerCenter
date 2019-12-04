<template>
	<div>
        <ul class="video-record-warp">
            <li class="record-item">
                <p>已上架视频：<span>{{videoNum}}</span>个</p>
            </li>
            <!--<li class="record-item">
                <p>本周观看：<span>{{sevenDayCount}}</span></p>
            </li>
            <li class="record-item">
                <p>累计观看：<span>{{allCount}}</span></p>
            </li>-->
        </ul>
		<div class="main-table-warp" style="width: 915px;">

            <div class="condition-video-online-warp">
                <dateTime class="time-show-float" ref="dateTime"></dateTime>
                <div class="room-id" style="margin-top:20px;">
                    <span>标题：</span>
                    <input type="text" class="bt-void-input" v-model="videoTitle">
                </div>
                <span class="ok-btn" @click="getDate">
                    确定
                </span><br>
                <div style="clear:both;"></div>
                <div class="select-warp" style="margin-left:0;">
                    <span class="slect-tip">所属专辑：</span>
                    <select v-model="selectedAlbum">
                        <option value="">请选择专辑</option>
                        <option v-for="item in albumList" :value="item.albumId">{{item.albumName}}</option>
                    </select>
                </div>
                <div class="select-warp mar-left" style="margin-left:10px;">
                    <span class="slect-tip">排序：</span>
                    <select v-model="selectedRank">
                        <option value="">默认</option>
                        <option value="4">观看数从高到低</option>
                        <option value="5">点赞数从高到低</option>
                    </select>
                </div>
            </div>
			<v-table
				is-horizontal-resize
	            style="width:100%;"
	            :column-cell-class-name="columnCellClass"
	            :columns="columns"
	            :table-data="tableData"
	            :row-height="48"
				:title-row-height="50"
	            @on-custom-comp="customCompFunc"
                :row-click="rowClickBack"
	    	></v-table>
			<pagination class="center-pagination"
		        :page-num="pageNum"
		        :current-page="activePage"
		        @change="pagechange"  v-if="pageNum>1">
		    </pagination>
		</div>
		<layer>
            </layer>
    </div>
</template>

<script>
    import qs from 'qs'
    import api from '@/api/index'
    import layer from '@/components/layer'
    import dateTime from '@/components/dateTimeSelect'
    import {AIDEO_PLAY} from '@/utils/constant'
    import {ALBUM} from '@/utils/constant'
    export default{
    	components:{
            dateTime,
            layer
        },
        data() {
            return {
            	pageNum:0,
            	activePage:1,
                tableData: [],
                selectedType:'',
                selectedRank:'',
                selectedAlbum:'',
                videoTitle: '',
                albumList:[],
                sevenDayCount: 0,
                allCount: 0,
                videoNum: 0,
                columns: [
                    {field: 'shelfTime', title:'上架时间', width: 150, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'videoPic', title: '视频封面', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true,
                    	formatter:(rowData,rowIndex,pagingIndex,field)=>{
                    			return "<a target='_blank' href='"+rowData.videoPic+"' ><img src='"+rowData.videoPic+"'></a>"
                    }},
                    {field: 'videoName', title: '视频名称', width: 163, titleAlign: 'center',columnAlign:'center',isResize:true,
                        formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return "<a style='color:#cc0000;text-decoration: underline;' target='_blank' href='"+AIDEO_PLAY+"?vid="+rowData.aliyunVideoId+"' >"+rowData.videoName+"</a>";
                    }},
                    {field: 'videoTitle', title: '标题', width: 160, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'albumId', title: '所属专辑',width: 100, titleAlign: 'center',columnAlign:'center',isResize:true,
                        formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return "<p style='color:rgb(204, 0, 0);cursor: pointer'>"+rowData.albumName+"</p>"
                        }
                    },
                    {field: 'custome-adv', title: '操作',width: 124, titleAlign: 'center',columnAlign:'center',componentName:'tableOpa',isResize:true},
                    {field: 'view', title: '观看数', width: 72, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'vote', title: '点赞数', width: 72, titleAlign: 'center',columnAlign:'center',isResize:true}
                ],
                downDateIndex:0,
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
            //点击操作内容触发事件
        	customCompFunc(params){
                if (params.type === 'discharge'){   //下架
                    //请求下架接口
                    this.$store.commit('layer/updateTipData',{
                        showbox:'pattern-1',
                        con:"下架后用户再看不到了，确定下架视频吗？"
                    })
                    this.$store.commit('layer/setSuccessCall',function(){
                        api.downVideoFn({vid:this.downVideoId})
                        .then(response => {
                            if(response.status == 200){
                                var data = response.data;
                                if(data.state == 0){
                                    this.$delete(this.tableData,this.downDateIndex);
                                    this.videoNum--
                                }else{
                                    console.log(data.message);
                                }
                            }else{
                                console.log("请求失败");
                            }
                        })
                        .catch(err => {
                            console.log("请求失败");
                        })
                    }.bind(this));

                    this.downVideoId = params.rowData['vid'];
                    this.$store.dispatch('layer/show');
                    this.downDateIndex = params.index;
                }else if (params.type === 'detailed'){  //查看详情
                    var item = params.rowData;
                    this.$store.commit('layer/updateTipData',{
                        showbox:'pattern-3',
                        con:[{
                                title:'发布时间：',
                                msg:item.publishTime
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
                        }]
                    })
                    this.$store.commit('layer/setSuccessCall',null);
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
                    d1:(this.$store.state.dateTime.start !== 'Invalid DateTime')?this.$store.state.dateTime.start:'',//开始时间
                    d2:(this.$store.state.dateTime.end !== 'Invalid DateTime')?this.$store.state.dateTime.end:'',//结束时间
                    videoTitle: this.videoTitle,
                    albumId:this.selectedAlbum,
                    i1: this.selectedRank,
                    status:2,
                    pageSize: 20,
                    pageNum: this.activePage,
                    videoSource: 1
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
                {content:'下架',style:{'color':'#4d9dfc'},type:'discharge'},
                {content:'查看详情',style:{'color':'#cc0000'},type:'detailed'}
            ])
            api.seeCountFn({
                videoSource:1
            })
            .then(response => {
                if(response.status == 200){
                    var data = response.data;
                    if(data.state == 0){
                        this.sevenDayCount = data.content.sevenDayCount;
                        this.allCount = data.content.allCount;
                        this.videoNum = data.content.videoNum;
                    }else{
                        console.log(data.message);
                    }
                }else{
                    console.log("请求失败");
                }
            })
            .catch(err => {

            })
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
    .video-record-warp{
        display: flex;
        padding: 35px 40px 40px;
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
    .condition-video-online-warp{
        @extend .clear;
        margin-bottom: 23px;
        margin-top: 22px;
        .time-show-float{
            float: left;

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
                @include basebox(100px, 28px, #fff, 1px solid #d6d6d6);
                @include basefont(16px, 28px, #333);
                padding:0 12px;
                &.bt-void-input{
                    width: 296px;
                }
            }
        }
        .select-warp{
            float: left;
            margin-top: 22px;
            margin-left:-412px;
            @extend .clear;
            &.mar-left{
                margin-left: -200px;
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
            margin-top: -32px;
            @extend .btn;
        }
    }
</style>
