<template>
	<div>
	   <headerPath :pathList="pathList">
			<router-link to="/audioaddalbum" class="up-video">+新建专辑</router-link>
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
				path:'/audioalbum/albumlist',
				title: '专辑列表'
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
