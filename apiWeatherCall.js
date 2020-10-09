
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