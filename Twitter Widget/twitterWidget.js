(function()
{
    freeboard.addStyle('table.list-table', "width: 100%; white-space: normal !important;");
    freeboard.addStyle('table.tablescroll_head', "width:279px!important;border-collapse: collapse;");
    freeboard.addStyle('table.tablescroll_head th', " font-size: 11px;");
    freeboard.addStyle('table.tablescroll_body', " 276px!important;");
    freeboard.addStyle('table.tablescroll_body .td-0', " width:106px!important;");
    freeboard.addStyle('table.tablescroll_body .td-1', " width:60%!important;");
    freeboard.addStyle('table.tablescroll_body .td-2', " width:40%!important;text-align:right;");
    freeboard.addStyle('table.tablescroll_wrapper', " width:280px!important;");
    freeboard.addStyle('.added-header', "background: #CFCCCB;");
    freeboard.addStyle('table.list-table thead', "background: #CFCCCB;");
    freeboard.addStyle('table.list-table tr', "display: table-row; vertical-align: inherit; border-color: inherit;");
    freeboard.addStyle('table.list-table tr.highlight', "background-color:#656565; color:#FFFFFF");
    freeboard.addStyle('table.list-table th', "padding: .3em; border: 2px #545454 solid; font-size: 11px;");
    freeboard.addStyle('table.list-table tbody', "display: table-row-group;  vertical-align: middle; border-color: inherit;");
    freeboard.addStyle('table.list-table td, table.list-table th', "padding: .3em; font-size: 12px; ");
    freeboard.addStyle('table.list-table td, table.list-table th', "padding: 2px 2px 2px 2px; vertical-align: top; ");
    freeboard.addStyle('table.tablescroll_head th', "padding: 2px 2px 2px 2px; vertical-align: top; ");
    freeboard.addStyle('.tweetButton',"position:absolute; right:0; bottom:0");
	var twitterWidget = function (settings) {
        var self = this;
        var titleElement = $('<h2 class="section-title"></h2>');
        var stateElement = $('<div><table id="thetable" class="list-table"><thead/><tbody/></table></div>');
        var currentSettings = settings;
		var stateObject = {};
		var currRowElements = [];
		var init = true;
        
        function initTable(rows) {
            //stateElement.find('.list-table').empty();
        	//var bodyHTML = $('<tbody/>');
			var headerRow = $('<tr class="added-header"/>');
			headerRow.append($('<th/>').addClass('td-'+0).html("Name"));
			headerRow.append($('<th/>').addClass('td-'+1).html("Value"));
            stateElement.find('thead').append(headerRow);
            for (i in rows) {
                var rowHTML = $('<tr/>');
                rowHTML.append($('<td/>').addClass('td-' + 1).html(rows[i])).append($('<td class="td-2"></td>').append());
                currRowElements.push(rowHTML);
                stateElement.find('tbody').append(rowHTML);
            }
            stateElement.find('.list-table').prepend(stateElement.find('tbody'));
            if($(stateElement).find('.list-table').hasClass('tablescroll_head')){
            }
            else {
                //$(stateElement).find('.list-table').tableScroll({height:200});
            }
                       
        }
        
        function clearTable() {
            stateElement.html('<div><table id="thetable" class="list-table"><thead/><tbody/></table></div>');
            currRowElements = [];
        }
        
		function updateTableValues() {   
		    if (init) {
		        //console.log('elleo');
                if($("#thetable").hasClass('tablescroll_head')){
                }
                else {
                    $("#thetable").tableScroll({height:120});
                }
                init = false;
		    }        						
			//only proceed if we have a valid JSON object
			if (stateObject.value) {
			    //console.log(stateObject["value"]);
			    for (v in stateObject["value"]) {
			        if (stateObject["value"][v] == undefined) {
                        currRowElements[v].find('.td-2').html('null');
                    } else {
			            currRowElements[v].find('.td-2').html(stateObject["value"][v]);
			        }
			    }
			}
        }
        
        function tweetTableData() {
            var dataString = "?text=Check+out+my+live+sensor+data:+";
            for (var i=0;i<currRowElements.length;i++) {
                if (i==0) {
                    dataString = dataString.concat(currRowElements[i].find('.td-1').html()).concat('=').concat(currRowElements[i].find('.td-2').html());
                } else {
                    dataString = dataString.concat(',+').concat(currRowElements[i].find('.td-1').html()).concat('=').concat(currRowElements[i].find('.td-2').html());
                }
            }
            dataString = dataString.concat('&url='+window.location.href+'&via=buglabs');
            if (dataString.length > 140) {
                freeboard.showDialog($("<div>Alert: Too much data to Tweet! Please remove one or more sensors from the widget configuration</div>"),"Error","OK",null,function(){});
            } else {
                window.open('http://twitter.com/intent/tweet'+dataString);
            }
        }

        this.render = function (element) {
            var tweetButton = $('<button class="tweetButton" id="tweet">Tweet This Data!</button>'); 
            $(element).append(titleElement).append(stateElement).append(tweetButton).on('click', '#tweet', function() {tweetTableData()});
        }		

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
            clearTable();			
            
            var re = /\["?(.+?)"?\]/g;
            var regexArray = new Array();
            var elementArray = new Array();
            while ((matches = re.exec(currentSettings["value"])) != null) {
                regexArray.push(matches[1]);
            }
            for (var x=0; x<regexArray.length; x++) {
                elementArray.push(regexArray[x+1]);
                x++;
            }
            initTable(elementArray);
            	
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
			stateObject[settingName] = newValue;
            updateTableValues();
        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
//             if (currentSettings["height"] && currentSettings["height"] !== 0) {
//                 return currentSettings["height"];
//             } else {
// 			    var height = Math.ceil(stateElement.height() / 50);
//                 //height = 3;
// 			    return (height > 0 ? height : 3);
// 			}
            return 3;
        }

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "twitter",
        display_name: "Twitter",
//         external_scripts : [
//          "plugins/thirdparty/jquery.tablescroll.js",
//          "plugins/thirdparty/jquery.timeago.js"
//          ],
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
			{
                name: "value",
                display_name: "Value",
                type: "calculated",
                multi_input: "true"
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new twitterWidget(settings));
        }
    });
}());	
