function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var publicProfileUri = getParameterByName('profile-uri');

var div = document.createElement("div");
div.id = 'overlay';
div.innerHTML = '</br></br></br></br>Jarvis Chrome Extension';
document.body.appendChild(div);

var buttonek = document.createElement("div");
buttonek.id = 'jarvis_buttonek';

xhr = new XMLHttpRequest();
var url = "https://jarvis2.alviso.cz:8443/jarvis/rest/validator";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-type", "application/json");

// TODO dodelat error handling

xhr.onreadystatechange = function () { 
    if (xhr.readyState == 4 && xhr.status == 200) {
        var json = JSON.parse(xhr.responseText);
        if (json.profileValidationResponse.name === undefined) {
        	buttonek.innerHTML = "</br><a class='btn-not-found' href=''>Go to Jarvis</a>";
        } else {
        	buttonek.innerHTML = "</br><a class='btn-found' href=''>Go to Jarvis</a>";
        }
        div.appendChild(buttonek);
        console.log("response: " + json.profileValidationResponse.name);
    }
}


var object = {
	"profileValidationRequest": 
		{ 
			"name": "Doesn't Matter", 
			"profile_uri": publicProfileUri
		}
	};

var data = JSON.stringify(object);

xhr.send(data);