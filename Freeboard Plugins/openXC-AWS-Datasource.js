// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ F R E E B O A R D  - OpenXC AWS DATASOURCE                         │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

(function () {
	var openXCAWSDatasource = function (settings, updateCallback) {
		var self = this;
		var currentSettings = settings;
		var currentDataset = [];
		var currentIndex = 0;
		var currentTimeout;
		var currentTracefiles = [];
		var currentTracefileIndex = 0;
		currentSettings.refresh = 50; //hardcoded refresh rate (in milliseconds)
		
		var API_BASE_URL = "https://thingproxy.freeboard.io/fetch/http://52.8.82.204/apiReturn.php";

		function moveNext() {
			if (currentDataset.length > 0) {
				if (currentIndex < currentDataset.length) {
					updateCallback({'tracefile_id':currentTracefiles[currentTracefileIndex],'data':currentDataset[currentIndex]});
					currentIndex++;
				}

				if (currentIndex >= currentDataset.length) {
					if (currentTracefileIndex >= currentTracefiles.length && currentSettings.loop) {
    					currentIndex = 0;
    					currentTracefileIndex = 0;
    					self.doPlayback();
					}
					if (currentTracefileIndex < currentTracefiles.length) {
					    currentIndex = 0;
    					currentTracefileIndex += 1;
					    self.doPlayback();
					}
				}

				if (currentIndex < currentDataset.length) {
					currentTimeout = setTimeout(moveNext, currentSettings.refresh);
				}
			}
			else if ((currentDataset.length == 0) && (currentTracefileIndex < currentTracefiles.length)) {
			    currentIndex = 0;
			    currentTracefileIndex += 1;
			    self.doPlayback();
			}
			else {
				updateCallback({});
			}
		}
		
		this.doPlayback = function(){
		    var currurl = "https://thingproxy.freeboard.io/fetch/"+currentTracefiles[currentTracefileIndex].link;
// 		    console.log(currentTracefiles[currentTracefileIndex]);
		    $.ajax({
		        url: currurl,
		        success: function(data) {
                    /* Check if tracefile is empty */
                    if (/^\s*$/.test(data)) {
                        currentIndex = 0;
                        currentTracefileIndex += 1;
                        self.doPlayback();
                    } else {
                        data = data.replace(/(\r\n|\n|\r)/gm,",");
                        while (data.charAt(0) != '{') {
                            data = data.substr(1);
                        }
                        while (data.charAt(data.length-1)!='}') {
                            data = data.substr(0,data.length-2);
                        }
                        data = '['+data+']';

                        data = JSON.parse(data);

                        if (_.isArray(data)) {
                            currentDataset = data;
                        }
                        else {
                            currentDataset = [];
                        }

                        currentIndex = 0;

                        moveNext();
                    }
				},
				error: function (xhr, status, error) {
					console.log('error: '+error);
				}
		    });
		}
		
		this.getTracefileList = function(){
            var filelist = {};
            _.each(currentTracefiles, function (tf) {
                var tftitle = tf.filename;
                filelist[tftitle] = tf;
            });
            updateCallback(filelist);
        }

		function stopTimeout() {
			currentDataset = [];
			currentIndex = 0;

			if (currentTimeout) {
				clearTimeout(currentTimeout);
				currentTimeout = null;
			}
		}

		this.updateNow = function () {
			stopTimeout();
            if (!currentSettings["id"]) 
                return;
                
			$.ajax({
				url: API_BASE_URL,
				type: "POST",
				data: "mid="+currentSettings.id+"&begin="+currentSettings.start_date+"&end="+currentSettings.end_date,
				success: function (data) {
				    currentTracefiles = JSON.parse(data);
                    if (currentSettings["playback"]) {
                        self.doPlayback();
                    } else {
                        self.getTracefileList();
                    }
				},
				error: function (xhr, status, error) {
					console.log('error: '+error);
				}
			});
		}

		this.onDispose = function () {
			stopTimeout();
		}

		this.onSettingsChanged = function (newSettings) {
			currentSettings = newSettings;
			self.updateNow(0);
		}
	};

	freeboard.loadDatasourcePlugin({
		"type_name": "openXCAWSDatasource",
		"display_name": "OpenXC AWS Datasource",
		"settings": [
            {
                "name" : "id",
                "display_name": "Device ID",
                "type" : "text",
                "required": true
            },
            {
                "name" : "start_date",
                "display_name": "Start Date (YYYY-MM-DD)",
                "type": "text",
                "description":"(Optional) If provided, limits the trace files to those collected on or after this date.  Use in combination with End Date to specify a range.",
                "default_value":""
            },
            {
                "name" : "end_date",
                "display_name": "End Date (YYYY-MM-DD)",
                "type": "text",
                "description":"(Optional) If provided, limits the trace files to those collected on or before this date",
                "default_value":""
            },
			{
			    "name": "playback",
			    "display_name": "Playback Mode",
			    "type": "boolean",
			    "description": "By default, datasource will retrieve list of trace files matching the above query parameters (for use with OpenXC Historical Charts).  Enable this option to playback through each data point as a simulation (for use with real-time widgets).",
			    "default_value": false
			},
			{
				"name": "loop",
				"display_name": "Playback Loop",
				"type": "boolean",
				"description": "If Playback Mode is enabled, the simulation will automatically loop back to beginning after the final datapoint for continuous playback."
			}
// 			{
// 				"name": "refresh",
// 				"display_name": "Refresh Every",
// 				"type": "number",
// 				"suffix": "milliseconds",
// 				"default_value": 5
// 			}
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new openXCAWSDatasource(settings, updateCallback));
		}
	});

}());
