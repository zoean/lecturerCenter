import { DateTime } from 'luxon'

export default{
	namespaced: true,
	state:{
		start:"",
		end:""
	},
	mutations: {
		clear(state){
			state.start = "";
			state.end = "";
		},
		setStartTime(state,msg){
			state.start = DateTime.fromISO(msg).toFormat("yyyy-MM-dd HH:mm:ss");
		},
		setEndTime(state,msg){
			state.end = DateTime.fromISO(msg).toFormat("yyyy-MM-dd HH:mm:ss");
		}
	},
	actions: {
		clear({commit, state, dispatch},msg){
			commit('clear');
		},
		setStartTime({commit, state, dispatch},msg){
			commit('setStartTime',msg);
		},
		setEndTime({commit, state, dispatch},msg){
			commit('setEndTime',msg);
		}
	}
}