var links = [];
var downloadedImages = [];
var userName;

function OnResult(result) {
    var media = result.data;
    userName = media[0].user.username;

    for (i = 0; i < media.length; i++) {
        var mediaFile = media[i];
        var url;

        if (mediaFile.type == "image") {
            url = mediaFile.images.standard_resolution.url;
        } else if (type == "video") {
            url = mediaFile.videos.standard_resolution.url;
        } else {
            continue;
        }

        var pair = {
            image_time: mediaFile.created_time,
            image_url: url,
        };

        links.push(pair);
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
                var extension = links[i].slice(links[i].lastIndexOf("."));
                zip.file(getDate(links[i].image_time) + extension, downloadedImages[i]);
            }

            var preparedFile = zip.generateAsync({
                type: "blob"
            });

            preparedFile.then(result => {
                document.getElementById("loader").className = "hide";
                var link = document.getElementById("downloadButton");
                link.className = "myButton show";

                var url = window.URL.createObjectURL(result);
                link.download = sanitize(userName) + ".zip";
                link.href = url;
            });
        });
    }
}

function getDate(timestamp) {
    var date = new Date(timestamp * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
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
        .then(result => downloadedmedia.push(result))
        .then(() => fetching(links.slice(1, links.length)))
        .catch(error => console.log(error));
}

function sanitize(fileName) {
    return fileName
        .replace(/[<>*?]/g, '')
        .replace(/[/\\|]/g, '-')
        .replace('"', '\'')
        .replace(':', ' -');
}
