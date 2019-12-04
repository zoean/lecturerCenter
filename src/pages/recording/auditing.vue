<template>
	<div>
		<div class="main-table-warp" style="width:776px;">
			<v-table
				is-horizontal-resize
	            style="width:100%;"
                :row-height="48"
                :title-row-height="50"
	            :column-cell-class-name="columnCellClass"
	            :columns="columns"
	            :table-data="tableData"
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
import Vue from 'vue'
import api from '@/api/index'
import layer from '@/components/layer'
import {mapActions,mapState} from 'vuex'
import qs from 'qs'
import {AIDEO_PLAY} from '@/utils/constant'
    export default{
    	components:{
			layer
    	},
        data() {
            return {
            	pageNum:0,
            	activePage:1,
                tableData: [
                 ],
                columns: [
                    {field: 'createTime', title:'创建时间', width: 175, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'videoPic', title: '视频封面', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true,
                    	formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return "<a target='_blank' href='"+rowData.videoPic+"' ><img src='"+rowData.videoPic+"'></a>"
                    }},
                    {field: 'videoTitle', title: '标题', width: 194,overflowTitle:true, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'roomId', title: '房间ID', width: 110, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'custome-adv', title: '操作',width: 132, titleAlign: 'center',columnAlign:'center',componentName:'tableOpa',isResize:true}
                ],
            }
        },
        methods:{

            //点击操作内容触发事件
        	customCompFunc(params){
                if (params.type === 'detailed'){
                    var item = params.rowData;
                    this.$store.commit('layer/updateTipData',{
                        showbox:'pattern-3',
                            con:[{
                              title:'创建时间：',
                              msg:item.createTime
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
                    this.showTip();
                }
        	},
            ...mapActions('layer',{
              showTip: 'show',
              closeTip: 'close'
            }),
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
            this.$store.dispatch('tableOpa/updateOpaList',[
                {content:'查看详情',style:{'color':'#cc0000'},type:'detailed',permissFlag:'album'}
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
