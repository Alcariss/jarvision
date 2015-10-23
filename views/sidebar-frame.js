var getURLParameter = function(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) || null;
}

var iframe = document.createElement('iframe');
iframe.setAttribute('src', getURLParameter('url'));
iframe.setAttribute('frameBorder', '0');
document.body.appendChild(iframe);
