var xhr = new XMLHttpRequest();
var editIds= ['fullName','telephone','address1','address2','address3','city','postcode','cardNumber','expiryDate','expiryYear','scn'];
var maxLength =[30,11,20,20,20,20,8,16,2,2,3];
var minLength =[1,11,1,1,1,1,5,16,2,2,3];

//function to check if an id of an input has been filled, if it is empty it will print a message in its result box
function presenceCheck(id){
	var valid=false;
	var input = document.getElementById(id);
	//if the input is not empty return true and clear the result box for the input
	if (input.value !=""){
			valid = true;
			printResult(id,"");
		}else{
			printResult(id,"please enter a value");
			valid = false;
		}
	
	return valid;
}

//given an id and a message this function will print a message to the ids respective result box
function printResult(id, message){
	//identify the corresponding result box which is just the id + Result
	var inputResult = id + "Result";
	document.getElementById(inputResult).innerHTML=message;
}

//returns the values of inputs in an array
function inputValues(ids){
	var result= [];
	//loop thorugh the array of id adding the data to a result array to be returned
	for(counter=0;counter<ids.length;counter++){
		result[counter] = document.getElementById(ids[counter]).value
	}
	return result;
}

function inputLength(id,min,max){
	var valid;
	var data= document.getElementById(id).value;
	var inputLength = data.length;	
	//if the input is between boundaries return true and clear message box 
	if (inputLength >= min && inputLength <= max){
		valid = true;
		printResult(id,"");
	}else{
		valid = false;
		printResult(id,"this value is out the range");
	}
	
	return valid;
}

//session check function takes the file path of php file on server and the funciton that will deal wiht the response
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

//funtion used in testiong
function sessionCheckResponse(response){
	//if the server has completed the request and has sent the repsonse
	if (xhr.readyState==4){
		//if the requets was successfull and returned a response
		if(xhr.status==200){  
			//run function
			console.log("check response")
			response();
		}
	}

}

//this autofills the details that are already in the database for the user
function editDetailsForm(){
	//recieves the raw response in XML 
	var root = xhr.responseXML.documentElement;
	//accessing the specific tag reqired, in this case all result elements
	elements = root.getElementsByTagName('result');
	//loop through the inut boxes and autofill from the corresponding result element
	var details = new Array(11);
		for(var i=0; i<editIds.length;i++){
			details[i] = elements.item(i).innerHTML;
			console.log(details[i]);
			defaultInput(details[i],i);
		}
}

//fucntion to set the value of a textbox to a given value
function defaultInput (string,index){
	//if integer values are empty (zero) they should not show zero
	if(string == 0){
		string="";
	}
	//get the element of the text box and print the value of that box
	var input = document.getElementById(editIds[index]);
	input.value = string;
}

//fucniton to validate each value on the form
function validate(){
	var validForm = true;
	for(var i=0; i<editIds.length; i++){
		var itemValidation = false;
		//first presenceCheck 
		itemValidation = presenceCheck(editIds[i]);
		//console.log("the item " + editIds[i] + " has the value " + itemValidation);
		//if the item is present the item is checked to be within the boundaries
		if(itemValidation == true){
			itemValidation = inputLength(editIds[i],minLength[i],maxLength[i]);
		}
		if (itemValidation == false){
			validForm = false;
		}
	}
	console.log(validForm);
	return validForm;
}

function serverRequestSend(server,request,response){
	if (xhr.readyState==0||xhr.readyState==4){
		xhr.open('POST',server,true);
		console.log(request);
		xhr.onreadystatechange= response;
		xhr.send(request);
	}else{
		setTimeout(serverRequestSend(),1000);
	}
}

function serverCallback(){
	console.log(xhr.responseText);
	var xmlDocumentElement = xhr.responseXML.documentElement;
	var message = xmlDocumentElement.firstChild.data;
	if(message == "complete"){
		window.location.href = "profile.html";
		console.log("redirecting to profile...")
	}else{
		alert("There was an error in the process, please try again");
	}
	
}

//send the validated details to the server to update the database.
function updateDetails(){
	var userDetails = inputValues(editIds);
	var url = "http://localhost/supremeBot/updateUserDetails.php"
	var str = '{' ;
	
	for(var i=0; i<editIds.length;i++){
		str = str + '"' +  editIds[i] + '":"' + userDetails[i] + '",';
	}
	//remove the & sign at the end of the request
	var finalRequest = str.substring(0, str.length-1);
	finalRequest = finalRequest + "}";
	serverRequestSend(url,finalRequest,serverCallback);
}


window.onload = function(){
	//as soon as the page elements load check the session and if successfull add the users details to the form
	sessionCheck("http://localhost/supremeBot/editDetailSetup.php",editDetailsForm);
	//add an event listener for the submit button to repeat the funtion 
	var submitBtn = document.getElementById('editDetailsBtn');
	submitBtn.addEventListener("click",function(){
		//validate until it is true at which point the details can be sent and the user can be redirected bac to the profile page
		if(validate() == true){
			updateDetails();
		}
	});
}