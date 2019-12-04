<template>
	<div>
	   <headerPath :pathList="pathList"></headerPath>
	   <router-view/>
   	</div>
</template>

<script>
import headerPath from '@/components/headerPath'
export default {
	data(){
		return {
			pathList:[{
				path:'/recording/unpublished',
				title: '未发布'
			},{
				path:'/recording/auditing',
				title: '审核中'
			},{
				path:'/recording/online',
				title: '已上架'
			},{
				path:'/recording/notpass',
				title: '未通过'
			},{
				path:'/recording/downline',
				title: '已下架'
			}]
		}
	},
	components:{
		headerPath
	}
}
</script>

<style lang="scss" type="text/css">
	.main-table-warp{
		width:776px;
		margin-left:25px;
		margin-top: 25px;
	}
	.v-table-body-cell{
		span{
			img{
				height: 45px;
				width: 75px;
				margin-top: 1px;
			}
		}
		
	}
	.title-cell-class-name{
	    div{
	    	span{
	    		color:#cc0000;
	    	}
	    }
	}
	#app .v-pagination .v-page li.active{
	    background: #cc0000;
	    border-color: #cc0000;
	}
	#app .v-pagination .btn-next,#app .v-pagination .btn-prev{
		font-size:30px;
	}
	#app .v-pagination .btn-next a,#app .v-pagination .btn-prev a{
		line-height: 28px;
	}
	#app .v-pagination .v-select-page .v-pagination-ipt:focus{
		    border-color: #cc0000;
	}
	.center-pagination{
		display: flex;
		margin-top: 25px;
	    justify-content: center;
	}
</style>
