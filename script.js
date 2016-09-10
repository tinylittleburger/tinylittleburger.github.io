 var links = [];
 
 function OnResult(result)
 {
	var images = result.data;
	
	for (i = 0; i < images.length; i++) {
		var image = images[i];
		var standard = image.images.standard_resolution;
		var url = standard.url;
		links.push(url);
		console.log(url);
	}
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