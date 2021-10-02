//creating the object that is used to comuicate with tthe server
var xhr = new XMLHttpRequest();


function validateEmail(email){
    var condition = /\S+@\S+/;
    var valid = condition.test(email);
	console.log()
	if (valid == true){
		return true;
	}else{
		document.getElementById('emailResult').innerHTML = "This email is not valid";
		return false;
	}
}

//function to do a peseenceCheck on the inputs given the array of ids 
function presenceCheck(ids){
	//variable to return at the end for a valid form
	var vaildForm = false;
	//loops through array of ids
	for(counter = 0; counter<ids.length; counter++){
		//identifies the input and its result DIV
		var input = document.getElementById(ids[counter]);
		var inputResult = ids[counter] + "Result";
		//if the input value is blank an error is printed to the result DIV 
		if (input.value == ""){
			document.getElementById(inputResult).innerHTML = "please enter a value";	
			validForm = false;
		}else{
			//if the input is not blank the error is removed from result
			validForm = true;
			document.getElementById(inputResult).innerHTML = "";
		}
	}
	return validForm;
}

//returns the values of inputs in an array
function inputValue(ids){
	var result= [];
	for(counter=0;counter<ids.length;counter++){
		result[counter] = document.getElementById(ids[counter]).value
	}
	return result;
}



function process(){
	//an array of the ids are declared as they will be used in multiple functions
	var ids = ["username","password","fullName","email"];  
	
	//performs a presence check on all ids in array and if any are blank the function is ended
	if (presenceCheck(ids) == false){
		return;
	}
	
	var email = document.getElementById('email').value;
	if(validateEmail(email)==false){
		return;
	}
	
	//runs function to retrieve the values of all the inputs
	var values = inputValue(ids);
	//checks if the server is ready for request
	if(xhr.readyState==0 || xhr.readyState==4){
		//creates the request to be sent to the server
		xhr.open('GET',"http://localhost/supremeBot/signUp.php?username="+values[0]+"&password="+values[1]+"&fullName="+values[2]+"&email="+values[3],true);
		//when the state of the server changes, be prepared to respond with this funciton
		xhr.onreadystatechange = response;
		//send the request
		xhr.send(null);
	}else{
		//if the server is not ready wait 10 second and try again
		setTimeout(process(),1000);
	}
}



function response(){
	//if the server is in a responded state
	if (xhr.readyState==4){
		if(xhr.status==200){
			//retrieve the response XML and decode to be used in HTML 
			console.log(xhr.responseText);
			var xmlDocumentElement = xhr.responseXML.documentElement;
			var message = xmlDocumentElement.firstChild.data;
			//if response is a success
			if(message=="UserAdded"){
				//continue process
				window.location.href = "editDetails.html";
			}else{
				//invalid username
				document.getElementById("usernameResult").innerHTML = "Username is already been used!"
			
			}
		}
	}
}
//when the window has fully loaded the button is watched for click
window.onload=function(){
	
	var item = document.getElementById("signUpBtn");
	item.addEventListener("click",process);

}
