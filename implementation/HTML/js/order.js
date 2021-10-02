window.onload=function(){
	var btn = document.getElementById("btn");
	btn.addEventListener("click",submit);
}

function submit(){
	var keywords = document.getElementById('keywords').value;
	var category = document.getElementById('category').value;
	var size = document.getElementById('size').value; 
	var color = document.getElementById('color').value; 
	console.log(keywords + category + size + color);
	var valid = validate();
	if (valid==true){
		//send data to session storage 
		
		chrome.storage.sync.set({"keywords": keywords});
		chrome.storage.sync.set({"category": category});
		chrome.storage.sync.set({"color": color});
		chrome.storage.sync.set({"size": size}, function(){
			window.location.href ='confirmOrder.html';
        });		
		
	}else{
		console.log('not valid');
	}
}

function validate(){
	var result = false;
	presenceCheck('keywords');  
	if (presenceCheck('color')==true && presenceCheck('keywords')==true){
		result = true;
	}
return result;
}

function presenceCheck(id){
	var input = document.getElementById(id);
	if(input.value==""|| input.value=="Required"){
	input.value = "Required";
	return false;	
	}else{
	return true;
	}
}