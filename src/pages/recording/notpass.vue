<template>
	<div>
		<div class="main-table-warp" style="width: 822px;">
			<v-table
				is-horizontal-resize
	            style="width:100%;"
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
    import dateTime from '@/components/dateTimeSelect'
    import api from '@/api/index'
    import layer from '@/components/layer'
    import qs from 'qs'
    import {AUDIT_RRESULT,AIDEO_PLAY} from '@/utils/constant'
    export default{
    	components:{
			layer
    	},
        data() {
            return {
            	pageNum:0,
            	activePage:1,
                tableData: [],
                columns: [
                    {field: 'auditDatetime', title:'审核时间', width: 175, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'videoPic', title: '视频封面', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true,
                    	formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return "<a target='_blank' href='"+rowData.videoPic+"' ><img src='"+rowData.videoPic+"'></a>"
                    }},
                    {field: 'videoTitle', title: '标题', width: 194,overflowTitle:true, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'roomId', title: '房间ID', width: 113, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'custome-adv', title: '操作',width: 178, titleAlign: 'center',columnAlign:'center',componentName:'tableOpa',isResize:true},
                ]
            }
        },
        methods:{
            //点击操作内容触发事件
        	customCompFunc(params){
        		console.log(params);
                if (params.type === 'edit'){ //编辑后上传
                    this.$router.push({path:'/releaseVideo',
                        query:{
                            vid:params.rowData['vid'],
                            roomId:params.rowData['roomId'],
                            aliyunVideoId:params.rowData['aliyunVideoId'],
                            videoName: params.rowData['videoName'],
                            typeId: params.rowData['typeId'],
                            videoTitle:params.rowData['videoTitle'],
                            videoRemark:params.rowData['videoRemark'],
                            videoPic:params.rowData['videoPic']
                        }})
                }else if (params.type === 'detailed'){
                    var item = params.rowData;
                    this.$store.commit('layer/updateTipData',{
                        showbox:(item.auditResult == undefined || item.auditResult == "") && (item.resultDesc == undefined || item.resultDesc == "") ? 'pattern-3' : 'pattern-4',
                        con:[{
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
                        result:item.auditResult == "" || item.auditResult == undefined ? "" : '审核结果：'+ AUDIT_RRESULT[item.auditResult],
                        reason:item.resultDesc == "" || item.resultDesc == undefined ? "" : '原因：' + item.resultDesc
                    })
                    this.$store.dispatch('layer/show');
                }
        	},
        	pagechange(arg){
        		this.activePage = arg;
                this.getDate();
        	},
            getDate(){
                api.dateSetFn(qs.stringify({
                    pageSize: 20,
                    pageNum: this.activePage,
                    status:3,
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
            },
            getVoucher(fileName,fn){
                api.getVoucherFn(qs.stringify({
                    fileName:fileName,
                    title:"呱呱财经"
                }))
                .then(response => {
                    console.log(response)
                    if(response.status == 200){
                        var data = response.data;
                        if(data.state == 0){
                             this.uploadAuth = data.obj.uploadAuth;
                             this.uploadAddress = data.obj.uploadAddress;
                             this.videoId = data.obj.videoId;
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
            this.$store.dispatch('tableOpa/updateOpaList',[
                {content:'编辑后提交',style:{'color':'#4d9dfc'},type:'edit'},
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
</style>
