//verze 0.2.0

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var publicProfileUri = getParameterByName('profile-uri');
var fullName = getParameterByName('full-name');

//parts of name variables for email generating
var nameParts = fullName.split(' ');
var firstNameDiak = nameParts[0].toLowerCase();
var lastNameDiak = nameParts[1].toLowerCase();
var mailVariations = [];
var listMailsHtml = "";
function mailGenerate(n1, n2) {
	var variation1 = n1+'.'+n2+'@gmail.com';
	mailVariations.push(variation1);
	var variation2 = n1+n2+'@gmail.com';
	mailVariations.push(variation2);
	var variation3 = n1[0]+'.'+n2+'@gmail.com';
	mailVariations.push(variation3);
	var variation4 = n2+'.'+n1+'@gmail.com';
	mailVariations.push(variation4);
	var variation5 = n2+'.'+n1[0]+'@gmail.com';
	mailVariations.push(variation5);
	var variation6 = n1+'-'+n2+'@gmail.com';
	mailVariations.push(variation6);
	var variation7 = n1[0]+'-'+n2+'@gmail.com';
	mailVariations.push(variation7);
	var variation8 = n2+'-'+n1+'@gmail.com';
	mailVariations.push(variation8);
	var variation9 = n2+'-'+n1[0]+'@gmail.com';
	mailVariations.push(variation9);
};
function listMails(x) {
	listMailsHtml += "<h3>Possible Mails</h3>";
	for (i=0; i < x.length; i++) {
		listMailsHtml += x[i]+"<br>";
	};
};
//

//odstraneni diakritiky
var firstName = bezdiak(firstNameDiak);
var lastName = bezdiak(lastNameDiak);
function bezdiak(diakName){ 
	var tx = "";
	var sdiak = "·ËÔÈÏÌÂÚÛ öù˙˘ ˝¯û¡»œ…ÃÕ“” äç⁄Ÿ ›ÿé"; 
	var bdiak = "acdeeilno stuu yrzACDEEINO STUU YRZ";
	for(p = 0; p < diakName.length; p++){ 
		if (sdiak.indexOf(diakName.charAt(p)) != -1){ 
			tx += bdiak.charAt(sdiak.indexOf(diakName.charAt(p))); 
		}
		else 
			tx += diakName.charAt(p); 
	}
	return tx;
}
//


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
			
			//generate mail suggestions
			mailGenerate(firstName, lastName);
			listMails(mailVariations);
			var div2 = document.createElement("div");
			div2.id = 'mail-suggestions';
			div2.innerHTML = listMailsHtml;
			document.getElementById("jarvis_buttonek").appendChild(div2);

            var suggestionsArray = json.profileValidationResponse.suggestions;

            if (suggestionsArray !== undefined && isObjectArray(suggestionsArray)) {
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
            } else if (suggestionsArray !== undefined && !isObjectArray(suggestionsArray)) {
                // single value, it requires special care
                var singleSuggestionDiv = document.createElement("div");
                singleSuggestionDiv.id = "suggestions";
                singleSuggestionDiv.innerHTML = "<br>" + suggestionsArray;
                div.appendChild(singleSuggestionDiv);
            } else {
                var noSuggestionsDiv = document.createElement("div");
                noSuggestionsDiv.id = "no-suggestions";
                noSuggestionsDiv.innerHTML = "<br><h3>no suggestions from Jarvis</h3>";
                div.appendChild(noSuggestionsDiv);
            }
        } else {
            buttonekDiv.innerHTML = "<br><a class='btn-found' href='' >Already in Jarvis</a>";
            div.appendChild(buttonekDiv);

            var candidateNotes = json.profileValidationResponse.candidateNotes;
            if (candidateNotes !== undefined && isObjectArray(candidateNotes)) {
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
            } else if (candidateNotes !== undefined && !isObjectArray(candidateNotes)) {
                // single value
                var noteDiv = document.createElement("div");
                noteDiv.id = "notesDiv";
                var noteTable = "<br><table border='1'>";

                noteTable += "<tr><td align='left'>" + candidateNotes.created.substring(0, 10) + "<br>";
                noteTable += candidateNotes.author + "<br><br>";
                noteTable += candidateNotes.note + "</td></tr>";
                noteTable += "</table>";
                noteDiv.innerHTML = noteTable;
                div.appendChild(noteDiv);
            } else {
                // no notes
            }
        }
    } else if (xhr.readyState == 4 && xhr.status != 200) {
        console.log("ready state: " + xhr.readyState + " status: " + xhr.status);
        var secExp = document.createElement("div");
        secExp.id = 'securityException';
        secExp.innerHTML = "<br><br>Security exception has expired, please click on " +
            "<a href='https://jarvis2.alviso.cz:8443/jarvis/rest/validator' " +
             "target='_blank'>Validate</a> and allow unsecure connection. Then refresh this site.";
        div.appendChild(secExp);
    }
}

function isObjectArray(input) {
    return Object.prototype.toString.call(input) === '[object Array]';
}

var object = {
    "profileValidationRequest": {
        "name": fullName,
        "profile_uri": publicProfileUri
    }
};

var data = JSON.stringify(object);

xhr.send(data);