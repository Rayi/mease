// JavaScript Document
(function() {
		  
	var musicList = [];

	function appinit(){
		Music.c.checkRuntime();
		getMusics();
	}
	
	function appclose(){
		if(Music.player){Music.player.stop()};
		if(Music.timer){clearInterval(Music.timer);Music.timer = null;}
	}
	
	function gb2312ToUtf8(myByteArray){
		var tempByteArray= new air.ByteArray();
		return myByteArray;
		
		for(var i = 1;i <= myByteArray.length; i++){
			if(myByteArray[i-1] == 194)
			tempByteArray.writeByte(myByteArray[i]);
			else if(myByteArray[i-1] == 195)
				tempByteArray.writeByte(myByteArray[i] + 64);
			else
			{//是英文数字
				tempByteArray.writeByte(myByteArray[i-1]);
				tempByteArray.writeByte(myByteArray[i]);
			}
		}
	//重设游标
	   tempByteArray.position = 0;
	   return tempByteArray.readMultiByte(tempByteArray.bytesAvailable, "cn-bg");
	   
	  /*var tempByteArray = new air.ByteArray();
	  for(var i = 0;i<myByteArray.length; i++){
		   if(myByteArray[i] == 194)
		   {
			tempByteArray.writeByte(myByteArray[i+1]);
			i++;
		   }else{
			   if(myByteArray[i] == 195){
					tempByteArray.writeByte(myByteArray[i+1] + 64);
					i++;
			   }else{
				tempByteArray.writeByte(myByteArray[i]);
			   }
		  }
	  }
	  tempByteArray.position = 0;
	  return tempByteArray.readMultiByte(tempByteArray.bytesAvailable,"utf8");
	  return tempByteArray.readMultiByte(tempByteArray.bytesAvailable,"chinese");*/
	}
	function getFileName(fileurl)
	{
		var q = new RegExp('/?','gi');
		function getQuest(s){
			q.test(s);
			if(q.lastIndex > 0)
			{
				return fileurl.slice(0,q.lastIndex)
			}else
			{
				return fileurl;
			}
		}
		fileurl = getQuest(fileurl);
		air.trace("getQuest : " + fileurl);
		
		var dpos = 0;
		function getPoint(s){
			if(s.indexOf('.',dpos + 1) > -1)
			{
				dpos = s.indexOf('.',dpos + 1);
				getPoint(s);
			}
		}
		
		var rpos = 0;
		var r = new RegExp('/','gi');
		function getLast(s){
			r.test(s);
			if(r.lastIndex > 0)
			{
				
				rpos = r.lastIndex;
				getLast(s);
			}
		}
		
		getPoint(fileurl);
		getLast(fileurl);
	
		
		return [fileurl.slice(rpos,dpos),fileurl.slice(dpos+1).toLowerCase()];
	}
	
	var Music = {
		loader : null,
		player : null,
		timer : null,
		scrollTimer : null,
		playIndex:null,
		selectedIndex:null,
		selectedMultiple:false,
		db : null,
		playPosition:0,
		_playListHeight:336,
		_status:'empty'
		
	}
	
	Music.m = {
		connectDB:function(openAction,param){
			var conn = new air.SQLConnection();
			conn.addEventListener(air.SQLEvent.OPEN, openHandler); 
			conn.addEventListener(air.SQLErrorEvent.ERROR, errorHandler);
			var dbFile = air.File.applicationStorageDirectory.resolvePath("Music.db");
			conn.openAsync(dbFile);
			function openHandler(){
				Music.db = conn;
				openAction.apply(null,param);
				air.trace('Connent Music DataBase success');
			}
			function errorHandler(){
				air.trace("Connent Music DataBase Failed")
			}
		},
		checkDBTables : function(){
			var musicsStmt = new air.SQLStatement(); 
			musicsStmt.sqlConnection = Music.db;
			var sql =  
				"SELECT * from albums"; 
			musicsStmt.text = sql;
			musicsStmt.addEventListener(air.SQLErrorEvent.ERROR, Music.m.createMusicTable); 
			musicsStmt.execute();
		},
		createMusicTable: function(){
			var createStmt = new air.SQLStatement(); 
			createStmt.sqlConnection = Music.db;
			var sql =  
				"CREATE TABLE IF NOT EXISTS musics (" +  
				"    musicId INTEGER PRIMARY KEY AUTOINCREMENT, " +  
				"    music_name TEXT, " +  
				"    music_artist TEXT," +
				"    music_time TEXT," +
				"    music_file TEXT" +
				")"; 
			createStmt.text = sql; 
			createStmt.addEventListener(air.SQLEvent.RESULT, _createResult); 
			createStmt.addEventListener(air.SQLErrorEvent.ERROR, _createError); 
			createStmt.execute(); 
			function _createResult(event) 
			{
				air.trace("Table created");
			} 
			function _createError() 
			{ 
				air.trace("Error message:"); 
			}
		},
		deleteSong : function(id){
			var deleteStmt = new air.SQLStatement(); 
			deleteStmt.sqlConnection = Music.db;
			var sql =  
				"DELETE FROM musics WHERE musicId = :id"; 
			deleteStmt.text = sql; 
			deleteStmt.parameters[':id'] = id;
			deleteStmt.addEventListener(air.SQLEvent.RESULT, _deleteResult); 
			deleteStmt.addEventListener(air.SQLErrorEvent.ERROR, _deleteError); 
			deleteStmt.execute(); 
			function _deleteResult(event) 
			{
				air.trace("Song deleted");
			} 
			function _deleteError() 
			{ 
				air.trace("Song deleted Error"); 
			}
		},
		addSong: function(name,artist,time,file){
			
			var selectStmt = new air.SQLStatement();
			selectStmt.sqlConnection = Music.db; 
			var sql =
				"INSERT INTO musics (music_name,music_artist,music_time,music_file) VALUES (:name,:artist,:time,:file)";
			selectStmt.text = sql;
			selectStmt.parameters[':name'] = name;
			selectStmt.parameters[':artist'] = artist;
			selectStmt.parameters[':time'] = time;
			selectStmt.parameters[':file'] = file;
			selectStmt.addEventListener(air.SQLEvent.RESULT,IOsuccess)
			selectStmt.addEventListener(air.SQLErrorEvent.ERROR,IOfail);
			selectStmt.execute();
			function IOsuccess(){
				var result = selectStmt.getResult(); 
				var primaryKey = result.lastInsertRowID; 
				musicList.push({
								   id:primaryKey,
								   name:name,
								   file:file,
								   time:time,
								   author:artist
								   });
				var h = '<li fileIndex="' + (musicList.length -1) +'"><span class="name">' + musicList[musicList.length -1].name +'</span><span class="auth">' + musicList[musicList.length -1].author +'</span><span class="time">' + musicList[musicList.length -1].time +'</span><span class="action" style="display:none"><img class="tag" src="images/music/s.png" /></span></li>';
				$(h).appendTo('#play-list ul');
				bindEvents();
				air.trace('time upodate success');
			}
			function IOfail(){
				air.trace('time upodate fail');
			}
		}
	}
	
	Music.v = {
		controlShow:function(action)
		{
			$('#music-control .btn').removeClass('current');
			
			if(action)
			{
				$('#music-control .btn-' + action).addClass('current');
			}
		},
		addNewSong:function(filePath){
			var file = getFileName(filePath);
			air.trace(file[0],file[1])
			var filesuf = file[1];
			var author = '';
			var songName = decodeURI(file[0]);
			if( filesuf.indexOf("wav") === 0 || filesuf.indexOf("mp3") === 0)
			{
				var _request = new air.URLRequest(filePath);
				var _loader = new air.Sound();
				_loader.addEventListener(air.Event.ID3, _id3Handler);
				_loader.addEventListener(air.Event.COMPLETE, _completeHandler);
				_loader.load(_request);
				function _id3Handler(){
					//air.trace(_loader.id3.songName + " and " + _loader.id3.artist);
					if(_loader.id3.songName && _loader.id3.songName !=""){
						var myByteArray= new air.ByteArray();
						myByteArray.writeUTFBytes(_loader.id3.songName);
						songName = gb2312ToUtf8(myByteArray);
					}
					if(_loader.id3.artist && _loader.id3.artist !=""){
						var myByteArray= new air.ByteArray();
						myByteArray.writeUTFBytes(_loader.id3.artist);
						author = gb2312ToUtf8(myByteArray);
					}
				}
				function _completeHandler(){
					var m = parseInt(_loader.length/60/1000);
					var s = parseInt((_loader.length-m*60000)/1000);
					if(m<10){m = "0" + m};
					if(s<10){s = "0" + s};
					air.trace(songName+ " , " + author+ " , " + m + ":" + s+ " , " + filePath);
					Music.c.doModelAction(Music.m.addSong,[songName,author,m + ":" + s,filePath]);
				}
				
			}else
			{
				alert("only support mp3 or wav");
				return;
			}
		},
		upadte : function(){
			getMusics();
		}
	}
	
	Music.c = {
		checkRuntime:function(){
			Music.c.doModelAction(Music.m.checkDBTables,[]);
		},
		doModelAction : function(func,param){
			if(!Music.db)
			{
				Music.m.connectDB(func,param);
			}else
			{
				func.apply(null,param);
			}
		},
		toggle : function(){
			if(Music._status == "playing")
			{
				Music.c.pause();
			}else{
				Music.c.play();
			}
		},
		play:function(){
			if(Music.loader && Music._status != "playing")
			{
				Music.player = Music.loader.play(Music.playPosition);
				if(Music.timer){clearInterval(Music.timer);Music.timer = null;};
				Music.timer = setInterval(setPlaytime,1000);
				Music.v.controlShow('play');
				return;
			}
			if(Music.selectedIndex && !Music.playIndex && Music._status =='empty')
			{
				Music.playIndex = Music.selectedIndex[0];
				Music.selectedIndex = null;
				$('#play-list li').eq(Music.playIndex).trigger('dblclick').removeClass('selected');
			}
			if(!Music.selectedIndex && !Music.playIndex && Music._status =='empty')
			{
				Music.playIndex = 0;
				$('#play-list li').eq(Music.playIndex).trigger('dblclick').removeClass('selected');
			}
		},
		pause:function(){
			if(Music.player && Music._status == "playing")
			{
				Music.player.stop();
				if(Music.timer){clearInterval(Music.timer);Music.timer = null;};
				Music._status = "pausing";
				Music.v.controlShow('pause');
			}
		},
		clear:function(){
			if(Music.player && (Music._status == "playing" || Music._status == "pausing"))
			{
				Music.player.stop();
				Music.playPosition = 0;
				if(Music.timer){clearInterval(Music.timer);Music.timer = null;};
				Music._status = "empty";
				$("#play-pot").css('left',0);
				$("#play-prog").css({'width':0});
				$("#current-time").html('00:00');
				Music.v.controlShow();
			}
		},
		del:function(){
			if(Music.selectedIndex[0])
			{
				if(confirm('是否删除选中的条目？'))
				{
					if(!Music.selectedIndex) {return false;}
					if(Music.selectedIndex.indexOf(Music.playIndex) >= 0)
					{
						air.trace(Music.selectedIndex.indexOf(Music.playIndex));
						Music.player.stop();
						Music.playPosition = 0;
						if(Music.timer){clearInterval(Music.timer);Music.timer = null;};
						Music._status = "empty";
					}
					
					var _temp = [];
					for(var i = 0;i < Music.selectedIndex.length; i++)
					{
						air.trace(musicList[Music.selectedIndex[i]].id);
						Music.c.doModelAction(Music.m.deleteSong,[musicList[Music.selectedIndex[i]].id]);
					}
					Music.selectedIndex = null;
					getMusics();
				}
			}
		},
		
		add:function(){
			APP.Weibo.actions.showTip("暂只支持mp3格式音乐，请勿选择其他音乐格式!");
			var docsDir = air.File.documentsDirectory;
			try
			{
				var ft = new air.FileFilter("Music Files","*.mp3;*.wma")
				docsDir.browseForOpenMultiple("选择音乐文件");
				docsDir.addEventListener(air.FileListEvent.SELECT_MULTIPLE,saveData);
				docsDir.addEventListener(air.Event.CANCEL,cancel);
				function cancel(FileListEvent)
				{
					air.trace("cancel");
					APP.Weibo.actions.hideTip();
				}
				function saveData(FileListEvent)
				{
					air.trace("saveData");
					APP.Weibo.actions.hideTip();
					for(var i = 0;i < FileListEvent.files.length;i ++)
					{
						Music.v.addNewSong(FileListEvent.files[i].url)
					}
				}
			}
			catch (error)
			{
				air.trace("Failed:", error.message)
			}
			
		},
		showSetting:function(){
		},
		showInfo:function(){
		}
	}
	
	function setPlaytime(){
		if(Music.player)
		{
			//air.trace(Music.loader.length)
			//air.trace(Music.player.position);
			Music.playPosition = Music.player.position;
			var secs = parseInt((Music.player.position/1000));
			if(secs < 60) {
				var cm = "0";
				var cs = secs;
			}else
			{
				var cm = parseInt(secs/60);
				var cs = parseInt(secs-cm*60);
			}
			if(cm<10){cm = "0" + cm};
			if(cs<10){cs = "0" + cs};
			
			var width = $("#progress").width();
			var pper = parseInt(Music.player.position / Music.loader.length*width);
			
			$("#play-pot").css('left',pper);
			$("#play-prog").css({'width':pper});
			$("#current-time").html(cm + ':' + cs);
			
			if((Music.player.position / Music.loader.length) > 0.999){playNext()}
		}
	}
	function playNext(){
				Music.playIndex ++;
				if(Music.playIndex >= $('#play-list li').length)
				{
					Music.playIndex = 0;
				}
				$('#play-list li').eq(Music.playIndex).trigger('dblclick').removeClass('selected');
				air.trace("sound_complete: " + Music.playIndex);
			}
	function playPrev(){
				Music.playIndex --;
				if(Music.playIndex < 0)
				{
					Music.playIndex = $('#play-list li').length-1;
				}
				$('#play-list li').eq(Music.playIndex).trigger('dblclick').removeClass('selected');
				air.trace("sound_complete: " + Music.playIndex);
			}
	function newsong(name,author,fileIndex){
		if(Music.player){Music.player.stop()};
		if(Music.timer){clearInterval(Music.timer);Music.timer = null;}
		Music.playPosition = 0;
		Music.playIndex = fileIndex;
		var request = new air.URLRequest(musicList[fileIndex].file);
		Music.loader  = null;
		Music.loader = new air.Sound();
		Music.loader.addEventListener(air.Event.COMPLETE, completeHandler);
		Music.loader.addEventListener(air.Event.ID3, id3Handler);
		Music.loader.addEventListener(air.IOErrorEvent.IO_ERROR, ioErrorHandler);
		Music.loader.addEventListener(air.ProgressEvent.PROGRESS, progressHandler);
		Music.loader.load(request);
		air.trace("load start: " +Music.loader.length)
		Music.player = Music.loader.play(Music.playPosition);
		Music.v.controlShow('play');
		Music._status = "playing";
		
		Music.timer = setInterval(setPlaytime,1000)
		function completeHandler(event) {
				air.trace("completeHandler: " +Music.loader.length);
				$("#loader").html(name + " - " + author);
				var m = parseInt(Music.loader.length/60/1000);
				var s = parseInt((Music.loader.length-m*60000)/1000);
				if(m<10){m = "0" + m};
				if(s<10){s = "0" + s};
				if((m + ":" + s) != musicList[fileIndex].time)
				{
					updateTime(musicList[fileIndex].id,m + ":" + s)
				}
				air.trace("completeHandler: " + event);
			}
	
			function id3Handler(event) {
				air.trace("id3Handler: " + Music.loader.length);
				var m = parseInt(Music.loader.length/60/1000);
				var s = parseInt((Music.loader.length-m*60000)/1000);
				if(m<10){m = "0" + m};
				if(s<10){s = "0" + s};
				$("#total-time").html(m + ':' + s);
				air.trace("total-time: " + m  + " :"+ s);
				air.trace(Music.loader.id3.songName)
				air.trace(Music.loader.id3.artist)
				air.trace(Music.loader.id3.TIME)
				air.trace("id3Handler2: " + event);
			}
	
			function ioErrorHandler(event) {
				air.trace("ioErrorHandler: " +Music.loader.length)
				air.trace("ioErrorHandler: " + event);
			}
	
			function progressHandler(event) {
				if($("#loader").css('display') != "block"){$("#loader").show()};
				var width = $("#progress").width();
				if(event.bytesTotal){
					var per = parseInt(event.bytesLoaded/event.bytesTotal*width,10);
					var left = per;
					air.trace("load left: " + left);
					$("#loader").html("正在加载 " + parseInt(event.bytesLoaded/event.bytesTotal*100) + "%");
					$("#play-buff").css({width:left});
				}
				//air.trace("progressHandler: " + event);
			}
			
	}
	
	function playsong(name,file){
		if(Music.player){Music.player.stop()};
		if(Music.timer){clearInterval(Music.timer);Music.timer = null;}
	
		var request = new air.URLRequest(file);
		Music.loader  = null;
		Music.loader = new air.Sound();
		Music.loader.addEventListener(air.Event.COMPLETE, completeHandler);
		Music.loader.addEventListener(air.Event.ID3, id3Handler);
		Music.loader.addEventListener(air.IOErrorEvent.IO_ERROR, ioErrorHandler);
		Music.loader.addEventListener(air.ProgressEvent.PROGRESS, progressHandler);
		Music.loader.load(request);
		
		Music.player = Music.loader.play(Music.playPosition);
		
		
		Music.timer = setInterval(setPlaytime,1000)
		function completeHandler(event) {
				air.trace("completeHandler: " +Music.loader.length);
				$("#loader").html(name);
				air.trace("completeHandler: " + event);
			}
	
			function id3Handler(event) {
				air.trace("id3Handler: " + Music.loader.length);
				var m = parseInt(Music.loader.length/60/1000);
				var s = parseInt((Music.loader.length-m*60000)/1000);
				if(m<10){m = "0" + m};
				if(s<10){s = "0" + s};
				$("#total-time").html(m + ':' + s);
				air.trace("total-time: " + m  + " :"+ s);
				
				for(var j in Music.loader.id3)
				{
					air.trace("id3Handler: " +  j +" : " +Music.loader.id3[j] )
				}
				air.trace("id3Handler: " + event);
			}
	
			function ioErrorHandler(event) {
				air.trace("ioErrorHandler: " +Music.loader.length)
				air.trace("ioErrorHandler: " + event);
			}
	
			function progressHandler(event) {
				if($("#loader").css('display') != "block"){$("#loader").show()};
				var width = $("#progress").width();
				if(event.bytesTotal){
					var per = parseInt(event.bytesLoaded/event.bytesTotal*width,10);
					var left = per;
					air.trace("left: " + left);
					$("#loader").html("正在加载 " + parseInt(event.bytesLoaded/event.bytesTotal*100) + "%");
					$("#play-buff").css({width:left});
				}
				//air.trace("progressHandler: " + event);
			}
			
	}
	function createHTML(){
		var output = ['<ul>']
		for(var i =0 ;i<musicList.length;i++)
		{
			output.push('<li fileIndex="' + i +'"><span class="name">' + musicList[i].name +'</span><span class="auth">' + musicList[i].author +'</span><span class="time">' + musicList[i].time +'</span><span class="action" style="display:none"><img class="tag" src="images/music/s.png" /></span></li>');
		}
		output.push('</ul>');
		$('#play-list').html(output.join(''));
		bindEvents();
	}
	
	function bindEvents()
	{
		$('#play-list li').unbind('click').bind('click',function(e){
			if(!Music.selectedMultiple){
				$('#play-list li').removeClass('selected');
				Music.selectedIndex = [$(this).attr('fileIndex')];
			}else
			{
				var _temp = [$(this).attr('fileIndex')];
				if(typeof Music.selectedIndex == 'object')
				{
					for(var ix = 0;ix < Music.selectedIndex.length;ix++)
					{
						if(Music.selectedIndex[ix] != $(this).attr('fileIndex'))
						{
							_temp.push(Music.selectedIndex[ix]);
						}
					}
				}else
				{
					_temp.push(Music.selectedIndex[0]);
				}
				Music.selectedIndex = _temp;
			}
			
			$(this).addClass('selected');
		})
		$('#play-list li').unbind('dblclick').bind('dblclick',function(){
			$("#total-time").html('00:00');
			$("#current-time").html('00:00');
			
			$("#play-pot").css('left',0);
			$("#play-prog").css({'width':0});
			$("#play-buff").css({'width':0});
			
			$('#play-list li').removeClass('current');
			
			$(this).removeClass('selected').addClass('current');
			newsong($(this).find('.name').html(),$(this).find('.auth').html(),$(this).attr('fileIndex'))
		
		})
	}

	$(document).bind('mouseup',function(){
		if(Music.scrollTimer)
		{
			clearInterval(Music.scrollTimer);
			Music.scrollTimer = null;
		}
		$(document).unbind('mousemove');
	});
	
	$("#progress").bind('click',function(e){
		var width = $("#progress").width();
		if(Music.player){
			var per = e.pageX/width*Music.loader.length;
			Music.player.stop();
			Music.player = Music.loader.play(parseInt(per));
			
			$("#play-pot").css('left',e.pageX);
			$("#play-prog").css({'width':e.pageX});
		}
	})
	
	window.addEventListener('dragenter',function(event){ 
		event.preventDefault();
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
		air.trace(droppedText[0].url);
		air.trace(getFileName(droppedText[0].url)[1]);
		var filesuf = getFileName(droppedText[0].url)[1];
		var author = '';
		var songName = decodeURI(getFileName(droppedText[0].url)[0]);
		if( filesuf.indexOf("wav") === 0 || filesuf.indexOf("mp3") === 0)
		{
			var _request = new air.URLRequest(droppedText[0].url);
			var _loader = new air.Sound();
			_loader.addEventListener(air.Event.COMPLETE, _completeHandler);
			_loader.addEventListener(air.Event.ID3, _id3Handler);
			_loader.load(_request);
			function _completeHandler(){
				var m = parseInt(_loader.length/60/1000);
				var s = parseInt((_loader.length-m*60000)/1000);
				if(m<10){m = "0" + m};
				if(s<10){s = "0" + s};
				air.trace(songName+ " , " + author+ " , " + m + ":" + s+ " , " + droppedText[0].url);
				addNew(songName,author,m + ":" + s,droppedText[0].url)
			}
			function _id3Handler(){
				//alert(_loader.id3.songName + " and " + _loader.id3.artist);
				if(_loader.id3.songName && _loader.id3.songName !=""){
					var myByteArray= new air.ByteArray();
					myByteArray.writeUTFBytes(_loader.id3.songName);
					songName = gb2312ToUtf8(myByteArray);
				}
				if(_loader.id3.artist && _loader.id3.artist !=""){
					var myByteArray= new air.ByteArray();
					myByteArray.writeUTFBytes(_loader.id3.artist);
					author = gb2312ToUtf8(myByteArray);
				}
				
			}
		}else
		{
			//alert("only support mp3 or wav");
			return;
		}
		
		
	
	})
	
	function deleteTable(){
		var conn = new air.SQLConnection(); 
		conn.addEventListener(air.SQLEvent.OPEN, openHandler); 
		conn.addEventListener(air.SQLErrorEvent.ERROR, errorHandler); 
		var dbFile = air.File.applicationStorageDirectory.resolvePath("Music.db");
		conn.openAsync(dbFile); 
		function openHandler(event)
		{ 
			//alert("the database was created successfully"); 
			var createStmt = new air.SQLStatement(); 
			createStmt.sqlConnection = conn; 
			var sql =  
				"DROP TABLE musics"; 
			createStmt.text = sql; 
			createStmt.addEventListener(air.SQLEvent.RESULT, createResult); 
			createStmt.addEventListener(air.SQLErrorEvent.ERROR, createError); 
			createStmt.execute(); 
			function createResult(event) 
			{ 
				air.trace("Table droped"); 
			} 
			function createError(event) 
			{ 
				air.trace("Error message:", event.error.message); 
				air.trace("Details:", event.error.details); 
			}
		}
		function errorHandler(event) 
		{ 
			alert("Error message:", event.error.message); 
			alert("Details:", event.error.details); 
		}
		
	}
	
	function ceateTable(){
		var conn = new air.SQLConnection(); 
		conn.addEventListener(air.SQLEvent.OPEN, openHandler); 
		conn.addEventListener(air.SQLErrorEvent.ERROR, errorHandler); 
		var dbFile = air.File.applicationStorageDirectory.resolvePath("Music.db");
		conn.openAsync(dbFile); 
		function openHandler(event)
		{ 
			//alert("the database was created successfully"); 
			var createStmt = new air.SQLStatement(); 
			createStmt.sqlConnection = conn; 
			var sql =  
				"CREATE TABLE IF NOT EXISTS musics (" +  
				"    musicId INTEGER PRIMARY KEY AUTOINCREMENT, " +  
				"    music_name TEXT, " +  
				"    music_artist TEXT," +
				"    music_time TEXT," +
				"    music_file TEXT" +
				")"; 
			createStmt.text = sql; 
			createStmt.addEventListener(air.SQLEvent.RESULT, createResult); 
			createStmt.addEventListener(air.SQLErrorEvent.ERROR, createError); 
			createStmt.execute(); 
			function createResult(event) 
			{ 
				air.trace("Table created"); 
				insertMusic();
			} 
			function createError(event) 
			{ 
				air.trace("Error message:", event.error.message); 
				air.trace("Details:", event.error.details); 
			}
		}
		function errorHandler(event) 
		{ 
			alert("Error message:", event.error.message); 
			alert("Details:", event.error.details); 
		}
		
	}
	
	function insertMusic(){
		var conn = new air.SQLConnection();
		conn.addEventListener(air.SQLEvent.OPEN, adddata);
		var dbFile = air.File.applicationStorageDirectory.resolvePath("Music.db");
		conn.openAsync(dbFile);
		
		
		function adddata(){
			for(var i = 0;i < musicList.length;i++)
			{
				var createStmt = new air.SQLStatement();
				createStmt.sqlConnection = conn; 
				var sql =
					"INSERT INTO musics (music_name, music_artist, music_time,music_file) " +  
					"VALUES (:name, :artist, :time,:file)";
				createStmt.text = sql;
				createStmt.parameters[':name'] = musicList[i].name;
				createStmt.parameters[':artist'] = musicList[i].author;
				createStmt.parameters[':time'] = musicList[i].time;
				createStmt.parameters[':file'] = musicList[i].file;
				createStmt.addEventListener(air.SQLEvent.RESULT,IOsuccess)
				createStmt.addEventListener(air.SQLErrorEvent.ERROR,IOfail);
				createStmt.execute();
			}
		}
		
		function IOsuccess(){
			air.trace('success');
		}
		function IOfail(){
			air.trace('failed');
		}
	}
	
	function getMusics(){
		var conn = new air.SQLConnection();
		conn.addEventListener(air.SQLEvent.OPEN, getdata);
		var dbFile = air.File.applicationStorageDirectory.resolvePath("Music.db");
		conn.openAsync(dbFile);
		var selectStmt = new air.SQLStatement();
		
		function getdata(){
				selectStmt.sqlConnection = conn; 
				var sql =
					"SELECT * FROM musics";
				selectStmt.text = sql;
				selectStmt.addEventListener(air.SQLEvent.RESULT,IOsuccess)
				selectStmt.addEventListener(air.SQLErrorEvent.ERROR,IOfail);
				selectStmt.execute();
		}
		
		function IOsuccess(){
			musicList = [];
			var result = selectStmt.getResult();
			try{
				var numResults = result.data.length;
				if(numResults > 0){
					for (i = 0; i < numResults; i++) 
					{ 
						var row = result.data[i];
						musicList.push({
									   id:row.musicId,
									   name:row.music_name,
									   file:row.music_file,
									   time:row.music_time,
									   author:row.music_artist
									   })
					};
					createHTML();
				}
			}catch(e){}
		}
		function IOfail(){
			air.trace('failed');
		}
	}
	function updateTime(id,time){
		var conn = new air.SQLConnection();
		conn.addEventListener(air.SQLEvent.OPEN, settime);
		var dbFile = air.File.applicationStorageDirectory.resolvePath("Music.db");
		conn.openAsync(dbFile);
		var selectStmt = new air.SQLStatement();
		
		function settime(){
				selectStmt.sqlConnection = conn; 
				var sql =
					"UPDATE musics SET music_time = :time WHERE musicId = :id ";
				selectStmt.text = sql;
				selectStmt.parameters[':time'] = time;
				selectStmt.parameters[':id'] = id;
				selectStmt.addEventListener(air.SQLEvent.RESULT,IOsuccess)
				selectStmt.addEventListener(air.SQLErrorEvent.ERROR,IOfail);
				selectStmt.execute();
		}
		function IOsuccess(){
			$('#play-list li').eq(Music.playIndex).find('.time').html(time);
			air.trace('time upodate success');
		}
		function IOfail(){
			air.trace('time upodate fail');
		}
	}
	function addNew(name,artist,time,file){
		var conn = new air.SQLConnection();
		conn.addEventListener(air.SQLEvent.OPEN, settime);
		var dbFile = air.File.applicationStorageDirectory.resolvePath("Music.db");
		conn.openAsync(dbFile);
		var selectStmt = new air.SQLStatement();
		
		function settime(){
				selectStmt.sqlConnection = conn; 
				var sql =
					"INSERT INTO musics (music_name,music_artist,music_time,music_file) VALUES (:name,:artist,:time,:file)";
				selectStmt.text = sql;
				selectStmt.parameters[':name'] = name;
				selectStmt.parameters[':artist'] = artist;
				selectStmt.parameters[':time'] = time;
				selectStmt.parameters[':file'] = file;
				selectStmt.addEventListener(air.SQLEvent.RESULT,IOsuccess)
				selectStmt.addEventListener(air.SQLErrorEvent.ERROR,IOfail);
				selectStmt.execute();
		}
		function IOsuccess(){
			var result = selectStmt.getResult(); 
			var primaryKey = result.lastInsertRowID; 
			musicList.push({
							   id:primaryKey,
							   name:name,
							   file:file,
							   time:time,
							   author:artist
							   });
			var h = '<li fileIndex="' + (musicList.length -1) +'"><span class="name">' + musicList[musicList.length -1].name +'</span><span class="auth">' + musicList[musicList.length -1].author +'</span><span class="time">' + musicList[musicList.length -1].time +'</span><span class="action" style="display:none"><img class="tag" src="images/music/s.png" /></span></li>';
			$(h).appendTo('#play-list ul');
			bindEvents();
			$('#play-list li:last-child').trigger('dblclick');
			air.trace('time upodate success');
		}
		function IOfail(){
			air.trace('time upodate fail');
		}
	}
	
	$(window).bind('keydown',function(e){if(e.keyCode == 17){Music.selectedMultiple = true;}});
	$(window).bind('keyup',function(e){if(e.keyCode == 17){Music.selectedMultiple = false;}});
	
	nativeWindow.addEventListener(air.Event.CLOSING,function(event){
		air.trace("123");
		appclose
	});
	
	Music.init = function(){
		$(".lists").hide();
		$("#music-list").show();
		appinit();
	}
	Music.hide = function(){
		$(".lists").hide();
		$("#wb-list").show();
	}
	
	APP.Music = Music;
	
})();