# OpenXC DweetPro Android App

This Private Ford Android application is based off of the OpenXC Enabler Android application (v 6.1.6 from Play Store). This pre-release version integrates the sending of live OpenXC data to a private and secure instance of [DweetPro.io](https://openxc.dweet.io), which enables security, storage, and alerts.

Navigate to the [Releases section to download the .apk](https://github.com/buglabs/openxc-buglabs/releases/tag/v2.0.0-prerelease), and install on your Android device using your favorite method (adb, etc).  

Follow the instructions below for set up:

**After installation, touch the Settings tab:**

<img src="https://github.com/buglabs/openxc-buglabs/raw/master/Enabler%20Android%20App/doc_images/Homescreen.png" height="480" width="auto">

**Then touch Recording:**

<img src="https://github.com/buglabs/openxc-buglabs/raw/master/Enabler%20Android%20App/doc_images/Settings.png" height="480" width="auto">

**You will notice five new fields at the bottom related to configuring your DweetPro.io connection.  Make note of the "thing-name" that is automatically created for you, then activate the "Send Data to OpenXC Dweet" checkbox to begin funneling any attached OpenXC device data to dweet:**

<img src="https://github.com/buglabs/openxc-buglabs/raw/master/Enabler%20Android%20App/doc_images/Recording2.png" height="480" width="auto">

**Click the "Use Pro (v2 API) Features" button below to enable data storage. Use the 'thing-name' supplied to create a new Thing in your DweetPro account.** 

[Adding a new Thing to your DweetPro account](https://github.com/buglabs/openxc-buglabs/tree/master/DweetPro)

**Email or Private message (Slack) your Master Key and Account Token to yourself.** 

**If at any point you would like to set your own 'thing-name', first de-activate the "Send Data to Dweet.io" checkbox, then touch the "thing-name" field.  You can name it whatever you want (just don't included spaces), but we recommend something unique to minimize the possibility of name clashing:**

<img src="https://cloud.githubusercontent.com/assets/584962/11877657/bd304f1e-a4be-11e5-882c-5a47683f0532.png" height="480" width="auto">

**Re-activate the "Send Data to Dweet.io" checkbox, then navigate back to the home screen.  If an OpenXC data source is configured and connected to the Enabler app, you can now see its data by navigating any browser to https://openxc.dweet.io/**

**Follow instructions to GET your data in the Console:**

<img src="https://github.com/buglabs/openxc-buglabs/blob/master/Enabler%20Android%20App/doc_images/GETexample.PNG" height="480" width="auto">

**Download all data to CSV:**

<img src="https://github.com/buglabs/openxc-buglabs/blob/master/Enabler%20Android%20App/doc_images/Download1.PNG" height="240" width="auto">

**Create Alerts:**

<img src="https://github.com/buglabs/openxc-buglabs/blob/master/Enabler%20Android%20App/doc_images/addAlert.PNG" height="480" width="auto">

**Or use [freeboard](https://openxc.freeboard.io) to visualize your data.**

_For more detailed documentation on the OpenXC Enabler Android App, please visit http://openxcplatform.com/android/getting-started.html_

[User guide for DweetPro](https://github.com/buglabs/openxc-buglabs/tree/master/DweetPro)

_Source code for the DweetPro.io Integrated version of the Enabler App can be found at https://github.com/buglabs/openxc-android/tree/openxc-dweetpro_

