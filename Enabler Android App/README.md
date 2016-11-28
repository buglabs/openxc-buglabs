Based off of the OpenXC Enabler Android application (v 6.1.6 from Play Store), this pre-release version integrates the sending of live OpenXC data to Dweet.io.  Used with the "Live Modes" of both Monsoon and Social Mobile templates.  

Navigate to the [/bin](./bin) directory, or visit the [Releases](/Releases) tab to download the .apk, and install on your Android device using your favorite method (adb, etc).  

Check out our [video tutorial](https://youtu.be/-ONi76sI9yc), or follow the instructions below:

**After installation, touch the Settings tab:**

<img src="https://cloud.githubusercontent.com/assets/584962/11876984/86417162-a4ba-11e5-8486-c9cbed89b8e6.png" height="480" width="auto">

**Then touch Recording:**

<img src="https://cloud.githubusercontent.com/assets/584962/11877301/77053c40-a4bc-11e5-89f2-c65db5bc28d2.png" height="480" width="auto">

**You will notice two new fields at the bottom related to configuring your Dweet.io connection.  Make note of the "thing-name" that is automatically created for you, then activate the "Send Data to Dweet.io" checkbox to begin funneling any attached OpenXC device data to dweet:**

<img src="https://cloud.githubusercontent.com/assets/584962/11877317/96a3628e-a4bc-11e5-9c08-2b14ccb5e0bd.png" height="480" width="auto">

**If at any point you would like to set your own 'thing-name', first de-activate the "Send Data to Dweet.io" checkbox, then touch the "thing-name" field.  You can name it whatever you want (just don't included spaces), but we recommend something unique to minimize the possibility of name clashing:**

<img src="https://cloud.githubusercontent.com/assets/584962/11877657/bd304f1e-a4be-11e5-882c-5a47683f0532.png" height="480" width="auto">

**Re-activate the "Send Data to Dweet.io" checkbox, then navigate back to the home screen.  If an OpenXC data source is configured and connected to the Enabler app, you can now see its data in real time by navigating any browser to https://dweet.io/follow/ and entering in your thing-name**

*For more detailed documentation on the OpenXC Enabler Android App, please visit http://openxcplatform.com/android/getting-started.html*

*Source code for the Dweet.io Integrated version of the Enabler App can be found at https://github.com/buglabs/openxc-android/tree/enabler-dweet*
