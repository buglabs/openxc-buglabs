<a href="https://openxc.dweet.io">OpenXC-DweetPro.io</a> User Manual
=================================
[https://openxc.dweet.io](https://openxc.dweet.io) - Ridiculously simple messaging for the Internet of Things.  Now with enterprise features!

## Introduction

The OpenXC-DweetPro instance combines the simplicity of [dweet.io](dweet.io) with new, easy-to-use APIs for storage, device management, alerts/notifications and reporting.

Available below is a step-by-step getting started guide, as well as a glossary to help users hit the ground running.

[Sign Up](https://openxc.dweet.io/ui/#/access/register) for a free account and follow the instructions below.

## Topics

- [Getting Started](#getting-started)
- [Key Concepts](#key-concepts)

## Getting Started

In order to access the Private instance of OpenXC-DweetPro, you will need to enter the following password: openxc-dweetio

1. Next, sign up for a free account and login. 

2. Navigate to the Collections page, and create a new Collection by clicking the +Collection button

   ![1b](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/1b.png)

3. Provide a name for your Collection (we chose "My_Collection"), and click the Add button

   ![2](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/2.png)

4. Your Collection will now appear in the Collection list.  Click on the Collection you just created

   ![3](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/3.png)

5. Click the +Thing button to create a Thing

   ![4](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/4.png)

6. Name your Thing something fancy like 'thing_name1'.  If you have an available Lock (new sign-ups get 1 free!) it will automatically be assigned to your Thing.

   ![5](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/5.png)

7. Click your newly-created Thing

   ![6](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/6.png)

8. The Thing Details page allows you to view and manage all meta data, Lock-related credentials, and Alerts for a Thing.

   ![7a](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/7a.png)

9. For this tutorial, take note of the Master Key, which will allow us to send dweets using the POST /v2/dweets API.  The Master Key can be used for all thing-related requests, whereas the Read-only key is limited to certain GET requests.

   ![7b](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/7b.png)

10. We now need to grab our Account Token (aka Thing Token), from the Accounts -> Organization page.  This will be the value of the X-DWEET-AUTH header set in our send requests.

   ![7c](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/7c.png)

   ![8](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/8.png)

11. Click the copy icon to copy the Thing Token to your clipboard (and paste in the scratchpad you made in Step 9, if you have one)

   ![10](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/10.png)

   ![11](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/11.png)

12. We now have all of the credentials necessary to send our first dweet!  To make testing quick-and-easy, we have provided a Swagger-based API request tool available from the Console page.

   ![12](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/12.png)

13. On the Console page, navigate down to the 'dweets' section and expand the '/v2/dweets' API.  (NOTE: You will notice a value already provided in the X-DWEET-AUTH field.  This is the Master Token generated for this session while logging in to the management UI.  We will replace this with our Thing Token in later steps)

   ![13](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/13.png)

14. To make things even easier, Click the Model Schema link, then click inside the yellow Model Schema box.  This will automatically generate the basic key fields for the /v2/dweets request in the payload testing area to the left.

   ![14](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/14.png)

   ![15](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/15.png)

15. Fill in the values obtained in Steps 8 & 9 for the "thing" and "key" fields, and provide a valid JSON object as the value for the "content" field.

   ![16](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/16.png)

16. Click the "Try it Out!" button, and review the Response Body section to verify the request succeeded.  If the request fails, any errors will be reported in this area.

   ![18](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/18.png)

17. Finally, we will test the request again using our Thing Token, obtained in Step 11.  Click the console token switch in the top right corner of the page.

   ![19](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/19.png)

18. You will notice the X-DWEET-AUTH value is now blank.  Paste the Thing Token retrieved in Step 11, and click the "Try it out!" button.

   ![20](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/20.png)

   ![21](https://github.com/buglabs/dweetpro.io-docs/raw/master/doc_images/21.png)

Congratulations!  You have now sent your first couple of dweets.  Please review the Key Concepts section below for more in-depth information on all of Dweet Pro features, concepts and terminology.


## Key Concepts

In contrast to our our original API set (now known as our Public APIs), data and assets using the Pro APIs benefit from expanded security and access control.  As such, you will need to include a [token](#token) in the header of every Pro API request.  We created two types of tokens - the [Thing Token](#thing-token) and [Master Token](#master-token) - with different access control capabilities.  Depending on the type of token provided in the request, API access may be further limited by the role of the user - Admin, Manager, or Viewer - that is making the request.


### Pro APIs
The new (/v2) APIs, which provide enhanced security, management, configuration, storage, and alerting functionality suitable for production-ready development.  These APIs can only be used with a Dweet Pro account.  Register for a free account at [https://dweetpro.io](https://dweetpro.io).

### Public APIs
Our original, free and “ridiculously simple” API set.  Use these APIs to get started working with dweet.io - no signups, no hassle.  Data sent through these APIs will appear on our publically accessible discover page.

### Token
**(The X-DWEET-AUTH header)**

In order to use the Pro APIs, you will need to include the header “X-DWEET-AUTH” in every request, with an encoded alphanumeric string value which we call a Token.  This allows owners of a Pro account to manage access to the data and the control functionality of the assets associated with their account.  In order to provide enhanced security and access control, we created two types of Tokens - the Master Token and Thing Token - which are used in different contexts depending on who or what is making the API call.

#### _Master Token_
The Master Token is a user-level, session-based token made up of approximately 265 alphanumeric characters.  Typically used for administrative functionality (which can also be accomplished in the [https://dweetPro.io](https://dweetpro.io) Management UI

- Can provide access to all Pro APIs depending on the user's account type
- Authorization to use different subsets of the Pro APIs is determined by the role of user:
    - Admins: Full access
    - Managers: Access to MOST APIs, except billing, lock purchasing, and org/account/user creation
    - Viewers:  limited to read-only fuctionality for Things, Collections and Dweets

_NOTE:_  After logging in to the Management Portal, clicking on the Console page will show only the APIs available to that user.
- Retrieved by issuing a ` POST /v2/users/login ` with a username field and password field in the request body.

#### _Thing Token_
The Thing Token is a static, restricted, account-wide token, made up of approximately 150 alphanumeric characters.  A physical device is best suited to use the Thing Token
- Used for basic communication to/from dweetPro.
- Limited to the following API requests:
```
POST /v2/dweets
GET /v2/dweets/latest
GET /v2/dweets
GET /v2/dweets/listen
```

The purpose of the Thing Token is to enable assets that are interested in data messaging APIs - not management functionality - to be able to continuously communicate with the platform.  As such, this Token does not expire unless intentionally re-generated by an Admin user (as may be necessary in a situation where the Thing Token is compromised to unauthorized parties).

- Re-generating the Thing Token can be accomplished either through the management UI (in the Organization tab of the Account page), or by issuing a `GET /v2/accounts/token` (_HINT: this request is made with the X-DWEET-AUTH header set to the Master Token of a logged-in Admin_).
**Proceed with caution:**  Re-generating the Thing Token will de-authorize the previous Thing Token and all previously locked Things.

### Provisioning
Another term for locking a Thing.  Provisioned/locked Things can take advantage of long term storage, alerts, and can be organized within a Collection.

### Lock
A Lock is used to provision a Thing.  After applying a Lock to a Thing, data storage and alerting features are enabled for that Thing, as well as the ability to add that Thing to a Collection.

Locks can be purchased and added to an account by Admin users only.  Managers can then manage the association of the available Locks to different Things, either by locking unprovisioned things or unlocking already-provisioned things.

Each Lock has three unique characteristics: Lock ID, Master Key and Read Key.

#### _Lock ID_
Used to lock a Thing.  At any given time, only one lock can be applied to one Thing.  The two remain bound together, until an Admin or Manager unlocks that Thing.  After unlocking a Thing, the Lock that was associated with that Thing becomes free to use with any unprovisioned Thing in the account.

#### _Lock Keys_
After locking a Thing, any requests to the /dweets APIs using a Thing Token must also include one of the lock’s Keys as described below.

##### **Master Key**
When a Thing Token is provided in the request header, the Lock’s Master Key can access all Thing Token enabled APIs (POST /v2/dweets, GET /v2/dweets/latest, GET /v2/dweets).  This key is typically used to allow an asset to send data to the platform.

##### **Read Key**
When a Thing Token is provided in the request header, the Lock’s Read Key can access only the Thing Token APIs that retrieve data of a thing (GET /v2/dweets/latest, GET /v2/dweets, GET /v2/dweets/listen).  Sharing the Read Key along with the Thing Token allows users to provide read-only access of their Things’ latest data to others.

### Collection
A Collection is a group of locked Things, used for organizational purposes.  When locking/provisioning a Thing, it must be added to a Collection.  Unlocked/unprovisioned things are held in a special Collection called “UNPROVISIONED”.

### Notes
DweetPro APIs maintain a common RESTful API structure, using the standard HTTP protocol.  

The headers of an HTTP request are set separately from the URL of the request.  

Standard notation for APIs are to show the relative path to the server, eliminating redundancy in documentation.  So, when you see an API displayed as "/v2/login", the full URL is actually "http://dweetpro.io/v2/login".  

The current HTTP protocol does not allow you to set the headers within the URL, only parameters.  When typing in a URL into a browser, the browser makes an HTTP GET request to the URL, with parameters if they are supplied (e.g. the "?param1=val&param2=val" part of the URL).  Browsers can only make POST requests by using a plugin, like POSTman for Chrome.  Again, this is commonplace across all APIs you might encounter.  You can consult any resource online for tutorials on the HTTP protocol and making HTTP POST requests from the client of your choice.  Most programming languages provide easy ways to set the headers, and the body of an HTTP POST request.  
