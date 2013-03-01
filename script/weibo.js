(function() {
		  
	var config = {};
	
	//检测内容中的链接或者视频地址
	function urlParse(str){
			str.replace(/(http:\/\/163\.fm\/\w{5,8})/g,'<a href="$1" rel="nofollow">$1</a>').replace(/\#(\S{1,})/g,'<a href="http://t.163.com/tag/$1" rel="nofollow">#$1</a>');
			return Emotions.replace(str);
	}
	function urlImageParse(str){
			return str.replace(/(http:\/\/126\.fm\/\w{5,8})/g,'<img src="http://oimagea5.ydstatic.com/image?w=120&h=120&url=$1" m="http://oimageb8.ydstatic.com/image?w=460&gif=0&url=$1" />').replace(/(http:\/\/126\.fm\/)/,'http%3A%2F%2F126.fm%2F');
	}
	function urlVedioParse(str){
			return str.replace(/(http:\/\/163\.fm\/\w{5,8})/g,'<a href="$1" rel="nofollow">video-$1</a>');
	}
	
	function getStringLength(str){
		return str.length;
	}
	
	function parseTime(xtime,time){
		var str = [];
		if(xtime < 0){
			str.push("今天");
		}
		if(xtime > 0 && xtime < 24*60*60*1000){
			str.push("昨天");
		}
		if(xtime > 24*60*60*1000){
			var dt = Math.floor(xtime/(24*60*60*1000)) + 1;
			var d = new Date();
			d.setTime(time);
			//str.push(d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate());
			str.push(dt + "天前的")
		}
		return str.join('');
	}
	
	function getShoutEmotion(){
		var emotions = ['隔空喊话', '说','笑道', '大喊', '悄悄说', '对大家说', '轻声说'];
		return emotions[parseInt(Math.random()*emotions.length)];
	}
	//获取用户的头像地址
	function getUserAvatar(url){
		return url;
		return decodeURIComponent(url.substr(url.indexOf("http%3A")));
	}
	
	var Emotions = {
		et : {
				"[开心]":"http://img1.cache.netease.com/t/face/yunying/kaixin.gif",
				"[勾引]":"http://img1.cache.netease.com/t/face/yunying/gouyin.gif"
		},
		replace : function(str){
			var self = this;
			for(var i in self.et) {
				str = str.replace(new RegExp(i.replace(/\[/,"\\[").replace(/\]/,"\\]"),'g'),'<img src="' + self.et[i] + '" />');
			}
			return str;
		}
	}
	
	
	//微博应用的全局对象
	var Weibo = {
			
		//初始化，为界面元素绑定事件
		init:function(){
		///{{{
			
			$("body").bind('selectstart',function(){return false});
			$("body").bind('dragstart',function(){return false});
			
			///{{{ 主导航栏tooltip效果
			$("#control .btn").hover(
				function(){
					//$(this).stop().animate({"paddingLeft":"10px","paddingRight":"10px","opacity":1},150);
					$(this).stop().animate({"opacity":1},150);
					var tip = $("#tooltip");
					var left = $(this).offset().left +5;
					if(left<=0){left = 10;}
					//air.trace($(this).offset().top + " : " + $(this).height())
					$("#tooltip").html($(this).attr("tip")).css({"left":left,"top":$(this).offset().top + $(this).height() - 24}).show();
				},
				function(){
					if(!$(this).hasClass("current")){
						$(this).stop().animate({"opacity":0.4},100);
					}
					$("#tooltip").html("").hide();
				}
			);
			///}}}
			
			///{{{ 底部toolbar tooltip效果
			$(".footer .btn").hover(function(){
				//$(this).stop().animate({"paddingLeft":"10px","paddingRight":"10px","opacity":1},150);
				var tip = $("#tooltip");
				var left = $(this).offset().left +15;
				if(left<=0){left = 10;}
				$("#tooltip").html($(this).attr("tip")).css({"left":left,"top":$(this).offset().top - 47}).show();
			},function(){
				$("#tooltip").html("").hide();
			});
			///}}}
			
			///{{{ 头部主导航鼠标点击事件
			$("#control .btn").click(function(){
				
				if(!$(this).hasClass("current")){
					$("#control .btn").removeClass("current").stop().animate({"opacity":0.4});
					$(this).stop().animate({"opacity":1}).addClass("current");
				}
				
				var actionName = $(this).attr("action");
				if( actionName!='playMusic'){
					APP.Music.hide();
					Weibo.actions.clearLists(actionName);
					Weibo.actions.clearUser('getUserInfo',[Oauth.userId]);
				} else {
					APP.Music.init();
				}
				$("#wb-panels .wb-panel").stop().animate({opacity:0,top:40},function(){$(this).hide()});
				if(actionName == 'getMyMails') {
					$("#letter-panel").css({opacity:0}).stop().show().animate({opacity:1,top:0});
					$("#wb-panels").css({"background-color":"#212121"});
					return;
				}
				if(actionName == 'getMyComments') {
					$("#comments-panel").css({opacity:0}).stop().show().animate({opacity:1,top:0});
					$("#wb-panels").css({"background-color":"#212121"});
					return;
				}
				if(actionName == 'getHomeTimeline') {
					$("#default-panel").css({opacity:0}).stop().show().animate({opacity:1,top:0});
					$("#wb-panels").css({"background-color":"#212121"});
					return;
				}
				if(actionName == 'getMyMentions') {
					$("#mention-panel").css({opacity:0}).stop().show().animate({opacity:1,top:0});
					$("#wb-panels").css({"background-color":"#212121"});
					return;
				}
				if(actionName == 'getMyFavs') {
					$("#favs-panel").css({opacity:0}).stop().show().animate({opacity:1,top:0});
					$("#wb-panels").css({"background-color":"#212121"});
					return;
				}
				if(actionName == 'playMusic') {
					$("#music-panel").css({opacity:0}).stop().show().animate({opacity:1,top:0});
					$("#wb-panels").css({"background-color":"#212121"});
					return;
				}
				$("#other-panel").css({opacity:0}).stop().show().animate({opacity:1,top:0});
				$("#wb-panels").css({"background-color":"#212121"});
			});
			
			$("#wordlength").html(Weibo._runtime.wordLength);
			
			$("#post-text").bind("keyup",function(){
				var statusLength = Weibo._runtime.wordLength-getStringLength($(this).val());
				air.trace("statusLength : " + statusLength);
				$("#wordlength").html(statusLength);
			})
			///}}}
			
			///{{{
		
			//Measy.readUserId();
			//Config.get(Oauth.userId,Weibo.actions.updateConfig);
			Weibo.request.verifyUser();
			Weibo.request.getHomeTimeline();
			Weibo.resetLinks();
			//Weibo.update.init();
			
			/*var appUpdater = new runtime.air.update.ApplicationUpdaterUI();
			appUpdater.addEventListener(air.UpdateEvent.INITIALIZED,function(){//air.trace("123123123123");appUpdater.checkNow();})
			appUpdater.addEventListener(air.UpdateEvent.CHECK_FOR_UPDATE,function(event){
				//air.trace(event);
				event.preventDefault();
				event.target.checkForUpdate();
			})
			appUpdater.configurationFile = new air.File("app:/updateConfig.xml"); 
			appUpdater.initialize();*/
			///}}}
		///}}}
		},
		
		resetLinks : function(){
		///{{{ 所有页面A链接的事件处理
			$("a").bind("click",function(e){
					var rel = $(this).attr("rel");
					var url = $(this).attr("href");
					if(rel == "nofollow"){
						event.preventDefault();
						var uq = new air.URLRequest(url);
						air.navigateToURL(uq);
					}
					return false;
			});
		///}}}
		}
	};
	
	
	Weibo._runtime = {
		action : "getHomeTimeline",
		currentPage : 1,
		wordLength : 163,
		state:{
		}
	}
	
	Weibo.request = {
		
		followSomeone : function(userName,userId){
			if(!userId){
				return false;
			}
			
			var opts = {
				user_id: userId
				,screen_name: userName
			};
			
			ST.do_friendships_create(opts,Weibo.actions.followSomebody);
		},
		unfollowSomeone : function(userName,userId){
			if(!userId){
				return false;
			}
			
			var opts = {
				user_id: userId
				,screen_name: userName
			};
			
			ST.do_friendships_destroy(opts,Weibo.actions.unfollowSomebody);
		},
		
		followChecke : function(userId){
			if(!userId){
				return false;
			}
			
			var opts = {
				target_id:userId
			};
			
			ST.get_friendships_show(opts,Weibo.actions.showFollow);
		},
		
		getUserInfo : function(userId){
			if(!userId){
				return false;
			}
			Weibo._runtime.userId = userId;
			
			var opts = {
				id: userId
			};
			
			ST.get_user_show(opts,Weibo.actions.updateUserInfo);
		},
		
		verifyUser : function(){
			
			var opts = {};
			
			ST.do_account_verify_credentials(opts,Weibo.actions.updateCurrentUser);
		},
		
		getFollowers : function(userId, page){
			if(!userId){
				return false;
			}
			Weibo._runtime.userId = userId;
			
			var opts = {
				user_id: userId
			};
			if(page) {
				opts['cursor'] = page;
			}
			
			ST.get_user_followers(opts,Weibo.actions.buildFriendList);
		},
		
		getFriends : function(userId, page){
			if(!userId){
				return false;
			}
			Weibo._runtime.userId = userId;
			
			var opts = {
				user_id: userId
			};
			if(page) {
				opts['cursor'] = page;
			}
			
			ST.get_user_friends(opts,Weibo.actions.buildFriendList);
		},
		
		getHomeTimeline : function(since_id){
			var opts = {
				count: 30
			};
			var callback = Weibo.actions.buildHomeTimeline;
			if(since_id) {
				opts.since_id = since_id;
				callback = Weibo.actions.appendHomeTimeline;
			}
			ST.get_home_timeline(opts,callback);
		},
		
		getMyTimeline : function(since_id){
			
			var opts = {
				count: 30,
			};
			var callback = Weibo.actions.buildMyTimeline;
			if(since_id) {
				opts.since_id = since_id;
				callback = Weibo.actions.appendMyTimeline;
			}
			ST.get_user_timeline(opts,callback);
			
		},
		
		getUserTimeline : function(userId, since_id){
			
			var opts = {
				count: 30,
				user_id :userId
			};
			var callback = Weibo.actions.buildUserTimeline;
			if(since_id) {
				opts.since_id = since_id;
				callback = Weibo.actions.appendUserTimeline;
			}
			ST.get_user_timeline(opts,callback);
		},
		
		getMyMentions : function(){	
			
			var opts = {
				count: 30
			};
			
			ST.get_mentions(opts,Weibo.actions.buildMentionItmes);
			
		},
		getMyComments : function(){
			
			var opts = {
				count: 30,
				trim_user: "false"
			};
			
			ST.get_comments_by_me(opts,Weibo.actions.buildCommentsList);
		},
		
		getCommentsByMe : function(){
			
			var opts = {
				count: 30,
				trim_user: "false"
			};
			
			ST.get_comments_by_me(opts,Weibo.actions.buildCommentOutboxList);
		},
		
		getCommentsToMe : function(){
			
			var opts = {
				count: 30,
				trim_user: "false"
			};
			
			ST.get_comments_to_me(opts,Weibo.actions.buildCommentInboxList);
		},
		
		getMyMails : function(){
			
			var opts = {
				count: 100
			};
			
			ST.get_direct_messages_inbox(opts,Weibo.actions.buildMailInboxList);
		},
		
		getMailsInbox : function(){
			var opts = {
				count: 100
			};
			
			ST.get_direct_messages_inbox(opts,Weibo.actions.buildMailInboxList);
		},
		
		getMailsOutBox : function(){
			var opts = {
				count: 100
			};
			
			ST.get_direct_messages_outbox(opts,Weibo.actions.buildMailOutboxList);
		},
		
		delComment: function(itemId){
			Weibo.actions.showErrorTip('API暂未开放', true);
			return;
			var opts = {
				id: itemId
			};
			
			ST.do_status_destroy(opts,function(){Weibo.actions.deleteItem(itemId)});
		},
		
		delStatus : function(itemId){
			
			var opts = {
				id: itemId
			};
			
			ST.do_status_destroy(opts,function(){Weibo.actions.removeListItem(itemId)});
			
		},
		
		addFav : function(itemId){
			Weibo.actions.showTip('检测到有更新了，去下载更新MEASE吧！<a href="http://www.startfeel.com/app/measy/" rel="unfollow">下载更新包</a>');
			
			var opts = {
				id : itemId,
			};
			
			ST.do_favorites_create(opts,function(){Weibo.actions.addFavSuccess(itemId)});
			
		},
		
		delFav: function(itemId){
			
			var opts = {
				id: itemId
			};
			
			ST.do_favorites_destroy(opts,function(){Weibo.actions.delFavSuccess(itemId)});
			
		},
		
		getMyFavs : function(){
			
			var opts = {
				id: Weibo._runtime.user.screen_name,
				count:50
			};
			
			ST.get_favorites_list(opts,Weibo.actions.buildFavList);
		},
		
		repostStatus : function(id,status){
			if(!status){
				return false;
			}
			Weibo._runtime.currentStatus = status;
			
			var opts = {
				count: 100
			};
			
			ST.get_direct_messages_outbox(opts,Weibo.actions.updatePost);
		},
		commentStatus: function(id,status){
			if(!status){
				return false;
			}
			Weibo._runtime.currentStatus = status;
			
			var opts = {
				count: 100
			};
			
			ST.get_direct_messages_outbox(opts,Weibo.actions.updatePost);
		},
		
		postStatus : function(status){
			if(!status){
				return false;
			}
			Weibo._runtime.currentStatus = status;
			
			var opts = {
				status: status,
				source: "Mease"
			};
			
			ST.do_status_update(opts,Weibo.actions.updatePost);
		},
		
	};
	
	Weibo.itemAction = {
		transdoor: function(itemid,userId){
			var data = null;
			for(var i=0;i<Weibo._runtime.listData.length;i++){
				if(Weibo._runtime.listData[i].id == itemid){
					data = Weibo._runtime.listData[i];
					break;
				}
			};
			var text = data.retweeted_status?data.retweeted_status.text:data.text;
			var stext = data.retweeted_status?"//@" + data.user.name +  ":" +data.text:"";
			var rid = data.retweeted_status?data.retweeted_status.id:data.id;
			var uid = data.retweeted_status?data.retweeted_status.user.id:userId;
			
			//text = " //@" + data.user.screen_name + " :" + text;
			var options = new air.NativeWindowInitOptions(); 
			options.transparent = false; 
			options.systemChrome = air.NativeWindowSystemChrome.NONE;
			options.type = air.NativeWindowType.LIGHTWEIGHT;
			 
			 if(!Weibo._runtime.comment || Weibo._runtime.comment.closed){
				//create the window 
				var newWindow = new air.NativeWindow(options); 
				newWindow.title = "A title";
				
				
				var sw = air.NativeWindow.systemMaxSize;
				//air.trace("sw.x :" + sw.x);
				//air.trace("sw.y :" + sw.y);
				
				var wx = window.nativeWindow.x + window.nativeWindow.width;
				var wy = window.nativeWindow.y;
				//air.trace("window.nativeWindow.x :" + window.nativeWindow.x);
				if(wx < sw.x/4){
					newWindow.x = wx;
				}else
				{
					newWindow.x = window.nativeWindow.x-320;
				}
				
				newWindow.y = wy;
				 
				//activate and show the new window 
				newWindow.activate();
				Weibo._runtime.comment = newWindow;
				Weibo._runtime.comment.stage.align = "TL"; 
				Weibo._runtime.comment.stage.scaleMode = "noScale"; 
				
				var htmlView = new air.HTMLLoader();
					htmlView.x = 3;
					htmlView.y = 3;
					 
					//set the stage so display objects are added to the top-left and not scaled 
					
					Weibo._runtime.comment.stage.addChildAt(htmlView,0);
					
					 
					//urlString is the URL of the HTML page to load
					htmlView.addEventListener(air.Event.COMPLETE,adjust);
					htmlView.load(new air.URLRequest("repost.html"));
				
			}
			
			Weibo._runtime.comment.activate();
			Weibo._runtime.comment.visible = true;
			//air.trace(Weibo._runtime.comment.stage.numChildren);
			
			function adjust(){
				//air.trace("loaded");
				//air.trace(htmlView.contentHeight);
				
				htmlView.width = 315;
				htmlView.height = Math.min(htmlView.contentHeight,600);
				Weibo._runtime.comment.width = htmlView.width + 6;
				Weibo._runtime.comment.height = htmlView.height + 6;
				htmlView.window.getRepost(Oauth.access.oauth_access,Oauth.access.oauth_access_secret,uid,rid,text,stext);
				htmlView.removeEventListener(air.Event.COMPLETE,adjust);
			}
			
			/*//air.trace("rid : " + rid);
			$("#transdoor").html("<b>转</b>：" + text);
			$("#post-text").html(stext);
			$("#repostId").val(rid);
			$("#commentId").val("");
			if($("#post-form").css("opacity")<1){
				Weibo.actions.hideLayer();
				var f = $("#post-form");
				f.show().stop().animate({"bottom":31,"opacity":1},300);
				Weibo._runtime.layer = f;
				$("#post-text").focus();
			}else
			{
				Weibo._runtime.layer = f;
				$("#post-text").focus();
			}*/
		},
		comment: function(itemid,userId){
			var data = null;
			for(var i=0;i<Weibo._runtime.listData.length;i++){
				if(Weibo._runtime.listData[i].id == itemid){
					data = Weibo._runtime.listData[i];
					break;
				}
			};
			var text = data.text;
			var stext = "";
			var cid = data.id;
			var userName = data.user.screen_name;
			//air.trace("comment cid : " + cid);
			
			var options = new air.NativeWindowInitOptions(); 
			options.transparent = false; 
			options.systemChrome = air.NativeWindowSystemChrome.NONE;
			options.type = air.NativeWindowType.LIGHTWEIGHT;
			 
			 if(!Weibo._runtime.comment || Weibo._runtime.comment.closed){
				//create the window 
				var newWindow = new air.NativeWindow(options); 
				newWindow.title = "A title";
				
				
				var sw = air.NativeWindow.systemMaxSize;
				//air.trace("sw.x :" + sw.x);
				//air.trace("sw.y :" + sw.y);
				
				var wx = window.nativeWindow.x + window.nativeWindow.width;
				var wy = window.nativeWindow.y;
				//air.trace("window.nativeWindow.x :" + window.nativeWindow.x);
				if(wx < sw.x/4){
					newWindow.x = wx;
				}else
				{
					newWindow.x = window.nativeWindow.x-320;
				}
				
				newWindow.y = wy;
				 
				//activate and show the new window 
				newWindow.activate();
				Weibo._runtime.comment = newWindow;
				Weibo._runtime.comment.stage.align = "TL"; 
				Weibo._runtime.comment.stage.scaleMode = "noScale"; 
				
				var htmlView = new air.HTMLLoader();
					htmlView.x = 3;
					htmlView.y = 3;
					 
					//set the stage so display objects are added to the top-left and not scaled 
					
					Weibo._runtime.comment.stage.addChildAt(htmlView,0);
					
					 
					//urlString is the URL of the HTML page to load
					htmlView.addEventListener(air.Event.COMPLETE,adjust);
					htmlView.load(new air.URLRequest("comment.html"));
				
			}
			Weibo._runtime.comment.activate();
			Weibo._runtime.comment.visible = true;
			//air.trace(Weibo._runtime.comment.stage.numChildren);
			
			function adjust(){
				//air.trace("loaded");
				//air.trace("htmlView.contentHeight" + htmlView.contentHeight);
				htmlView.width = 315;
				htmlView.height = Math.min(htmlView.contentHeight,600);
				Weibo._runtime.comment.width = htmlView.width + 6;
				Weibo._runtime.comment.height = htmlView.height + 6;
				htmlView.window.getData(Oauth.access.oauth_access,Oauth.access.oauth_access_secret,userId,userName,itemid,text);
				htmlView.removeEventListener(air.Event.COMPLETE,adjust);
			}
			
			/*$("#transdoor").html("<b>评论</b>：" + text);
			$("#post-text").html(stext);
			$("#commentId").val(cid);
			$("#repostId").val("");
			if($("#post-form").css("opacity")<1){
				Weibo.actions.hideLayer();
				var f = $("#post-form");
				f.show().stop().animate({"bottom":31,"opacity":1},300);
				Weibo._runtime.layer = f;
				$("#post-text").focus();
			}else
			{
				Weibo._runtime.layer = f;
				$("#post-text").focus();
			}*/
			
		},
		
		deleteit : function(itemId,userId){
			Weibo.request.delStatus(itemId);
		},
		
		bookmark : function(itemId,userId){
			//air.trace(itemId,userId)
			Weibo.request.addFav(itemId);
		},
		
		unbookmark : function(itemId,userId){
			//air.trace("unbookmark",itemId,userId)
			Weibo.request.delFav(itemId);
		}
	}
	
	Weibo.actions = {
		
		removeListItem : function (itemId){
			//air.trace("#wb-timeline-" + itemId);
			//air.trace($("#wb-timeline-" + itemId).length);
			$("#wb-timeline-" + itemId).fadeOut(200,function(){$(this).remove()});
		},
		clearLists : function(actionName,param){
			param = param || [];
			
			$("#wb-list").animate({"opacity":0},100).html("");
			$("#message").html("正在获取数据...").css({"top":230}).show().animate({"opacity":0.8,"top":280},100,"swing");
			
			setTimeout(function(){
			if(Weibo._runtime.request){
				Weibo._runtime.request.close();
				Weibo._runtime.request = null;
				//air.trace("actionName : " + actionName)
			}
			Weibo._runtime.action = actionName;
			Weibo.request[actionName].apply(null,param);
								},100)
		},
		
		clearUser : function(actionName,param){
			param = param || [];
			
			$("#my-honor").html("正在获取用户信息...").stop().animate({"opacity":1},200);
			
			if(Weibo._runtime.srequest){
				Weibo._runtime.srequest.close();
				Weibo._runtime.srequest = null;
				air.trace("actionName : " + actionName)
			}
			air.trace("actionName : " + actionName + ""  + param);
			Weibo.request[actionName].apply(null,param);
		},
		
		hideMessage : function(){
			$("#message").animate({"opacity":0},300,function(){$(this).hide()});
		},
		
		gotoUser : function(userId){
			//air.trace(" gotoUser userId : " +userId);
			$("#control .btn").removeClass("current").stop().animate({"opacity":0.4});
			Weibo._runtime.state.user_id = userId;
			Weibo.actions.clearLists('getUserTimeline',[userId]);
			Weibo.actions.clearUser('getUserInfo',[userId]);
		},
		
		updateCurrentUser : function(dataObj){
			Weibo._runtime.userId = dataObj.id;
			Weibo._runtime.user = dataObj
			Oauth.userId = dataObj.id;
			Weibo.actions.updateUserInfo(dataObj);
		},
		
		updateUserInfo : function(dataObj){
			for(var i in dataObj){
				//air.trace(i + " : " + dataObj[i]);
			}
			$("#my-honor").stop().animate({"opacity":0},100);
			if(dataObj.error_code){
				Weibo.actions.clearUser('getUserInfo',[Weibo._runtime.userId]);
				return;
			}
			var detail = ['<span class="link" id="followers_' + dataObj.id + '">' + dataObj.followers_count + '粉丝</span><span class="link" id="friends_' + dataObj.id + '">关注' +  dataObj.friends_count + '</span><span class="link" id="user_' + dataObj.id + '">' + dataObj.statuses_count + '微博</span>'];
			$("#my-avatar").attr("src",getUserAvatar(dataObj.profile_image_url)).attr("title","来自：" + dataObj.location);
			$("#my-info .my-name").html(dataObj.name + " " + dataObj.location );
			$("#my-info .my-detail").html(detail.join(''));
			$("#followers_" + dataObj.id).bind("click",function(){
				Weibo.actions.clearLists("getFollowers",[dataObj.id]);
			})
			$("#friends_" + dataObj.id).bind("click",function(){
				Weibo.actions.clearLists("getFriends",[dataObj.id]);
			})
			$("#user_" + dataObj.id).bind("click",function(){
				Weibo._runtime.state.user_id = dataObj.id;
				Weibo.actions.clearLists("getUserTimeline",[dataObj.id]);
			})
			if(Oauth.userId != dataObj.id){
				Weibo.request.followChecke(dataObj.id);
			}
		},
		
		
		buildHomeTimeline: function(dataArr){
			
			Weibo._runtime.listData = dataArr;
			Weibo._runtime.state.home_status_id = (dataArr.length > 0) ? dataArr[dataArr.length-1].cursor_id:"";
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder.homeTimelineItem(dataArr[i]));
			}
			output.push(Weibo.builder.getMoreSection());
			
			$("#wb-list").html(output.join(''));
			
			$("#wb-list").animate({"opacity":1},100);
			
			$("#get-more-item").unbind("click").bind("click",function(){
				Weibo.request.getHomeTimeline(Weibo._runtime.state.home_status_id);
			});
			$(".wb-item").hover(function(){
				$(this).find(".btns").show().css({"opacity":1});
			},function(){
				$(this).find(".btns").hide().css({"opacity":0});
			});
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			})
			$("#wb-list p img").bind("mouseup",function(e){
				var mimg = $(this).attr("m");
				if(mimg){
					Weibo.actions.loadImage(mimg);
				}
				return false;
			});
			$("#wb-list a").bind("click",function(e){
				var rel = $(this).attr("rel");
				var url = $(this).attr("href");
				if(rel == "nofollow"){
					event.preventDefault();
					Tinco.openInBrowser(url);
				}
				return false;
			})
			$("#wb-list .btn-link").bind("click",function(e){
				var rel = $(this).attr("rel");
				var itemId = $(this).parent().attr("actionId");
				var userId = $(this).parent().attr("userId");
				//air.trace(rel + " : " + itemId + " , " + userId );
				Weibo.itemAction[rel](itemId,userId);
				return false;
			});
		},
		
		appendHomeTimeline: function(dataArr){
			
			Weibo._runtime.listData = dataArr;
			air.trace(dataArr.length,Weibo._runtime.state.home_status_id);
			
			Weibo._runtime.state.home_status_id = (dataArr.length > 0) ? dataArr[dataArr.length-1].cursor_id:"";
			
			if(dataArr.length < 30) {
				$("#get-more-item").unbind("click").html("没有更多数据可以拉取了！");
				return;
			}
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder.homeTimelineItem(dataArr[i]));
			}
			$("#get-more-item").before(output.join(''));
			
			$(".wb-item").hover(function(){
				$(this).find(".btns").show().css({"opacity":1});
			},function(){
				$(this).find(".btns").hide().css({"opacity":0});
			});
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			})
			$("#wb-list p img").bind("mouseup",function(e){
				var mimg = $(this).attr("m");
				if(mimg){
					Weibo.actions.loadImage(mimg);
				}
				return false;
			});
			$("#wb-list a").bind("click",function(e){
				var rel = $(this).attr("rel");
				var url = $(this).attr("href");
				if(rel == "nofollow"){
					event.preventDefault();
					Tinco.openInBrowser(url);
				}
				return false;
			})
			$("#wb-list .btn-link").bind("click",function(e){
				var rel = $(this).attr("rel");
				var itemId = $(this).parent().attr("actionId");
				var userId = $(this).parent().attr("userId");
				//air.trace(rel + " : " + itemId + " , " + userId );
				Weibo.itemAction[rel](itemId,userId);
				return false;
			});
		},
		
		buildUserTimeline: function(dataArr){
			
			
			Weibo._runtime.listData = dataArr;
			Weibo._runtime.state.user_status_id = (dataArr.length > 0) ? dataArr[dataArr.length-1].cursor_id:"";
			air.trace(dataArr.length,Weibo._runtime.state.user_status_id);
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder.homeTimelineItem(dataArr[i]));
			}
			if(dataArr.length == 30) {
				output.push(Weibo.builder.getMoreSection());
			}
			
			$("#wb-list").html(output.join(''));
			
			$("#wb-list").animate({"opacity":1},100);
			
			$("#get-more-item").unbind("click").bind("click",function(){
				Weibo.request.getUserTimeline(Weibo._runtime.state.user_id, Weibo._runtime.state.user_status_id);
			});
			$(".wb-item").hover(function(){
				$(this).find(".btns").show().css({"opacity":1});
			},function(){
				$(this).find(".btns").hide().css({"opacity":0});
			});
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			})
			$("#wb-list p img").bind("mouseup",function(e){
				var mimg = $(this).attr("m");
				if(mimg){
					Weibo.actions.loadImage(mimg);
				}
				return false;
			});
			$("#wb-list a").bind("click",function(e){
				var rel = $(this).attr("rel");
				var url = $(this).attr("href");
				if(rel == "nofollow"){
					event.preventDefault();
					Tinco.openInBrowser(url);
				}
				return false;
			})
			$("#wb-list .btn-link").bind("click",function(e){
				var rel = $(this).attr("rel");
				var itemId = $(this).parent().attr("actionId");
				var userId = $(this).parent().attr("userId");
				//air.trace(rel + " : " + itemId + " , " + userId );
				Weibo.itemAction[rel](itemId,userId);
				return false;
			});
		},
		
		appendUserTimeline: function(dataArr){
			
			Weibo._runtime.listData = dataArr;
			air.trace(dataArr.length,Weibo._runtime.state.user_status_id);
			
			Weibo._runtime.state.user_status_id = (dataArr.length > 0) ? dataArr[dataArr.length-1].cursor_id:"";
			
			if(dataArr.length < 30) {
				$("#get-more-item").unbind("click").html("没有更多数据可以拉取了！");
				return;
			}
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder.homeTimelineItem(dataArr[i]));
			}
			$("#get-more-item").before(output.join(''));
			
			$(".wb-item").hover(function(){
				$(this).find(".btns").show().css({"opacity":1});
			},function(){
				$(this).find(".btns").hide().css({"opacity":0});
			});
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			})
			$("#wb-list p img").bind("mouseup",function(e){
				var mimg = $(this).attr("m");
				if(mimg){
					Weibo.actions.loadImage(mimg);
				}
				return false;
			});
			$("#wb-list a").bind("click",function(e){
				var rel = $(this).attr("rel");
				var url = $(this).attr("href");
				if(rel == "nofollow"){
					event.preventDefault();
					Tinco.openInBrowser(url);
				}
				return false;
			})
			$("#wb-list .btn-link").bind("click",function(e){
				var rel = $(this).attr("rel");
				var itemId = $(this).parent().attr("actionId");
				var userId = $(this).parent().attr("userId");
				//air.trace(rel + " : " + itemId + " , " + userId );
				Weibo.itemAction[rel](itemId,userId);
				return false;
			});
		},
		
		buildMyTimeline: function(dataArr){
			
			
			Weibo._runtime.listData = dataArr;
			Weibo._runtime.state.user_status_id = (dataArr.length > 0) ? dataArr[dataArr.length-1].cursor_id:"";
			air.trace(dataArr.length,Weibo._runtime.state.user_status_id);
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder.myTimelineItem(dataArr[i]));
			}
			if(dataArr.length == 30) {
				output.push(Weibo.builder.getMoreSection());
			}
			
			$("#wb-list").html(output.join(''));
			
			$("#wb-list").animate({"opacity":1},100);
			
			$("#get-more-item").unbind("click").bind("click",function(){
				Weibo.request.getMyTimeline(Weibo._runtime.state.user_status_id);
			});
			$(".wb-item").hover(function(){
				$(this).find(".btns").show().css({"opacity":1});
			},function(){
				$(this).find(".btns").hide().css({"opacity":0});
			});
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			})
			$("#wb-list p img").bind("mouseup",function(e){
				var mimg = $(this).attr("m");
				if(mimg){
					Weibo.actions.loadImage(mimg);
				}
				return false;
			});
			$("#wb-list a").bind("click",function(e){
				var rel = $(this).attr("rel");
				var url = $(this).attr("href");
				if(rel == "nofollow"){
					event.preventDefault();
					Tinco.openInBrowser(url);
				}
				return false;
			})
			$("#wb-list .btn-link").bind("click",function(e){
				var rel = $(this).attr("rel");
				var itemId = $(this).parent().attr("actionId");
				var userId = $(this).parent().attr("userId");
				//air.trace(rel + " : " + itemId + " , " + userId );
				Weibo.itemAction[rel](itemId,userId);
				return false;
			});
		},
		
		appendMyTimeline: function(dataArr){
			
			Weibo._runtime.listData = dataArr;
			air.trace(dataArr.length,Weibo._runtime.state.user_status_id);
			
			Weibo._runtime.state.user_status_id = (dataArr.length > 0) ? dataArr[dataArr.length-1].cursor_id:"";
			
			if(dataArr.length < 30) {
				$("#get-more-item").unbind("click").html("没有更多数据可以拉取了！");
				return;
			}
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder.homeTimelineItem(dataArr[i]));
			}
			$("#get-more-item").before(output.join(''));
			
			$(".wb-item").hover(function(){
				$(this).find(".btns").show().css({"opacity":1});
			},function(){
				$(this).find(".btns").hide().css({"opacity":0});
			});
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			})
			$("#wb-list p img").bind("mouseup",function(e){
				var mimg = $(this).attr("m");
				if(mimg){
					Weibo.actions.loadImage(mimg);
				}
				return false;
			});
			$("#wb-list a").bind("click",function(e){
				var rel = $(this).attr("rel");
				var url = $(this).attr("href");
				if(rel == "nofollow"){
					event.preventDefault();
					Tinco.openInBrowser(url);
				}
				return false;
			})
			$("#wb-list .btn-link").bind("click",function(e){
				var rel = $(this).attr("rel");
				var itemId = $(this).parent().attr("actionId");
				var userId = $(this).parent().attr("userId");
				//air.trace(rel + " : " + itemId + " , " + userId );
				Weibo.itemAction[rel](itemId,userId);
				return false;
			});
		},
		
		buildMyTimeline2 : function(dataArr){
			
			Weibo._runtime.listData = dataArr;
			Weibo._runtime.homeId = (dataArr.length > 0) ? dataArr[0].id:"";
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder.myTimelineItem(dataArr[i]));
			}
			
			$("#wb-list").html(output.join(''));
			
			$("#wb-list").animate({"opacity":1},100);
			$(".wb-item").hover(function(){
				$(this).find(".btns").show().css({"opacity":1});
			},function(){
				$(this).find(".btns").hide().css({"opacity":0});
			});
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			})
			$("#wb-list p img").bind("mouseup",function(e){
				var mimg = $(this).attr("m");
				if(mimg){
					Weibo.actions.loadImage(mimg);
				}
				return false;
			});
			$("#wb-list a").bind("click",function(e){
				var rel = $(this).attr("rel");
				var url = $(this).attr("href");
				if(rel == "nofollow"){
					event.preventDefault();
					var uq = new air.URLRequest(url);
					air.navigateToURL(uq);
				}
				return false;
			})
			$("#wb-list .btn-link").bind("click",function(e){
				var rel = $(this).attr("rel");
				var itemId = $(this).parent().attr("actionId");
				var userId = $(this).parent().attr("userId");
				//air.trace(rel + " : " + itemId + " , " + userId );
				Weibo.itemAction[rel](itemId,userId);
				return false;
			});
		},
		
		buildMentionItmes: function(dataArr){
			
			air.trace("dataArr length : " +  dataArr.length);
			Weibo._runtime.listData = dataArr;
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder.mentionItem(dataArr[i]));
			}
			
			$("#wb-list").append(output.join(''));
			
			$("#wb-list").animate({"opacity":1},100);
			
			$(".wb-item").hover(function(){
				$("#wb-list").find(".btns").stop().animate({"opacity":0},200)
				$(this).find(".btns").stop().animate({"opacity":1})
			},function(){
				$(this).find(".btns").stop().animate({"opacity":0},200)
			})
			$(".wb-refer").hover(function(){
				$(this).stop().animate({"opacity":1},200);
			},function(){
				$(this).stop().animate({"opacity":0.8},100);
			})
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			})
			$("#wb-list p img").bind("mouseup",function(e){
				var mimg = $(this).attr("m");
				if(mimg){
					Weibo.actions.loadImage(mimg);
				}
				return false;
			});
			$("#wb-list a").bind("click",function(e){
				var rel = $(this).attr("rel");
				var url = $(this).attr("href");
				if(rel == "nofollow"){
					event.preventDefault();
					var uq = new air.URLRequest(url);
					air.navigateToURL(uq);
				}
				return false;
			})
			$("#wb-list .btn-link").bind("click",function(e){
				var rel = $(this).attr("rel");
				var itemId = $(this).parent().attr("actionId");
				var userId = $(this).parent().attr("userId");
				//air.trace(rel + " : " + itemId + " , " + userId );
				Weibo.itemAction[rel](itemId,userId);
				return false;
			})
		},
		
		buildCommentOutboxList : function(dataArr){
			Weibo.actions.buildCommentsList(dataArr,'byMyCommentItem');
		},
		
		buildCommentInboxList : function(dataArr){
			Weibo.actions.buildCommentsList(dataArr,'toMyCommentItem');
		},
		
		buildCommentsList: function(dataArr,builderName){
			builderName = builderName || 'byMyCommentItem'
			
			air.trace("dataArr length : " +  dataArr.length);
			Weibo._runtime.commentId = (dataArr.length > 0) ? dataArr[0].id:"";
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder[builderName](dataArr[i]));
			}
			
			$("#wb-list").append(output.join(''));
			
			$("#wb-list").animate({"opacity":1},100);
			
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			});
			
			$(".wb-refer").hover(function(){
				$(this).stop().animate({"opacity":1},200);
			},function(){
				$(this).stop().animate({"opacity":0.8},100);
			});
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			});
			$(".delete-link").bind("click",function(e){
				var actionId = $(this).attr("actionId");
				e.preventDefault();
				Weibo.request.delComment(actionId)
				return false;
			});
			$("#wb-list p img").bind("mouseup",function(e){
				var mimg = $(this).attr("m");
				if(mimg){
					Weibo.actions.loadImage(mimg);
				}
				return false;
			})
			$("#wb-list a").bind("click",function(e){
				var rel = $(this).attr("rel");
				var url = $(this).attr("href");
				if(rel == "nofollow"){
					event.preventDefault();
					var uq = new air.URLRequest(url);
					air.navigateToURL(uq);
				}
				return false;
			})
		},
		
		buildFavList : function(dataArr){
			
			air.trace("dataArr length : " +  dataArr.length);
			Weibo._runtime.mailId = (dataArr.length > 0) ? dataArr[0].id:"";
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder.favItem(dataArr[i]));
			}
			$("#wb-list").append(output.join(''));
			
			$("#wb-list").animate({"opacity":1},100);
			
			$(".wb-refer").hover(function(){
				$(this).stop().animate({"opacity":1},200);
			},function(){
				$(this).stop().animate({"opacity":0.8},100);
			});
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			});
			$("#wb-list p img").bind("mouseup",function(e){
				var mimg = $(this).attr("m");
				if(mimg){
					Weibo.actions.loadImage(mimg);
				}
				return false;
			})
			$("#wb-list a").bind("click",function(e){
				var rel = $(this).attr("rel");
				var url = $(this).attr("href");
				if(rel == "nofollow"){
					event.preventDefault();
					var uq = new air.URLRequest(url);
					air.navigateToURL(uq);
				}
				return false;
			})
			$("#wb-list .btn-link").bind("click",function(e){
				var rel = $(this).attr("rel");
				var itemId = $(this).parent().attr("actionId");
				var userId = $(this).parent().attr("userId");
				//air.trace("btnLink click :", rel + " : " + itemId + " , " + userId );
				Weibo.itemAction[rel](itemId,userId);
				return false;
			})
		},
		
		buildMailOutboxList : function(dataArr){
			Weibo.actions.buildMailList(dataArr,'mailOutboxItem');
		},
		
		buildMailInboxList : function(dataArr){
			Weibo.actions.buildMailList(dataArr,'mailInboxItem');
		},
		
		buildMailList : function(dataArr,builderName){
			air.trace("dataArr length : " +  dataArr.length);
			Weibo._runtime.mailId = (dataArr.length > 0) ? dataArr[0].id:"";
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder[builderName](dataArr[i]));
			}
			
			$("#wb-list").append(output.join(''));
			
			$("#wb-list").animate({"opacity":1},100);
			
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			});
		},
		
		
		buildFollowerList : function(dataArr){
			
			air.trace("dataArr length : " +  dataArr.length);
			if(dataArr.users){
				dataArr = dataArr.users;
			}
			
			Weibo._runtime.followId = (dataArr.length > 0) ? dataArr[0].id:"";
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder.userItem(dataArr[i]));
			}
			
			$("#wb-list").append(output.join(''));
			
			$("#wb-list").animate({"opacity":1},100);
			
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			});
			
		},
		
		buildFriendList : function(dataArr){
			
			air.trace("dataArr length : " +  dataArr.length);
			Weibo._runtime.mailId = (dataArr.length > 0) ? dataArr[0].id:"";
			
			if(dataArr.users){
				dataArr = dataArr.users;
			}
			
			var output = [];
			for(var i = 0;i < dataArr.length;i++){
				output.push(Weibo.builder.userItem(dataArr[i]));
			}
			
			
			$("#wb-list").append(output.join(''));
			
			$("#wb-list").animate({"opacity":1},100);
			
			$(".userlink").bind("mouseup",function(e){
				var userId = $(this).attr("userId");
				Weibo.actions.gotoUser(userId);
				e.preventDefault();
				return false;
			});
		},
		
		addNew: function(){
			var f = $("#post-form");
			if(!Weibo._runtime.layer || (Weibo._runtime.layer && Weibo._runtime.layer[0] != f[0])){
				Weibo.actions.hideLayer();
				$("#transdoor").html('');
				$("repostId").val('');
				$("commentId").val('');
				f.show().stop().animate({"opacity":1},300);
				Weibo._runtime.layer = f;
				$("#post-text").focus();
			}else{
				Weibo.actions.hideLayer();
			}
		},
		
		hidePost: function(){
			var f = $("#post-form");
			
			//air.trace(f.length + " : " + (((-1)*f.height())-10));
			f.stop().animate({"bottom":0,"opacity":0},200,function(){$(this).hide()});
			Weibo._runtime.layer = null;
		},
		
		sendPost: function(){
			var f = $("#post-form");
			var t = $("#post-text").val();
			$("#post-text").addClass("sending").val('').data("source",t);
			var rid = $("#repostId").val();
			var cid = $("#commentId").val();
			//air.trace("rid" +rid +"cid" +rid);
			var statusLength = getStringLength(t);
			air.trace(statusLength);
			if(statusLength > 163) {
				alert("那么多文字还能叫微博么？长话短说吧~~");
				$("#post-text").removeClass("sending").val(t).data("source","");
				return;
			}
			
			if(rid != ""){
				Weibo.request.repostStatus(rid,t);
			}else{
				if(cid !=""){
					Weibo.request.commentStatus(cid,t);
				}else{
					Weibo.request.postStatus(t);
				}
			}
			
			
		},
		
		updatePost: function(data){
			Weibo.actions.insertList(data,true);
			//Weibo._runtime.homeId = data.id;
			$("repostId").val('');
			$("commentId").val('');
			$("#transdoor").html('');
			$("#post-text").removeClass("sending").addClass("send-success");
			setTimeout(function(){
								$("#post-text").removeClass("send-success").focus().trigger('keyup');
								},2000);
		},
		
		insertList: function(data,position){
			var time = Date.parse(data.created_at);
			var now = new Date();
			var today = Date.parse(now.toDateString() + " 00:00:00");
			var xtime =today- time;
			var dateString = parseTime(xtime,time);
			var shoutString = getShoutEmotion();
			
			var tdate = new Date();
			tdate.setTime(time);
			
			var hour = tdate.getHours();
			if(hour < 10){
				hour = "0" + hour;
			}
			var minit = tdate.getMinutes();
			if(minit < 10){
				minit = "0" + minit;
			}
			
			var iclass = (!data.user.sysTag || data.user.sysTag.length < 1)?"":"daren";
			var html = '<div class="wb-item" itemId="' + data.id + '">\
					<div class="wb-content">\
						<p class="user_emote">' + dateString + ' ' + + hour + '点' + minit +'分 </p>\
						<p class="user_emote"><span class="userlink ' + iclass + '" userId="' + data.user.id + '">' + data.user.name + '</span> 通过' + data.source + shoutString + ': </p>\
						<p>' +  urlImageParse(urlParse(data.text)) +'</p>';
				if(data.thumbnail_pic){
					html += '<p><img src="' + data.thumbnail_pic +'" m="' + data.bmiddle_pic +'" /></p>';
				}		
				html += '</div>\
					<div class="wb-action">\
						<div class="avatar">\
							<span class="userlink" userId="' + data.user.id + '"><img src="' + getUserAvatar(data.user.profile_image_url) + '" width="50px" height="50px" /></span>\
						</div>';
					html += '</div>\
					<div class="clean"></div>';
				if(data.user.id == Oauth.userId){
						html += '<p class="btns" actionId="' + data.id + '" userId="' + data.user.id +'" id="item-actions-' + data.id + '"><span class="btn-link btn-delete" rel="deleteit">删除</span><span class="btn-link btn-comment" rel="comment">评论</span><span class="btn-link" rel="transdoor">转发</span><span class="btn-link btn-bookmark" rel="bookmark">收藏</span></p>';
					}else{
						html += '<p class="btns" actionId="' + data.id + '" userId="' + data.user.id +'" id="item-actions-' + data.id + '"><span class="btn-link btn-comment" rel="comment">评论</span><span class="btn-link" rel="transdoor">转发</span><span class="btn-link btn-bookmark" rel="bookmark">收藏</span></p>';
					}
				if(data.root_in_reply_to_status_text){
					html += '<div class="wb-refer">';
					html += '<p><span class="userlink" userId="' + data.root_in_reply_to_user_id +'">' + data.root_in_reply_to_user_name + '</span>：' + urlImageParse(urlParse(data.root_in_reply_to_status_text)) + '</p>';
					'</div>';
				}
				html += '</div>';
				if(!position){
					$("#wb-list").append($(html));
				}else
				{
					$("#wb-list").prepend($(html));
				}
		},
		
		insertMentionItem: function(data,position){
			var html = '<div class="wb-item" itemId="' + data.id + '">\
					<div class="wb-content">\
						<p><span class="userlink" userId="' + data.user.id + '">' + data.user.name + '</span>：</p>\
						<p>' +  urlImageParse(urlParse(data.text)) +'</p>\
						<p>来自：' + data.source +'</p>';
				if(data.thumbnail_pic){
					html += '<p><img src="' + data.thumbnail_pic +'" m="' + data.bmiddle_pic +'" /></p>';
				}
				air.trace("getUserAvatar : " + getUserAvatar(data.user.profile_image_url));
				html += '</div>\
					<div class="wb-action">\
						<div class="avatar">\
							<span class="userlink" userId="' + data.user.id + '"><img src="' + getUserAvatar(data.user.profile_image_url) + '" width="50px" height="50px" /></span>\
						</div>';
					html += '</div>\
					<div class="clean"></div>';
				html += '<p class="btns" actionId="' + data.id + '" userId="' + data.user.id +'" id="item-actions-' + data.id + '"><span class="btn-link  btn-comment" rel="comment">评论</span><span class="btn-link btn-transdoor" rel="transdoor">转发</span><span class="btn-link btn-bookmark" rel="bookmark">收藏</span></p>';
				if(data.retweeted_status){
					html += '<div class="wb-refer">';
					html += '<p><span class="userlink" userId="' + data.retweeted_status.user.id +'">' + data.retweeted_status.user.name + '</span>：' + urlParse(data.retweeted_status.text) + '</p>'; 
					if(data.retweeted_status.thumbnail_pic){
						html += '<p><img src="' + data.retweeted_status.thumbnail_pic +'" m="' + data.retweeted_status.bmiddle_pic +'" /></p>';
					}
					'</div>';
				}
				html += '</div>';
				if(!position){
					$("#wb-list").append($(html));
				}else
				{
					$("#wb-list").prepend($(html));
				}
		},
		
		hideLayer : function(){
			if(!Weibo._runtime.layer){
				return;
			}
			f = Weibo._runtime.layer;
			f.stop().animate({"opacity":0},200,function(){f.hide()});
			Weibo._runtime.layer = null;
		},
		
		showConfig : function(){
			var f = $("#custom-setting");
			if(!Weibo._runtime.layer || (Weibo._runtime.layer && Weibo._runtime.layer[0] != f[0])){
				Weibo.actions.hideLayer();
				f.show().stop().animate({"bottom":0,"opacity":1},200);
				Weibo._runtime.layer = f;
			}else{
				Weibo.actions.hideLayer();
			}
		},
		
		saveConfig : function(){
			var f = $("#custom-setting");
			f.stop().animate({"bottom":0,"opacity":0},200,function(){f.hide()});
			var data = {
				page_size : $("#page-item-length").val() + "",
				comment_size : $("#comment-item-length").val() + "",
				timer : $("#autofresh-timer").val()* 1000 + "",
				image_path : Config.newbackgroundImage
			}
			Config.pageSize = parseInt(data.page_size);
			Config.commentSize = parseInt(data.comment_size);
			Config.timer = parseInt(data.timer);
			Config.backgroundImage = data.image_path;
			
			//air.trace(JSON.stringify(data));
			Config.set(Oauth.userId,data);
		},
		
		updateConfig : function(){
			$("#page-item-length").val(Config.pageSize);
			$("#comment-item-length").val(Config.commentSize);
			$("#autofresh-timer").val(Config.timer/1000);
			
			$("#list-content").css("backgroundImage","url(" + Config.backgroundImage +")");
		},
		
		cancelConfig : function(){
			Weibo.actions.hideLayer();
			Weibo.actions.updateConfig();
		},
		
		getImage : function(){
			var file = air.File.desktopDirectory;
			var filter = new air.FileFilter("Images(*.gif;*.png;*.jpg;*.jpeg)","*.gif;*.png;*.jpg;*.jpeg"); 
			file.browseForOpen("选择背景图",new window.runtime.Array(filter));
			file.addEventListener(air.Event.SELECT,changgeBackground);
			
			function changgeBackground(event){
				var bg = event.target.url;
				var tbg = bg.toLowerCase();
				air.trace(tbg);
				air.trace(tbg.indexOf(".jpg"));
				air.trace(tbg.indexOf(".gif"));
				air.trace(tbg.indexOf(".png"));
				if(tbg.indexOf(".jpg") > 0 || tbg.indexOf(".gif") > 0 || tbg.indexOf(".png") > 0) {
					Weibo.actions.setBG(bg);
				}
			}
		},
		
		setBG : function(bg, saveFlag){
			saveFlag = saveFlag || false;
			$("#list-content").css("backgroundImage","url(" + bg + ")");
			if(saveFlag){
				Weibo.actions.showTip('<span class="button" id="save-bg">保存为默认背景?</span>');
				$("#save-bg").unbind("click").bind("click",function(){
					config.backgroundImage = bg;
					Api.File.write("config.json", config, function(){
						Weibo.actions.showTip('保存背景设置成功！',true);
					}, function(){
						Weibo.actions.showErrorTip('保存背景设置失败！',true);
					})
				});
			}
		},
		
		showAbout : function(){
			var f = $("#about-mease");
			if( !Weibo._runtime.layer || (Weibo._runtime.layer && Weibo._runtime.layer[0] != f[0])){
				Weibo.actions.hideLayer();
				f.show().stop().animate({"bottom":0,"opacity":1},200);
				Weibo._runtime.layer = f;
			}else{
				Weibo.actions.hideLayer();
			}
			
		},
		
		loadImage : function(imageUrl){
			var options = new air.NativeWindowInitOptions(); 
			options.transparent = false; 
			options.systemChrome = air.NativeWindowSystemChrome.NONE;
			options.type = air.NativeWindowType.LIGHTWEIGHT;
			 
			 if(!Weibo._runtime.win || Weibo._runtime.win.closed){
				//create the window 
				var newWindow = new air.NativeWindow(options); 
				newWindow.title = "A title";
				
				
				var sw = air.NativeWindow.systemMaxSize;
				//air.trace("sw.x :" + sw.x);
				//air.trace("sw.y :" + sw.y);
				
				var wx = window.nativeWindow.x + window.nativeWindow.width;
				var wy = window.nativeWindow.y;
				//air.trace("window.nativeWindow.x :" + window.nativeWindow.x);
				if(wx < sw.x/4){
					newWindow.x = wx;
				}else
				{
					newWindow.x = 300;
				}
				
				newWindow.y = wy;
				 
				//activate and show the new window 
				newWindow.activate();
				Weibo._runtime.win = newWindow;
				Weibo._runtime.win.stage.align = "TL"; 
				Weibo._runtime.win.stage.scaleMode = "noScale"; 
				
				var toolBar = new air.HTMLLoader();
				toolBar.load(new air.URLRequest("toolbar.html"));
				
				Weibo._runtime.win.stage.addChildAt(toolBar,0);
				
				Weibo._runtime.toolbar = toolBar;
			}
			Weibo._runtime.win.activate();
			Weibo._runtime.win.visible = true;
			//air.trace(Weibo._runtime.win.stage.numChildren);
			if(Weibo._runtime.win.stage.numChildren > 1){
				
				if(imageUrl != Weibo._runtime.imageUrl)
				{
					Weibo._runtime.win.stage.removeChildAt(1);
					var htmlView = new air.HTMLLoader();
					htmlView.x = 2;
					htmlView.y = 30;
					 
					//set the stage so display objects are added to the top-left and not scaled 
					
					Weibo._runtime.win.stage.addChildAt(htmlView,1);
					
					 
					//urlString is the URL of the HTML page to load
					htmlView.addEventListener(air.Event.COMPLETE,adjust);
					htmlView.load(new air.URLRequest(imageUrl));
					Weibo._runtime.imageUrl = imageUrl;
				}
			}else{
				var htmlView = new air.HTMLLoader();
				htmlView.x = 2;
				htmlView.y = 30;
				
				//set the stage so display objects are added to the top-left and not scaled 
				
				Weibo._runtime.win.stage.addChildAt(htmlView,1);
				
				 
				//urlString is the URL of the HTML page to load
				htmlView.addEventListener(air.Event.COMPLETE,adjust);
				htmlView.load(new air.URLRequest(imageUrl));
				Weibo._runtime.imageUrl = imageUrl;
			}
			
			function adjust(){
				//air.trace("loaded");
				Weibo._runtime.toolbar.width = htmlView.contentWidth + 4;
				htmlView.width = htmlView.contentWidth;
				htmlView.height = Math.min(htmlView.contentHeight,600);
				Weibo._runtime.toolbar.height = htmlView.height + 32;
				Weibo._runtime.win.width = htmlView.width + 4;
				Weibo._runtime.win.height = htmlView.height + 32;
			}
			
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
		
		followSomebody : function(data){
			//air.trace("followSomebody" + data.id)
			if(data.id){
				$("#followme_" + data.id).unbind("click").html("已关注");
			}
		},
		
		showRender : function(callback){
			callback = callback || function(){};
			$("#message").html("操作成功！！！").css({"backgroundColor":"#64e441","opacity":1,"top":280}).fadeIn(100);
			$("#mask").show();
			setTimeout(function(){
				$("#message").animate({"opacity":0,"top":250},300,"swing",function(){
					$(this).hide().css({"backgroundColor":"none"});
					$("#mask").hide();
					callback();
				});
			},300);
		},
		
		hideTip : function(){
			$("#globaltip").animate({"opacity":0},300,"swing",function(){
						$(this).hide();
					});
		},
		
		showTip : function(message, flag){
			$("#tip-content").html(message);
			$("#globaltip").css({"background-color":"#133C1E"}).show().animate({"opacity":1},300);
			$("#globaltip .close").unbind("click").bind("click",function(){
					$("#globaltip").css({"opacity":0}).hide();
				});
			if(flag){
				setTimeout(function(){
					$("#globaltip").animate({"opacity":0},300,"swing",function(){
						$(this).hide();
					});
				},2000);
			}
		},
		
		showErrorTip : function(message, flag){
			$("#globaltip").css({"background-color":"#8B201B"}).show().animate({"opacity":1},300).unbind("click");
			$("#tip-content").html(message);
			$("#globaltip .close").unbind("click").bind("click",function(){
					$("#globaltip").css({"opacity":0}).hide();
				});
			if(flag){
				setTimeout(function(){
					$("#globaltip").animate({"opacity":0},300,"swing",function(){
						$(this).hide();
					});
				},2000);
			}
		},
		
		addFavSuccess : function(itemId){
			//air.trace("itemId",itemId,$("#item-actions-" + itemId + " .btn-bookmar").length)
			$("#item-actions-" + itemId + " .btn-bookmark").html('已收藏').unbind("click").animate({"opacity":0.5},function(){Weibo.actions.showRender();});
		},
		
		delFavSuccess : function(itemId){
			Weibo.actions.showRender();
			$("#bookmark-" + itemId).animate({"height":0,"opacity":0},300,"swing",function(){$(this).hide()});
		},
		
		deleteItem : function(itemId){
			Weibo.actions.showRender();
			$("#comment-item-" + itemId).animate({opacity:0},400,function(){$(this).hide();});
		}
	};
	
	Weibo.Mails = {
		renderUI: function(type){
			$('.wb-mail-switcher').removeClass('custom-btn-active');
			$('.wb-mail-' + type).addClass('custom-btn-active');
		},
		
		getInbox : function(){
			Weibo.Mails.renderUI('inbox');
			Weibo.actions.clearLists('getMailsInbox',[]);
		},
		
		getOutbox : function(){
			Weibo.Mails.renderUI('outbox');
			Weibo.actions.clearLists('getMailsOutBox',[]);
		}
	};
	
	Weibo.Comments = {
		renderUI: function(type){
			$('.wb-comment-switcher').removeClass('custom-btn-active');
			$('.wb-comment-' + type).addClass('custom-btn-active');
		},
		
		getInbox : function(){
			Weibo.Comments.renderUI('inbox');
			Weibo.actions.clearLists('getCommentsToMe',[]);
		},
		
		getOutbox : function(){
			Weibo.Comments.renderUI('outbox');
			Weibo.actions.clearLists('getCommentsByMe',[]);
		}
	};
	
	Weibo.Favs = {
		refresh: function(){
			Weibo.actions.clearLists('getMyFavs',[]);
		}
	};
	
	Weibo.Mentions = {
		refresh: function(){
			Weibo.actions.clearLists('getMyMentions',[]);
		}
	};
	
	Weibo.Comments = {
		renderUI: function(type){
			$('.wb-comment-switcher').removeClass('custom-btn-active');
			$('.wb-comment-' + type).addClass('custom-btn-active');
		},
		
		getInbox : function(){
			Weibo.Comments.renderUI('inbox');
			Weibo.actions.clearLists('getCommentsToMe',[]);
		},
		
		getOutbox : function(){
			Weibo.Comments.renderUI('outbox');
			Weibo.actions.clearLists('getCommentsByMe',[]);
		}
	};
	
	Weibo.update = {
		
		init: function(){
			Weibo.update.homeTimer = setTimeout(Weibo.update.homeUpdate,Config.timer);
		},
		homeUpdate: function(){
			
			var info = Oauth.getInfo();
			var q = {
				count:200,
				oauth_consumer_key: Oauth.oauth_consumer_key,
				oauth_nonce: info.oauth_nonce,
				oauth_timestamp: info.oauth_timestamp,
				oauth_signature_method: Oauth.oauth_signature_method,
				oauth_version: Oauth.oauth_version,
				oauth_token: Oauth.access.oauth_access,
				page:1,
				source:Oauth.oauth_consumer_key
			}
			if(Weibo._runtime.homeId){
				q.since_id = Weibo._runtime.homeId;
			}
			var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
			
			var requestData = Oauth.generateSignature(q,s,WBapis.friends_timeline_api);
			
			Weibo.request.simple(requestData,Weibo.update.homeUpdateAction,function(){});
			if(Weibo.update.homeTimer){
				clearTimeout(Weibo.update.homeTimer);
				Weibo.update.homeTimer = null;
			}
			Weibo.update.homeTimer = setTimeout(Weibo.update.homeUpdate,Config.timer);
		},
		
		homeUpdateAction : function(dataArr){
			//air.trace(dataArr)
			if(dataArr.getElementsByTagName("status").length > 0 && Weibo._runtime.homeId){
				$("#action-panel").html("您有 " + dataArr.getElementsByTagName("status").length + " 条新微博信息，点击查看!").show().unbind("click").bind("click",function(){
				$("#action-panel").hide();
				$("#control .btn").removeClass("current").stop().animate({"opacity":0.4});
				$("#control .btn-home").stop().animate({"opacity":1}).addClass("current");
				var actionName = $("#control .btn-home").attr("action");
				Weibo.actions.clearLists(actionName);
				Weibo.actions.clearUser('getUserInfo',[Oauth.userId]);
			});
			}
		}
	};
	
	Weibo.builder = {
		/**
		  * 生成发件箱条目的HTML内容
		 **/
		 mailOutboxItem : function(dataObj){
			html = '<div class="wb-item" id="mail-item-' + dataObj.id +'" mailid="' + dataObj.id +'">\
					<div class="wb-content">\
						<p><span class="userlink" userId="' + dataObj.sender.id +'">我</span>  在发送给  <span class="userlink" userId="' + dataObj.recipient.id +'">' + dataObj.recipient.name + '</span> 的信中提到：</p><p> ' + urlParse(dataObj.text) +'</p>\
					</div>\
					<div class="wb-action">\
						<div class="avatar">\
							<span class="userlink" userId="' + dataObj.sender.id + '"><img src="' + dataObj.sender.profile_image_url +'" /></span>\
							<span class="userlink smaller" userId="' + dataObj.sender.id + '"><img src="' + dataObj.recipient.profile_image_url +'" /></span>\
						</div>\
						<p><span class="btn-link">回复</span><span class="btn-link">删除</span></p>\
					</div>\
					<div class="clean"></div>\
				</div>';
			return html;
		},
		
		/**
		  * 生成收件箱条目的HTML内容
		 **/
		mailInboxItem : function(dataObj){
			html =  '<div class="wb-item" id="mail-item-' + dataObj.id +'" mailid="' + dataObj.id +'">\
					<div class="wb-content">\
						<p><span class="userlink" userId="' + dataObj.sender.id +'">' + dataObj.sender.name +'</span>  在发送给  <span class="userlink" userId="' + dataObj.recipient.id +'">我</span> 的信中提到：</p><p> ' + urlParse(dataObj.text) +'</p>\
					</div>\
					<div class="wb-action">\
						<div class="avatar">\
							<span class="userlink" userId="' + dataObj.sender.id + '"><img src="' + dataObj.sender.profile_image_url +'" /></span>\
							<span class="userlink smaller" userId="' + dataObj.sender.id + '"><img src="' + dataObj.recipient.profile_image_url +'" /></span>\
						</div>\
						<p><span class="btn-link">回复</span><span class="btn-link">删除</span></p>\
					</div>\
					<div class="clean"></div>\
				</div>';
			return html;
		},
		
		/**
		  * 生成微博时间线微博条目
		 **/
		homeTimelineItem : function(dataObj,position){
			var time = Date.parse(dataObj.created_at);
			var now = new Date();
			var today = Date.parse(now.toDateString() + " 00:00:00");
			var xtime =today- time;
			var dateString = parseTime(xtime,time);
			var shoutString = getShoutEmotion();
			
			var tdate = new Date();
			tdate.setTime(time);
			
			var hour = tdate.getHours();
			if(hour < 10){
				hour = "0" + hour;
			}
			var minit = tdate.getMinutes();
			if(minit < 10){
				minit = "0" + minit;
			}
			
			var iclass = (!dataObj.user.sysTag || dataObj.user.sysTag.length < 1)?"":"daren";
			var html = '<div id="wb-timeline-' + dataObj.id + '" class="wb-item" itemId="' + dataObj.id + '">\
					<div class="wb-content">\
						<p class="user_emote">' + dateString + ' ' + + hour + '点' + minit +'分 </p>\
						<p class="user_emote"><span class="userlink ' + iclass + '" userId="' + dataObj.user.id + '">' + dataObj.user.name + '</span> 通过' + dataObj.source + shoutString + ': </p>\
						<p>' +  urlImageParse(urlParse(dataObj.text)) +'</p>';
				if(dataObj.thumbnail_pic){
					html += '<p><img src="' + dataObj.thumbnail_pic +'" m="' + dataObj.bmiddle_pic +'" /></p>';
				}		
				html += '</div>\
					<div class="wb-action">\
						<div class="avatar">\
							<span class="userlink" userId="' + dataObj.user.id + '"><img src="' + getUserAvatar(dataObj.user.profile_image_url) + '" width="50px" height="50px" /></span>\
						</div>';
					html += '</div>\
					<div class="clean"></div>';
				if(dataObj.user.id == Oauth.userId){
						html += '<p class="btns" actionId="' + dataObj.id + '" userId="' + dataObj.user.id +'" id="item-actions-' + dataObj.id + '"><span class="btn-link btn-delete" rel="deleteit">删除</span><span class="btn-link btn-comment" rel="comment">评论</span><span class="btn-link" rel="transdoor">转发</span><span class="btn-link btn-bookmark" rel="bookmark">收藏</span></p>';
					}else{
						html += '<p class="btns" actionId="' + dataObj.id + '" userId="' + dataObj.user.id +'" id="item-actions-' + dataObj.id + '"><span class="btn-link btn-comment" rel="comment">评论</span><span class="btn-link" rel="transdoor">转发</span><span class="btn-link btn-bookmark" rel="bookmark">收藏</span></p>';
					}
				if(dataObj.root_in_reply_to_status_text){
					html += '<div class="wb-refer">';
					html += '<p><span class="userlink" userId="' + dataObj.root_in_reply_to_user_id +'">' + dataObj.root_in_reply_to_user_name + '</span>：' + urlImageParse(urlParse(dataObj.root_in_reply_to_status_text)) + '</p>';
					html += '</div>';
				}
				html += '</div>';
				return html;
		},
		
		/**
		  * 生成我的微博条目
		 **/
		myTimelineItem : function(dataObj,position){
			var time = Date.parse(dataObj.created_at);
			var now = new Date();
			var today = Date.parse(now.toDateString() + " 00:00:00");
			var xtime =today- time;
			var dateString = parseTime(xtime,time);
			var shoutString = getShoutEmotion();
			
			var tdate = new Date();
			tdate.setTime(time);
			
			var hour = tdate.getHours();
			if(hour < 10){
				hour = "0" + hour;
			}
			var minit = tdate.getMinutes();
			if(minit < 10){
				minit = "0" + minit;
			}
			
			var iclass = (!dataObj.user.sysTag || dataObj.user.sysTag.length < 1)?"":"daren";
			var html = '<div class="wb-item" itemId="' + dataObj.id + '">\
					<div class="wb-content">\
						<p class="user_emote">' + dateString + ' ' + + hour + '点' + minit +'分 </p>\
						<p class="user_emote"><span class="userlink ' + iclass + '" userId="' + dataObj.user.id + '">我</span> 通过' + dataObj.source + shoutString + ': </p>\
						<p>' +  urlImageParse(urlParse(dataObj.text)) +'</p>';
				if(dataObj.thumbnail_pic){
					html += '<p><img src="' + dataObj.thumbnail_pic +'" m="' + dataObj.bmiddle_pic +'" /></p>';
				}		
				html += '</div>\
					<div class="wb-action">\
						<div class="avatar">\
							<span class="userlink" userId="' + dataObj.user.id + '">\
								<img src="' + getUserAvatar(dataObj.user.profile_image_url) + '" width="50px" height="50px" />\
							</span>\
						</div>\
					</div>\
					<div class="clean"></div>';
				if(dataObj.user.id == Oauth.userId){
						html += '<p class="btns" actionId="' + dataObj.id + '" userId="' + dataObj.user.id +'" id="item-actions-' + dataObj.id + '"><span class="btn-link btn-delete" rel="deleteit">删除</span><span class="btn-link btn-comment" rel="comment">评论</span><span class="btn-link" rel="transdoor">转发</span><span class="btn-link btn-bookmark" rel="bookmark">收藏</span></p>';
					}else{
						html += '<p class="btns" actionId="' + dataObj.id + '" userId="' + dataObj.user.id +'" id="item-actions-' + dataObj.id + '"><span class="btn-link btn-comment" rel="comment">评论</span><span class="btn-link" rel="transdoor">转发</span><span class="btn-link btn-bookmark" rel="bookmark">收藏</span></p>';
					}
				if(dataObj.root_in_reply_to_status_text){
					html += '<div class="wb-refer">';
					html += '<p><span class="userlink" userId="' + dataObj.root_in_reply_to_user_id +'">' + dataObj.root_in_reply_to_user_name + '</span>：' + urlImageParse(urlParse(dataObj.root_in_reply_to_status_text)) + '</p>';
					html += '</div>';
				}
				html += '</div>';
				return html;
		},
		
		/**
		  * 我的收藏条目
		 **/
		favItem : function(dataObj){
			var html = '<div class="wb-item" id="bookmark-' + dataObj.id + '">\
					<div class="wb-content">\
						<p><span class="userlink" userId="' + dataObj.user.id + '">' + dataObj.user.name + '</span>：' +  urlParse(dataObj.text) +'</p>\
						<p>来自：' + dataObj.source +'</p>';
				if(dataObj.thumbnail_pic){
					html += '<p><img src="' + dataObj.thumbnail_pic +'" m="' + dataObj.bmiddle_pic +'" /></p>';
				}		
				html += '</div>\
					<div class="wb-action">\
						<div class="avatar">\
							<span class="userlink" userId="' + dataObj.user.id + '"><img src="' + dataObj.user.profile_image_url + '" /></span>\
						</div>\
						<p actionId="' + dataObj.id + '" userId="' + dataObj.user.id +'" id="item-actions-' + dataObj.id + '"><span class="btn-link btn-unbookmark" rel="unbookmark">取消收藏</span></p>\
					</div>\
					<div class="clean"></div>';
				if(dataObj.retweeted_status){
					html += '<div class="wb-refer">';
					html += '<p><span class="userlink" userId="' + dataObj.retweeted_status.user.id +'">' + dataObj.retweeted_status.user.screen_name + '</span>：' + urlImageParse(urlParse(dataObj.retweeted_status.text)) + '</p>'; 
					if(dataObj.retweeted_status.thumbnail_pic){
						html += '<p><img src="' + dataObj.retweeted_status.thumbnail_pic +'" m="' + dataObj.retweeted_status.bmiddle_pic +'" /></p>';
					}
					'</div>';
				}
				html += '</div>';
			return html
		},
		
		/**
		  * @我的条目
		 **/
		mentionItem : function(dataObj){
			var html = '<div class="wb-item" itemId="' + dataObj.id + '">\
					<div class="wb-content">\
						<p><span class="userlink" userId="' + dataObj.user.id + '">' + dataObj.user.name + '</span>：</p>\
						<p>' +  urlImageParse(urlParse(dataObj.text)) +'</p>\
						<p>来自：' + dataObj.source +'</p>';
				if(dataObj.thumbnail_pic){
					html += '<p><img src="' + dataObj.thumbnail_pic +'" m="' + dataObj.bmiddle_pic +'" /></p>';
				}
				air.trace("getUserAvatar : " + getUserAvatar(dataObj.user.profile_image_url));
				html += '</div>\
					<div class="wb-action">\
						<div class="avatar">\
							<span class="userlink" userId="' + dataObj.user.id + '"><img src="' + getUserAvatar(dataObj.user.profile_image_url) + '" width="50px" height="50px" /></span>\
						</div>';
					html += '</div>\
					<div class="clean"></div>';
				html += '<p class="btns" actionId="' + dataObj.id + '" userId="' + dataObj.user.id +'" id="item-actions-' + dataObj.id + '"><span class="btn-link  btn-comment" rel="comment">评论</span><span class="btn-link btn-transdoor" rel="transdoor">转发</span><span class="btn-link btn-bookmark" rel="bookmark">收藏</span></p>';
				if(dataObj.retweeted_status){
					html += '<div class="wb-refer">';
					html += '<p><span class="userlink" userId="' + dataObj.retweeted_status.user.id +'">' + dataObj.retweeted_status.user.name + '</span>：' + urlParse(dataObj.retweeted_status.text) + '</p>'; 
					if(dataObj.retweeted_status.thumbnail_pic){
						html += '<p><img src="' + dataObj.retweeted_status.thumbnail_pic +'" m="' + dataObj.retweeted_status.bmiddle_pic +'" /></p>';
					}
					'</div>';
				}
				html += '</div>';
				return html;
		},
		
		/**
		  * 我的评论条目
		 **/
		byMyCommentItem : function(dataObj){
			var html = '<div class="wb-item" id="comment-item-' + dataObj.id + '">\
					<div class="wb-content">\
						<p><span class="userlink" userId="' + dataObj.user.id + '">' + dataObj.user.name + '</span>：' +  urlParse(dataObj.text) +'</p>';	
				html += '</div>\
					<div class="wb-action">\
						<div class="avatar">\
							<span class="userlink" userId="' + dataObj.user.id + '"><img src="' + dataObj.user.profile_image_url + '" /></span>\
						</div>';
				if(dataObj.user){
						html += '<p><span class="btn-link delete-link" actionId="' + dataObj.id + '">删除</span></p>';
				};
					html += '</div>\
					<div class="clean"></div>';
				if(dataObj.in_reply_to_status_text != ""){
					html += '<div class="wb-refer">';
					html += '<p><span class="userlink" userId="' + dataObj.root_in_reply_to_user_id +'">' + dataObj.in_reply_to_user_name + '</span>：' + urlImageParse(urlParse(dataObj.in_reply_to_status_text)) + '</p>';
					html += '</div>';
				}else
				{
					html += '<div class="wb-refer">';
					html += '<p>好像无法读取到您评论的微博内容！</p>'; 
					html += '</div>';
				}
				html += '</div>';
			return html;
		},
		
		/**
		  * 评论我的评论条目
		 **/
		toMyCommentItem : function(dataObj){
			var html = '<div class="wb-item" id="comment-item-' + dataObj.id + '">\
					<div class="wb-content">\
						<p><span class="userlink" userId="' + dataObj.user.id + '">' + dataObj.user.name + '</span>：' +  urlParse(dataObj.text) +'</p>';	
				html += '</div>\
					<div class="wb-action">\
						<div class="avatar">\
							<span class="userlink" userId="' + dataObj.user.id + '"><img src="' + dataObj.user.profile_image_url + '" /></span>\
						</div>';
				if(dataObj.user){
						html += '<p><span class="btn-link delete-link" actionId="' + dataObj.id + '">删除</span></p>';
				};
					html += '</div>\
					<div class="clean"></div>';
				if(dataObj.in_reply_to_status_text != ""){
					html += '<div class="wb-refer">';
					html += '<p><span class="userlink" userId="' + dataObj.root_in_reply_to_user_id +'">' + dataObj.in_reply_to_user_name + '</span>：' + urlImageParse(urlParse(dataObj.in_reply_to_status_text)) + '</p>';
					html += '</div>';
				}else
				{
					html += '<div class="wb-refer">';
					html += '<p>好像无法读取到您评论的微博内容！</p>'; 
					html += '</div>';
				}
				html += '</div>';
			return html;
		},
		
		/**
		  * 用户列表条目
		 **/
		userItem : function(dataObj){
			html = '<div class="wb-item" id="follower-item-' + dataObj.id +'">\
					<div class="wb-content">\
						<p><span class="userlink" userId="' + dataObj.sender_id +'">' + dataObj.screen_name +'</span>  来自：' + dataObj.location +'</p>';
						if(dataObj.description !=""){
							html += '<p>' + dataObj.description +'</p>';
						}
						if(dataObj.url !="http://1"){
							html += '<p>' + dataObj.url +'</p>';
						}
						html += '<p>共发表了 <b>' + dataObj.statuses_count + '</b> 条微博语录，有 <b>' + dataObj.followers_count + '</b> 个粉丝关注他，而他成为了 <b>' + dataObj.friends_count + '</b> 个人的粉丝!</p>\
					</div>\
					<div class="wb-action">\
						<div class="avatar">\
							<span class="userlink" userId="' + dataObj.id + '"><img src="' + dataObj.profile_image_url +'" /></span>\
						</div>';
						if(!dataObj.following){
							html += '<p><span class="btn-link">关注他</span><br /></p>';
						}else {
							html += '<p><span class="btn-link">取消关注</span><br /></p>';
						}
					html += '</div>\
					<div class="clean"></div>\
				</div>';
			return html;
		},
		
		/**
		  * 获取更多
		 **/
		getMoreSection : function(dataObj){
			html = '<div class="wb-item wb-getmore-item" id="get-more-item">查看更多(点击)</div>';
			return html;
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
			Weibo.actions.setBG(droppedText[0].url,true);
		}
		
	})
	
	ST.regSuccessEvent(Weibo.actions.hideMessage);
	APP.Weibo = Weibo;
	
})();