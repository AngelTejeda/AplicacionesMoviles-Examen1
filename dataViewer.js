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