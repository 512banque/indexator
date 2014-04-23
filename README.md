indexator
=========

CasperJS script to make Googlebot to index instantly any url.

##Usage
1. Create 301.php on a website you control on GWT
2. Call indexator like this :

> casperjs indexator.js  --email="yourgmailaccount@gmail.com" --password="yourpassword" --2steps="123123" --indexor="http://www.yourcontrolledwebsite.com" --url="301.php?url=http://www.websitetoindex.com"

* email = your GWT gmail account
* password = your GWT gmail password account
* 2steps = if you have activated 2 steps authentication
* indexor = the website you control on your GWT account
* url = the url you want to index. You must add "301.php?url=" before this url
