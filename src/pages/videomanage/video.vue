<template>
	<div  class="prism-player" ref="J_prismPlayer" id="J_prismPlayer" ></div>
</template>
<script>
	import api from '@/api/index'
    import qs from 'qs'
	export default{
		data(){
			return {

			}
		},
		methods:{
			
		},
		mounted(){
			api.videoPlayFn(qs.stringify({
				videoId: this.$route.query.videoId,
			}))
			.then(response=>{
				if(response.status == 200){
                    var data = response.data;
                    if(data.state == 0){
                    	console.log(1)
                     	var player = new Aliplayer({
					            id:'J_prismPlayer',
					            width: '100%',
					            autoplay: false,
					            height: 500,
					            //支持播放地址播放,此播放优先级最高
					            vid : this.$route.query.videoId,
					            playauth : data.obj[this.$route.query.videoId].auth,
					            cover: 'http://liveroom-img.oss-cn-qingdao.aliyuncs.com/logo.png',  
					        })
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
	}
</script>
<style scoped type="text/css">
.prism-player{
	height: 600px;
}
</style>