(function () {

    // Define the overlay, derived from google.maps.OverlayView
    function Label(opt_options) {
     // Initialization
        this.setValues(opt_options);
        var span = this.span_ = document.createElement('span');
        span.style.cssText = 'position: relative; left: -50%; top: -8px; ' +
                          'white-space: nowrap; border: none; ' +
                          'padding: 2px; background-color: transparent; color:blue;';

        var div = this.div_ = document.createElement('div');
        div.appendChild(span);
        div.style.cssText = 'position: absolute; display: none';
    };

    var gmapColors = ["#FF9900", "#B3B4B4", "#6B6B6B", "#28DE28", "#13F7F9", "#E6EE18", "#C41204", "#CA3CB8", "#0B1CFB"];
    freeboard.addStyle(".sub-section-height-5","height: 300px;");
    freeboard.addStyle(".sub-section-height-6","height: 360px;");

    var monsoonWidget = function (settings) {
        var self = this;
        var currentSettings = settings;
        var map;
        var marker;
        var markers = [];
        var currentPosition = {};
        var circles = new Array(20);
        //var circles ;
        var currentPositions = {};
        var poly = [];
        var polys = [];
        var postUpdateCount = 0;
        var postUpdateCounts = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var carIcon_green;
        var carIcon_red ;
        var gmapCircle;
        var chosenCarIdx = null;

        function addLatLngPoly(polyidx, position) {
            var path = polys[polyidx].getPath();
            path.push(position);
        }

        function updatePosition(idx) {
            if (map && markers[idx-1] && currentPositions[idx].latitude && currentPositions[idx].longitude) {
                var newLatLon = new google.maps.LatLng(currentPositions[idx].latitude, currentPositions[idx].longitude);
                markers[idx-1].setPosition(newLatLon);
                //if(currentSettings.drawPath) addLatLngPoly(idx-1, newLatLon);
                //map.panTo(newLatLon);
            }
        }
        
        function updateColor(idx, color) {
            if (map && markers[idx-1]) {
                if (color == "red") {
                    markers[idx-1].setIcon(carIcon_red);
                    gmapCircle = new google.maps.Circle({
                        center: markers[idx-1].center,
                        map:map,
                        radius:1000,
                        strokeColor: "red",
                        strokeOpacity:0.8,
                        strokeWeight: 2,
                        fillColor: "red"
                    });
                    gmapCircle.bindTo('center',markers[idx-1],'position');
                    circles[idx-1] = gmapCircle;
                    
                }
                else if (color=="green") {
                    markers[idx-1].setIcon(carIcon_green);
                    if (circles[idx-1])
                        circles[idx-1].setMap(null);
                }
            }
        }

        this.render = function (element) {
            function initializeMap() {
                var mapOptions = {
                    zoom: 11,
                    center: new google.maps.LatLng(42.269634, -83.245415),
                    disableDefaultUI: true,
                    draggable: true,
                    styles: [
                    {
                    "featureType": "all",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "gamma": 0.26
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "lightness": -50
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "labels.text",
            "stylers": [
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#e8efcf"
                }
            ]
        },
        {
            "featureType": "landscape.natural.landcover",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "landscape.natural.terrain",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi.attraction",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.government",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.medical",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.place_of_worship",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.school",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.sports_complex",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#efefef"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 40
                },
                {
                    "hue": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#dcb4b4"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#dcb4b4"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 15
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#bbe0ed"
                }
            ]
        }

                    ]
                };

                map = new google.maps.Map(element, mapOptions);
                
                Label.prototype = new google.maps.OverlayView;

                // Implement onAdd
                Label.prototype.onAdd = function() {
                    var pane = this.getPanes().overlayLayer;
                    pane.appendChild(this.div_);

                     // Ensures the label is redrawn if the text or position is changed.
                    var me = this;
                    this.listeners_ = [
                        google.maps.event.addListener(this, 'position_changed',
                            function() { me.draw(); }),
                        google.maps.event.addListener(this, 'text_changed',
                            function() { me.draw(); })
                    ];
                };

                // Implement onRemove
                Label.prototype.onRemove = function() {
                    this.div_.parentNode.removeChild(this.div_);

                    // Label is removed from the map, stop updating its position/text.
                    for (var i = 0, I = this.listeners_.length; i < I; ++i) {
                        google.maps.event.removeListener(this.listeners_[i]);
                    }
                };

                // Implement draw
                Label.prototype.draw = function() {
                    var projection = this.getProjection();
                    var position = projection.fromLatLngToDivPixel(this.get('position'));

                    var div = this.div_;
                    div.style.left = position.x + 'px';
                    div.style.top = position.y + 'px';
                    div.style.display = 'block';
                    // this.span_.innerHTML = this.get('text').toString();
                    this.span_.innerHTML = this.title;
                };
                
                carIcon_green = {
                    url: "https://www.dropbox.com/s/7hwt9ra284jf3bn/car_green.png?dl=1",
                    size: new google.maps.Size(25,25),
                    origin: new google.maps.Point(0,0),
                    anchor: new google.maps.Point(12,12),
                };
                carIcon_red = {
                    url: "https://www.dropbox.com/s/orupvi03hynodq6/car_red.png?dl=1",
                    size: new google.maps.Size(25,25),
                    origin: new google.maps.Point(0,0),
                    anchor: new google.maps.Point(12,12),
                
                };

                google.maps.event.addDomListener(element, 'mouseenter', function (e) {
                    e.cancelBubble = true;
                    if (!map.hover) {
                        map.hover = true;
                        map.setOptions({zoomControl: true});
                    }
                });

                google.maps.event.addDomListener(element, 'mouseleave', function (e) {
                    if (map.hover) {
                        map.setOptions({zoomControl: false});
                        map.hover = false;
                    }
                });
                
                for (var y=1; y<= currentSettings["vehicles"].length; y++) {
                    var merker = new google.maps.Marker({map: map, icon: carIcon_green, animation: google.maps.Animation.DROP, id: y});                    
                    google.maps.event.addListener(merker, 'click', function() {
                        /* Calls function defined in monsoonapp.js */
                        //window.updateMonsoonDash(currentSettings["vehicles"][this.id-1]);
                        chosenCarIdx = this.id-1;
                        freeboard.showLoadingIndicator(true);
                    	setTimeout(function(){	
                            freeboard.showLoadingIndicator(false);
	                    },1000);    
                    });
                    markers.push(merker);
                    currentPositions[y] = {"latitude":"","longitude":"","wiper_status":""};
                    updatePosition(y);
                }
                //circles = new Array(currentSettings["vehicles"].length);
                setTimeout(function() {
                    google.maps.event.trigger(map, 'resize');
                    map.setZoom( map.getZoom() );
                },5000);    
            }

            if (window.google && window.google.maps) {
                initializeMap();
            }
            else {
                window.gmap_initialize = initializeMap;
                head.js("https://maps.googleapis.com/maps/api/js?v=3.exp&scale=2&callback=gmap_initialize");  
            }
        }

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            //console.log(newValue);
            //console.log(currentPositions);
            for (var x=1; x<=newValue.length;x++) {
                if (newValue[x-1]["latitude"] != undefined) {
                    currentPositions[x]["latitude"] = newValue[x-1]["latitude"];
                }
                if (newValue[x-1]["longitude"] != undefined) {
                    currentPositions[x]["longitude"] = newValue[x-1]["longitude"];
                }
                if (newValue[x-1]["windshield_wiper_status"] != undefined) {
                    if (currentPositions[x]["windshield_wiper_status"] == newValue[x-1]["windshield_wiper_status"]) {
                        //no change
                    }
                    else {
                        if (newValue[x-1]["windshield_wiper_status"]) {
                            updateColor(x,"red");
                        } else {
                            updateColor(x,"green");
                        }
                    }   
                    currentPositions[x]["windshield_wiper_status"] = newValue[x-1]["windshield_wiper_status"];
                }
                updatePosition(x);
            }
            if (chosenCarIdx != null) {
                if (newValue[chosenCarIdx]["vehicle_speed"]) {
                    window.vehicle_speed = newValue[chosenCarIdx]["vehicle_speed"];
                }
                if (newValue[chosenCarIdx]["brake_pedal_status"]) {
                    window.brake_pedal_status = newValue[chosenCarIdx]["brake_pedal_status"];
                }
                if (newValue[chosenCarIdx]["accelerator_pedal_position"]) {
                    window.accel_pedal_position = newValue[chosenCarIdx]["accelerator_pedal_position"];
                }                
            }
         
        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
            return 5;
        }

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "google_map_alt",
        display_name: "Monsoon Map",
        fill_size: true,
        settings: [
            {   
                name: "vehicles",
                display_name: "Vehicles",
                type: "calculated",
                multi_input: true
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new monsoonWidget(settings));
        }
    });


}());