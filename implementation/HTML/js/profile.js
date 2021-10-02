var xhr = new XMLHttpRequest();

function sessionCheck(filepath, responseFunction) {
	//if the server is in an available state ready to do another request
	if (xhr.readyState == 0 || xhr.readyState == 4) {
		//run the server side script php for this function
		xhr.open('GET', filepath, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				//if the requets was successfull and returned a response
				if (xhr.status == 200) {
					//run function
					responseFunction();
				}
			}

		}
		xhr.send(null);
	} else {
		setTimeout(sessionCheck(filepath,responseFucntion), 1000);
	}
}

function response(){
	var xmlDocumentElement = xhr.responseXML.documentElement;
	var message = xmlDocumentElement.firstChild.data;
	console.log(message);
	document.getElementById('fullName').innerHTML = message + '!';
}

window.onload=function(){

	sessionCheck("http://localhost/supremeBot/profile.php",response)

}