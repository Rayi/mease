var Config = {
	
	autoSignIn:true,
	pageSize: 20,
	commentSize: 5,
	timer: 30000,
	backgroundImage :"images/defalut_bg.png",
	
	_update:function(event){
		//air.trace("success select");
		var statment = event.target;
		//air.trace(statment);
		var result = statment.getResult();
		//air.trace(result);
		if(result.data == null){
			//air.trace("insert no data");
			
		}else{
			var data = result.data;
			//air.trace(data[0].page_size + " : " + data[0].comment_size+ " : " + data[0].timer+ " : " + data[0].image_path);
			if(data.length == 1){
				Config.pageSize = parseInt(data[0].page_size);
				Config.commentSize = parseInt(data[0].comment_size);
				Config.timer = parseInt(data[0].timer);
				Config.backgroundImage = data[0].image_path;
				//air.trace("init data success : " + data[0].page_size + "|" + data[0].comment_size + "|" + data[0].timer + "|" + data[0].image_path);
			}
		}
	},
	get:function(userId,func){
		userId = userId +"";
		func = func || function(){};
		var userFile = air.File.applicationStorageDirectory.resolvePath(userId + ".db");
		//air.trace("userFile.exists : " +userFile.exists)
		if(userFile.exists){
			//air.trace("userFile.exists : " +userFile.nativePath);
			var conn = DB.create(userId,nect);
			
			function nect(){
				//air.trace("start select");
				DB.query(conn,"SELECT * FROM config",null,function(event){Config._update(event);func()});
			}
			
		}else{
			var sql = "CREATE TABLE IF NOT EXISTS config (" +  
				"    id INTEGER PRIMARY KEY AUTOINCREMENT, " + 
				"    timer TEXT, " +
				"    page_size TEXT, " +  
				"    comment_size TEXT," +
				"    image_path TEXT" +
				")";
			var conn = DB.create(userId,next);
			function next(){
				//air.trace("start create");
				DB.query(conn,sql,null,function(){Config.set(Oauth.userId)});
			}
			
		}
	},
	set:function(userId,data){
		
		userId = userId || Oauth.userId;
		userId = userId +"";
		//air.trace(userId,data);
		data = data || {
			page_size : Config.pageSize + "",
			comment_size : Config.commentSize + "",
			timer : Config.timer + "",
			image_path : Config.backgroundImage
		};
		
		var userFile = air.File.applicationStorageDirectory.resolvePath(userId + ".db");
		if(userFile.exists){
			var sql = "UPDATE config SET page_size=?,comment_size=?,timer=?,image_path=? WHERE id=1";
			var conn = DB.create(userId,nect);
			
			function nect(){
				//air.trace("start insert");
				DB.query(conn,sql,[data.page_size,data.comment_size,data.timer,data.image_path],function(){
																										 //air.trace("success insert");
																								});
			}
			
		}
	}
};

var Oauth = {
	request : {
		oauth_token:"",
		oauth_token_secret:""
	},
	authrize:{
		verifier:""
	},
	access:{
		oauth_access:"",
		oauth_access_secret:""
	},
	oauth_consumer_key : "",
	oauth_consumer_key_secret : "",
	oauth_signature_method : "HMAC-SHA1",
	oauth_version : "1.0",
	oauth_method : "GET",
	request_token_api : "http://api.t.163.com/oauth/request_token",
	authorize_api : "http://api.t.163.com/oauth/authenticate",
	access_token_api : "http://api.t.163.com/oauth/access_token",
	verify_api: 'http://api.t.163.com/account/verify_credentials.json',
	signatureArr:["count", "comment", "cursor", "id", "ids", "is_comment", "is_comment_to_root", "is_retweet", "lat", "long", "max_id", "oauth_consumer_key", "oauth_nonce", "oauth_signature_method", "oauth_timestamp", "oauth_token", "oauth_verifier", "oauth_version", "page", "vid", "screen_name", "since_id", "status", "target_id", "text", "trim_user", "user_id", "x_auth_mode", "x_auth_password", "x_auth_username"],
	requestTimer:0,
	generateSignature: function(dataJSON,secretArr,apiUrl,method){
		
		//air.trace(dataJSON.oauth_token, Oauth.access.oauth_access);
		
		var baseArr = [];
		var paramArr = []
		var harr = ['OAuth realm="http://api.t.163.com/"'];
		var method = method || Oauth.oauth_method;
		
		var d = Oauth.signatureArr;
        for (var e = 0; e < d.length; e++) {
                var j = d[e];
                if (dataJSON[j]) {
                        baseArr.push(j + "=" + encodeURIComponent(dataJSON[j]).replace(/\(/g,'%28').replace(/\)/g, '%29').replace(/\'/g, '%27').replace(/\!/g, '%21').replace(/\*/g, '%2A'));
						if(j.indexOf("oauth_") > -1){
							harr.push(j + "=\"" + encodeURIComponent(dataJSON[j]) + "\"");
						}else
						{
							paramArr.push(j + "=" + encodeURIComponent(dataJSON[j]));
						}
                }
        }
        var baseString = method + "&" + encodeURIComponent(apiUrl) + "&" + encodeURIComponent(baseArr.join("&"));
		if(secretArr.length < 2){
			secretArr.push("");
		}
		var secretString = secretArr.join("&");
		//air.trace("secretString : " + secretString);
		//air.trace("baseString : " + baseString);
        var signature = b64_hmac_sha1(secretString, baseString) + "=";
		
		//修正当服务器不兼容+符号时，验证失败的情况
		//signature = encodeURIComponent(signature.replace("+"," "));
		signature = encodeURIComponent(signature);
		
		//air.trace("oauth_consumer_key : " + Oauth.oauth_consumer_key);
		air.trace("oauth_signature=" + signature + " oauth_signature_base_string=" + baseString);
		harr.push("oauth_signature=\"" + signature + "\"");
		
		return {
			"url":apiUrl,
			"data":paramArr.join("&"),
			"method":method
			,"header":harr.join(",")
		}
	},
	
	randomChar : function(b) {
        var a = "0123456789qwertyuioplkjhgfdsazxcvbnm";
        var d = "";
        for (var c = 0; c < b; c++) {
                d += a.charAt(Math.ceil(Math.random() * 100000000) % a.length)
        }
        return d
	},
	
	timestamp : function(){
		return Date.parse(new Date()) / 1000;
	},
	
	toParaString : function(dataObj){
		var strArr = [];
		for(var i in dataObj){
			strArr.push(i + "=" + dataObj[i]);
		}
		return strArr.join("&");
	},
	
	getInfo : function(){
		return {
			"oauth_nonce":Oauth.randomChar(32),
			"oauth_timestamp":Oauth.timestamp()
		}
	},
	
	requestStart: function(requestJson,callback,errorCallback,outCallBack){
		Oauth.requestTimer++;
		//air.trace(Oauth.requestTimer);
		if(Oauth.requestTimer < 5){
			errorCallback = errorCallback || function(event){setTimeout(function(){loader.load(request);Oauth.requestTimer++;},1000)};
			
			var completeHandle = function(event){
				Oauth.requestTimer = 0;
				callback(event);	
			};
			var request = new air.URLRequest();
			air.trace("requestJson.method : " + requestJson.method);
			request.method = (requestJson.method == "POST")?air.URLRequestMethod.POST:air.URLRequestMethod.GET;
			request.url = requestJson.url;
			request.data = requestJson.data;
			request.requestHeaders = new Array(new air.URLRequestHeader("Authorization", requestJson.header))
			
			var loader = new air.URLLoader();
			loader.addEventListener(air.Event.COMPLETE,completeHandle);
			air.trace(request.method);
			loader.addEventListener(air.IOErrorEvent.IO_ERROR,errorCallback)
			loader.load(request);
			return loader;
		}else
		{
			Oauth.requestTimer = 0;
			outCallBack = outCallBack || Measy.outService;
			outCallBack();
		}
	},
	
	getRequestToken: function(){
		$(".login-message").unbind("click");
		var info = Oauth.getInfo();
		var b = {
                oauth_consumer_key: Oauth.oauth_consumer_key,
                oauth_nonce: info.oauth_nonce,
                oauth_timestamp: info.oauth_timestamp,
                oauth_signature_method: Oauth.oauth_signature_method,
                oauth_version: Oauth.oauth_version
        };
		var a = [Oauth.oauth_consumer_key_secret];
		var requestData = Oauth.generateSignature(b,a,Oauth.request_token_api);
		
		Oauth.requestStart(requestData,handle,Oauth.getRequestToken,outhandle);
		
		function handle(event){
			var loader = air.URLLoader(event.target);
            air.trace("getRequestToken completeHandler: " + loader.data);
			var response = loader.data;
			var data = response.split("&");
			Oauth.request.oauth_token = data[0].split("=")[1];
			Oauth.request.oauth_token_secret = data[1].split("=")[1];
			//air.trace("Oauth.request.oauth_token : " + Oauth.request.oauth_token);
			//air.trace("Oauth.request.oauth_token_secret : " + Oauth.request.oauth_token_secret);
			Oauth.getOauthVerifier();
			//Measy.showLogin();
		}
		function outhandle(){
			Measy.outService();
			$(".login-message").bind("click",function(){
				$("#msg-detail").removeClass().addClass('msg-content msg-load').animate({"opacity":1,"top":0},100);
				Oauth.getRequestToken();
			})
		}
	},
	
	getOauthVerifier: function(userId,passWd){
		
		var uq = new air.URLRequest(Oauth.authorize_api + "?oauth_token=" + Oauth.request.oauth_token + "&oauth_callback=http%3a%2f%2fwww.startfeel.com%2f");
		air.navigateToURL(uq);
		return;
		
		var b = {
				display:"page",
				oauth_token:Oauth.request.oauth_token,
				oauth_callback:"jsonoob",
				userId:userId,
				passwd:passWd
        };
		var requestData = {
			"url":Oauth.authorize_api,
			"data":Oauth.toParaString(b)
		};
		
		Oauth.requestStart(requestData, handle,errorHandle);
		
		function handle(event){
			var loader = air.URLLoader(event.target);
			//air.trace("authrizeCompleteHandler: " + loader.data);
			var d = JSON.parse(loader.data);
			Oauth.authrize.verifier = d.oauth_verifier;
			//air.trace("Oauth.authrize.verifier : " + Oauth.authrize.verifier);
			Oauth.getAccessToken(function(){
				Measy.loadApp();
			})
		}
		function errorHandle(){
			$("#msg-detail").removeClass().addClass('msg-content msg-signinfail').css({"top":-20}).stop().animate({"opacity":1,"top":0},300);
			signinFlag = false;
		}
	},
	
	getAccessToken: function(func){
		var info = Oauth.getInfo();
		var c = {
                oauth_consumer_key: Oauth.oauth_consumer_key,
                oauth_nonce: info.oauth_nonce,
                oauth_timestamp: info.oauth_timestamp,
                oauth_signature_method: Oauth.oauth_signature_method,
                oauth_version: Oauth.oauth_version,
                oauth_token: Oauth.request.oauth_token
        };
        var a = [Oauth.oauth_consumer_key_secret, Oauth.request.oauth_token_secret];
		
		var requestData = Oauth.generateSignature(c,a,Oauth.access_token_api);
		
		Oauth.requestStart(requestData,handle,function(){Oauth.getAccessToken(func)});
		
		function handle(event){
			var loader = air.URLLoader(event.target);
			//air.trace("completeHandler2: " + loader.data);
			var d = loader.data.split("&");
			Oauth.access.oauth_access = d[0].split("=")[1]
			Oauth.access.oauth_access_secret = d[1].split("=")[1];
			func();
			return;
			//Oauth.userId = d[2].split("=")[1];
			$("#msg-detail").removeClass().addClass('msg-content msg-saveid').css({"top":-20}).stop().animate({"opacity":1,"top":0},400);
			//air.trace("Oauth.access.oauth_access : " + Oauth.access.oauth_access );
			//air.trace("Oauth.access.oauth_access_secret : " + Oauth.access.oauth_access_secret );
			
			
		}
	},
	
	directLogin : function(func, username, passwd){
		func = func || function(){};
		
		//测试用
		if(Oauth.access.oauth_access !=""){
			func();
			return;
		}
		
		var info = Oauth.getInfo();
		var c = {
                oauth_consumer_key: Oauth.oauth_consumer_key,
                oauth_nonce: info.oauth_nonce,
                oauth_timestamp: info.oauth_timestamp,
                oauth_signature_method: Oauth.oauth_signature_method,
                oauth_version: Oauth.oauth_version,
				x_auth_username: username,
				x_auth_password: passwd,
				x_auth_mode:"client_auth"
        };
        var a = [Oauth.oauth_consumer_key_secret];
		
		var requestData = Oauth.generateSignature(c,a,'http://api.t.163.com/oauth/access_token');
		
		Oauth.requestStart(requestData,handle,function(){air.trace("xauth fail")});
		
		function handle(event){
			air.trace("xauth success");
			var loader = air.URLLoader(event.target);
			air.trace("completeHandler2: " + loader.data);
			var d = loader.data.split("&");
			Oauth.access.oauth_access = d[0].split("=")[1]
			Oauth.access.oauth_access_secret = d[1].split("=")[1];
			Api.File.write("autoLogin.f",{
					oauth_access:Oauth.access.oauth_access,
					oauth_access_secret:Oauth.access.oauth_access_secret
			})
			
			func();
			return;
			//Oauth.userId = d[2].split("=")[1];
			$("#msg-detail").removeClass().addClass('msg-content msg-saveid').css({"top":-20}).stop().animate({"opacity":1,"top":0},400);
			//air.trace("Oauth.access.oauth_access : " + Oauth.access.oauth_access );
			//air.trace("Oauth.access.oauth_access_secret : " + Oauth.access.oauth_access_secret );
			
			
		}
	},
	
	verifyUser: function(func){
		var info = Oauth.getInfo();
		var c = {
                oauth_consumer_key: Oauth.oauth_consumer_key,
                oauth_nonce: info.oauth_nonce,
                oauth_timestamp: info.oauth_timestamp,
                oauth_signature_method: Oauth.oauth_signature_method,
                oauth_version: Oauth.oauth_version,
                oauth_token: Oauth.access.oauth_access
        };
        var a = [Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access_secret];
		air.trace(Oauth.oauth_consumer_key_secret + " and " + Oauth.access.oauth_access_secret)
		var requestData = Oauth.generateSignature(c,a,Oauth.verify_api);
		
		Oauth.requestStart(requestData,handle,function(){Oauth.getAccessToken(func)});
		
		function handle(event){
			var loader = air.URLLoader(event.target);
			var d = JSON.parse(loader.data);
			Oauth.userId = d.id;
			Measy.saveUserId();
			Config.get(d.id);
			Oauth.saveOauthInfo();
			
			Measy.saveAutoSignin();
			return;
			
		}
	},
	
	saveOauthUser: function(func){
		var userName  = Oauth.userId + "";
		var userFile = new air.File(air.File.applicationStorageDirectory.resolvePath("wb.txt").nativePath);
		var userStream = new air.FileStream();
		//air.trace("saveOauthUser : ");
		
		userStream.addEventListener(air.Event.CLOSE,saveUser);
		userStream.addEventListener(air.IOErrorEvent.IO_ERROR,error);
		userStream.open(userFile,air.FileMode.UPDATE);
		//air.trace("userName : " + userName + " type id : " + typeof(userName));
		
		userStream.writeUTF(userName);
		userStream.close();
		
		function saveUser(){
			//air.trace("save success!");
		}
		
		function error(){
			//air.trace(userName)
			//air.trace("save error!");
		}
	},
	
	readOauthUser: function(){
		
		var userFile = new air.File(air.File.applicationStorageDirectory.resolvePath("wb.txt").nativePath);
		//air.trace(userFile.url);
		var userStream = new air.FileStream();
		//air.trace("readOauthUser : ");
		
		userStream.addEventListener(air.Event.COMPLETE,readUser);
		userStream.open(userFile,air.FileMode.READ);
		Oauth.userId = userStream.readUTF();
		//air.trace("Oauth.userId :" + Oauth.userId);
		userStream.close();
		function readUser(){
			//air.trace(userStream.readUTF());
			//air.trace(userStream.readUTFBytes());
			//Oauth.userId = userStream.readUTFBytes();
			//air.trace("read success!");
		}
	},
	
	saveOauthInfo: function(){
		Oauth.clearOauthInfo(function(){
								
			var conn = DB.create("Oauth",nect);
			
			function nect(){
				DB.query(conn,"INSERT INTO oauth (consumer_key,consumer_key_secret,access,access_secret) VALUES (?,?,?,?)",[Oauth.oauth_consumer_key ,Oauth.oauth_consumer_key_secret, Oauth.access.oauth_access , Oauth.access.oauth_access_secret],function(event){air.trace("insert successfull!!")},function(event){air.trace("insert failed!!")});
			}
			
			/*var conn = new air.SQLConnection();
			conn.addEventListener(air.SQLEvent.OPEN, settime);
			var dbFile = air.File.applicationStorageDirectory.resolvePath("Oauth.db");
			conn.openAsync(dbFile);
			var selectStmt = new air.SQLStatement();
			
			function settime(){
					selectStmt.sqlConnection = conn; 
					var sql =
						"UPDATE oauth SET access =:access,access_secret =:access_secret WHERE consumer_key = :consumer_key";
					selectStmt.text = sql;
					selectStmt.parameters[':consumer_key'] = Oauth.oauth_consumer_key;
					selectStmt.parameters[':access'] = Oauth.access.oauth_access;
					selectStmt.parameters[':access_secret'] = Oauth.access.oauth_access_secret;
					air.trace("saveOauthInfo",Oauth.access.oauth_access, ":" + Oauth.access.oauth_access_secret);
					selectStmt.addEventListener(air.SQLEvent.RESULT,IOsuccess)
					selectStmt.addEventListener(air.SQLErrorEvent.ERROR,IOfail);
					selectStmt.execute();
			}
			function IOsuccess(){
				air.trace('oauth insert success');
			}
			function IOfail(event){
				//air.trace('oauth insert fail:' + event.error);
			}	*/				
		})
	},
	
	clearOauthInfo: function(func){
		
		func = func || function(){};
		
		var conn = new air.SQLConnection();
		conn.addEventListener(air.SQLEvent.OPEN, settime);
		var dbFile = air.File.applicationStorageDirectory.resolvePath("Oauth.db");
		conn.openAsync(dbFile);
		var selectStmt = new air.SQLStatement();
		
		function settime(){
				selectStmt.sqlConnection = conn; 
				var sql =
					"DELETE FROM oauth";
				selectStmt.text = sql;
				selectStmt.addEventListener(air.SQLEvent.RESULT,IOsuccess)
				selectStmt.addEventListener(air.SQLErrorEvent.ERROR,IOfail);
				selectStmt.execute();
		}
		function IOsuccess(){
			air.trace('oauth delete success');
			func();
		}
		function IOfail(event){
			//air.trace('oauth insert fail:' + event.error);
		}
	},
	
	getOauthInfo: function(func){
		
		var conn  = DB.create("Oauth",settime);
		var selectStmt;
		
		air.trace("Oauth.oauth_consumer_key",Oauth.oauth_consumer_key)
		
		function settime(){
			selectStmt = DB.query(conn,"SELECT * FROM oauth",null,IOsuccess,IOfail)
		}

		function IOsuccess(){
			var result = selectStmt.getResult();
			if(result.data){
			var numResults = result.data.length;
			Oauth.access.oauth_access = result.data[0].access;
			Oauth.access.oauth_access_secret = result.data[0].access_secret;
			func();
			}else{
				//Measy.signOut();
			}
		}
		function IOfail(event){
			//air.trace('oauth insert fail:' + event.error);
		}
	},
	
	createOauthTable: function(){
		var conn = new air.SQLConnection(); 
		conn.addEventListener(air.SQLEvent.OPEN, openHandler); 
		conn.addEventListener(air.SQLErrorEvent.ERROR, errorHandler); 
		var dbFile = air.File.applicationStorageDirectory.resolvePath("Oauth.db");
		conn.openAsync(dbFile);
		
		function openHandler(event)
		{ 
			//alert("the database was created successfully"); 
			var createStmt = new air.SQLStatement(); 
			createStmt.sqlConnection = conn; 
			var sql =  
				"CREATE TABLE IF NOT EXISTS oauth (" +  
				"    consumer_key INTEGER PRIMARY KEY, " +  
				"    consumer_key_secret TEXT, " +  
				"    access TEXT," +
				"    access_secret TEXT" +
				")"; 
			createStmt.text = sql; 
			createStmt.addEventListener(air.SQLEvent.RESULT, createResult); 
			createStmt.addEventListener(air.SQLErrorEvent.ERROR, createError); 
			createStmt.execute(); 
			function createResult(event) 
			{ 
				Oauth.createOauthRecord();
				//air.trace("Oauth Table created");
			} 
			function createError(event) 
			{ 
				//air.trace("Error message:", event.error.message); 
				//air.trace("Details:", event.error.details); 
			}
		}
		function errorHandler(event) 
		{ 
			alert("Error message:", event.error.message); 
			alert("Details:", event.error.details); 
		}
	},
	
	createOauthRecord: function(){
		var conn = DB.create("Oauth",nect);
			
			function nect(){
				DB.query(conn,"INSERT INTO oauth (consumer_key,consumer_key_secret,access,access_secret) VALUES (" + Oauth.oauth_consumer_key +"," + Oauth.oauth_consumer_key_secret +",'','')",null,function(event){});
			}
	},
	
	deleteOauthTable: function(){
		var conn = new air.SQLConnection(); 
		conn.addEventListener(air.SQLEvent.OPEN, openHandler); 
		conn.addEventListener(air.SQLErrorEvent.ERROR, errorHandler); 
		var dbFile = air.File.applicationStorageDirectory.resolvePath("Oauth.db");
		conn.openAsync(dbFile);
		
		function openHandler(event)
		{ 
			//alert("the database was created successfully"); 
			var createStmt = new air.SQLStatement(); 
			createStmt.sqlConnection = conn; 
			var sql =  
				"DROP TABLE IF EXISTS oauth"; 
			createStmt.text = sql; 
			createStmt.addEventListener(air.SQLEvent.RESULT, createResult); 
			createStmt.addEventListener(air.SQLErrorEvent.ERROR, createError); 
			createStmt.execute(); 
			function createResult(event) 
			{ 
				//air.trace("Oauth Table DELETED"); 
			} 
			function createError(event) 
			{ 
				//air.trace("Error message:", event.error.message); 
				//air.trace("Details:", event.error.details); 
			}
		}
		function errorHandler(event) 
		{ 
			alert("Error message:", event.error.message); 
			alert("Details:", event.error.details); 
		}
	}
};

var DB = {
	_errorHandle: function(event){
		air.trace("Error message:", event.error.message); 
		air.trace("Details:", event.error.details); 
	},
	create: function(dbFile,openHandle,errorHandle){
		
		errorHandle = errorHandle ||DB._errorHandle;
		
		var conn = new air.SQLConnection(); 
		conn.addEventListener(air.SQLEvent.OPEN, openHandle); 
		conn.addEventListener(air.SQLErrorEvent.ERROR, errorHandle); 
		var dbFile = air.File.applicationStorageDirectory.resolvePath(dbFile + ".db");
		conn.openAsync(dbFile);
		return conn;
	},
	query: function(sqlConnection,sqlStr,param,successHandle,errorHandle){
		
		errorHandle = errorHandle ||DB._errorHandle;
		
		var queryHandle = function(event){
			air.trace("query success : " + sqlStr);
			sqlConnection.close();
			successHandle.call(this,event)
			
		}
		
		if(!sqlConnection){errorHandle();sqlConnection.close();};
		
		air.trace("sqlStr : " +sqlStr);
		
		var sqlStmt = new air.SQLStatement(); 
		sqlStmt.sqlConnection = sqlConnection; 
		sqlStmt.text = sqlStr;
		
		if(param){
			for(var i=0;i < param.length; i++){
				sqlStmt.parameters[i] = param[i];
			};
		};
		
		sqlStmt.addEventListener(air.SQLEvent.RESULT, queryHandle); 
		sqlStmt.addEventListener(air.SQLErrorEvent.ERROR, errorHandle); 
		sqlStmt.execute();
		return sqlStmt;
	}
};
var Measy = {
	init: function(){
		var conn = DB.create("Oauth",next);
		
		function next(){
			var sql =  
				"CREATE TABLE IF NOT EXISTS oauth (" +  
				"    consumer_key TEXT PRIMARY KEY, " +  
				"    consumer_key_secret TEXT, " +  
				"    access TEXT," +
				"    access_secret TEXT" +
				")";
			DB.query(conn,sql,null,function(event){Measy._addOauth()});
		}
	},
	checkStatus: function(){
		var installFile = air.File.applicationStorageDirectory.resolvePath("Oauth.db");
			air.trace("installFile.exists" + installFile.exists);
			if(installFile.exists){
				//Oauth.getRequestToken();
				air.trace("Measy.checkAutoSignin() is : " + Measy.checkAutoSignin())
				if(Measy.checkAutoSignin())
				{
					Measy.loadApp();
				}else
				{
					Oauth.getRequestToken();
				}
			}else
			{
				Measy.init();
			}
	},
	_addOauth: function(){
		var conn = DB.create("Oauth",next);
			
		function next(){
			var sql = "INSERT INTO oauth (consumer_key,consumer_key_secret,access,access_secret) VALUES ('" + Oauth.oauth_consumer_key +"','" + Oauth.oauth_consumer_key_secret +"','','')";
			DB.query(conn,sql,null,Oauth.getRequestToken);
		}
	},
	showLogin: function(){
		$("#msg-detail").animate({"opacity":0,"top":20},400,function(){
									$(this).parent().hide();
									$(".login-switch").show();
								});
		
		
	},
	checkAutoSignin : function(){
		var userFile = new air.File(air.File.applicationStorageDirectory.resolvePath("AutoSignin.m").nativePath);
		//air.trace("userFile.exists" + userFile.exists)
		if(userFile.exists){
			return true;
		}
		return false;
	},
	saveAutoSignin : function(){
		if(Config.autoSignIn == true){
			var autoSignin = "auto-signin";
			//air.trace(autoSignin);
			var userFile = new air.File(air.File.applicationStorageDirectory.resolvePath("AutoSignin.m").nativePath);
			var userStream = new air.FileStream();
			//air.trace("saveAutoSignin : ");
			userStream.open(userFile,air.FileMode.UPDATE);
			userStream.writeUTFBytes(autoSignin);
			userStream.close();
		}
	},
	deleteAutoSignin : function(){
		var userFile = new air.File(air.File.applicationStorageDirectory.resolvePath("AutoSignin.m").nativePath);
		if(userFile.exists){
			userFile.deleteFile();
		}
	},
	saveUserId:function(){
		var userId  = Oauth.userId + "";
		var userFile = new air.File(air.File.applicationStorageDirectory.resolvePath("User.dat").nativePath);
		var userStream = new air.FileStream();
		//air.trace("saveUserId : ");
		
		userStream.addEventListener(air.Event.COMPLETE,saveUser);
		userStream.addEventListener(air.IOErrorEvent.IO_ERROR,error);
		userStream.open(userFile,air.FileMode.UPDATE);
		
		userStream.writeUTFBytes(userId);
		userStream.close();
		
		function saveUser(){
			//air.trace("save userId success!");
		}
		
		function error(){
			//air.trace("save error!");
		}
	},
	readUserId: function(){
		
		var userFile = new air.File(air.File.applicationStorageDirectory.resolvePath("User.dat").nativePath);
	     air.trace("userFile is : " + userFile.url);
		var userStream = new air.FileStream();
		
		//air.trace("readUserId : ");
		userStream.addEventListener(air.Event.COMPLETE,readUser);
		userStream.open(userFile,air.FileMode.READ);
		//air.trace("userStream.position : " +userStream.position);
		Oauth.userId = userStream.readUTFBytes(userStream.bytesAvailable);
		//air.trace("Oauth.userId :" + Oauth.userId);
		userStream.close();
		function readUser(){
			//air.trace(userStream.readUTF());
			//air.trace(userStream.readUTFBytes());
			//Oauth.userId = userStream.readUTFBytes();
			//air.trace("read success!");
		}
	},
	checkuserConfig : function(userId,func){
		var userFile = air.File.applicationStorageDirectory.resolvePath(userId + ".db");
		if(userFile.exists){
			func();
		}else{
			Measy.createUserConfig(userId,func)
		}
	},
	createUserConfig : function(userId,func){
		var userFile = air.File.applicationStorageDirectory.resolvePath(userId + ".db");
		var sql = "CREATE TABLE IF NOT EXISTS config (" +  
				"    id INTEGER PRIMARY KEY AUTOINCREMENT, " + 
				"    timer TEXT, " +
				"    page_size TEXT, " +  
				"    comment_size TEXT," +
				"    image_path TEXT" +
				")";
		var conn = DB.create(userId,next);
		function next(){
			//air.trace("start create");
			DB.query(conn,sql,null,function(){Measy.saveUserConfig(userId,func)});
		}
	},
	saveUserConfig : function(userId,func){
		data = {
			page_size : Config.pageSize + "",
			comment_size : Config.commentSize + "",
			timer : Config.timer + "",
			image_path : Config.backgroundImage
		};
		
		var userFile = air.File.applicationStorageDirectory.resolvePath(userId + ".db");
		var sql = "INSERT INTO config (page_size, comment_size, timer, image_path) VALUES (?,?,?,?)";
		var conn = DB.create(userId,nect);
		
		function nect(){
			//air.trace("start insert");
			DB.query(conn,sql,[data.page_size,data.comment_size,data.timer,data.image_path],function(){func()});
		}
	},
	outService : function(){
		$("#msg-detail").removeClass().addClass('msg-content msg-servicefail').css({"top":-20}).stop().animate({"opacity":1,"top":0},400);
	},
	loadApp : function(){
		Oauth.getOauthInfo(function(){
			$("#startup").animate({"opacity":0},500,function(){
		   $(this).hide();
		   nativeWindow.x = (window.screen.width-480);
		   nativeWindow.y = 80;
		   nativeWindow.width = 330;
		   nativeWindow.height = 660;
		   $("#main").show();
		   
		   Oauth.verifyUser();
		   
		   $("#msg-detail").animate({"opacity":0,"top":20});
		$("#normal-login").animate({"top":20,"opacity":0.7},150,function(){$(this).animate({"top":-100,"opacity":0},200)});
		setTimeout(function(){
			
			$(".stage-app").fadeIn();
			$(".stage-login").fadeOut();
			//$(".footer").fadeIn();
			$("#default-panel").css({opacity:0}).stop().show().animate({opacity:1,top:0});
			Weibo.init();
			/*apps.weibo = {};
			apps.weibo.appWindow = new air.HTMLLoader();
			apps.weibo.appName = "Weibo";
			apps.weibo.appWindow.width = 330;
			apps.weibo.appWindow.height = 565;
			apps.weibo.appWindow.x = 0;
			apps.weibo.appWindow.y = 30;
			apps.weibo.appWindow.visible = false;
			apps.weibo.appWindow.load(new air.URLRequest('snweibo.html'));
			apps.weibo.appWindow.addEventListener(air.Event.COMPLETE,showapp)
			htmlLoader.stage.addChildAt(apps.weibo.appWindow,1);
			apps.current = apps.weibo.appWindow;*/
			$("#sighout").show();
			$("#msg-detail").removeClass().addClass('msg-content msg-load').animate({"opacity":1,"top":0},100);
		},300);
		   
		});							
		});
		
		
		
	},
	signOut : function(){
		Api.File.write("autoLogin.f",{});
		$("#main, #sighout").hide();
		nativeWindow.x = (window.screen.width-400)/2;
		nativeWindow.y = (window.screen.height-200)/2;
		nativeWindow.width = 400;
		nativeWindow.height = 224;
		$("#panel-signin,#tool-panel").show();
	},
	showMenus: function(){
		if($("#main-menus").css("display") == "none") {
			$("#main-menus").fadeIn(100);
			$("#main-menus").delegate("li","click",function(){
				$("#main-menus").fadeOut(100);										   
			})
			return;
		}
		$("#main-menus").fadeOut(200);
	},
	
	checkUpdate : function(){
		air.trace("checkUpdate");
		$(".menu-list").fadeOut(200);
		APP.Weibo.actions.showTip('正在检查更新，请稍候...');
		
		var cv = Mease.version;
		
		var errorCallback = function(){};
		var completeHandle = function(event){
			var loader = air.URLLoader(event.target);
			air.trace(loader.data);
			var d = JSON.parse(loader.data);
			
			var lv = d.version;
			var url = d.downloadurl;
			if(lv > cv) {
				APP.Weibo.actions.showTip('有新版本 ' + lv + ' 可以更新！<span class="button" id="download-new">下载</span>后安装！');
				$("#download-new").bind("click",function(){RC.downloadUpdate();APP.Weibo.actions.hideTip()});
			} else {
				APP.Weibo.actions.showTip('木有新的了，你用的已经是最新的了！',true);
			}
		};
		
		var request = new air.URLRequest();
		request.method = air.URLRequestMethod.POST;
		request.url = "http://www.startfeel.com/app/mease/check.json";
		
		var loader = new air.URLLoader();
		loader.addEventListener(air.Event.COMPLETE,completeHandle);
		loader.addEventListener(air.IOErrorEvent.IO_ERROR,errorCallback)
		loader.load(request);
		
	}
}

var Tinco = {
	openInBrowser : function (url){
		var request = new air.URLRequest(url);
		air.navigateToURL(request);
	}
};
