(function(){

		$('#startup').bind('mousedown',function(){
			nativeWindow.startMove();
		});

// Declare the global variables:
		var thisVersion, currentVersion, fileUrl, xhr, newAppFile, data, urlStream = null;

		// Function called when the application loads.
		// This function begin the updating process.
		// It gets the two application versions.
		window.onload = function() {
		
			// Get the version of the running application:
			

		} // End of anonymous function.

		// Function gets the version of the running
		// application from the application descriptor file.
		function getThisVersion() {

			// Get the data:
			var appData = air.NativeApplication.nativeApplication.applicationDescriptor;
			//air.trace(appData);
			
			// Turn the file data into an XML object:
			var dp = new DOMParser();
			var xml = dp.parseFromString(appData, 'text/xml');

			// Parse out and return the version value:
			var version = xml.getElementsByTagName('version')[0].firstChild;
			thisVersion = version.nodeValue;
			air.trace(thisVersion);
			
			getCurrentVersion();

		} // End of getThisVersion() function.

		// This function performs an XMLHttpRequest to get the
		// version number of the most recent release.
		function getCurrentVersion() {

			var errorCallback = function(){};
			var completeHandle = function(event){
				var ld = air.URLLoader(event.target);
				var d = JSON.parse(ld.data);
				
				currentVersion = d.version;
				fileUrl = d.downloadurl;
				air.trace(currentVersion, fileUrl)
				downloadNewVersion();
			};
			
			var request = new air.URLRequest();
			request.method = air.URLRequestMethod.POST;
			request.url = "http://www.startfeel.com/app/mease/check.json";
			
			air.trace(completeHandle);
			air.trace(errorCallback);
			var loader = new air.URLLoader();
			loader.addEventListener(air.Event.COMPLETE,completeHandle);
			loader.addEventListener(air.IOErrorEvent.IO_ERROR,errorCallback);
			loader.load(request);

		} // End of getCurrentVersion() function.

		// This function downloads the latest version.
		function downloadNewVersion() {

			// Create the variables:
			var addr = fileUrl;
			var url = new air.URLRequest(addr);
			urlStream = new air.URLStream();
			data = new air.ByteArray();

			// Add an event listener:
			urlStream.addEventListener(air.Event.COMPLETE, saveNewVersion);
			
			// Add an event listener:
			urlStream.addEventListener(air.ProgressEvent.PROGRESS, showProgress);

			// Get the data:
			urlStream.load(url);

		} // End of downloadNewVersion() function.
		
		function showProgress(e) {
			//air.trace(e.bytesLoaded + " and " + e.bytesTotal  +  " and " + parseInt(e.bytesLoaded/e.bytesTotal*100));
			$("#progress-percent").css({width:152 * e.bytesLoaded/e.bytesTotal});
		}
		
		// Function that writes the downloaded data to a file:
		function saveNewVersion(e) {
			
			$("#startup-status").html("下载成功，正在准备升级...");
			$("#progress-bar").fadeOut(500);
			// Read the downloaded data into the 'data' variable:
			urlStream.readBytes(data, 0, urlStream.bytesAvailable);

			// Write the data to a file:
			//newAppFile = air.File.desktopDirectory.resolvePath('Measy.air');
			newAppFile = air.File.desktopDirectory.resolvePath('Mease.air');
			var fileStream = new air.FileStream();
			fileStream.open(newAppFile, air.FileMode.WRITE);
			fileStream.writeBytes(data, 0, data.length);
			fileStream.close();

			// Call the function that performs the update:
			updateApplication();

		} // End of saveNewVersion() function.

		// This function performs the actual update.
		function updateApplication() {
			
			try{
				var updater = new air.Updater();
				updater.update(newAppFile, currentVersion);
			} catch(err) {}
			
			nativeWindow.close();
		} // End of updateApplication() function.
		
		$("#startup").fadeIn(200);
		
		getThisVersion();
})();