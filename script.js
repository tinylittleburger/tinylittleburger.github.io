

var http = new XMLHttpRequest();
var url = "https://api.instagram.com/oauth/access_token";
var params = "client_id=ce2b39d6f4dd4732b6ee88b69c542bc0&client_secret=66aa993c3e534d17ab9b65a8609a0d6b&grant_type=authorization_code&redirect_uri=https%3A%2F%2Ftinylittleburger.github.io%2Fredirect&code=0da0b134c55a403bb16641987911e7fd";
http.open("POST", url, true);

http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
        alert(http.responseText);
    }
}
http.send(params);