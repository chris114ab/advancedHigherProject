var xhr = new XMLHttpRequest();

function onclicklistener (id,action){
		var item = document.getElementById(id);
		item.addEventListener("click",action);
}

function loginSubmit(){
	//if the server is in a free state, ready to be used
	if(xhr.readyState==4 || xhr.readyState ==0 ){	
		//get the values of username and password
		var user = document.getElementById('username').value;
		var pass = document.getElementById('password').value;
		//values of he url and structures the data in JSON format to be decoded in php
		var url = "http://localhost/supremeBot/loginScript.php";
		var str = '{"username":"'+user+'","password":"'+pass+'"}';
		//parameters sent to server funciton
		serverRequestSend(url,str,loginValidate);
	}else{
		setTimeout(link(),1000);
	}
}

//functino that sends data via post request, given the data the url and the response function
function serverRequestSend(server,request,response){
	if (xhr.readyState==0||xhr.readyState==4){
		xhr.open('POST',server,true);
		xhr.onreadystatechange= response;
		xhr.send(request);
	}else{
		setTimeout(serverRequestSend(),1000);
	}
}



function loginValidate(){
	var xmlDocumentElement = xhr.responseXML.documentElement;
	var message = xmlDocumentElement.firstChild.data;
	console.log(xhr.responseText);
	if(message=="sucessfull"){
		console.log("Logged In successfully")
		window.location.href = "profile.html";
	}else{
		document.getElementById("output").innerHTML= message;
	}
		
	
}


window.onload=function(){
onclicklistener('loginBtn',loginSubmit);
}