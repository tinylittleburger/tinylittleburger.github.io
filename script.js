var globalLinks = [];
var failedLinks = [];
var downloadedImages = [];

function OnResult(result) {
    var media = result.data;
    var userName = media[0].user.username;

    for (i = 0; i < media.length; i++) {
        var mediaFile = media[i];

        var mediaInfo = {
            time: mediaFile.created_time
        };

        if (mediaFile.type == "image") {
            mediaInfo.url = mediaFile.images.standard_resolution.url;
            mediaInfo.extension = ".jpg";
        } else if (mediaFile.type == "video") {
            mediaInfo.url = mediaFile.videos.standard_resolution.url;
            mediaInfo.extension = ".mp4";
        } else {
            continue;
        }

        globalLinks.push(mediaInfo);
    }

    var next = result.pagination.next_url;

    if (next) {
        script = document.createElement("script");
        script.src = next;
        document.body.appendChild(script);
    } else {
        download(globalLinks, userName);
    }
}

function download(links, userName) {
    var loader = document.getElementById("loader");
    var link = document.getElementById("downloadButton");

    fetching(links).then(() => {
            var zip = new JSZip();

            for (var i = 0; i < links.length; i++) {
                zip.file(getDate(links[i].time) + links[i].extension, downloadedImages[i]);
            }

            var preparedFile = zip.generateAsync({
                type: "blob"
            });

            preparedFile.then(result => {
                loader.className = "hide";
                link.innerHTML = "Download";
                link.className = "myButton show";

                var url = window.URL.createObjectURL(result);
                link.download = sanitize(userName) + ".zip";
                link.href = url;
            });
        })
        .catch(() => {
            loader.className = "hide";
            link.innerHTML = "Retry";
            link.className = "myButton show";

            var clickListener = function() {
                link.removeEventListener("click", clickListener, false);

                loader.className = "show";
                link.className = "hide";

                download(failedLinks, userName);
            }

            link.addEventListener("click", clickListener, false);
        });
}

function fetching(links) {
    if (links[0] == null) {
        return;
    }

    var url = links[0].url;

    if (links.length === 10) {
        url = "garbidz";
    }
    var promise = fetch(url);

    return promise.then(result => result.blob())
        .catch(error => {
            failedLinks = links;
            throw error;
        })
        .then(result => downloadedImages.push(result))
        .then(() => fetching(links.slice(1, links.length)));
}

function getDate(timestamp) {
    var date = new Date(timestamp * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    var fullDate = "" + year + pad(month) + pad(day) + "_" + pad(hour) + pad(min) + pad(sec);

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
            token + "&callback=OnResult&count=20";
        document.body.appendChild(script);
    }
}

function sanitize(fileName) {
    return fileName
        .replace(/[<>*?]/g, '')
        .replace(/[/\\|]/g, '-')
        .replace('"', '\'')
        .replace(':', ' -');
}
