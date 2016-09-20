 var links = [];
 var images = [];
 
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
	
	var next = result.pagination.next_url;
		
	if (next)
	{
		script = document.createElement("script");
		script.src = next;
		document.body.appendChild(script);
	}
	else
	{
		fetching(links).then(() => {
		var zip = new JSZip();

		for (var i = 0; i < links.length; i++)
		{
			zip.file(links[i].image_time + ".jpg", images[i]);
		}
	
		var preparedFile = zip.generateAsync({type:"blob"});
	
		preparedFile.then(result => {
			var url = window.URL.createObjectURL(result);
			var link = document.getElementById("link");
			link.download = "Inst-Archive.zip";
			link.href = url;
		});
	});
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
 
 function fetching(links)
{
	if (links[0] == null)
	{
		return;		
	}
	
	promise = fetch(links[0]);
	
	return promise.then(result => result.blob())
		.then(result => images.push(result))
		.then(() => console.log("Dohvacen "))
		.then(() => doThing(links.slice(1, links.length)))
		.catch(error => console.log(error));
}