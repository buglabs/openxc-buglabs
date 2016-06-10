# Scripts

Helpful Python scripts for converting OpenXC trace files into JSON data files optimized for browsers (and Freeboard.io!)

##OpenXC Freeboard Datasources/Widgets
Javascript files for use with OpenXC.freeboard.io.  Install via the developer console in freeboard.

###[openXC-AWS-Datasource.js](./openXC-AWS_Datasource.js)
Datasource that retrieves trace files from AWS instance and allows user to show data in a static graph or as a playback simulation

###[openXC-TracefileDatasource.js](./openXC-TracefileDatasource.js)

Datasource that allows for user to specify URL to download OpenXC trace file(s) and playback for simulation applications.

###[openXCHistoricalChart.js](./openXCHistoricalChart.js)

Displays data from OpenXC datasources in a bar or line graph

##Python Scripts
###[openxc_json_converter.py](./openxc_json_converter.py)

Takes any raw trace file from the OpenXC library (examples can be downloaded at [http://openxcplatform.com/resources/traces.html](http://openxcplatform.com/resources/traces.html) and converts into an array of JSON data objects, which can be parsed by Freeboard datasources and widgets, and many other external APIs

Usage:
```Shell
$ python openxc_json_converter.py input_trace_filename.json
```

This will output a new version of the trace file named `input_trace_filename_VALIDATED.json`


###[signal_extractor.py](./signal_extractor.py)

Takes in a JSON data file (created by using [openxc_json_converter](#openxc_json_converter.py)) and a list of signals (each prepended with '-s') that the user wishes to keep.  Outputs new JSON data file with only those signals included, named `input_trace_filename_VALIDATED_STRIPPED.json`

Example Usage:
```Shell
$ python signal_extractor.py input_trace_filename_VALIDATED.json -s openxc_signal_name -s openxc_signal_name2 [...]
```

###[normalizer.py](./normalizer.py)

Strips the input JSON data file to one data point, per signal, per second.  Outputs new files named `input_trace_filename_VALIDATED_STRIPPED_NORMALIZED.json`

Example Usage:
```Shell
$ python normalizer.py input_trace_filename_VALIDATED_STRIPPED.json
```
