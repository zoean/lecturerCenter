export default{
	namespaced: true,
	state:{
		videoId:'',
		videoName:'',
		typeId:'',
		videoTitle:'',
		videoRemark:'',
		videoPic:'',
		imgRegion:'',
		albumId:'',
		sort:''
	},
	mutations: {
		updateVideoSort(state,msg){
			state.sort = msg;
		},
		updateVideoName(state,msg){
			state.videoName = msg;
		},
		updateTypeId(state,msg){
			state.typeId = msg;
		},
		updateVideoTitle(state,msg){
			state.videoTitle = msg;
		},
		updateVideoRemark(state,msg){
			state.videoRemark = msg;
		},
		updateVideoPic(state,msg){
			state.videoPic = msg;
		},
		updateImgRegion(state,msg){
			state.imgRegion = msg;
		},
		updateAlbumId(state,msg){
			state.albumId = msg;
		},
		updateVideoId(state,msg){
			state.videoId = msg;
		},
		initVideoState(state){
			state.videoName = "";
			state.typeId = "";
			state.videoTitle = "";
			state.videoRemark = "";
			state.videoPic = "";
			state.imgRegion = "";
			state.videoId = "";
			state.albumId = "";
			state.sort = "";
		}
	},
	actions: {
		updateVideoSort({commit, state, dispatch},msg){
			commit('updateVideoSort',msg);
		},
		updateVideoName({commit, state, dispatch},msg){
			commit('updateVideoName',msg);
		},
		updateTypeId({commit, state, dispatch},msg){
			commit('updateTypeId',msg);
		},
		updateVideoTitle({commit, state, dispatch},msg){
			commit('updateVideoTitle',msg);
		},
		updateVideoRemark({commit, state, dispatch},msg){
			commit('updateVideoRemark',msg);
		},
		updateVideoPic({commit, state, dispatch},msg){
			commit('updateVideoPic',msg);
		},
		updateImgRegion({commit, state, dispatch},msg){
			commit('updateImgRegion',msg);
		},
		updateAlbumId({commit, state, dispatch},msg){
			commit('updateAlbumId',msg);
		}
	}
}