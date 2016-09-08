 function OnResult(result)
 {
	 alert(result);
 }
 
 if (window.location.hash)
 {
    var hash = window.location.hash.substring(1);
	var item = hash.split("=");
	token = decodeURIComponent(item[1]);
	
	window.onload = function() {
		script = document.createElement("newScript");
		script.src = "https://api.instagram.com/v1/tags/coffee/media/recent?access_token=" + token + "&callback=OnResult";
		document.body.appendChild(script);
	}
 }