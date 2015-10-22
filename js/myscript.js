var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    // extract view-public-profile
    var publicProfile = document.getElementsByClassName("view-public-profile");
	var publicProfileUri =  publicProfile[0].innerHTML;
	//alert(publicProfileUri);
    
    var iframe = document.createElement('iframe');
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('views/sidebar-frame.html?profile-uri=' + publicProfileUri);

    // Some styles for a fancy sidebar
    iframe.style.cssText = 'position:fixed;top:80px;left:0;display:block;' +
                           'width:13%;height:80%;z-index:1000;';
	
    document.body.appendChild(iframe);
}