//获取当前用户浏览器版本
function getBrowserInfo(){
    var agent = navigator.userAgent.toLowerCase() ;
    var regStr_ie = /msie [\d.]+;/gi ;
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi ;
    var regStr_saf = /safari\/[\d.]+/gi ;
    //IE11以下
    if(agent.indexOf("msie") > 0)
    {
        // return agent.match(regStr_ie) ;
        return 'IE11以下';
    }
    //IE11版本中不包括MSIE字段
    if(agent.indexOf("trident") > 0&&agent.indexOf("rv") > 0){
        return "IE " + agent.match(/rv:(\d+\.\d+)/) [1];
    }
    //firefox
    if(agent.indexOf("firefox") > 0)
    {
        return agent.match(regStr_ff) ;
    }
    //Chrome
    if(agent.indexOf("chrome") > 0)
    {
        return agent.match(regStr_chrome) ;
    }
    //Safari
    if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0)
    {
        return agent.match(regStr_saf) ;
    }
}
function getUrlVerify(url){
	try{
		var domainUrl = window.location.href
		if(domainUrl.indexOf('ggcj.com') != -1){
			domainUrl = 'ggcj.com'
		}else if(domainUrl.indexOf('ggcj.cn') != -1){
			domainUrl = 'ggcj.cn'
		}
		if(url.indexOf('ggcj.com') == -1&&url.indexOf('ggcj.cn') == -1){
			return url
		}else if(url.indexOf('ggcj.com') != -1){
			return url.replace('ggcj.com',domainUrl)
		}else if(url.indexOf('ggcj.cn') != -1){
			return url.replace('ggcj.cn',domainUrl)
		}
	}catch(err){
		return url
	}
}
export default {//导出这个函数
    getBrowserInfo,
    getUrlVerify
}