// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ F R E E B O A R D                                                  │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2013 Jim Heising (https://github.com/jheising)         │ \\
// │ Copyright © 2013 Bug Labs, Inc. (http://buglabs.net)               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.                                    │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

(function () {
	var monsoonDatasource = function (settings, updateCallback) {
		var self = this;
		var currentSettings = settings;
		var currentDataset = [];
		var currentIndex = 0;
		var currentTimeout;
		var currentDatafileIndex = 0;
		var currentSubsets = [];

		function moveNext() {
			if (currentDataset.length > 0) {
				for (var x=0;x<20;x++) {
				    currentSubsets[x] = currentDataset[currentIndex+116*x];
				}
				updateCallback(currentSubsets);
				currentIndex++;
				
// 				if (currentIndex < currentDataset.length) {
// 					updateCallback(currentDataset[currentIndex]);
// 					currentIndex++;
// 				}
// 
// 				if (currentIndex >= currentDataset.length) {
// 					if (currentDatafileIndex >= currentSettings["dataurl"].length && currentSettings.loop) {
//     					currentIndex = 0;
//     					currentDatafileIndex = 0;
//     					self.updateNow();
// 					}
// 					if (currentDatafileIndex < currentSettings["dataurl"].length) {
// 					    currentIndex = 0;
//     					currentDatafileIndex += 1;
// 					    self.updateNow();
// 					}
// 				}
// 
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
					data = JSON.parse(data);

					if (_.isArray(data)) {
						currentDataset = data;
						for (var i=0; i<20; i++) {
						    currentSubsets.push(data[116*i]);
						}
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
		"type_name": "monsoonplayback",
		"display_name": "Monsoon",
		"settings": [
			{
				"name": "dataurl",
				"display_name": "Data File Base URL",
				"type": "array",
				"description": "A link to a JSON array of data.",
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
				"default_value": 500
			}
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new monsoonDatasource(settings, updateCallback));
		}
	});

}());
