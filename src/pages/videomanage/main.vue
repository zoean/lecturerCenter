<template>
	<div>
	   <headerPath :pathList="pathList">
			<router-link to="/uploadVideo" class="up-video">上传视频</router-link>
	   </headerPath>
	   <router-view/>
   	</div>
</template>

<script>
import headerPath from '@/components/headerPath'
export default {
	data(){
		return {
			pathList:[{
				path:'/video/auditing',
				title: '审核中'
			},{
				path:'/video/notpass',
				title: '未通过'
			},{
				path:'/video/online',
				title: '已上架'
			},{
				path:'/video/downline',
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
	.up-video{
		position: absolute;
		right: 35px;
		bottom: 12px;
		@extend .btn;
	}
	.main-table-warp{
		width:776px;
		margin-left:25px;
		margin-top: 25px;
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
