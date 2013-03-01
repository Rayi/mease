// JavaScript Document
function appinit(){
	
}

function appclose(){

}
$(function(){
	
	$('.tool-bar').bind('mousedown',function(e){
		if(e.target.tagName.toLowerCase() != "span") {
			try {
				nativeWindow.startMove();
			} catch(moveError) {
			}
		}
	});
	
	$("#wordlength").html(Weibo._runtime.wordLength);
			
			$("#post-text").bind("keyup",function(){
				var statusLength = Weibo._runtime.wordLength-getStringLength($(this).val());
				air.trace("statusLength : " + statusLength);
				$("#wordlength").html(statusLength);
			})
	//window.nativeWindow.height = 700;
	
})

function getStringLength(str){
		return str.length;
	}

function getData(access,access_secret,userId,userName,commentId,text){
	Oauth.access.oauth_access = access;
	Oauth.access.oauth_access_secret = access_secret;
	//air.trace("userId : " + userId);
	Weibo._runtime.commentId = commentId;
	Weibo._runtime.userName = userName;
	Weibo.request.getUserInfo(userId);
	Weibo.request.getComments(1);
	$("#transdoor").html("回复 ：<br />" + text);
	$("#repostId").val(commentId);
	$("#get-all-comments").bind("click",function(){
		var url = 'http://t.163.com/' + Weibo._runtime.userName + '/status/' + Weibo._runtime.commentId;
		event.preventDefault();
		Tinco.openInBrowser(url);
		return false;
	});
	htmlLoader.height = document.documentElement.scrollHeight;
	nativeWindow.height = document.documentElement.scrollHeight + 6;
}

function getRepost(access,access_secret,userId,commentId,text,stext){
	Oauth.access.oauth_access = access;
	Oauth.access.oauth_access_secret = access_secret
	//air.trace("userId : " + userId + stext);
	Weibo._runtime.commentId = commentId;
	Weibo._runtime.currentPage = 1;
	Weibo._runtime.stext = stext;
	Weibo.request.getUserInfo(userId);
	$("#transdoor").html("转发 ：<br />" + text);
	$("#post-text").html(stext).focus()
	$("#repostId").val(commentId);
	htmlLoader.height = document.documentElement.scrollHeight;
	nativeWindow.height = document.documentElement.scrollHeight + 6;
}

function next(){
	if(!$("#page-next").hasClass("disable")){
		$("#comment-list").css({opacity:0.3});
		$("#message").animate({opacity:1},200);
		Weibo.request.getComments(Weibo._runtime.current_page+1);
	}
}
function prev(){
	if(!$("#page-prev").hasClass("disable")){
		$("#comment-list").css({opacity:0.3});
		$("#message").animate({opacity:1},200);
		Weibo.request.getComments(Weibo._runtime.current_page-1);
	}
}
function first(){
	if(!$("#page-first").hasClass("disable")){
		$("#comment-list").css({opacity:0.3});
		$("#message").animate({opacity:1},200);
		Weibo.request.getComments(1);
	}
}

var Weibo = {
	_runtime : {
		pages:{},
		wordLength : 163
	}
};

Weibo.request = {
	timer: 0,
	stimer: 0,
	
	simple : function(requestData,action,errorHandle){
		Weibo.request.stimer++;
		//air.trace("Weibo.request.stimer" + Weibo.request.stimer);
		errorHandle = errorHandle || function(){};
		
		if(Weibo.request.stimer < 15){
			Weibo._runtime.srequest = Oauth.requestStart(requestData,handle,errorHandle);
		}else{
			Weibo.request.stimer = 0;
			Weibo._runtime.srequest = null;
		}
		
		function handle(event){
			var loader = air.URLLoader(event.target);
			if(loader.data.indexOf("xml version") > 0){
				var xmlParse = new DOMParser()
				var data = xmlParse.parseFromString(loader.data,"text/xml");
			}else
			{
				var data = JSON.parse(loader.data);
			}
			
			Weibo.request.stimer = 0;
			Weibo._runtime.srequest = null;
			action(data);
		}
	},
	
	start : function(requestData,action,errorHandle){
		Weibo.request.timer++;
		errorHandle = errorHandle || function(){};
		
		if(Weibo.request.timer < 5){
			Weibo._runtime.request = Oauth.requestStart(requestData,handle,errorHandle);
		}else
		{
			Weibo.request.timer = 0;
			Weibo._runtime.request = null;
			$("#message").html("服务器请求数据失败，点击重试！").unbind("click").bind("click",errorHandle);
		}
		
		function handle(event){
			var loader = air.URLLoader(event.target);
			if(loader.data.indexOf("xml version") > 0){
				var xmlParse = new DOMParser()
				var data = xmlParse.parseFromString(loader.data,"text/xml");
			}else
			{
				var data = JSON.parse(loader.data);
			}
			Weibo.actions.hideMessage();
			Weibo.request.timer = 0;
			Weibo._runtime.request = null;
			$("#wb-list").html('');
			action(data);
		}
	},
	
	followSomeone : function(userName,userId){
		if(!userId){
			return false;
		}
		var info = Oauth.getInfo();
		var q = {
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			screen_name: userName,
			source: Oauth.oauth_consumer_key,
			user_id: userId
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.follow_api + userId + ".json","POST");
		
		Weibo.request.simple(requestData,Weibo.actions.followSomebody,function(){Weibo.request.followSomeone.call(null,userId)});
	},
	
	followChecke : function(userId){
		if(!userId){
			return false;
		}
		var info = Oauth.getInfo();
		var q = {
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			source:Oauth.oauth_consumer_key,
			target_id:userId
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.follow_check_api);
		
		Weibo.request.simple(requestData,Weibo.actions.showFollow,function(){Weibo.request.followChecke.call(null,userId)});
	},
	
	getUserInfo : function(userId){
		if(!userId){
			return false;
		}
		Weibo._runtime.userId = userId;
		
		var info = Oauth.getInfo();
		var q = {
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			source:Oauth.oauth_consumer_key,
			user_id:userId
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.user_info_api + userId + ".json");
		
		Weibo.request.simple(requestData,Weibo.actions.updateUserInfo,function(){Weibo.request.getUserInfo.call(null,userId)});
	},
	
	getFollowers : function(userId){
		if(!userId){
			return false;
		}
		Weibo._runtime.userId = userId;
		
		var info = Oauth.getInfo();
		var q = {
			id:userId,
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			source:Oauth.oauth_consumer_key
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.followers_api);
		
		Weibo.request.start(requestData,Weibo.actions.buildFollowerList,function(){Weibo.request.getFollowers.call(null,userId)});
	},
	
	getFriends : function(userId){
		if(!userId){
			return false;
		}
		Weibo._runtime.userId = userId;
		
		var info = Oauth.getInfo();
		var q = {
			id:userId,
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			source:Oauth.oauth_consumer_key
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.friends_api);
		
		Weibo.request.start(requestData,Weibo.actions.buildFriendList,function(){Weibo.request.getFriends.call(null,userId)});
	},
	
	getHomeList : function(page){
		
		page = page || 1;
		var info = Oauth.getInfo();
		var q = {
			count:20,
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			page:page,
			source:Oauth.oauth_consumer_key
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.home_timeline_api);
		
		Weibo.request.start(requestData,Weibo.actions.buildHomeItmes,Weibo.request.getHomeList);
	},
	getMyList : function(page){
		
		page = page || 1;
		var info = Oauth.getInfo();
		var q = {
			count:20,
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			page:page,
			source:Oauth.oauth_consumer_key
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.my_timeline_api);
		
		Weibo.request.start(requestData,Weibo.actions.buildHomeItmes,Weibo.request.getMyList);
	},
	getUserList : function(userId,page){
		//air.trace("userId : " + userId);
		page = page || 1;
		//air.trace(page);
		var info = Oauth.getInfo();
		var q = {
			count:20,
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			source:Oauth.oauth_consumer_key,
			user_id :userId
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.my_timeline_api);
		
		Weibo.request.start(requestData,Weibo.actions.buildHomeItmes,function(){Weibo.request.getMyList(userId,page)});
	},
	getMyMention : function(page){
		
		page = page || 1;
		var info = Oauth.getInfo();
		var q = {
			count:20,
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			page:page,
			source:Oauth.oauth_consumer_key
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.mention_api);
		
		Weibo.request.start(requestData,Weibo.actions.buildHomeItmes,Weibo.request.getMyMention);
	},
	getMyComments : function(page){
		
		page = page || 1;
		var info = Oauth.getInfo();
		var q = {
			count:20,
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			page:page,
			source:Oauth.oauth_consumer_key
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.comments_by_me_api);
		
		Weibo.request.start(requestData,Weibo.actions.buildCommentsItmes,Weibo.request.getMyComments);
	},
	
	getMyMails : function(page){
		
		page = page || 1;
		var info = Oauth.getInfo();
		var q = {
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			source:Oauth.oauth_consumer_key
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.my_mail_api);
		
		Weibo.request.start(requestData,Weibo.actions.buildMailList,Weibo.request.getMyMails);
	},
	getMyFavs : function(page){
		
		page = page || 1;
		var info = Oauth.getInfo();
		var q = {
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			source:Oauth.oauth_consumer_key
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.my_favs_api);
		
		Weibo.request.start(requestData,Weibo.actions.buildFavList,Weibo.request.getMyFavs);
	},
	
	repostStatus : function(repostId,status,reply,callBack){
		
		if(status === null){
			return false;
		}
		var args = arguments;
		Weibo._runtime.currentStatus = status;
		
		var info = Oauth.getInfo();
		var q = {
			status:status,
			id:repostId,
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			source:Oauth.oauth_consumer_key
		}
		if(reply){
			q.is_comment = "1";
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.retweet_api + repostId + ".json","POST");
		
		Weibo.request.simple(requestData,callBack,function(){args.callee.call(null,args)});
	},
	
	commentStatus: function(commentId,status,retweet,callBack){
		if(status === null){
			return false;
		}
		var args = arguments;
		Weibo._runtime.currentStatus = status;
		
		var info = Oauth.getInfo();
		var q = {
			status:status,
			id:commentId,
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			source:Oauth.oauth_consumer_key
		}
		if(retweet){
			q.is_retweet = "1";
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.post_comment_api,"POST");
		
		Weibo.request.simple(requestData,callBack,function(){args.callee.call(null,args)});
	},
	
	postStatus : function(status){
		if(!status){
			return false;
		}
		Weibo._runtime.currentStatus = status;
		
		var info = Oauth.getInfo();
		var q = {
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			source:Oauth.oauth_consumer_key,
			status:Weibo._runtime.currentStatus
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.post_message_api,"POST");
		
		Weibo.request.simple(requestData,Weibo.actions.updatePost,function(){Weibo.request.postStatus.call(null,status)});
	},
	
	getComments : function(targetPage){
		targetPage = targetPage || "1";
		Weibo._runtime.currentStatus = status;
		Weibo._runtime.temp_page = targetPage;
		since_id = Weibo._runtime.pages[targetPage]?Weibo._runtime.pages[targetPage]:"";
		air.trace("page : " + targetPage + " and since_id :" + since_id);
		var info = Oauth.getInfo();
		var q = {
			count: 5,
			oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
			oauth_signature_method: Oauth.oauth_signature_method,
			oauth_version: Oauth.oauth_version,
			oauth_token: Oauth.access.oauth_access,
			source:Oauth.oauth_consumer_key
		}
		if(since_id != ""){
			q.since_id = since_id;
		}
		var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		
		var requestData = Oauth.generateSignature(q,s,WBapis.comments_api + Weibo._runtime.commentId +".json");
		
		Weibo.request.simple(requestData,Weibo.actions.updateComments,function(){Weibo.request.getComments.call(null,targetPage)});
	}
	
};

Weibo.actions = {
	clearUser : function(actionName,param){
		param = param || [];
		
		$("#my-honor").html("正在获取用户信息...").stop().animate({"opacity":1},200);
		
		if(Weibo._runtime.srequest){
			Weibo._runtime.srequest.close();
			Weibo._runtime.srequest = null;
			//air.trace("actionName : " + actionName)
		}
		Weibo.request[actionName].apply(null,param);
	},
	
	updateUserInfo : function(dataObj){
		/*for(var i in dataObj){
			//air.trace(i + " : " + dataObj[i]);
		}*/
		$("#my-honor").stop().animate({"opacity":0},100);
		if(dataObj.error_code){
			Weibo.actions.clearUser('getUserInfo',[Weibo._runtime.userId]);
			return;
		}
		var detail = ['<span class="link" id="followers_' + dataObj.id + '">' + dataObj.followers_count + '粉丝</span><span class="link" id="friends_' + dataObj.id + '">关注' +  dataObj.friends_count + '</span><span class="link" id="user_' + dataObj.id + '">' + dataObj.statuses_count + '微博</span>'];
		$("#my-avatar").attr("src",dataObj.profile_image_url).attr("title","来自：" + dataObj.location);
		$("#my-info .my-name").html(dataObj.screen_name + "-" + dataObj.location );
		$("#my-info .my-detail").html(detail.join(''));
		Weibo.request.followChecke(dataObj.id);
	},
	
	showFollow : function(data){
		var tid = data.target.id;
		//air.trace("data.target.id is " + data.target.id);
		//air.trace("data.target.followed_by : " + data.target.followed_by)
		if(data.target.followed_by){
			var detail = ['<span class="link" id="followme_' + data.target.id + '">已关注</span>'];
			$("#my-info .my-detail").append(detail.join(''));
		}else
		{
			var detail = ['<span class="link" id="followme_' + data.target.id + '">关注他/她</span>'];
			$("#my-info .my-detail").append(detail.join(''));
			$("#followme_" + data.target.id).bind("click",function(){
				Weibo.request.followSomeone(data.target.screen_name,data.target.id);
			})
		}
	},
	
	updateComments : function(dataArr){
		$("#message").animate({opacity:0},200);
		Weibo._runtime.current_page = Weibo._runtime.temp_page;
		Weibo._runtime.pages[Weibo._runtime.current_page+1] = (dataArr.length == 5)?dataArr[dataArr.length-1].id:null;
		air.trace(Weibo._runtime.current_page+1);
		air.trace(Weibo._runtime.pages[Weibo._runtime.current_page+1]);
		
		$(".comment-pager span").addClass("disable");
		
		if(Weibo._runtime.current_page > 1){
			$("#page-first").removeClass("disable");
			$("#page-prev").removeClass("disable");
		}
		
		if(dataArr.length == 5){
			$("#page-next").removeClass("disable");
		}
		
		$("#comment-list").html("").css({opacity:1});
		
		if(dataArr.length  == 0){
			$("#comment-list").append('<div class="comment-item">\
				<div class="comment-content">\
					<p>没有找到更多的评论了...！</p>\
				</div>\
			</div>');
		} else {
			for(var i = 0 ; i < dataArr.length;i++){
				var data = dataArr[i];
				$("#comment-list").append('<div class="comment-item">\
					<div class="comment-content">\
						<p><a href="#" target="_blank">' + data.user.name +'</a>：' + data.text +'(' + data.created_at +')</p>\
					</div>\
				</div>');
			}
			$("#comment-list .comment-item:odd").addClass("comment-even");
		}
		htmlLoader.height = document.documentElement.scrollHeight;
		nativeWindow.height = document.documentElement.scrollHeight + 6;
	},
	
	sendComment : function(){
		var commentId = $("#repostId").val();
		//var commentId = $("#commentId").val();
		var commentText = $("#post-text").val();
		
		var postStatus = $("#addPost").attr("checked");
		
		$("#post-text").addClass("sending").attr("disabled","disabled").val("");
		
		if($.trim(commentText) == ""){
			alert("评论不能为空");
			return;
		}
		Weibo.request.commentStatus(commentId,commentText,postStatus,Weibo.actions.hideWindow);

	},
	
	sendPost : function(){
		var statusId = $("#repostId").val();
		var commentId = $("#commentId").val();
		var commentText = $("#post-text").val();
		
		var postStatus = $("#addPost").attr("checked");
		
		$("#post-text").addClass("sending").attr("disabled","disabled").val("");
		
		if(commentText==""){
			commentText = Weibo._runtime.stext;
		}
		air.trace("postStatus2 : " + postStatus)
		Weibo.request.repostStatus(statusId,commentText,postStatus,Weibo.actions.hideWindow);

	},
	
	
	hideWindow : function(){
		$("#post-text").removeClass("sending").addClass("send-success");
		setTimeout(function(){nativeWindow.close();},2000)
	}
}