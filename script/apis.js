var WBapis = {
    cancel_friend_api: "http://api.t.163.com/friendships/destroy/",
    comments_api: "http://api.t.163.com/statuses/comments/",
    comments_by_me_api: "http://api.t.163.com/statuses/comments_by_me.json",
    counts_api: "http://api.t.163.com/statuses/counts.json",
    del_comment_api: "http://api.t.163.com/statuses/destroy/",
    favorite_create_api: "http://api.t.163.com/favorites/create.json",
    favorite_destroy_api: "http://api.t.163.com/favorites/destroy/",
    follow_api: "http://api.t.163.com/friendships/create/",
    follow_check_api: "http://api.t.163.com/friendships/show.json",
    followers_api: "http://api.t.163.com/statuses/followers.json",
    friends_api: "http://api.t.163.com/statuses/friends.json",
    friends_timeline_api: "http://api.t.163.com/statuses/friends_timeline.xml",
    home_timeline_api: "http://api.t.163.com/statuses/home_timeline.json",
    mention_api: "http://api.t.163.com/statuses/mentions.json",
    my_favs_api: "http://api.t.163.com/favorites/",
    my_inbox_mail_api: "http://api.t.163.com/direct_messages.json",
    my_outbox_mail_api: "http://api.t.163.com/direct_messages/sent.json",
    my_timeline_api: "http://api.t.163.com/statuses/user_timeline.json",
    post_comment_api: "http://api.t.163.com/statuses/reply.json",
    post_long_content_api: "http://xxx/weibo/upload.php",
    post_message_api: "http://api.t.163.com/statuses/update.json",
    rate_limit_api: "http://api.t.163.com/account/rate_limit_status.json",
    retweet_api: "http://api.t.163.com/statuses/retweet/",
    send_mail_api: "http://api.t.163.com/direct_messages/new.json",
    status_destroy_api: "http://api.t.163.com/statuses/destroy/",
    unread_api: "http://api.t.163.com/statuses/unread.json",
    user_info_api: "http://api.t.163.com/users/show.json",
    user_timeline_api: "http://api.t.163.com/statuses/user_timeline.json",
    verify_api: "http://api.t.163.com/account/verify_credentials.json"
};

var WBactions = {

    apis: {
        home_timeline_api: "http://api.t.163.com/statuses/home_timeline.json",
        public_timeline_api: "http://api.t.163.com/statuses/public_timeline.json",
        mentions_api: "http://api.t.163.com/statuses/mentions.json",
        user_timeline_api: "http://api.t.163.com/statuses/user_timeline.json",
        retweets_api: "http://api.t.163.com/statuses/retweets_of_me.json",
        location_timeline_api: "http://api.t.163.com/statuses/location_timeline.json",
        comments_by_me_api: "http://api.t.163.com/statuses/comments_by_me.json",
        comments_to_me_api: "http://api.t.163.com/statuses/comments_to_me.json",

        status_update_api: "http://api.t.163.com/statuses/update.json",
        status_reply_api: "http://api.t.163.com/statuses/reply.json",
        status_retweet_api: "http://api.t.163.com/statuses/retweet/",
        status_show_api: "http://api.t.163.com/statuses/show/",
        status_comments_api: "http://api.t.163.com/statuses/comments/",
        status_destroy_api: "http://api.t.163.com/statuses/destroy/",
        status_retweeted_by_api: "http://api.t.163.com/statuses/id/retweeted_by.json",
        status_upload_api: "http://api.t.163.com/statuses/upload.json",

        user_show_api: "http://api.t.163.com/users/show.json",
        user_friends_api: "http://api.t.163.com/statuses/friends.json",
        user_followers_api: "http://api.t.163.com/statuses/followers.json",
        user_suggestions_api: "http://api.t.163.com/users/suggestions.json",
        user_suggestions_i_followers_api: "http://api.t.163.com/users/suggestions_i_followers.json",

        friendships_create_api: "http://api.t.163.com/friendships/create.json",
        friendships_destroy_api: "http://api.t.163.com/friendships/destroy.json",
        friendships_show_api: "http://api.t.163.com/friendships/show.json",

        trends_recommended_api: "http://api.t.163.com/trends/recommended.json",

        topRetweets_api: "http://api.t.163.com/statuses/topRetweets.json",
        topRetweets_type_api: "http://api.t.163.com/statuses/topRetweets/type.json",

        direct_messages_inbox_api: "http://api.t.163.com/direct_messages.json",
        direct_messages_outbox_api: "http://api.t.163.com/direct_messages/sent.json",
        direct_messages_new_api: "http://api.t.163.com/direct_messages/new.json",
        direct_messages_destroy_api: "http://api.t.163.com/direct_messages/destroy/",

        account_register_api: "http://api.t.163.com/account/register.json",
        account_update_profile_api: "http://api.t.163.com/account/update_profile.json",
        account_update_profile_image_api: "http://api.t.163.com/account/update_profile_image.json",
        account_verify_credentials_api: "http://api.t.163.com/account/verify_credentials.json",
        account_reminds_message_lastest_api: "http://api.t.163.com/reminds/message/latest.json",
        account_rate_limit_status_api: "http://api.t.163.com/account/rate_limit_status.json",

        favorites_list_api: "http://api.t.163.com/favorites/",
        favorites_create_api: "http://api.t.163.com/favorites/create/",
        favorites_destroy_api: "http://api.t.163.com/favorites/destroy/",

        blocks_create_api: "http://api.t.163.com/blocks/create.json",
        blocks_destroy_api: "http://api.t.163.com/blocks/destroy.json",
        blocks_exists_api: "http://api.t.163.com/blocks/exists.json",
        blocks_blocking_api: "http://api.t.163.com/blocks/blocking.json",
        blocks_blocking_ids_api: "http://api.t.163.com/blocks/blocking/ids.json",

        location_venues_api: "http://api.t.163.com/location/venues.json",

        search_api: "http://api.t.163.com/search.json",
        search_users_api: "hhttp://api.t.163.com/users/search.json",

        oauth_request_token_api: "http://api.t.163.com/oauth/request_token",
        oauth_authenticate_api: "http://api.t.163.com/oauth/authenticate",
        oauth_authorize_api: "http://api.t.163.com/oauth/authorize",
        oauth_access_token_api: "http://api.t.163.com/oauth/access_token"
    },

    /**
     * request�B4
     **/
    createRquestHeader: function(optionObj, apiUrl){

		var method = optionObj.method || "GET";
        var info = Oauth.getInfo();
        var q = {
            oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
            oauth_signature_method: Oauth.oauth_signature_method,
            oauth_version: Oauth.oauth_version,
            oauth_token: Oauth.access.oauth_access,
            source: Oauth.oauth_consumer_key
        }
        for (var i in optionObj){
            q[i] = optionObj[i];
        }
        var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];

        return Oauth.generateSignature(q, s, apiUrl, method);

    },
    /**
     * request�B4
     **/
    doRquest: function(requestHeader, callback, failNumer){
        var args = arguments;
        failNumer = failNumer || 0;
        failNumer++;
        //air.trace("Weibo.request.stimer" + Weibo.request.stimer);
        errorHandle = errorHandle ||
        function(){
            };

        if (failNumer < 3){
            Weibo._runtime.srequest = Oauth.requestStart(requestHeader, handle, errorHandle);
        } else{

            }

        function errorHandle(){
            args.callee.call(null, requestHeader, callback, failNumer);
        }

        function timeoutHandle(){
            WBactions.doTimeout();
        }

        function handle(event){
            var loader = air.URLLoader(event.target);
            var data;
            if (loader.data.indexOf("xml version") > 0){
                var xmlParse = new DOMParser()
                data = xmlParse.parseFromString(loader.data, "text/xml");
            } else{
                data = JSON.parse(loader.data);
            }
            callback.call(null, data);
			WBactions.doSuccess();
        }

    },
    /**
     * �B1%���:
     **/
    doTimeout: function(){
    },
	
	/**
     * �B1%���:
     **/
    doSuccess: function(){
    },
	
	
    /**
     * ��h�s���Zh
     **/
    getHomeTimeline: function(opts, callback){

        var apiUrl = WBactions.apis.home_timeline_api;

        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��lq�Zh
     **/
    getPublicTimeline: function(opts, callback){
        var apiUrl = WBactions.apis.public_timeline_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��@��Zh
     **/
    getMentions: function(opts, callback){
        var apiUrl = WBactions.apis.mentions_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ���(7��Zh
     **/
    getUserTimeline: function(opts, callback){
        var apiUrl = WBactions.apis.user_timeline_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ���lф�Zh
     **/
    getRetweets: function(opts, callback){
        var apiUrl = WBactions.apis.retweets_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��+	0Mn�o��Zh
     **/
    getLocaitonTimeline: function(opts, callback){
        var apiUrl = WBactions.apis.location_timeline_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ���h�ĺh
     **/
    getCommentsByMe: function(opts, callback){
        var apiUrl = WBactions.apis.comments_by_me_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��60�ĺh
     **/
    getCommentsToMe: function(opts, callback){
        var apiUrl = WBactions.apis.comments_to_me_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * �a�Z
     **/
    doUpdateStatus: function(opts, callback){
        var apiUrl = WBactions.apis.status_update_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ĺa�Z
     **/
    doReplyStatus: function(opts, callback){
        var apiUrl = WBactions.apis.status_reply_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * l�a�Z
     **/
    doRetweetStatus: function(opts, callback){
        var apiUrl = WBactions.apis.status_retweet_api + opts.targetID + ".json";
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ����Z�o
     **/
    doShowStatus: function(opts, callback){
        var apiUrl = WBactions.apis.status_show_api + opts.targetID + ".json";;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ������@	ĺ
     **/
    doGetStatusComments: function(opts, callback){
        var apiUrl = WBactions.apis.status_comments_api + opts.targetID + ".json";
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     *  d��Z
     **/
    doDestroyStatus: function(opts, callback){
        var apiUrl = WBactions.apis.status_destroy_api + opts.targetID + ".json";
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��6��Z�Zlф�o
     **/
    doGetStatusRetweetId: function(opts, callback){
        var apiUrl = WBactions.apis.status_retweeted_by_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * 
 �G
     **/
    doUploadImage: function(opts, callback){
        var apiUrl = WBactions.apis.status_upload_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ����(7��o
     **/
    getUserInfo: function(opts, callback){
        var apiUrl = WBactions.apis.user_show_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��(7�s�h
     **/
    getUserFriends: function(opts, callback){
        var apiUrl = WBactions.apis.user_friends_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��(7��s�h
     **/
    getUserFollowers: function(opts, callback){
        var apiUrl = WBactions.apis.user_followers_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * �֨P(7h
     **/
    getUserSuggestion: function(opts, callback){
        var apiUrl = WBactions.apis.user_suggestions_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * �֨P��/��(7h
     **/
    getUserVtagSuggestion: function(opts, callback){
        var apiUrl = WBactions.apis.user_suggestions_i_followers_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��s�s�
     **/
    doCheckFriendship: function(opts, callback){
        var apiUrl = WBactions.apis.friendships_show_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * s��(7
     **/
    doCreateFriendship: function(opts, callback){
        var apiUrl = WBactions.apis.friendships_create_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ֈs��(7
     **/
    doDestroyFriendship: function(opts, callback){
        var apiUrl = WBactions.apis.friendships_destroy_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * �֨Pݘ
     **/
    getRecommendedTrends: function(opts, callback){
        var apiUrl = WBactions.apis.trends_recommended_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��60���h
     **/
    getMailsInbox: function(opts, callback){
        var apiUrl = WBactions.apis.direct_messages_inbox_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ������h
     **/
    getMailsOutbox: function(opts, callback){
        var apiUrl = WBactions.apis.direct_messages_outbox_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ���
     **/
    doCreateMail: function(opts, callback){
        var apiUrl = WBactions.apis.direct_messages_new_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     *  d��
     **/
    doDestroyMail: function(opts, callback){
        var apiUrl = WBactions.apis.direct_messages_destroy_api + opts.targetID + ".json";
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * �(7
     **/
    doRegeisterAccount: function(opts, callback){
        var apiUrl = WBactions.apis.account_register_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * �9(7D�
     **/
    doUpdateAccountProfile: function(opts, callback){
        var apiUrl = WBactions.apis.account_update_profile_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * �9(74�
     **/
    doUpdateAccountAvatar: function(opts, callback){
        var apiUrl = WBactions.apis.account_update_profile_image_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��(7�Cŵv��(7�o
     **/
    doVerifyAccount: function(opts, callback){
        var apiUrl = WBactions.apis.account_verify_credentials_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��(7*�o
     **/
    getLatestMessage: function(opts, callback){
        var apiUrl = WBactions.apis.account_reminds_message_lastest_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��SM(7API��P6
     **/
    getApiRateStatus: function(opts, callback){
        var apiUrl = WBactions.apis.account_rate_limit_status_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * 6��a�Z�o
     **/
    doBookmarkStatus: function(opts, callback){
        var apiUrl = WBactions.apis.favorites_create_api + opts.targetID + ".json";
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ֈ6��a�Z
     **/
    doDestrotyBookmark: function(opts, callback){
        var apiUrl = WBactions.apis.favorites_destroy_api + opts.targetID + ".json";
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * �֮Z6�h
     **/
    getBookmarks: function(opts, callback){
        var apiUrl = WBactions.apis.favorites_list_api + opts.targetID + ".json";
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * �к�e�
U
     **/
    doCeateBlockUser: function(opts, callback){
        var apiUrl = WBactions.apis.blocks_create_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ֈ��(7
     **/
    doDestroyBlockUser: function(opts, callback){
        var apiUrl = WBactions.apis.blocks_destroy_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��/&���
     **/
    doCheckBlock: function(opts, callback){
        var apiUrl = WBactions.apis.blocks_exists_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ����h
     **/
    getBlockUsers: function(opts, callback){
        var apiUrl = WBactions.apis.blocks_blocking_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ����h�	ID
     **/
    getBlockUserIds: function(opts, callback){
        var apiUrl = WBactions.apis.blocks_blocking_ids_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * ��0h
     **/
    getLocations: function(opts, callback){
        var apiUrl = WBactions.apis.location_venues_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * "�Z
     **/
    doSearchStatus: function(opts, callback){
        var apiUrl = WBactions.apis.search_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    },
    /**
     * "(7
     **/
    doSearchUsers: function(opts, callback){
        var apiUrl = WBactions.apis.search_users_api;
        
        // create httpRequestHeader
        var requestData = WBactions.createRquestHeader(opts, apiUrl);

        WBactions.doRquest(requestData, callback);
    }
};

(function() {

	
	var ST = {
		regSuccessEvent : function(func){
			doSuccess = func;
		}
	};
	
	var console = {
		log: function() {
			var result = [];
			for(var i = 0;i < arguments.length;i++) {
				result.push(arguments[i]);
			}
			air.trace(result.join(" | "));
		}
	};
	
	var apiRequest;
	var emptyFunc = function(){};
	var doTimeout = emptyFunc;
    var doSuccess = emptyFunc;
	
	var createRquestHeader =function(optionObj, apiUrl, method){
		method = method|| "GET";
        var info = Oauth.getInfo();
        var q = {
            oauth_consumer_key: Oauth.oauth_consumer_key,
            oauth_nonce: info.oauth_nonce,
            oauth_timestamp: info.oauth_timestamp,
            oauth_signature_method: Oauth.oauth_signature_method,
            oauth_version: Oauth.oauth_version,
            oauth_token: Oauth.access.oauth_access,
            source: Oauth.oauth_consumer_key
        }
        for (var i in optionObj){
            q[i] = optionObj[i];
        }
        var s = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];

        return Oauth.generateSignature(q, s, apiUrl,method);

    }

	
    var doRquest = function(requestHeader, callback, failNumer){
        var args = arguments;
        failNumer = failNumer || 0;
        failNumer++;
        //air.trace("Weibo.request.stimer" + Weibo.request.stimer);
        errorHandle = errorHandle ||emptyFunc;

        if (failNumer < 3){
            apiRequest = Oauth.requestStart(requestHeader, handle, errorHandle);
        } else{

            }

        function errorHandle(){
            args.callee.call(null, requestHeader, callback, failNumer);
        }

        function timeoutHandle(){
            doTimeout();
        }

        function handle(event){
            var loader = air.URLLoader(event.target);
            var data;
            if (loader.data.indexOf("xml version") > 0){
                var xmlParse = new DOMParser()
                data = xmlParse.parseFromString(loader.data, "text/xml");
            } else{
                data = JSON.parse(loader.data);
            }
            callback.call(null, data);
			doSuccess();
        }

    };
	
	var buildURL = function(url, params){
        var tmp = url.split("?");
        var uri = tmp[0];
        var ps = null;
        if (tmp.length > 1) ps = tmp[1].split("&");
        var pnames = uri.match(/{\w+}/g);
        if (pnames != null) {
            for (var i=0; i<pnames.length; ++i){
                var pn = pnames[i];
                var ppn = pnames[i].match(/{(\w+)}/)[1];
                if (!params[ppn]) return null;
                else uri = uri.replace(pn, params[ppn]);
            }
        }
        if (!ps) return uri;
        var re_ps = [];
        for (var i=0; i<ps.length; ++i) {
            var tmp = ps[i].match(/{(\w+)}/);
            if (tmp==null) re_ps.push(ps[i]);
            else {
                var pn = tmp[0];
                var ppn = tmp[1];
                if (params[ppn]) re_ps.push(encodeURI(ps[i].replace(pn, params[ppn])));
            }
        }
        if (re_ps.length>0) return [uri, re_ps.join("&")].join("?");
        else return uri;
    };
	
    
	
	var apis = {
		get_home_timeline: {
			"url": "http://api.t.163.com/statuses/home_timeline.json"
		},
        get_public_timeline: {
			"url": "http://api.t.163.com/statuses/public_timeline.json"
		},
        get_mentions: {
			"url": "http://api.t.163.com/statuses/mentions.json"
		},
        get_user_timeline: {
			"url": "http://api.t.163.com/statuses/user_timeline.json"
		},
        get_retweets: {
			"url": "http://api.t.163.com/statuses/retweets_of_me.json"
		},
        get_location_timeline: {
			"url": "http://api.t.163.com/statuses/location_timeline.json"
		},
        get_comments_by_me: {
			"url": "http://api.t.163.com/statuses/comments_by_me.json"
		},
        get_comments_to_me: {
			"url": "http://api.t.163.com/statuses/comments_to_me.json"
		},

        do_status_update: {
			"url": "http://api.t.163.com/statuses/update.json",
			"method":"POST"
		},
        do_status_reply: {
			"url": "http://api.t.163.com/statuses/reply.json",
			"method":"POST"
		},
        do_status_retweet: {
			"url": "http://api.t.163.com/statuses/retweet/{id}.json",
			"method":"POST"
		},
        do_status_show: {
			"url": "http://api.t.163.com/statuses/show/{id}.json"
		},
        get_status_comments: {
			"url": "http://api.t.163.com/statuses/comments/{id}.json"
		},
        do_status_destroy: {
			"url": "http://api.t.163.com/statuses/destroy/{id}.json",
			"method":"POST"
		},
        get_status_retweeted_by: {
			"url": "http://api.t.163.com/statuses/id/retweeted_by.json"
		},
        do_status_upload: {
			"url": "http://api.t.163.com/statuses/upload.json"
		},

        get_user_show: {
			"url": "http://api.t.163.com/users/show.json"
		},
        get_user_friends: {
			"url": "http://api.t.163.com/statuses/friends.json"
		},
        get_user_followers: {
			"url": "http://api.t.163.com/statuses/followers.json"
		},
        get_user_suggestions: {
			"url": "http://api.t.163.com/users/suggestions.json"
		},
        get_user_suggestions_i_followers: {
			"url": "http://api.t.163.com/users/suggestions_i_followers.json"
		},

        do_friendships_create: {
			"url": "http://api.t.163.com/friendships/create.json",
			"method":"POST"
		},
        do_friendships_destroy: {
			"url": "http://api.t.163.com/friendships/destroy.json",
			"method":"POST"
		},
        get_friendships_show: {
			"url": "http://api.t.163.com/friendships/show.json"
		},

        get_trends_recommended: {
			"url": "http://api.t.163.com/trends/recommended.json"
		},

        get_topRetweets: {
			"url": "http://api.t.163.com/statuses/topRetweets.json"
		},
        get_topRetweets_type: {
			"url": "http://api.t.163.com/statuses/topRetweets/type.json"
		},

        get_direct_messages_inbox: {
			"url": "http://api.t.163.com/direct_messages.json"
		},
        get_direct_messages_outbox: {
			"url": "http://api.t.163.com/direct_messages/sent.json"
		},
        do_direct_messages_new: {
			"url": "http://api.t.163.com/direct_messages/new.json"
		},
        do_direct_messages_destroy: {
			"url": "http://api.t.163.com/direct_messages/destroy/{id}.json"
		},

        do_account_register: {
			"url": "http://api.t.163.com/account/register.json"
		},
        do_account_update_profile: {
			"url": "http://api.t.163.com/account/update_profile.json"
		},
        do_account_update_profile_image: {
			"url": "http://api.t.163.com/account/update_profile_image.json"
		},
        do_account_verify_credentials: {
			"url": "http://api.t.163.com/account/verify_credentials.json"
		},
        do_account_reminds_message_lastest: {
			"url": "http://api.t.163.com/reminds/message/latest.json"
		},
        do_account_rate_limit_status: {
			"url": "http://api.t.163.com/account/rate_limit_status.json"
		},

        get_favorites_list: {
			"url": "http://api.t.163.com/favorites/{id}.json"
		},
        do_favorites_create: {
			"url": "http://api.t.163.com/favorites/create/{id}.json",
			"method":"POST"
		},
        do_favorites_destroy: {
			"url": "http://api.t.163.com/favorites/destroy/{id}.json",
			"method":"POST"
		},

        do_blocks_create: {
			"url": "http://api.t.163.com/blocks/create.json"
		},
        do_blocks_destroy: {
			"url": "http://api.t.163.com/blocks/destroy.json"
		},
        do_blocks_exists: {
			"url": "http://api.t.163.com/blocks/exists.json"
		},
        get_blocks_blocking: {
			"url": "http://api.t.163.com/blocks/blocking.json"
		},
        get_blocks_blocking_ids: {
			"url": "http://api.t.163.com/blocks/blocking/ids.json"
		},

        get_location_venues: {
			"url": "http://api.t.163.com/location/venues.json"
		},

        get_search_status: {
			"url": "http://api.t.163.com/search.json"
		},
        get_search_users: {
			"url": "http://api.t.163.com/users/search.json"
		},

        do_oauth_request_token: {
			"url": "http://api.t.163.com/oauth/request_token"
		},
        do_oauth_authenticate: {
			"url": "http://api.t.163.com/oauth/authenticate"
		},
        do_oauth_authorize: {
			"url": "http://api.t.163.com/oauth/authorize"
		},
        do_oauth_access_token: {
			"url": "http://api.t.163.com/oauth/access_token"
		}
	}
	
	for (var name in apis) {
        ST[name] = (function(url, method){
            return function(opts,callback){
				apiUrl = buildURL(url,opts);
				console.log(apiUrl);
				
                // create httpRequestHeader
				var requestData = createRquestHeader(opts, apiUrl, method);
				doRquest(requestData, callback);
            };
        })(apis[name].url,apis[name].method)
	}
	window.ST = ST;
	window.APP = window.APP || {};
})();


(function($){
		RC = window.RC || {};
		$.extend(RC,(function(){
			
			var w = window;
			var winList = {};
			
			function openWindow(name, width, height){
				var options = new air.NativeWindowInitOptions(); 
				options.transparent = true; 
				options.systemChrome = air.NativeWindowSystemChrome.NONE;
				options.type = air.NativeWindowType.LIGHTWEIGHT;
			
				if(!winList[name]) {
					var newWindow = new air.NativeWindow(options); 
					newWindow.title = "Startfeel.com";
					newWindow.width = width;
					newWindow.height = height;
					
					// position fix to center
					newWindow.x = (window.screen.width-width)/2;
					newWindow.y = (window.screen.height-height)/2;
					
					var htmlView = new air.HTMLLoader();
					htmlView.x = 0;
					htmlView.y = 0;
					htmlView.width = width;
					htmlView.height = height;
					
					newWindow.stage.align = "TL"; 
					newWindow.stage.scaleMode = "noScale";
					newWindow.stage.addChildAt(htmlView,0);
					
					//urlString is the URL of the HTML page to load
					//htmlView.addEventListener(air.Event.COMPLETE,adjust);
					htmlView.load(new air.URLRequest(name + ".html"));
					
					//activate and show the new window 
					newWindow.activate();
					newWindow.visible = true;
					
					winList[name] = newWindow;
				}
				
			}
			
			// Function for making new native windows.
		// Takes no arguments.
		function makeNativeWindow(name, width, height) {

			// For window options:
			var options = new air.NativeWindowInitOptions();
			options.transparent = true; 
			options.systemChrome = air.NativeWindowSystemChrome.NONE;
			options.type = air.NativeWindowType.LIGHTWEIGHT;

			// Window size and location:
			var x =  (window.screen.width-width)/2;
			var y = (window.screen.height-height)/2;
			var rect = new air.Rectangle(x, y, width, height);

			// Create the window:
			var popup = air.HTMLLoader.createRootWindow(true, options, false, rect);

			// Load the content:
			var page = air.File.applicationDirectory.resolvePath(name + '.html');
			popup.addEventListener(air.Event.COMPLETE,completetHandler);
			popup.load(new air.URLRequest(page.url));
			
			function completetHandler (){
				popup.window.windowInit(window);
				popup.removeEventListener(air.Event.COMPLETE,completetHandler);
			}

		} // End of makeNativeWindow() function.
		
			function downloadUpdate(){
				makeNativeWindow('update', 400, 260)
			}
			function showSettings(){
				makeNativeWindow('settings',400,300);
			}
			function changeBgs(){
				makeNativeWindow('background',600,400);
			}
			
			function MeaseBgs(){
				makeNativeWindow('recommend',600,400);
			}
			
			
			function saveConfig(config) {
				var localConfig = Api.File.read("config.json",true);
				$.extend(localConfig,config);
				Api.File.write("config.json", localConfig, function(){
					APP.Weibo.actions.showTip('设置保存成功！',true);
				}, function(){
					APP.Weibo.actions.showErrorTip('设置保存失败！',true);
				})
			}
			
			return {
				openWindow : openWindow,
				openWin: makeNativeWindow,
				downloadUpdate: downloadUpdate,
				changeBgs:changeBgs,
				MeaseBgs: MeaseBgs,
				showSettings:showSettings,
				wins:winList,
				saveConfig: saveConfig
			};
		})())
})(jQuery)