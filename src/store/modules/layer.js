export default {
	namespaced: true,
	state:{
		isShow:false,
		tipData:null,
		successCall:null,
		cancelCall:null
	},
	mutations: {
		updateIsShow(state,msg){
			state.isShow = msg;
		},
		updateTipData(state, msg){
			state.tipData = msg;
		},
		setSuccessCall(state, fn){
			if(fn!=null){
				if(typeof fn == "function"){
					state.successCall = fn;
				}else{
					console.log('参数必须是方法')
					return ;
				}
			}else{
				state.successCall = function(){
					console.log('没有设置确定回调')
				}
			}
		},
		setCancelCall(state, fn){
			if(fn!=null){
				if(typeof fn == "function"){
					state.cancelCall = fn;
				}else{
					console.log('参数必须是方法')
				}
			}else{
				state.cancelCall = function(){
					console.log('没有设置取消回调')
				}
			}
		},
	},
	actions: {
		show({commit, state, dispatch}, msg){
			commit('updateIsShow',true);
		},
		close({commit, state, dispatch}, msg){
			commit('updateIsShow', false);
		},
		exeSuccessCall({commit, state, dispatch}, msg){
			state.successCall !=null && state.successCall();
			commit('setSuccessCall', null);
		},
		exeCancelCall({commit, state, dispatch}, msg){
			state.cancelCall !=null && state.cancelCall();
			commit('setCancelCall', null);
		},
	}
}

