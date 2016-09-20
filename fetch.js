var links = [
	"https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/14309752_551501115044685_1933481283_n.jpg",
	"https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/14309711_1750693505187135_1967385764_n.jpg",
	"https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/14240953_1673975979587150_1422387973_n.jpg"
];

var images = [];

doThing(links).then(() => {
	var zip = new JSZip();

	for (var i = 0; i < images.length; i++)
	{
		zip.file("Picture" + i + ".jpg", images[i])
	}
	
	
	var nestoDrugo = zip.generateAsync({type:"blob"});
	
	nestoDrugo.then(result => {
		var url = window.URL.createObjectURL(result);
		var link = document.getElementById("link");
		link.download = "Inst-Archive.zip";
		link.href = url;
	});
});

function doThing(links)
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
