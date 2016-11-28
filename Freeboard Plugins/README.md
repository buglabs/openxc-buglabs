OpenXC Freeboard Plugins
=================================

# Table of Contents
* [Introduction](#introduction)
* [How to Use](#how-to-use)

# Introduction
Datasources and Widgets that integrate OpenXC with OpenXC.freeboard.io .  Install via the developer console in freeboard - either via your own host or using https://rawgit.com (see Installation below)

##[openXC-AWS-Datasource.js](./openXC-AWS_Datasource.js)
Datasource that retrieves trace files from AWS instance and allows user to show data in a static graph or as a playback simulation

##[openXC-TracefileDatasource.js](./openXC-TracefileDatasource.js)

Datasource that allows for user to specify URL to download OpenXC trace file(s) and playback for simulation applications.

##[openXCHistoricalChart.js](./openXCHistoricalChart.js)

Displays data from OpenXC datasources in a bar or line graph

# How to Use

## Installation (using Dropbox)

If you have a dropbox account, place the javascript files in a dedicated folder.

![dbox1](./doc_images/install1.png)

Right click the script you would like to include in your Freeboard, and choose "Copy Dropbox Link".  A URL will be generated and automatically copied to your system clipboard.

![dbox2](./doc_images/install2.png)

Navigate to Freeboard, and open the Developer Console

![dconsole](./doc_images/install3.png)

Click the ADD button, then Paste in your dropbox link.  *NOTE:* Change the '?dl=0' at the end of the dropbox url to '?dl=1'

![aws1](./doc_images/aws1.png)



## OpenXC AWS Datasource

Devices compatable with the OpenXC python AWS instances can have historical data visualized directlyfrom freeboard using this datasource. 

![aws2](./doc_images/aws2.png)

![aws3](./doc_images/aws3.png)

![aws4](./doc_images/aws4.png)

![aws5](./doc_images/aws5.png)

![aws6](./doc_images/aws6.png)

![aws7](./doc_images/aws7.png)

![aws8](./doc_images/aws8.png)


## OpenXC Tracefile Datasource

OpenXC tracefiles can be imported directly from any hosting source using this Datasource.  

![tf1](./doc_images/tf1.png)

![tf2](./doc_images/tf2.png)

![tf3](./doc_images/tf3.png)

![tf4](./doc_images/tf4.png)

![tf5](./doc_images/tf5.png)


## OpenXC Historical Chart Widget

Using either of the OpenXC Datasource above (when NOT in 'playback mode), you can visualize the tracefile data in a bar or line chart using this Freeboard widget.

![hist1.png](./doc_images/hist1.png)

![hist2.png](./doc_images/hist2.png)

![hist3.png](./doc_images/hist3.png)

![hist4.png](./doc_images/hist4.png)

![hist5.png](./doc_images/hist5.png)


