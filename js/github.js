//The code that is fired upon page load
//to check your plugin js is working uncomment the next line.

        
		var email = document.body.textContent.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
		
		
		var uniqueMail = [];
		$.each(email, function(i, el){
			if($.inArray(el, uniqueMail) === -1) uniqueMail.push(el);
		});
		
		console.log(uniqueMail);
		var emailHtml = "";
		if (email === null) {
			console.log("Empty: ")
			emailHtml += "<h3> No Mails found </h3>"
		} else {
			emailHtml += "<h3> Possible mails:</h3>";
			for (i=0;i<uniqueMail.length;i++) {
				emailHtml += uniqueMail[i] +"<br>"
			}
		};
		
		var div = document.createElement("div");
		div.id = 'overlay_github';
		div.innerHTML = emailHtml;
		document.body.appendChild(div);





