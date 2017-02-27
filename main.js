$(function() {
    var units = "metric";
    var appID = "80a78670ec00c834d491f558f16673c4"; // register on openweathermap.org for free to get yours

    function getLocation() {
        $.ajax({
            type: "GET",
            url: "http://freegeoip.net/json/",
            success: function(response) {
                if (response.city === null || response.city === "") {
                    // sometimes freegeoip.net fails to get the city, so we will make another request with coordinates
                    getWeatherByCoordinates(response, units, appID);
                } else {
                    // but openweathermap.org is more accurate when requesting by city
                    getWeatherByCity(response, units, appID);
                }
            },
            error: function() {
                $("#out").text("Unable to reach freegeoip.net");
            }
        });
    }

    function getWeatherByCity(data, units, appID) {
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + data.city + "&units=" + units + "&appid=" + appID,
            success: function(response) {
                displayWeather(response, units);
            },
            error: function(data, units, appID) {
                $("#out").text("Unable to reach openweathermap.org");
            }
        });
    }

    function getWeatherByCoordinates(data, units, appID) {
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/weather?lat=" + data.latitude + "&lon=" + data.longitude + "&units=" + units + "&appid=" + appID,
            success: function(response) {
                displayWeather(response, units);
            },
            error: function() {
                $("#out").text("Unable to reach openweathermap.org");
            }
        });
    }

    function displayWeather(data, units) {
        $("#city").text(data.name);
        $("#country").text(data.sys.country);
        $("#temperature").text(data.main.temp);
        if (units === "metric") {
            $("#units").text("°C");
        } else {
            $("#units").text("°F");
        }
        $("#weather").text(data.weather[0].main);
        $("#description").text(data.weather[0].description);
        $("#icon").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
    }

    $("#units").click(function() {
        if (units === "metric") {
            units = "imperial";
        } else {
            units = "metric";
        }
        getLocation();
    });

    getLocation();
});
