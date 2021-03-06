
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    // extract view-public-profile
    var publicProfileElement = document.getElementsByClassName("view-public-profile");
	var publicProfileUri =  publicProfileElement[0].innerHTML;
	
	var fullNameElement = document.getElementsByClassName("full-name");
	var fullName = fullNameElement[0].innerHTML;
    
    var iframe = document.createElement('iframe');
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('views/sidebar-frame.html?profile-uri=' + publicProfileUri + '&full-name=' + fullName);

    // Some styles for a fancy sidebar
    iframe.style.cssText = 'position:fixed;top:1px;left:0;display:block;background-color:gray;resize: both;width:15%;height:100%;z-index:2147483647;';
    
    /*iframe.style.cssText = 'position:fixed;top:45px;left:0;display:block;background-color:gray;resize: both;overflow: auto;opacity: 0.9;' +
                           'width:15%;height:95%;z-index:1000;';
	*/
    document.body.appendChild(iframe);
}
