 function OnResult(result)
 {
	 alert(JSON.stringify(result, null, "  "));
 }
 
 if (window.location.hash)
 {
    var hash = window.location.hash.substring(1);
	var item = hash.split("=");
	token = decodeURIComponent(item[1]);
	
	window.onload = function() {
		script = document.createElement("script");
		script.src = "https://api.instagram.com/v1/users/self/media/recent/?access_token=" + token + "&callback=OnResult";
		document.body.appendChild(script);
	}
 }