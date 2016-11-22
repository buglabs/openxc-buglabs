// # D3.js Visualization Plugin
//
// The D3.js visualization plugin lets you leverage the power of d3.js and the simplicity of the freeboard design.
//
// -------------------

(function()
{

  // ## A plugin that uses D3.js to visualise some data.
  //
  // -------------------
  // ### D3.js visualization
  //
  // -------------------
    var push_apply = Function.apply.bind([].push);
    var slice_call = Function.call.bind([].slice);

    Object.defineProperty(Array.prototype, "pushArrayMembers", {
        value: function() {
            for (var i = 0; i < arguments.length; i++) {
                var to_add = arguments[i];
                for (var n = 0; n < to_add.length; n+=300) {
                    push_apply(this, slice_call(to_add, n, n+300));
                }
            }
        }
    });
  freeboard.addStyle(".tooltip","position: absolute;   text-align: left;   width:auto;   height: auto;   padding: 8px;   margin-top: -20px;   font: 10px sans-serif;   background: #d3d4d4;   pointer-events: none; z-index:3000; ");
  freeboard.addStyle(".axis path","fill: none; stroke: #FFF;shape-rendering: crispEdges;");
  freeboard.addStyle(".axis line","fill: none; stroke: #FFF;shape-rendering: crispEdges;");
  freeboard.addStyle(".chart","color:#fff;");
  freeboard.addStyle(".axis text","font-family: sans-serif; font-size:10px; font-weight:lighter; fill:none; stroke:#d3d4d4;shape-rendering: crispEdges;");
    freeboard.addStyle(".overlay","fill: none; pointer-events: all;");
    freeboard.addStyle(".focus circle","fill:none; stroke:white");


  freeboard.loadWidgetPlugin({
    "type_name": "openXCHistoricalChartWidget",
    "display_name": "OpenXC Historical Chart",
    "description": "Creates a bar or line chart from OpenXC trace file data.  Use with OpenXC AWS Datasource (NOT in Playback Mode)",
    "external_scripts": [
        "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"
    ],
    "fill_size": false,
    "settings": [
        {
            "name": "type",
            "display_name": "Chart Type",
            "type": "option",
            "options": [
                "Bar",
                "Line"
            ],
            "default_value": "Bar"
        },
        {
            "name": "data",
            "display_name": "OpenXC Trace File(s)",
            "type": "calculated",
            "multi_input":true,
            "description": "Choose the trace file(s) to include in the graph.  NOTE: only choose the top-level filename (e.g. datasources[\"DSNAME\"][\"OpenXC-VI-MODEM-1111.22222.trace.json\"])"
        },
        {
            "name": "target",
            "display_name": "Target Data Field",
            "type": "text",
            "description": "Type the name of the signal to graph. For example: engine_speed "
        },
        {
            "name": "size",
            "display_name": "Size",
            "description": "Small: 300x180, Medium: 600x420, Large: 900x600.<br><strong>NOTE: You must also set the containing Pane's COLUMNS value to 1 (Small), 2 (Medium) or 3 (Large)</strong>",
            "type": "option",
            "options": [
                "Small",
                "Medium",
                "Large"
            ],
            "default_value": "Small"
        },
        {
            "name": "include_axis",
            "display_name": "Include Axis?",
            "type": "boolean",
            "default_value": false
        }
    ],
    newInstance   : function(settings, newInstanceCallback)
    {
      newInstanceCallback(new openXCHistoricalChartWidget(settings));
    }
  });

  var openXCHistoricalChartWidget = function(settings)
  {
    var self = this;
    var currentSettings = settings;
    var container;
    var chartElement;
    var currentDataSet = [];
    var DOWNLOAD_BASE_URL = "https://thingproxy.freeboard.io/fetch/";
    
    // Create a variable for the created stylesheet:
    var styleSheet = null;

    this.render = function(containerElement)
    {
      // Here we append our text element to the widget container element.
      container = containerElement;

      // Load the settings:
      this.onSettingsChanged(currentSettings);
    }

    this.getHeight = function()
    {
        switch (currentSettings.size) {
            case 'Small':
                return 3;
            case  'Medium':
                return 7;
            case 'Large':
                return 10;    
        }
      return 5;
    }

    this.onSettingsChanged = function(newSettings)
    {
      currentSettings = newSettings;
        $(container).empty();
        chartElement = d3.select(container).append('svg').attr("class","chart");
        //container.innerHTML = '<svg class="chart" />';
        
        switch (currentSettings.size) {
            case 'Small':
                currentSettings.width = 300;
                currentSettings.height = 180;
                break;
            case 'Medium':
                currentSettings.width = 600;
                currentSettings.height = 420;
                break;
            case 'Large':
                currentSettings.width = 900;
                currentSettings.height = 600;
                break;
            default:
                currentSettings.width = 300;
                currentSettings.height = 180;
        }

    }

    this.onCalculatedValueChanged = function(settingName, newValue)
    {
      if(settingName == "data")
      {
        if (_.isArray(newValue)) 
        {
            currentDataSet = [];
            
            /* Wait for all tracefiles to download, then create the graph */
            var dfrds = self.DownloadSelectedData(newValue);
            $.when.apply(null,dfrds).done(function() {
                // reset the graph
                $(container).empty();
                chartElement = d3.select(container).append('svg').attr("class","chart");
                //container.innerHTML = '<svg class="chart"/>';

                /* Create new data array with only the signal of interest */
                var filtered_data = [];
                _.each(currentDataSet, function(d) {
                    if (d.name == currentSettings.target)
                        filtered_data.push(d);
                });
        
                switch (currentSettings.type) {
                    case "Bar":
                        createBarChart(filtered_data, currentSettings.target, currentSettings.include_axis);
                        break;
                    case "Line":
                        createLineChart(filtered_data, currentSettings.target, currentSettings.include_axis);
                        break;
                    default:
                        createBarChart(filtered_data, currentSettings.target, currentSettings.include_axis);
                }
            });
            
        }
      }
    }
    
    function createBarChart(data,target,axis) {

        var getDataPt = function(d) { return d.value; };
        var getTime = function(d) { return d.timestamp; };        
        var margin = {top:0, right:0, bottom:0, left:0};    
        if( axis ) {
            margin = {top:10, right:0, bottom: 15, left:40};
        }
        var fullwidth = currentSettings.width,
            fullheight = currentSettings.height;
        
        var graphwidth = fullwidth - margin.left - margin.right;
        var graphheight = fullheight - margin.top - margin.bottom;

        var y = d3.scale.linear().range([graphheight, 0]).domain([0, d3.max(data, getDataPt)]);

        var chart = chartElement
            .attr("width", fullwidth)
            .attr("height", fullheight)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');


          var barWidth = graphwidth / data.length;

          var bar = chart.selectAll("g")
              .data(data)
            .enter().append("g")
              .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

          bar.append("rect")
              .attr("y", function(d) { return y(getDataPt(d)); })
              .attr("height", function(d) { return graphheight - y(getDataPt(d)); })
              .attr("width", barWidth)
          .style("fill", function(d){return d3.hsl(getDataPt(d),0.9,0.5);})    
          .on("mouseover", mouseover)
            .on("mousemove", function (d) {
            div
              .html("<strong>Time:</strong> " + getTime(d) + "<br>" + "<strong>"+target+":</strong>  "+getDataPt(d))
              .style("left", (d3.event.pageX +10) + "px")
              .style("top", (d3.event.pageY +20) + "px");
        })
            .on("mouseout", mouseout);

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", "none");

        function mouseover() {
          div.style("display", "inline");
        }

        function mouseout() {
          div.style("display", "none");
        };
        
//         var xAxis = d3.svg.axis()
//                     .scale(x)
//                   .orient("bottom");
//         chart.append("g").call(xAxis);
        if (axis) {
            var yAxis = d3.svg.axis()
                        .scale(y)
                        .ticks(5)
                        .tickPadding(8)
                        .orient("left");
            chartElement.append("g")
                .attr("transform", "translate("+margin.left+","+margin.top+")")
                .attr('class', 'axis')
                .call(yAxis)
                .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text(target);
        }
    }
    
    function createLineChart(data,target,axis) {

        var getDataPt = function(d) { return d.value; };
        var getTime = function(d) { return d.timestamp; }; 
         
        var margin = {top:0, right:0, bottom:0, left:0};    
        if( axis ) {
            margin = {top:10, right:0, bottom: 15, left:40};
        }
        
        var bisectDate = d3.bisector(function(d) { return new Date(d["timestamp"])}).left;

        var fullwidth = currentSettings.width,
            fullheight = currentSettings.height;
        
        var graphwidth = fullwidth - margin.left - margin.right;
        var graphheight = fullheight - margin.top - margin.bottom;

        var y = d3.scale.linear()
            .range([graphheight, 0])
            .domain(d3.extent(data, getDataPt));
            
        var x = d3.time.scale.utc()
            .domain(d3.extent(data, getTime))
            .range([0,graphwidth]);

        var chart = chartElement
            .attr("width", fullwidth)
            .attr("height", fullheight)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

        var line = d3.svg.line()
            .x(function(d) {return x(getTime(d));})
            .y(function(d){return y(getDataPt(d));})
            .interpolate('basis');

        chart.append("path")
                .datum(data)
                .attr("class","line")
                .attr("d",line)
                .attr("stroke","white")
                .attr("fill","none");

     var focus = chart.append("g")
      .attr("class", "focus")
      .style("display", "none");

      focus.append("circle")
      .attr("r", 4.5);
        focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");
      
        var div = chartElement.append("div")
            .attr("class", "tooltip")
            .style("display", "none");
      
       chart.append("rect")
      .attr("class", "overlay")
      .attr("width", graphwidth)
      .attr("height", graphheight)
      .on("mouseover", function() { 
            focus.style("display", null);
            div.style("display", "inline");
         })
      .on("mouseout", function() { focus.style("display", "none"); 
            div.style("display", "none");
        })
      .on("mousemove", mousemove);
      
      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0["timestamp"] > d1["timestamp"] - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(getTime(d)) + "," + y(getDataPt(d)) + ")");
//         focus.select("text").html("<strong>Time:</strong> " + getTime(d) + "<br>" + "<strong>"+target+":</strong>  "+getDataPt(d))
//             .style("left", (d3.event.pageX - 34) + "px")
//             .style("top", (d3.event.pageY - 12) + "px");
        div.attr("transform", "translate(" + x(getTime(d)) + "," + y(getDataPt(d)) + ")")
              .html("<strong>Time:</strong> " + getTime(d) + "<br>" + "<strong>"+target+":</strong>  "+getDataPt(d))
              .style("left", (d3.event.pageX + 10) + "px")
              .style("top", (d3.event.pageY + 20) + "px");
    }

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", "none");

        function mouseover() {
          div.style("display", "inline");
        }

        function mouseout() {
          div.style("display", "none");
        };
        
//         var xAxis = d3.svg.axis()
//                     .scale(x)
//                   .orient("bottom");
//         chart.append("g").call(xAxis);
        if (axis) {
            var yAxis = d3.svg.axis()
                        .scale(y)
                        .ticks(5)
                        .tickPadding(8)
                        .orient("left");
            chartElement.append("g")
                .attr("transform", "translate("+margin.left+","+margin.top+")")
                .attr('class', 'axis')
                .call(yAxis);
        }
    }
    
    this.DownloadSelectedData = function(links) 
    {
        var requests = [];
        for (var i=0; i<links.length; i++) 
        {
            requests.push(
                $.post(DOWNLOAD_BASE_URL+links[i].link, function(data) {
                    if (/^\s*$/.test(data)) 
                    {
                        //do nothing if the tracefile is empty
                    } 
                    else 
                    {
                        data = data.replace(/(\r\n|\n|\r)/gm,",");
                        while (data.charAt(0) != '{') {
                            data = data.substr(1);
                        }
                        while (data.charAt(data.length-1)!='}') {
                            data = data.substr(0,data.length-2);
                        }
                        //console.log(data);
                        data = '['+data+']';

                        data = JSON.parse(data);
                        
                        if (_.isArray(data)) {
                            currentDataSet.pushArrayMembers(data);
                        }
                        else {
                        }

                    }
                })
            );
        }
        return requests; 
    }

    this.onDispose = function()
    {
    }
  }
}());