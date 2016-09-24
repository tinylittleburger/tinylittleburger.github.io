var links = [];
var downloadedImages = [];

function OnResult(result) {
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
        console.log(pair.image_time);
    }

    var next = result.pagination.next_url;

    if (next) {
        script = document.createElement("script");
        script.src = next;
        document.body.appendChild(script);
    } else {
        fetching(links).then(() => {
            var zip = new JSZip();

            for (var i = 0; i < links.length; i++) {
                zip.file(getDate(links[i].image_time) + ".jpg",
                    downloadedImages[
                        i]);
            }

            var preparedFile = zip.generateAsync({
                type: "blob"
            });

            preparedFile.then(result => {
                var url = window.URL.createObjectURL(result);
                var link = document.getElementById("link");
                link.download = "Inst-Archive.zip";
                link.href = url;
            });
        });
    }
}

function getDate(timestamp) {
    var date = new Date(timestamp * 1000);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    var fullDate = "" + year + pad(month) + pad(day) + "_" + pad(hour) + pad(
        min) + pad(sec);

    console.log(fullDate);

    return fullDate;
}

function pad(str) {
    str = str + "";

    while (str.length < 2) {
        str = '0' + str;
    }

    return str;
}

if (window.location.hash) {
    var hash = window.location.hash.substring(1);
    var item = hash.split("=");
    token = decodeURIComponent(item[1]);

    window.onload = function() {
        script = document.createElement("script");
        script.src =
            "https://api.instagram.com/v1/users/self/media/recent/?access_token=" +
            token + "&callback=OnResult&count=5";
        document.body.appendChild(script);
    }
}

function fetching(links) {
    if (links[0] == null) {
        return;
    }

    promise = fetch(links[0].image_url);

    return promise.then(result => result.blob())
        .then(result => downloadedImages.push(result))
        .then(() => fetching(links.slice(1, links.length)))
        .catch(error => console.log(error));
}
