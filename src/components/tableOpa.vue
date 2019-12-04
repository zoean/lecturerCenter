<template>
		<span class="show-opa">
	    	<a v-for="item in opaList" :style="item.style" href="">
				<a href="" class="tableSty" :style="item.style" @click.stop.prevent="details(rowData,item.type,index)" v-show="item.permissFlag === undefined">{{item.content}}</a>
				<a href="" class="tableSty" :style="item.style" @click.stop.prevent="details(rowData,item.type,index)" v-show="(item.permissFlag === 'album')&&((item.type == 'see')//查看
					  ||(item.type == 'discharge'&&rowData.type == 0&&rowData.status == 0)//下架
					  ||(item.type == 'upcharge'&&rowData.type == 0&&rowData.status == 1)//上架
					  ||(item.type == 'edit')//编辑
					  ||(item.type == 'delete'&&rowData.type == 0)//删除
					  ||(item.type == 'stop'&&rowData.type == 1&&rowData.saleStatus == 1)//停售
					  ||(item.type == 'recovery'&&rowData.type == 1&&rowData.saleStatus == 0 && rowData.originalPrice)//恢复销售
					  )">{{item.content}}</a>

				<a href="" class="tableSty" :style="item.style" @click.stop.prevent="details(rowData,item.type,index)" v-show="(item.permissFlag === 'details')&&(//视频专辑详情页
				  (rowData.status == 2 && item.type[0] == 'discharge')//下架
				||(rowData.status == 4 && item.type[0] == 'edit')//免费 已下架
				||(rowData.status == 2 && rowData.model == 1 && item.type[0] == 'qxcourse')//取消试听课
				||(rowData.status == 2 && rowData.model == 2 && item.type[0] == 'szcourse')//设置试听课 
				)">{{item.content}}</a>


				<a href="" class="tableSty" :style="item.style" @click.stop.prevent="details(rowData,item.type,index)" v-show="(item.permissFlag === 'audioalbum')&&(//音频专辑列表页
				  (rowData.status == 1 && rowData.albumType==1 && item.type === 'discharge')//下架
				||(rowData.status == 2 && rowData.albumType==1 && item.type === 'upcharge')//上架
				||(item.type === 'see')//查看
				||(item.type === 'edit')//编辑
				||(item.type === 'delete' && rowData.albumType==1)//删除
				||(item.type === 'stop' && rowData.albumType==2 && rowData.saleStatus==1)//停售
				||(item.type === 'recovery' && rowData.albumType==2 && rowData.saleStatus==9 && rowData.originalPrice)//恢复销售
				)">{{item.content}}</a>

				<a href="" class="tableSty" :style="item.style" @click.stop.prevent="details(rowData,item.type,index)" v-show="(item.permissFlag === 'audioalbumsee')&&(//音频专辑详情页
				  (rowData.status == 2 && item.type[0] == 'discharge')//下架
				||(rowData.status == 4 && item.type[0] == 'edit')//编辑
				||(rowData.status == 2 && rowData.audioModel == 3 && item.type[0] == 'qxcourse')//取消试听课
				||(rowData.status == 2 && rowData.audioModel == 2 && item.type[0] == 'szcourse')//设置试听课 
				)">{{item.content}}</a>

			</a>
	    </span>
</template>
<script>
//按钮显示权限目前通过permissFlag手动控制，默认不传，都显示
//album--视频专辑列表按钮权限
//details--视频专辑详情页按钮权限
	export default{
		computed: {
			opaList:vm=>vm.$store.state.tableOpa.opaList
		},
		props:{
            rowData:{
                type:Object
            },
            field:{
                type:String
            },
            index:{
                type:Number
			}
		},
        methods:{
            details(arg,arg1,arg2){
               // 参数根据业务场景随意构造
               let params = {type:arg1,index:this.index,rowData:this.rowData};
               this.$emit('on-custom-comp',params);
            }
		}
	}
</script>
<style  lang="scss" scoped type="text/css">
	.show-opa{
		.tableSty{
			margin-left:5px;
		}
		a{
			// border-right:1px solid #d2d2d2;
			// padding:0 5px;
			&:last-child{
				border: none;
			}
		}
	}
</style>