

var details = ['keywords','category','size','color'];
var detailObject;

chrome.storage.sync.get(['keywords'],function(value){
	console.log(value.keywords);
	document.getElementById('keywords').innerHTML = value.keywords;
});

chrome.storage.sync.get(['size'],function(value){
	console.log(value.size);
	document.getElementById('size').innerHTML = value.size;
});

chrome.storage.sync.get(['category'],function(value){
	console.log(value.category);
	document.getElementById('category').innerHTML = value.category + "       ";
});

chrome.storage.sync.get(['color'],function(value){
	console.log(value.color);
	document.getElementById('color').innerHTML = value.color;
});


function onclicklistener (id,action){
		var item = document.getElementById(id);
		item.addEventListener("click",action);
}


window.onload=function(){
onclicklistener('confirmBtn', function(){
	window.location.href = 'autoBuy.html'; 
});
}
