var response = {};

$(document).ready(() => {
  
  $("#submitButton").click(() => {
    var city = $("#input").val();
    $("#input").val("");
    
    toggleFormDisplay("hide");

    $("#results")
      // https://stackoverflow.com/questions/6287308/jquery-fade-out-then-fade-in
      .fadeOut(300, () => {
        if(city == "") {
          alert("Debe ingresar una ciudad.");
          toggleFormDisplay("show");
          return;
        }

        getResponse(city)
          .then(data => {
            showData(data);
          })
          .catch(error => {
            alert(error);
          })
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally
          .finally(() => {
            toggleFormDisplay("show");
          })
        ;
      })
    ;

    $("#close").click(() => {
      $("#results").fadeOut(300);
    });
  
    $("#degreesSelect").change(() => {
      toggleDegrees($("#degreesSelect").val());
    });

  });
});

function toggleFormDisplay(action) {
  var submitButton = $("#submitButton");
  var input = $("#input");
  var loading = $("#loading");

  switch(action) {
    case "show": {
      submitButton.css({display: ""});
      input.css({display: ""});
      loading.css("display", "none");
      break;
    }
    case "hide": {
      submitButton.css("display", "none");
      input.css("display", "none");
      loading.css("display", "block");
      break;
    }
  }
}

function showData(data) {
  response.min = data.main.temp_min;
  response.max = data.main.temp_max;
  response.current = data.main.temp;
  
  var link = `https://www.google.com/maps/place/${data.coord.lat}+${data.coord.lon}/@${data.coord.lat},${data.coord.lon},8z`;
  $("#link").attr("href", link);
  $("#cityName").html(data.name);
  $("#icon").attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
  $("#weatherDecription").html( titleCase(data.weather[0].description) );
  
  $("#degreesSelect").selectedIndex = 0;
  toggleDegrees("1");
}

function titleCase(string) {
  string.toLowerCase();
  var array = string.split(" ");
  
  array.forEach((word, i) => {
    array[i] = word[0].toUpperCase() + word.substring(1, word.length)
  });

  return array.join(" ");
}

function displayWeather(units, min, max, current) {
  $("#currentTemp span").html(current + units);
  $("#minTemp span").html(min + units);
  $("#maxTemp span").html(max + units);

  $("#results").fadeIn();
}

function cToF(celcius) {
  var farenheit = (celcius * (9 / 5)) + 32;
  return farenheit.toFixed(2);
}

function cToK(celcius) {
  var kelvin = celcius + 273.15;
  return kelvin.toFixed(2);
}

function toggleDegrees(degrees) {
  switch(degrees) {
    case "1": displayWeather("°C", response.min, response.max, response.current); break;
    case "2": displayWeather("°F", cToF(response.min), cToF(response.max), cToF(response.current)); break;
    case "3": displayWeather("°K", cToK(response.min), cToK(response.max), cToK(response.current)); break;
  }
}