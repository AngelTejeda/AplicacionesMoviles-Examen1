
function getResponse(city) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/weather?q=${city},mx&appid=c9f3f0ec30af23465397f60c7ad5fc2b&lang=es&units=metric`,
      type: 'GET',
      success: (data) => {
        return resolve(data);
      },
      error: (error) => {
        var string;

        if(error.status == 404)
          string = "Ingresó una ciudad que no existe o no es una ciudad de la República Mexicana.";
        else
          string = "Algo salió mal.\nError: " + error.status + " " + error.statusText;
        return reject(string);
      }
    })
  });
}

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