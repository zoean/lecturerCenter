<template>
	<div>
        <ul class="record-warp">
                <li class="record-item">
                    <p>本周观看：<span>{{weekCount}}</span></p>
                </li>
                <li class="record-item">
                    <p>累计观看：<span>{{allCount}}</span></p>
                </li>
            </ul>
		<div class="main-table-warp" style="width: 915px;">
            
            <div class="condition-online-warp">
                <dateTime class="time-show-float" ref="dateTime"></dateTime>
                <div class="room-id" style="margin-left:10px;">
                    <span>房间ID：</span>
                    <input type="text" class="room-input" v-model="roomId">
                </div>
                <div class="room-id" style="margin-left:10px;">
                    <span>标题：</span>
                    <input type="text" class="bt-input" v-model="videoTitle">
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
	            @on-custom-comp="customCompFunc"
	    	></v-table>
			<pagination class="center-pagination"
		        :page-num="pageNum"
		        :current-page="activePage"
		        @change="pagechange" v-if="pageNum > 1">
		    </pagination>
		</div>
        <layer></layer>
    </div>
</template>

<script>
    import dateTime from '@/components/dateTimeSelect'
    import api from '@/api/index'
    import layer from '@/components/layer'
    import qs from 'qs'
    import {AIDEO_PLAY} from '@/utils/constant'
    export default{
        data() {
            return {
            	pageNum:0,
            	activePage:1,
                roomId:'',
                videoTitle:'',
                tableData: [],
                weekCount: 0,
                allCount: 0,
                columns: [
                    {field: 'shelfTime', title:'上架时间', width: 158, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'videoPic', title: '视频封面', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true,
                    	formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return "<a target='_blank' href='"+rowData.videoPic+"' ><img src='"+rowData.videoPic+"'></a>"
                    }},
                    {field: 'videoTitle', title: '标题', width: 194,overflowTitle:true, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'roomId', title: '房间', width: 78, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'custome-adv', title: '操作',width: 124, titleAlign: 'center',columnAlign:'center',componentName:'tableOpa',isResize:true},
                    {field: 'view', title: '观看数', width: 70, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'vote', title: '点赞数', width: 70, titleAlign: 'center',columnAlign:'center',isResize:true}
                ],
                tipData:null,
                downVideoId:'',
                downDateIndex:0,
            }
        },
        components:{
            dateTime,
            layer
        },
        methods:{
            //点击操作内容触发事件
        	customCompFunc(params){
                if (params.type === 'discharge'){   //下架
                    //请求下架接口
                    this.$store.commit('layer/updateTipData',{
                        showbox:'pattern-1',
                        con:"下架后用户再看不到了，确定下架视频吗？"
                    })
                    this.downVideoId = params.rowData['vid'];
                    this.downDateIndex = params.index;
                    this.$store.dispatch('layer/show');
                    this.$store.commit('layer/setSuccessCall',function(){
                        api.downVideoFn({vid:this.downVideoId})
                        .then(response => {
                            if(response.status == 200){
                                var data = response.data;
                                if(data.state == 0){
                                    this.$delete(this.tableData,this.downDateIndex);
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
                }else if (params.type === 'detailed'){  //查看详情
                    var item = params.rowData;
                    this.$store.commit('layer/updateTipData',{
                        showbox:'pattern-3',
                        con:[{
                          title:'发布时间：',
                          msg:item.publishTime
                        },{
                          title:'房间：',
                          msg:item.roomId 
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
                    this.$store.commit('layer/setSuccessCall', function(){});
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
                    str3: this.roomId,
                    videoTitle: this.videoTitle,
                    status:2,
                    pageSize: 20,
                    pageNum: this.activePage,
                    videoSource: 0
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
            /**
             * 获取观看记录
             */
            api.liveSeeCountFn({
                videoSource:0
            })
            .then(response => {
                if(response.status == 200){
                    var data = response.data;
                    if(data.state == 0){
                        this.weekCount = data.content.weekCount;
                        this.allCount = data.content.allCount;
                    }else{
                        console.log(data.message);
                    }
                }else{
                    console.log("请求失败");
                }
            })
            .catch(err => {

            })
            this.$store.dispatch('tableOpa/updateOpaList',[
                {content:'下架',style:{'color':'#4d9dfc'},type:'discharge'},
                {content:'查看详情',style:{'color':'#cc0000'},type:'detailed'}
            ])

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
    .condition-online-warp{
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
                &.room-input{
                    width: 90px;
                }
                &.bt-input{
                    width: 140px;
                }
            }
        }
        .ok-btn{
            float: left;
            margin-top: -3px;
            @extend .btn;
        }
    }
</style>
