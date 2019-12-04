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
		        @change="pagechange" v-if="pageNum>1">
		    </pagination>
		</div>
		<layer></layer>
    </div>
</template>

<script>
    import qs from 'qs'
    import api from '@/api/index'
    import layer from '@/components/layer'
    import {AIDEO_PLAY,AUDIT_RRESULT} from '@/utils/constant'
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
                columns: [
                    {field: 'downTime', title:'下架时间', width: 166, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'videoPic', title: '视频封面', width: 100, titleAlign: 'center',columnAlign:'center',isResize:true,
                    	formatter:(rowData,rowIndex,pagingIndex,field)=>{
                    			return "<a target='_blank' href='"+rowData.videoPic+"' ><img src='"+rowData.videoPic+"'></a>"
                    }},
                    {field: 'videoName', title: '视频名称', width: 180, titleAlign: 'center',columnAlign:'center',isResize:true,
                        formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return "<a style='color:#cc0000;text-decoration: underline;' target='_blank' href='"+AIDEO_PLAY+"?vid="+rowData.aliyunVideoId+"' >"+rowData.videoName+"</a>";
                    }},
                    {field: 'videoTitle', title: '标题', width: 194,overflowTitle:true, titleAlign: 'center',columnAlign:'center',isResize:true},
                    {field: 'albumId', title: '所属专辑',width: 100, titleAlign: 'center',columnAlign:'center',isResize:true,
                        formatter:(rowData,rowIndex,pagingIndex,field)=>{
                            return "<p style='color:rgb(204, 0, 0);cursor: pointer'>"+rowData.albumName+"</p>"
                        }
                    },
                    {field: 'custome-adv', title: '操作',width: 134, titleAlign: 'center',columnAlign:'center',componentName:'tableOpa',isResize:true},
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
                            sort:params.rowData['sort'],
                            videoPic:params.rowData['videoPic'],
                            albumName:params.rowData['albumName'],//专辑名称
                            model:params.rowData['model']//音频类型0免费1付费
                        }})

                }else if (params.type === 'detailed'){
					var item = params.rowData;
                    this.$store.commit('layer/updateTipData',{
                        showbox:item.downDesc == "讲师自行下架" ? 'pattern-3' : 'pattern-4',
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
                        },{
                          title:'下架时间：',
                          msg:item.downTime
                        }],
                        reason:item.downDesc == "讲师自行下架" ? "" : '原因：' + item.downDesc
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
                api.dateSetFn(qs.stringify({
                    status:4,
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
                {content:'查看详情',style:{'color':'#cc0000'},type:'detailed'},

                {content:'编辑',style:{'color':'#4d9dfc'},type:'edit'}
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
</style>
