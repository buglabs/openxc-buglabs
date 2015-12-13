window.thing1 = "";
window.thing2 = "";
window.thing3 = "";
window.masterNumber = "";
window.masterLocation = {"latitude":"","longitude":""};
window.userData = [{"latitude":"","longitude":"", "locationAlerted":false,"previousSpeed":0,"speedAlerted":false,"decelAlerted":false},{"latitude":"","longitude":"","locationAlerted":false,"previousSpeed":0,"speedAlerted":false,"decelAlerted":false}];
window.speedThreshold = 90;
window.distanceThreshold = 1; //in miles
window.decelThreshold = 30;
window.isInit;
$.support.cors = true;
//window.previousSpeed = 0;

setTimeout(function(){	
        if (!freeboard.isEditing()) {
            freeboard.showDialog($("<div align='center'>Please login to your Freeboard.io account.  <br>Once logged in, load this URL and click Clone on the bottom right to create personalized dashboard.</div>"),"Setup Instructions","OK",null,function(){
                    });
        }
	    else if (freeboard.getDatasourceSettings("Master").thing_id == ""){
                freeboard.showDialog($("<div><div class='form-row'><div class='form-label'><label class='control-label'>Master User (you):</label></div><div class='form-value'><input id='thing1' type='text'><div class='setting-description'>The asset representative of the owner of this profile.  All GPS geofencing will be relative to this asset's location</div></div><div class='form-row'><div class='form-label'><label class='control-label'>SMS Alert Phone Number:</label></div><div class='form-value'><input type='text' id='mastersms'><div class='setting-description'>please include country code and remove all symbols e.g. 12223334444</div></div></div></div><div class='form-row'><div class='form-label'><label class='control-label'>Sub-User 1:</label></div><div class='form-value'><input type='text' id='thing2'></div></div><div class='form-row'><div class='form-label'><label class='control-label'>Sub-User 2:</label></div><div class='form-value'><input type='text' id='thing3'></div></div><div class='form-row'><div class='form-label'><label class='control-label'>Proximity Threshold (Mi):</label></div><div class='form-value'><input type='text' id='distanceThresh'></div></div><div class='form-row'><div class='form-label'><label class='control-label'>Speed Threshold (MPH):</label></div><div class='form-value'><input type='text' id='speedThresh'></div></div><div class='form-row'><div class='form-label'><label class='control-label'>Deceleration (MPH):</label></div><div class='form-value'><input type='text' id='decelThresh'></div></div></div>"),"Family Profile Setup","OK",null,function(){                
                window.thing1 = $("#thing1").val();
                window.thing2 = $("#thing2").val();
                window.thing3 = $("#thing3").val();
                window.masterNumber = $("#mastersms").val();
                if ($("#distanceThresh").val() < 1) { 
                    window.distanceThreshold = 1;
                } else {
                    window.distanceThreshold = $("#distanceThresh").val();
                }
                if ($("#speedThresh").val() < 1) {
                    window.speedThreshold = 90;
                } else {
                    window.speedThreshold = $("#speedThresh").val();
                }
                if ($("#decelThresh").val() < 1) {
                    window.decelThreshold = 30;
                } else {
                    window.decelThreshold = $("#decelThresh").val();
                }
                freeboard.setDatasourceSettings("Master", {"thing_id":window.thing1});
                freeboard.setDatasourceSettings("Master", {"distance_thresh":window.distanceThreshold});
                freeboard.setDatasourceSettings("Master", {"speed_thresh":window.speedThreshold});
                freeboard.setDatasourceSettings("Master", {"decel_thresh":window.decelThreshold});
                freeboard.setDatasourceSettings("SubUser1", {"thing_id":window.thing2});
                freeboard.setDatasourceSettings("SubUser2", {"thing_id":window.thing3});
                freeboard.setDatasourceSettings("MasterSMS", {"phone_number":window.masterNumber});
                freeboard.setDatasourceSettings("MasterSMS", {"is_init":true});
                freeboard.showDialog($("<div align='center'>Configuration Saved!  Please REFRESH the page.<br>For future browser sessions, you may access this dashboard from the My Freeboards page of your freeboard.io account</div>"),"Reminder","OK",null,function(){
                    });
            });
        }
        else {
            window.masterNumber = freeboard.getDatasourceSettings("MasterSMS").phone_number;
            window.isInit = freeboard.getDatasourceSettings("MasterSMS").is_init;
            if (window.isInit) {
                $.ajax({
                  type: "GET",
                    url: "https://thingproxy.freeboard.io/fetch/http://bugops.com:4000/sendSMS",
                  data: {
                    "To" : window.masterNumber,
                    "From" : "+17182159196",
                    "Body" : "You are now registered with the OpenXC Social Mobile Template, powered by Bug Labs"
                  },
                  success: function(data) {
                    console.log(data);
                    freeboard.setDatasourceSettings("MasterSMS",{"is_init":false});
                  },
                  error: function(data) {
                    console.log(data);
                  }
                });
            }
            window.distanceThreshold = freeboard.getDatasourceSettings("Master").distance_thresh ;
            window.speedThreshold = freeboard.getDatasourceSettings("Master").speed_thresh;
            window.decelThreshold = freeboard.getDatasourceSettings("Master").decel_thresh;
            freeboard.showLoadingIndicator(true);
	        setTimeout(function(){
	            freeboard.addStyle(".sub-section","border-bottom: none;");
	            freeboard.showLoadingIndicator(false);
	        },10000);	
        }
		
},1000);

window.checkSpeedAlert = function(speed,user) {
    //console.log(user+ ': '+speed); 
    if (speed > window.speedThreshold) {
        if (!window.userData[user-1]["speedAlerted"]) {
            window.sendSMSAlert(user,"was detected driving at speed: "+speed+"mph, which violated the threshold of "+window.speedThreshold);
            window.userData[user-1]["speedAlerted"] = true;
            //return true;
        }
        console.log('user ' +user+ 'speed alert');
    }
    else if (window.userData[user-1]["previousSpeed"]-speed > window.decelThreshold) {
        if (!window.userData[user-1]["decelAlerted"]) {
            window.sendSMSAlert(user,"decelerated from: "+window.userData[user-1]['previousSpeed']+"mph, to "+speed+"mph");
            window.userData[user-1]["decelAlerted"] = true;
            //return true;
        }
        console.log('user ' +user+ 'decel alert');
    }
    window.userData[user-1]["previousSpeed"] = speed;
}

window.checkUserProximity = function(user) {
    if  ((window.masterLocation["latitude"] !== "") && (window.masterLocation["longitude"] !== "")){
        var p1 = new LatLon(window.masterLocation["latitude"],window.masterLocation["longitude"]) ;
        var idx = user;
        if (idx > 0) {    
            if ((window.userData[idx-1]["latitude"] !== "") && (window.userData[idx-1]["longitude"] !== "")) {
                var p2 = new LatLon(window.userData[idx-1]["latitude"],window.userData[idx-1]["longitude"]);
                var d = p1.distanceTo(p2);
                //console.log(d); //in meters
                /* converts to miles */
                if (d/1600 > window.distanceThreshold) {
                    if (!window.userData[idx-1]["locationAlerted"]){
                        window.sendSMSAlert(idx,"violated distance threshold!");
                        window.userData[idx-1]["locationAlerted"] = true;
                        //return true;
                    }
                }
            }
        }   
    }
}
window.sendSMSAlert = function(offendingUser, message) {
    var usrString = "SubUser"+offendingUser;
    var messageBody = "--OpenXC ALERT-- " +usrString+" "+message ;
    $.ajax({
                  type: "GET",
                    url: "https://thingproxy.freeboard.io/fetch/http://bugops.com:4000/sendSMS",
                  data: {
                    "To" : window.masterNumber,
                    "From" : "+17182159196",
                    "Body" : messageBody
                  },
                  success: function(data) {
                    console.log(data);
                  },
                  error: function(data) {
                    console.log(data);
                  }
        });
}


