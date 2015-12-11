// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ F R E E B O A R D                                                  │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2013 Jim Heising (https://github.com/jheising)         │ \\
// │ Copyright © 2013 Bug Labs, Inc. (http://buglabs.net)               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.                                    │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

(function () {
	var openXCDatasource = function (settings, updateCallback) {
		var self = this;
		var currentSettings = settings;
		var currentDataset = [];
		var currentIndex = 0;
		var currentTimeout;
		var currentDatafileIndex = 0;

		function moveNext() {
			if (currentDataset.length > 0) {
				if (currentIndex < currentDataset.length) {
					updateCallback(currentDataset[currentIndex]);
					currentIndex++;
				}

				if (currentIndex >= currentDataset.length) {
					if (currentDatafileIndex >= currentSettings["dataurl"].length && currentSettings.loop) {
    					currentIndex = 0;
    					currentDatafileIndex = 0;
    					self.updateNow();
					}
					if (currentDatafileIndex < currentSettings["dataurl"].length) {
					    currentIndex = 0;
    					currentDatafileIndex += 1;
					    self.updateNow();
					}
				}

				if (currentIndex < currentDataset.length) {
					currentTimeout = setTimeout(moveNext, currentSettings.refresh);
				}
			}
			else {
				updateCallback({});
			}
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
            if (!currentSettings.dataurl) 
                return;
                
			var currurl = currentSettings.dataurl[currentDatafileIndex].url;
			console.log(currurl);
			$.ajax({
				url: currurl,
				success: function (data) {
					//console.log(data);
					data = JSON.parse(data);

					if (_.isArray(data)) {
						currentDataset = data;
					}
					else {
						currentDataset = [];
					}

					currentIndex = 0;

					moveNext();
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
		"type_name": "openxcplayback",
		"display_name": "OpenXC Tracefile Playback",
		"settings": [
			{
				"name": "dataurl",
				"display_name": "Trace File Base URL",
				"type": "array",
				"description": "URL of a hosted openxc JSON tracefile",
				"settings": [
					{
						name: "url",
						display_name: "URL",
						type: "text"
					}
				]
			},
			{
				name: "is_jsonp",
				display_name: "Is JSONP",
				type: "boolean"
			},
			{
				"name": "loop",
				"display_name": "Loop",
				"type": "boolean",
				"description": "Rewind and loop when finished"
			},
			{
				"name": "refresh",
				"display_name": "Refresh Every",
				"type": "number",
				"suffix": "milliseconds",
				"default_value": 5
			}
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new openXCDatasource(settings, updateCallback));
		}
	});

}());
