export default {
	namespaced: true,
	state:{
		audioup:0
	},
	mutations: {
		audioUp(state,msg){
			state.audioup = msg;
		}
	},
	actions: {
		audioUp({commit, state, dispatch}, msg){
			commit('audioUp',msg);
		}
	}
}

