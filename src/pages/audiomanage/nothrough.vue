<template>
		<div class="main-table-warp" style="width: 915px;">
            <div class="condition-video-online-warp">
                <div class="room-id">
                    <span>标题：</span>
                    <input type="text" class="bt-void-input" v-model="audioTitle">
                </div>
                <div class="select-warp">
                    <span class="slect-tip">所属专辑：</span>
                    <select v-model="selectedAlbum">
                        <option value="">请选择专辑</option>
                         <option v-for="item in albumList" :value="item.id">{{item.title}}</option>
                    </select>
                </div> 
                <span class="ok-btn" @click="getDate" style="margin-top:-5px;">
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
	            :row-click="rowClick"
	    	></v-table>
			<pagination class="center-pagination"
		        :page-num="pageNum"
		        :current-page="activePage"
		        @change="pagechange"  v-if="pageNum>1">
		    </pagination>
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
                tableData: [],//已上架列表
                albumList:[],//专辑列表
                audioTitle:'',//标题
                selectedAlbum:'',//专辑
                selectedRank:'',//排序
                sort:'',
                columns: [
                    {field: 'id', title:'序号', width: 60, titleAlign: 'center',columnAlign:'center',isResize:true,
                        formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return (rowIndex+1);
                    }},
                    {field: 'updateTime', title: '审核时间',width: 140, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'title', title:'音频标题', width: 150, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'name', title: '音频名称', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true,
                        formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return "<a style='color:#4d9dfc;text-decoration: underline; cursor:pointer;' target='_blank' audioId='"+rowData.id+"'>"+rowData.name+"</a>";
                    }},
                    {field: 'albumTitle', title: '所属专辑', width: 163, titleAlign: 'center',columnAlign:'center',isResize:true,
                        formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return "<a style='color:#4d9dfc;text-decoration: underline; cursor:pointer;' target='_blank'>"+rowData.albumTitle+"</a>";
                    }},
                    {field: 'custome-adv', title: '操作',width: 124, titleAlign: 'center',columnAlign:'center',componentName:'tableOpa',isResize:true},
                ],
                downDateIndex:0,
            }
        },
        methods:{
        	//音频播放
        	rowClick(rowIndex, rowData, column){
        		if(column.field=="name"){
        			api.audioPlayFn({
        				id:rowData.id
        			})
        			 .then(response=>{
        			 	if(response.status == 200){
	                        var data = response.data;
	                        if(data.state == 0){
	                            this.$store.commit('layer/updateTipData',{
				                        showbox:'pattern-5',
				                        url:response.data.content.playUrl
				                  })
	                             this.$store.dispatch('layer/show');
	                        }else{
	                            console.log(data.message);
	                        }
	                    }else{
	                        console.log("请求失败");
	                    }
        			 });
        		}
        		if(column.field == 'albumTitle'){
                    let param = {
                        albumId:rowData.albumId
                    }
                    this.$router.push({name:'audioalbumsee',query:param})
                }
        		
        	},
            //点击操作内容触发事件===查看详情
        	customCompFunc(params){
        		if (params.type === 'edit'){   //编辑后上传
                    let param = {
                            id:params.rowData['id'],
                            aliId:params.rowData['aliId'],//阿里云ID
                            name: params.rowData['name'],
                            albumId: params.rowData['albumId'],
                            title:params.rowData['title'],
                            sort:params.rowData['sort'],
                            albumTitle:params.rowData['albumTitle'],
                            audioModel:params.rowData['audioModel'],//音频类型1免费2付费
                            status:params.rowData['status']//音频状态 1-审核中 3-未通过审核
                        }
                    this.$router.push({path:'/uploadaudio',
                        query:{param:JSON.stringify(param)}})

                }else if (params.type === 'detailed'){
                    var item = params.rowData;
                    this.$store.commit('layer/updateTipData',{
                        showbox:'pattern-3',
                        con:[{
                          title:'创建时间：',
                          msg:item.updateTime
                        },{
                          title:'所属专辑：',
                          msg:item.albumTitle
                        },{
                          title:'音频名称：',
                          msg:item.name
                        },{
                          title:'音频标题：',
                          msg:item.title
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
                api.dateAudioListFn({
                	type:3,//未通过查询 
                    //d1:(this.$store.state.dateTime.start !== 'Invalid DateTime')?this.$store.state.dateTime.start:'',//开始时间
                    //d2:(this.$store.state.dateTime.end !== 'Invalid DateTime')?this.$store.state.dateTime.end:'',//结束时间
                    audioTitle: this.audioTitle,//标题
                    albumId:this.selectedAlbum,//专辑id
                    //sort: this.selectedRank,//排序
                    size: 20,
                    page: this.activePage
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
               
                {content:'查看详情',style:{'color':'#4d9dfc'},type:'detailed'},
                 {content:'编辑上传',style:{'color':'#4d9dfc'},type:'edit'}
            ])
             /**
             * 获取音频列表
             */
            api.dateAudioListFn({
            	type:3
            })
                .then(response=>{
                    if(response.status == 200){
                        var data = response.data;
                        if(data.state == 0){
                            this.tableData = data.content.list;
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
            api.audioAlbumFn()
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
.container{
	margin-top:20px;
}
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
            margin-left:5px;
            margin-top:20px;
        }
        .room-id{
            float: left;
            font-size: 0;
            margin-left: 5px;
            span{
                @include basefont(16px, 28px, #333);
            }
            input{
                box-sizing: border-box;
                @include basebox(100px, 28px, #fff, 1px solid #d6d6d6);
                @include basefont(16px, 28px, #333);
                padding:0 12px;
                &.bt-void-input{
                    width: 150px;
                }
            }
        }
        .select-warp{
            float: left;
            margin-left: 30px;
            margin-top:0;
            @extend .clear;
                select{
                    width: 140px;
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
            float: left;
            margin-top:16px;
            @extend .btn;
        }
    }
</style>
