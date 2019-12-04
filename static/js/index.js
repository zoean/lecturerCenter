// JavaScript Document
if(getCookie("guagua.authToken.login") == null && getCookie("login.authToken") == null ) {
	var host = location.hostname;
	var toLoginUrl = "//user." + getMainHost() + "/login/login_web.html?sUrl=http://";
	location.href=toLoginUrl + host;
}
// 一级菜单默认的二级菜单
var menuAry = {caifuguanli : "caifuxinxi"};

function initLeftMenuClick(){
	$("#left_nav h2").unbind("click");
	$("#left_nav h2").click(function(){
		var aul = $(this).next($("ul"));
		if(aul.css("display") == "none"){
			$("#left_nav ul").each(function(){
				$(this).css("display", "none");
			});
			aul.slideDown();
		}else{
			aul.slideUp();
		}
	});
	$("#left_nav h2").unbind("click");
	$("#left_nav h2").click(function(){
		if($(this).next().css("display") == "none"){
			$(this).next().slideDown();
			if(window._user.bindPhone == 0){
				addBubble('mima_bangdingshouji','绑手机领好礼')
			}
		}else{
			$(this).next().slideUp();
		}
	});
	$("#left_nav h3").unbind("click");
	$("#left_nav h3").click(function(){
		if($(this).next().css("display") == "none"){
			$(this).next().slideDown();
		}else{
			$(this).next().slideUp();		
		}
	});
	$("#left_nav h5").unbind("click");
	$("#left_nav h5").click(function(){
		if($(this).next().css("display") == "none"){
			$(this).next().slideDown();
		}else{
			$(this).next().slideUp();		
		}
	});
	var storage=window.localStorage;
	var isVueHash = /^#\/\w+/.test(location.hash);
	if(isVueHash){
		//如果是vue连接需要展示对应菜单选项
		var name = storage.getItem('urlClickCall');
		setTimeout(function(){
			$('#'+name).addClass('active').parents('ul').show();
		},2000)
	}else{
		var name = getQueryParam("name");
		if(name!=null && name!=''){ // 有name参数
			// 需要列表加载完成才可以做对应跳转
			setTimeout(function(){
				if($("#" + name).length > 0){
					document.getElementById(name).click();
					storage.setItem('urlClickCall',name);
				} else if(menuAry[name] && $("#" + menuAry[name]).length > 0){
					document.getElementById(menuAry[name]).click();
					storage.setItem('urlClickCall',name);
				}else{
					document.getElementById("mima_bangdingshouji").click();
					storage.setItem('urlClickCall',"mima_bangdingshouji");
				}
			},2000)
		}else{ //没有name参数
			document.getElementById("mima_bangdingshouji").click();
			storage.setItem('urlClickCall',"mima_bangdingshouji");
		}
	}
	setTimeout(function(){
		if(window._user.bindPhone == 0){
			addBubble('mima_bangdingshouji','绑手机领好礼')
		}
	},2500)
}
//导航显示气泡
function addBubble(id,msg){
	var top = $('#'+id).offset().top
	if($('#'+id).parent('li').children().length<=1&&top>0){
		var bubble = "<div class='bubbleBox'>"+msg+"</div>"
		$('#'+id).parent('li').append(bubble)
	}
}

function changeIframeHeight(height){
	document.getElementById("iframepage").height = height;
}

function appendMenu(cont){
	$("#left_nav").append(cont);
}

function chgMenu(url, menu, height){
	// if(height &&　height > 0)
	// 	document.getElementById("iframepage").height = height;
	var storage=window.localStorage;
	storage.setItem('urlClickCall',menu);
	$("#left_nav ul li a").each(function(){
		$(this).removeClass('active');
	});
	$("#" + menu).attr("class", "active");

	$("#" + menu).parent().parent().css("display", "block");
	if(url.indexOf('#')!=-1){
		location.href=url;
	}else{
		location.href = '/#/iframe?url='+url+'&iframeH='+height+'&random='+parseInt(Math.random()*10000);
	}
	// $('#iframepage').attr('src', url);
}



