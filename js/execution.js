function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var publicProfileUri = getParameterByName('profile-uri');
var fullName = getParameterByName('full-name');

var div = document.createElement("div");
div.id = 'overlay';
div.innerHTML = '<br><br>Jarvis Chrome Extension';
document.body.appendChild(div);

var buttonekDiv = document.createElement("div");
buttonekDiv.id = 'jarvis_buttonek';

xhr = new XMLHttpRequest();
// var url = "https://localhost:8443/jarvis/rest/validator";
var url = "https://jarvis2.alviso.cz:8443/jarvis/rest/validator";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-type", "application/json");

// TODO dodelat error handling

xhr.onreadystatechange = function () { 
    if (xhr.readyState == 4 && xhr.status == 200) {
        var json = JSON.parse(xhr.responseText);
        // test wether we found 
        if (json.profileValidationResponse.name === undefined) {
        	buttonekDiv.innerHTML = "<br><a class='btn-not-found' href='' >Not in Jarvis yet</a>";
        	div.appendChild(buttonekDiv);
        	
        	var suggestionsArray = json.profileValidationResponse.suggestions;

			if (suggestionsArray !== undefined && Object.prototype.toString.call(suggestionsArray) === '[object Array]') {
        		var suggestionsDiv = document.createElement("div");
        		suggestionsDiv.id = "suggestions";
        		var suggestionsTable = "<br><table>";
        		var suggestionsArrayLength = suggestionsArray.length;
        		for (var i = 0; i < suggestionsArrayLength; i++) {
    				suggestionsTable += "<tr><td>" + suggestionsArray[i] + "</td></tr>";
				}
        		suggestionsTable += "</table>";
        		suggestionsDiv.innerHTML = suggestionsTable;
        		div.appendChild(suggestionsDiv);
        	} else if (suggestionsArray !== undefined && Object.prototype.toString.call(suggestionsArray) !== '[object Array]') {
                // single value, it requires special care
                var singleSuggestionDiv = document.createElement("div");
                singleSuggestionDiv.id = "suggestions";
                singleSuggestionDiv.innerHTML = "<br>" + suggestionsArray;
                div.appendChild(singleSuggestionDiv);
        	} else {
        		var noSuggestionsDiv = document.createElement("div");
        		noSuggestionsDiv.id = "no-suggestions";
        		noSuggestionsDiv.innerHTML = "<br>no suggestions from Jarvis";
        		div.appendChild(noSuggestionsDiv);
        	}
        } else {
        	buttonekDiv.innerHTML = "<br><a class='btn-found' href='' >Already in Jarvis</a>";
        	div.appendChild(buttonekDiv);
        	
        	var candidateNotes = json.profileValidationResponse.candidateNotes;
            if (candidateNotes !== undefined && Object.prototype.toString.call(candidateNotes) === '[object Array]') {
            	// multiple notes
            	var notesDiv = document.createElement("div");
            	notesDiv.id = "notesDiv";
            	var notesTable = "<br><table border='1'>";
            	var candidateNotesLength = candidateNotes.length;
            	for (var i = 0; i < candidateNotesLength; i++) {
            		notesTable += "<tr><td align='left'>" + candidateNotes[i].created.substring(0, 10) + "<br>";
             		notesTable += candidateNotes[i].author + "<br><br>";
            		notesTable += candidateNotes[i].note + "</td></tr>";
            	}
           		notesTable += "</table>";
           		notesDiv.innerHTML = notesTable;
           		div.appendChild(notesDiv);
           } else if (suggestionsArray !== undefined && Object.prototype.toString.call(suggestionsArray) !== '[object Array]') {
                   // single value
           } else {
                   // no notes
           }
        }
        console.log("response: " + json.profileValidationResponse.name);
    }
}

var object = {
	"profileValidationRequest": 
		{ 
			"name": fullName, 
			"profile_uri": publicProfileUri
		}
	};

var data = JSON.stringify(object);

xhr.send(data);