<template>
	<div class="main-table-warp" style="width:776px;">
			<div class="condition-warp">
		   		<dateTime class="time-show-float" ref="dateTime"></dateTime>
		   		<div class="room-id">
		   			<span>房间ID：</span>
		   			<input type="text" v-model="roomId">
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
    import dateTime from '@/components/dateTimeSelect'
    import api from '@/api/index'
    import qs from 'qs'
    export default{
        data() {
            return {
	            pageNum : 0, //总页数， 默认1
	            activePage : 1, //当前页， 默认1
                roomId:'',
                tableData: [],
                columns: [
                    {field: 'createTime', title:'保存时间', width: 215, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'roomId', title: '房间ID', width: 150, titleAlign: 'center',columnAlign:'center',isResize:true},
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
                if (params.type === 'shipment'){ // do delete operation
                    this.$router.push({path:'/releaseVideo',
                        query:{
                            vid:params.rowData['vid'],
                            roomId:params.rowData['roomId'],
                            aliyunVideoId:params.rowData['aliyunVideoId'],
                            videoName: params.rowData['videoName']
                        }})
                }
            },
            columnCellClass(rowIndex,columnName,rowData){
            	if(columnName == "tel"){
            		return 'title-cell-class-name';
            	}
            },
            titleCellClass(rowIndex,columnName,rowData){
        		console.log(rowIndex,columnName,rowData)
            	return 'title-cell-class-name'
            },
            mchange(arg){
            	this.activePage = arg;
                this.getDate();
            },
            getDate(){
                api.dateSetFn(qs.stringify({
                    d1:(this.$store.state.dateTime.start !== 'Invalid DateTime')?this.$store.state.dateTime.start:'',//开始时间
                    d2:(this.$store.state.dateTime.end !== 'Invalid DateTime')?this.$store.state.dateTime.end:'',//结束时间
                    str3: this.roomId,
                    status:0,
                    pageSize: 20,
                    pageNum: this.activePage,
                    videoSource: 0
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
                {content:'发布',style:{'color':'#cc0000'},type:'shipment'}
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
			margin-left: 50px;
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
			float: right;
			@include basebox(100px, 34px, #4d9dfc, none, 5px);
			@include basefont(16px, 34px, #fff, center);
			margin-right: -18px;
		    margin-top: -3px;
		    cursor: pointer;
		}
    }
</style>