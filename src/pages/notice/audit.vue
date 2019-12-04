<template>
	<div class="table-wrap">
		<div class="main-table-warp" style="width: 885px;">
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
		<layer>
            </layer>
    </div>
</template>

<script>
    import qs from 'qs'
    import api from '@/api/index'
    import layer from '@/components/layer'
    import {AIDEO_PLAY,AUDIT_RRESULT} from '@/utils/constant'
    export default{
    	components:{
			layer
    	},
        data() {
            return {
            	pageNum:1,
            	activePage:1,
                tableData: [],
                columns: [
                    {field: 'videoName', title:'视频名称', width: 166, titleAlign: 'center',columnAlign:'center',isResize:true,
                        formatter:(rowData,rowIndex,pagingIndex,field)=>{
                                return "<a style='color:#cc0000;text-decoration: underline;' target='_blank' href='"+AIDEO_PLAY+"?videoId="+rowData.video.aliyunVideoId+"' >"+rowData.video.videoName+"</a>";
                    }},
                    {field: 'auditResult', title: '审核结果', width: 180, titleAlign: 'center',columnAlign:'center',isResize:true,
                    	formatter:(rowData,rowIndex,pagingIndex,field)=>{
                    			return AUDIT_RRESULT[rowData.auditResult]
                    }},
                    {field: 'auditDatetime', title: '通知时间', width: 194,overflowTitle:true, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'custome-adv', title: '操作',width: 134, titleAlign: 'center',columnAlign:'center',componentName:'tableOpa',isResize:true},
                ],
                tipData:null
            }
        },
        methods:{
            //点击操作内容触发事件
        	customCompFunc(params){
                if (params.type === 'detailed'){
					var item = params.rowData;
                    console.log(item)
                    this.$store.commit('layer/updateTipData',{
                        showbox:(item.auditResult == undefined || item.auditResult == "") && (item.resultDesc == undefined || item.resultDesc == "") ? 'pattern-3' : 'pattern-4',
                        con:[{
                          title:'视频名称：',
                          msg:'<a href="'+this.AIDEO_PLAY+'?vid='+item.video.aliyunVideoId+'" target="_blank" style="color:#cc0000;text-decoration: underline;">'+item.video.videoName+'</a>'
                        },{
                          title:'标题：',
                          msg:item.video.videoTitle
                        },{
                          title:'标签：',
                          msg:item.video.typeName
                        },{
                          title:'简介：',
                          msg:item.video.videoRemark == "" ? "无" : item.video.videoRemark
                        }],
                        result:item.auditResult == "" || item.auditResult == undefined ? "" : '审核结果：'+ AUDIT_RRESULT[item.auditResult],
                        reason:item.resultDesc == "" || item.resultDesc == undefined ? "" : '原因：' + item.resultDesc
                    });
                    this.$store.dispatch('layer/show');

                }
        	},
        	pagechange(arg){
        		this.activePage = arg;
                this.getDate();
        	},
            columnCellClass(rowIndex,columnName,rowData){
            	if(columnName == "videoName"){
            		return 'title-cell-class-name';
            	}
            },
            getDate(){
                api.eorkOrderFn({
                    pageSize: 20,
                    pageNum: this.activePage
                })
                .then(response=>{
                    if(response.status == 200){
                        var data = response.data;
                        if(data.state == 0){
                            this.tableData = data.content.list;
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
                {content:'查看详情',style:{'color':'#cc0000'},type:'detailed'},
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
    .table-wrap{
        padding-left: 20
    }
</style>
