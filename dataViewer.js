//Ángel Tejeda Tiscareño (Oyente :P)
//Examen 1 de Aplicaciones Móviles

//La variable temperatures guarda las temperaturas que se reciban de la petición a la API para trabajar con ellas
//en caso de que se deseen cambiar las unidades.
var temperatures = {};

$(document).ready(() => {
  
  //Evento onclick del botón Ver Clima
  $("#submitButton").click(() => {
    //Se recoge el nombre de la ciudad y se borra el texto de la caja.
    var city = $("#input").val();
    $("#input").val("");
    
    toggleFormDisplay("hide");

    //Se oculta la sección de resultados, después se realiza la llamada AJAX a la API.
    $("#results")
      //Esperar hasta que se oculte la sección de resultados para hacer la llamada: https://stackoverflow.com/questions/6287308/jquery-fade-out-then-fade-in
      .fadeOut(300, () => {

        //Si no se ingresó una ciudad
        if(city == "") {
          alert("Debe ingresar una ciudad.");
          toggleFormDisplay("show");
          return;
        }

        //Petición a la API
        getResponse(city)
          .then(data => {
            displayData(data);
          })
          .catch(error => {
            alert(error);
          })
          //Finally en una promesa: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally
          .finally(() => {
            toggleFormDisplay("show");
          })
        ;
      })
    ;

    //Evento onclick del botón Cerrar
    $("#close").click(() => {
      $("#results").fadeOut(300);
    });

    //Evento onchange del Select de las unidades de la temperatura
    $("#degreesSelect").change(() => {
      toggleDegrees($("#degreesSelect").val());
    });

  });
});

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

  $("#results").fadeIn(300, () => {
    $("html, body").animate({
      scrollTop: $('html, body').get(0).scrollHeight
    }, 800);  
  });
}

//Regresa una cadena formateada para que la primera letra de cada palabra sea mayúscula
function titleCase(string) {
  string.toLowerCase();
  var array = string.split(" ");
  
  array.forEach((word, i) => {
    array[i] = word[0].toUpperCase() + word.substring(1, word.length)
  });

  return array.join(" ");
}

//Grados Centígrados a Farenheit.
function cToF(celcius) {
  var farenheit = (celcius * (9 / 5)) + 32;
  return farenheit.toFixed(2);
}

//Grados Centígrados a Kelvin.
function cToK(celcius) {
  var kelvin = celcius + 273.15;
  return kelvin.toFixed(2);
}