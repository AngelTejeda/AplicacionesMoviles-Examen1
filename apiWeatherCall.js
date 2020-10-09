function getResponse(city) {
  return new Promise((resolve, reject) => {
    //Llamada AJAX
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

//Muestra u Oculta el formulario y el mensaje de "Cargando."
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

//Escribe en los elementos HTML correspondientes la información que reciba de la petición a la API.
function displayData(data) {
  //Link a Google Maps con las coordenadas de latitud y longitud de la ciudad ingresada.
  var link = `https://www.google.com/maps/place/${data.coord.lat}+${data.coord.lon}/@${data.coord.lat},${data.coord.lon},8z`;

  //Se guardan las temperaturas.
  temperatures.min = data.main.temp_min;
  temperatures.max = data.main.temp_max;
  temperatures.current = data.main.temp;

  //Información general de la ciudad y las condiciones climáticas
  $("#link").attr("href", link);
  $("#cityName").html(data.name);
  $("#icon").attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
  $("#weatherDecription").html( titleCase(data.weather[0].description) );
  
  //Selecciona la opción de Grados Centígrados en el Select.
  $("#degreesSelect").selectedIndex = 0;
  //Muestra las temperaturas que regresó la petición a la API.
  toggleDegrees("1");
}

//Cambia las unidades en que se muestra la temperatura, dependiendo del parámetro que se reciba.
function toggleDegrees(degrees) {
  switch(degrees) {
    case "1": displayWeather("°C", temperatures.min, temperatures.max, temperatures.current); break;
    case "2": displayWeather("°F", cToF(temperatures.min), cToF(temperatures.max), cToF(temperatures.current)); break;
    case "3": displayWeather("°K", cToK(temperatures.min), cToK(temperatures.max), cToK(temperatures.current)); break;
  }
}

//Escribe en el HTML los valores de las temperaturas.
function displayWeather(units, min, max, current) {
  $("#currentTemp span").html(current + units);
  $("#minTemp span").html(min + units);
  $("#maxTemp span").html(max + units);

  $("#results").fadeIn();
}