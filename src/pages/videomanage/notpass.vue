<template>
	<div>
		<div class="main-table-warp" style="width: 930px;">
        <div class="condition-video-online-warp2">
                <div class="room-id">
                    <span>标题：</span>
                    <input type="text"  v-model="videoTitle">
                </div>
                <div class="select-warp2">
                    <span class="slect-tip">所属专辑：</span>
                    <select v-model="selectedAlbum">
                        <option :value="''">请选择专辑</option>
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
	            @on-custom-comp="customCompFunc"
                :row-click="rowClickBack"
	    	></v-table>
			<pagination class="center-pagination"
		        :page-num="pageNum"
		        :current-page="activePage"
		        @change="pagechange"  v-if="pageNum>1">
		    </pagination>
		</div>
		<layer :tip-data="tipData">
        </layer>
    </div>
</template>

<script>
    import api from '@/api/index'
    import layer from '@/components/layer'
    import qs from 'qs'
    import {AIDEO_PLAY,AUDIT_RRESULT,UPLOAD_MODIFY_FILE} from '@/utils/constant'
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
                selectedAlbum: '',
                albumList:[],
                sort:'',
                columns: [
                    {field: 'auditDatetime', title:'审核时间', width: 174, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'videoPic', title: '视频封面', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true,
                    	formatter:(rowData,rowIndex,pagingIndex,field)=>{
                    			return "<a target='_blank' href='"+rowData.videoPic+"' ><img src='"+rowData.videoPic+"'></a>"
                    }},
                    {field: 'videoName', title: '视频名称', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true,
                        formatter:(rowData,rowIndex,pagingIndex,field)=>{
                                return "<a style='color:#cc0000;text-decoration: underline;' target='_blank' href='"+AIDEO_PLAY+"?vid="+rowData.aliyunVideoId+"' >"+rowData.videoName+"</a>";
                    }},
                    {field: 'videoTitle', title: '标题', width: 170, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'albumId', title: '所属专辑',width: 100, titleAlign: 'center',columnAlign:'center',isResize:true,
                        formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return "<p style='color:rgb(204, 0, 0);cursor: pointer'>"+rowData.albumName+"</p>"
                        }
                    },
                    {field: 'custome-adv', title: '操作',width: 145, titleAlign: 'center',columnAlign:'center',componentName:'tableOpa',isResize:true}
                ],
                tipData:null,
                downVideoId:''
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
        		if (params.type === 'edit'){   //编辑后上传
                    this.$router.push({path:'/uploadVideo',
                        query:{
                            uploadType:2,
                            vid:params.rowData['vid'],//阿里云ID
                            aliyunVideoId:params.rowData['aliyunVideoId'],
                            videoName: params.rowData['videoName'],
                            albumId: params.rowData['albumId'],
                            videoTitle:params.rowData['videoTitle'],
                            videoRemark:params.rowData['videoRemark'],
                            videoPic:params.rowData['videoPic'],
                            albumName:params.rowData['albumName'],
                            sort:params.rowData['sort'],
                            model:params.rowData['model'],//音频类型0免费1付费
                            status: params.rowData['status']//视频状态 3-未通过审核
                        }})
                }else if (params.type === 'detailed'){  //查看详情
                    var item = params.rowData;

                    this.$store.commit('layer/updateTipData',{
                        showbox:(item.auditResult == undefined || item.auditResult == "") && (item.resultDesc == undefined || item.resultDesc == "") ? 'pattern-3' : 'pattern-4',
                        con:[{
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
                        result:item.auditResult == "" || item.auditResult == undefined ? "" : '审核结果：'+ AUDIT_RRESULT[item.auditResult],
                        reason:item.resultDesc == "" || item.resultDesc == undefined ? "" : '原因：' + item.resultDesc
                    })
                    this.$store.dispatch('layer/show');
                }
        	},
        	pagechange(arg){
                this.activePage = arg;
        	},
            columnCellClass(rowIndex,columnName,rowData){
            	if(columnName == "hobby"){
            		return 'title-cell-class-name';
            	}
            },
            getDate(){
                api.dateSetFn(qs.stringify({//列表接口
                    status:3,
                    pageSize: 20,
                    pageNum: this.activePage,
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
                {content:'编辑后提交',style:{'color':'#4d9dfc'},type:'edit'},
                {content:'查看详情',style:{'color':'#cc0000'},type:'detailed'}
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
