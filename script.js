 var links = [];
 
 function OnResult(result)
 {
	var images = result.data;
	
	for (i = 0; i < images.length; i++) {
		var image = images[i];
		var standard = image.images.standard_resolution;
		var url = standard.url;
		var time = image.created_time;
		
		var pair = {
		image_time: time,
		image_url: url,
		};
		
		links.push(pair);
		console.log(pair.image_time + " " + pair.image_url);
	}
	
	console.log("----------------");
	
	if (images.next_url)
	{
		script = document.createElement("script");
		script.src = images.next_url;
		document.body.appendChild(script);
	}
 }
 
 if (window.location.hash)
 {
    var hash = window.location.hash.substring(1);
	var item = hash.split("=");
	token = decodeURIComponent(item[1]);
	
	window.onload = function() {
		script = document.createElement("script");
		script.src = "https://api.instagram.com/v1/users/self/media/recent/?access_token=" + token + "&callback=OnResult&count=5";
		document.body.appendChild(script);
	}
 }