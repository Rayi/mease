//主对象
var Mease = (typeof Mease != 'undefined')? Mease : {version:"0.0.5"};
var Weibo = (typeof Weibo != 'undefined')? Weibo : {};

// 设定最小最大尺寸
window.nativeWindow.minSize = new air.Point(330,255);
window.nativeWindow.maxSize = new air.Point(900,800);

var resizeTimer = null;

function toggleWindow(){
	//nativeWindow.maximize();
	if(window.nativeWindow.width < 600) {
		window.nativeWindow.width = 600;
	}else {
		window.nativeWindow.width = 330;
	}
}

window.addEventListener('dragenter',function(event){ 
    event.preventDefault();
	event.dataTransfer.effectAllowed = "copy"; 
	event.dataTransfer.effectAllowed = "all"; 
})
window.addEventListener('dragover',function(event){ 
    event.preventDefault();
})
window.addEventListener('drop',function(event){
	event.preventDefault();
	for(var i in event)
	{
		//air.trace("drop in " + i + " and " + event[i])
	}
    droppedText = event.dataTransfer.getData(air.ClipboardFormats.FILE_LIST_FORMAT);
	
	var tbg = droppedText[0].url.toLowerCase();
	if(tbg.indexOf(".jpg") > 0 || tbg.indexOf(".gif") > 0 || tbg.indexOf(".png") > 0) {
		APP.Weibo.actions.setBG(droppedText[0].url);
	}
	
})



// 点击底部时调整窗口大小
$(".footer").bind("mousedown",function(){								   
	window.nativeWindow.startResize(new runtime.String(air.NativeWindowResize.BOTTOM_RIGHT));
	
	window.nativeWindow.addEventListener(air.NativeWindowBoundsEvent.RESIZING,function(event){
		var stageHeight = event.target.height-24;
		var listHeight = stageHeight - 136;
		var slideHeight = listHeight - 22;
		$(".stage").height(event.target.height-56);
		$(".wb-list").height(listHeight);
		$(".slider").height(listHeight);
		$(".slide-bar").height(slideHeight);
		Weibo._playListHeight = slideHeight;
		var _maxt = (Weibo._playListHeight - $("#slide-dragger").height());
		$("#slide-dragger").css({'top':$('#wb-list')[0].scrollTop/($('#wb-list')[0].scrollHeight - $('#wb-list').height())*_maxt});
	});
	
	window.nativeWindow.addEventListener(air.NativeWindowBoundsEvent.RESIZE,function(event){
		// 调整界面元素尺寸，以匹配调整窗口动作
		function adjust(){
			var stageHeight = event.target.height-24;
			var listHeight = stageHeight - 136;
			var slideHeight = listHeight - 22;
			$(".stage").height(event.target.height-56);
			$(".wb-list").height(listHeight);
			$(".slider").height(listHeight);
			$(".slide-bar").height(slideHeight);
			Weibo._playListHeight = slideHeight;
		}
		if (resizeTimer) {
			clearTimeout(resizeTimer);
			resizeTimer = null;
		}
		resizeTimer = setTimeout(adjust,200);
	});
});

(function(){

	function iconLoadComplete(event){ 
		air.NativeApplication.nativeApplication.icon.bitmaps = new runtime.Array(event.target.content.bitmapData); 
	}
	
	function showApp(event){
		window.nativeWindow.visible = true;
		if(window.nativeWindow.displayState == air.NativeWindowDisplayState.MINIMIZED){
			window.nativeWindow.restore();
		}
		window.nativeWindow.activate();
		air.NativeApplication.nativeApplication.activate();
	}
	function closeApp(){
		if(true || confirm("确定退出程序么？")){
			for(var i in RC.wins){
				if(RC.wins[i] && !RC.wins[i].closed){
					RC.wins[i].close();
				}
			}
			air.NativeApplication.nativeApplication.icon.bitmaps = [];
			air.NativeApplication.nativeApplication.exit();
		}
	}
	
	Mease.show = showApp;
	Mease.exit = closeApp;
	
	air.NativeApplication.nativeApplication.autoExit = false;
	
	var iconLoad = new air.Loader();
	var iconMenu = new air.NativeMenu(); 
	
	/*var exitCommand = iconMenu.addItem(new air.NativeMenuItem("显示Mease窗口")); 
	exitCommand.addEventListener(air.Event.SELECT,function(event){
			showApplication(event);
	});*/
	
	var exitCommand = iconMenu.addItem(new air.NativeMenuItem("退出微博登录")); 
	exitCommand.addEventListener(air.Event.SELECT,function(event){
			showApp(event);
			Measy.signOut();
	}); 
	
	var closeCommand = iconMenu.addItem(new air.NativeMenuItem("退出Mease程序")); 
	closeCommand.addEventListener(air.Event.SELECT,function(event){
			closeApp();
	}); 
	
	// 添加Windows DockIcon
	if (air.NativeApplication.supportsSystemTrayIcon) { 
		air.NativeApplication.nativeApplication.autoExit = false; 
		iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE,iconLoadComplete); 
		iconLoad.load(new air.URLRequest("icons/16.png")); 
		air.NativeApplication.nativeApplication.icon.tooltip = "Mease网易微聊！"; 
		air.NativeApplication.nativeApplication.icon.menu = iconMenu; 
	} 
	// 添加Mac DockIcon
	if (air.NativeApplication.supportsDockIcon) { 
		iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE,iconLoadComplete); 
		iconLoad.load(new air.URLRequest("icons/128.png")); 
		air.NativeApplication.nativeApplication.icon.menu = iconMenu; 
	}
	
	//点击dockicon显示程序窗口
	air.NativeApplication.nativeApplication.icon.addEventListener('click',showApp);
	
	// when right click on window quest tab ,and click close button
	window.nativeWindow.addEventListener(air.Event.CLOSING,function(event){
		air.NativeApplication.nativeApplication.icon.bitmaps = [];
	});
	
	window.nativeWindow.addEventListener(air.Event.ACTIVATE,function(event){
		if(APP.Weibo._runtime.comment && !APP.Weibo._runtime.comment.closed){APP.Weibo._runtime.comment.activate()};
		//if(Weibo._runtime.win && !Weibo._runtime.win.closed){Weibo._runtime.win.activate()};
		//if(!Weibo._runtime.win.closed){Weibo._runtime.win.activate()};
	});
})();




function getBingImage(){
	var request = {
		"url":"http://cn.bing.com/HPImageArchive.aspx",
		"data":"format=xml&idx=0&n=9&nc=1283872492211",
		"method":"GET"
	}
	Oauth.requestStart(request,function(event){var loader = air.URLLoader(event.target);
		if(loader.data.indexOf("xml version") > 0){
			var xmlParse = new DOMParser();
			var data = xmlParse.parseFromString(loader.data,"text/xml");
			$(data.getElementsByTagName("image")).each(function(i,v){
				bingURL = "http://cn.bing.com" + v.getElementsByTagName('url')[0].childNodes[0].nodeValue;
				var pic = $('<img src="' + bingURL + '" width="15" height="15" class="bgimage" timg="' + bingURL + '" />');
				pic.bind("click",function(){APP.Weibo.actions.setBG($(this).attr('timg'),true)});
				$("#bg-thumbs").append(pic);
			})
		}})
}

/**
  * 本地文件读写操作
  * 默认保存在应用Storage目录下
 **/
(function(){
	function writeToFile(fileName, fileString, callback, errcallback){
		callback = callback || function(){};
		errcallback = errcallback || function(){};
		fileString = (typeof fileString == "string")?fileString : JSON.stringify(fileString);
		
		var targetFile = new air.File(air.File.applicationStorageDirectory.resolvePath(fileName).nativePath);
		var fileStream = new air.FileStream();
		
		fileStream.addEventListener(air.Event.CLOSE, callback);
		fileStream.addEventListener(air.IOErrorEvent.IO_ERROR,errcallback);
		fileStream.openAsync(targetFile,air.FileMode.UPDATE);
		fileStream.writeUTF(fileString);
		fileStream.close();
	}
	
	function readFromFile(fileName, toObj, callback, errcallback){
		callback = callback || function(e){air.trace(e.target)};
		errcallback = errcallback || function(){};
		
		var targetFile = new air.File(air.File.applicationStorageDirectory.resolvePath(fileName).nativePath);
		var fileStream = new air.FileStream();
		var fileContent;
		
		try{
		fileStream.addEventListener(air.Event.COMPLETE,callback);
		fileStream.open(targetFile,air.FileMode.READ);
		fileContent = fileStream.readUTF();
		fileStream.close();
		return (toObj&&JSON.parse)?JSON.parse(fileContent):fileContent
		} catch(e) {
			return "{}"
		}
	}
	
	function checkFileExist(fileName){
		var targetFile = new air.File(air.File.applicationStorageDirectory.resolvePath(fileName).nativePath);
		return targetFile.exists;
	}
	window.Api = window.Api || {};
	Api.File = {};
	Api.File.read = readFromFile;
	Api.File.write = writeToFile;
	Api.File.check = checkFileExist
})();

$(function(){
	
	$("body").bind("click",function(e){
		if(!$(e.target).hasClass("menus") && $(e.target).parents(".menu-list").length < 1){
			$(".menu-list").fadeOut(200);
		}
	})
	
	//绑定窗口移动到Title区域
	$('#tool-panel,#startup').bind('mousedown',function(){
		nativeWindow.startMove();
	});
	
	//设置初始窗口位置在画面中央
	nativeWindow.x = (window.screen.width-400)/2;
	nativeWindow.y = (window.screen.height-300)/2;
	
	//显示初始化面板
	$("#startup").css({"opacity":0}).show().animate({"opacity":1},500,function(){
		/*Oauth.getAccessToken(function(){
			$("#startup").animate({"opacity":0},500,function(){
				$(this).hide();
				nativeWindow.x = (window.screen.width-400)/2;
				nativeWindow.y = (window.screen.height-200)/2;
				nativeWindow.height = 224;
				$("#panel-signin,#tool-panel").show();
			});
		});*/
		var localConfig = Api.File.read("config.json",true);
		if(localConfig.backgroundImage) {
			APP.Weibo.actions.setBG(localConfig.backgroundImage);
			$("#progress-percent").animate({"width":70});
			$("#startup-status").html("正在读取本地配置...")
		}
		setTimeout(function(){
			$("#progress-percent").animate({"width":152});
			setTimeout(function(){
				$("#startup").animate({"opacity":0},500,function(){										 
					$(this).hide();
					if(Api.File.check("autoLogin.f")){
						var access = Api.File.read("autoLogin.f",true);
						if(access.oauth_access && access.oauth_access!=""){
							Oauth.access.oauth_access = access.oauth_access;
							Oauth.access.oauth_access_secret = access.oauth_access_secret;
							nativeWindow.x = (window.screen.width-480);
							nativeWindow.y = 80;
							nativeWindow.width = 320;
							nativeWindow.height = 660;
							$("#main").show().height(634);
							$("#sighout, #tool-panel").show();
							APP.Weibo.init();
							return;
						}
					}
					nativeWindow.x = (window.screen.width-400)/2;
					nativeWindow.y = (window.screen.height-200)/2;
					nativeWindow.height = 224;
					$("#panel-signin,#tool-panel").show();
				});
			},1500);
		},1500);
	});
	
	$("#btn-signin").bind("click",function(){
		var username = $.trim($("#userid").val());
		var passwd = $.trim($("#passwd").val());
		Oauth.directLogin(function(){
			$("#panel-signin").hide();
			nativeWindow.x = (window.screen.width-480);
			nativeWindow.y = 80;
			nativeWindow.width = 320;
			nativeWindow.height = 660;
			$("#main").show().height(634);
			$("#sighout").show();
			APP.Weibo.init();
		}, username, passwd);
	})
	
	getBingImage();
	
});