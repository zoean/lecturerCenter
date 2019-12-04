<template>
	<div>
	   <headerPath :pathList="pathList">
			<router-link to="/uploadaudio" class="up-video">+上传音频</router-link>
	   </headerPath>
	   <router-view/>
	   <div>{{num}}</div>
   	</div>
</template>

<script>
import headerPath from '@/components/headerPath'
import {mapState} from 'vuex'
export default {
	data(){
		return {
			pathList:[{
				path:'/audio/audioup',
				title: `已上架`
			},{
				path:'/audio/audioaudit',
				title: '审核中'
			},{
				path:'/audio/nothrough',
				title: '未通过'
			},{
				path:'/audio/audiodown',
				title: '已下架'
			}]
		}
	},
	components:{
		headerPath
	},
	computed:{
		...mapState('navNum', {
		    audioup: state => state.audioup
	  	}),
	  	num(){
	  		this.pathList[0].title = '已上架('+this.audioup+')'
	  	}
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
