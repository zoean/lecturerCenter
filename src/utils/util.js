export default{
	checkIE(){
	  return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style
	},
	hasSensitiveWords(arg){
		let hasKeyWord = [];
		this.keyWords.forEach((el, index) => {
			this[arg].indexOf(el)!=-1 && hasKeyWord.push(el);
		});
		if(hasKeyWord.length > 0){
			this.$store.commit('layer/updateTipData',{
				showbox: 'pattern-2',
				con:[
					{
						msg: '填写的内容含有以下违禁词，请重试'
					},
					{
						msg:hasKeyWord.join(','),
						color: 'color:#cc0000'
					}
				]
			})
			this.$store.dispatch('layer/show');
			return true;
		}
		return false;
	}


}