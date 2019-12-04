<template>
	<div class="main-table-warp" style="width:776px;">
			<div class="condition-warp">
		   		<dateTime class="time-show-float"></dateTime>
		   		<div class="room-id">
		   			<span>房间：</span>
		   			<input type="text" v-model="roomid">
		   		</div>
		   		<span class="ok-btn" @click="getDate">
		   			确定
		   		</span>
		   	</div>
		<v-table
			:column-cell-class-name="columnCellClass"
	        is-horizontal-resize
	        style="width:100%;"
	        :row-height="48"
			:title-row-height="50"
	        :columns="columns"
	        :table-data="tableData" 
	        row-hover-color="#eee"
	        row-click-color="#edf7ff"
	        @on-custom-comp="customCompFunc"
	    ></v-table>
	    <pagination class="center-pagination"
	        :page-num="pageNum"
	        :current-page="activePage"
	        @change="mchange" v-if="pageNum > 1">
	    </pagination>
	</div>
</template>

<script>

    import Vue from 'vue'
    import dateTime from '@/components/dateTimeSelect'
    import api from '@/api/index'
    import qs from 'qs'
    export default{
        data() {
            return {
	            pageNum : 0, //总页数， 默认1
	            activePage : 0, //当前页， 默认1
                roomid:'',
                tableData: [],
                columns: [
                    {field: 'id', title:'订单编号', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'productName', title: '产品名称', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'versionType', title:'产品版本', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'actualPrice', title: '订单金额', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'payStatus', title:'订单状态', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'userGgid', title: '用户ID', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'userName', title:'用户昵称', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'addDatetime', title: '订单创建时间', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'startDatetime', title: '服务开始时间', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'expireDatetime', title: '服务结束时间', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'days', title: '剩余服务时间', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'custome-adv', title: '操作',width: 130, titleAlign: 'center',columnAlign:'center',componentName:'tableOpa',isResize:true}
                ]
            }
        },
        components:{
			dateTime
        },
        methods:{
        	//点击操作内容触发事件
            customCompFunc(params){
                if (params.type === 'shipment'){ 
                    this.$router.push({path:'/releaseVideo',
                        query:{
                            vid:params.rowData['vid'],
                            roomId:params.rowData['roomId'],
                            aliyunVideoId:params.rowData['aliyunVideoId'],
                            videoName: params.rowData['videoName']
                        }})
                }else if(params.type === 'delete'){
                    this.tableData.shift();
                }
            },
            columnCellClass(rowIndex,columnName,rowData){
            	if(columnName == "tel"){
            		return 'title-cell-class-name';
            	}
            },
            titleCellClass(rowIndex,columnName,rowData){
            	return 'title-cell-class-name'
            },
            mchange(arg){
            	this.activePage = arg;
                this.getDate();
            },
            getDate(){
                api.gyFn(qs.stringify({
                    pageSize:10, 
                    pageNum:this.activePage
                }))
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
                {content:'发布',style:{'color':'#cc0000'},type:'shipment'},
                {content:'删除',style:{'color':'#cc0000'},type:'delete'}
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
    .condition-warp{
    	@extend .clear;
    	margin-bottom: 23px;
    	.time-show-float{
    		float: left;

    	}
    	.room-id{
			float: left;
			font-size: 0;
			margin-left: 65px;
			span{
				@include basefont(16px, 28px, #333);
			}
			input{
				box-sizing: border-box;
				@include basebox(100px, 28px, #fff, 1px solid #d6d6d6);
				@include basefont(16px, 28px, #333);
				padding:0 12px;
			}
		}
		.ok-btn{
			float: left;
			@include basebox(100px, 34px, #4d9dfc, none, 5px);
			@include basefont(16px, 34px, #fff, center);
			margin-left: 43px;
		    margin-top: -4px;
		    cursor: pointer;
		}
    }
</style>