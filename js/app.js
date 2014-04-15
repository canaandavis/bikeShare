$(document).ready(function(){
	console.log("Hello from JS");
});

function ajaxRequest(){
	var result =
		$.ajax({
			url: "http://api.citybik.es/austin.json"
		})
}