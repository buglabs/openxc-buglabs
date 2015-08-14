var datafiles = [
    "https://www.dropbox.com/s/zzjcvv5bd2212bg/localwithgps0.json?dl=1",
    "https://www.dropbox.com/s/l2v40svn9bee2re/localwithgps1.json?dl=1",
    "https://www.dropbox.com/s/mreg3t5k8pmg4zg/localwithgps2.json?dl=1",
    "https://www.dropbox.com/s/vyw5gaqkxgsflp9/localwithgps3.json?dl=1",
    "https://www.dropbox.com/s/h1w4y1ncsojldcm/localwithgps4.json?dl=1",
    "https://www.dropbox.com/s/rln94rhzt2lvui3/localwithgps5.json?dl=1",
    "https://www.dropbox.com/s/67zfxt2lghxnvba/localwithgps6.json?dl=1",
    "https://www.dropbox.com/s/jypp0jsw7kn7c8g/localwithgps7.json?dl=1",
    "https://www.dropbox.com/s/efyutsyfodn23x3/localwithgps8.json?dl=1",
    "https://www.dropbox.com/s/br5mhronhzf2b2o/localwithgps9.json?dl=1"
    ];
    
var speeddatafile = "https://www.dropbox.com/s/ipxoxch09ox15zy/localwithgps0_speed.json?dl=1"
                    
window.updateMonsoonDash = function(idx) {
    freeboard.showLoadingIndicator(true);
	setTimeout(function(){	
		freeboard.setDatasourceSettings("car_data", {"datafile":"https://thingproxy.freeboard.io/fetch/"+datafiles[idx%10]});
		freeboard.setDatasourceSettings("speed_data", {"datafile":"https://thingproxy.freeboard.io/fetch/"+speeddatafile});
		freeboard.showLoadingIndicator(false);
	},1000);
};
