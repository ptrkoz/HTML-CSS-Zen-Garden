getWeatherBtn = document.getElementById('getWeatherBtn');
inputField = document.getElementById('inputField');
resultWeather = document.getElementById("resultWeather");
resultForecast = document.getElementById("resultForecast");
weatherHeader = document.getElementById("weatherHeader");

apiKey = "";
function addZero(i) {
  if (parseInt(i) < 10) {i = "0" + i}
  return i;
}

getWeatherBtn.addEventListener('click', () => {
    const city = inputField.value;
    if (!city) {
        alert('Wpisz nazwę miasta');
        return;
    }
    if (apiKey == "") {
        alert('Wpisz klucz API do OpenWeatherMap w script.js');
        return;
    }
    
    resultWeather.innerHTML = "";
    resultForecast.innerHTML = "";
    weatherHeader.innerHTML = `Pogoda dla miasta: ${city}`;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText);

        currentdate = new Date();
        datestr = currentdate.getFullYear() + "-" + addZero((parseInt(currentdate.getMonth()) + 1).toString()) + "-" + addZero(currentdate.getDate()) + " " + addZero(currentdate.getHours()) + ":" + addZero(currentdate.getMinutes()) + ":" + addZero(currentdate.getSeconds());
        dateDiv = document.createElement('div');
        dateDiv.innerHTML = datestr;
        dateDiv.style.fontSize = "20px";
        resultWeather.appendChild(dateDiv);
        
        iconDiv = document.createElement('img');
        iconDiv.src = "https://openweathermap.org/img/wn/" + JSON.parse(xhttp.responseText).weather[0].icon + "@2x.png";
        resultWeather.appendChild(iconDiv);
        
        infoWrapperDiv = document.createElement('div');

        temperatureDiv = document.createElement('div');
        temperatureDiv.innerHTML = JSON.parse(xhttp.responseText).main.temp.toString().replace(".", ",") + " °C";
        temperatureDiv.style.fontSize = "30px";
        temperatureDiv.style.fontWeight = "bold";
        infoWrapperDiv.appendChild(temperatureDiv);

        feelDiv = document.createElement('div');
        feelDiv.innerHTML = "Odczuwalna: " + JSON.parse(xhttp.responseText).main.feels_like.toString().replace(".", ",") + " °C";
        infoWrapperDiv.appendChild(feelDiv);

        descriptionDiv = document.createElement('div');
        descriptionData = JSON.parse(xhttp.responseText).weather[0].description;
        descriptionDiv.innerHTML = descriptionData.charAt(0).toUpperCase() + descriptionData.slice(1);
        infoWrapperDiv.appendChild(descriptionDiv);
        
        resultWeather.appendChild(infoWrapperDiv);
        resultWeather.style.display = "flex";
        resultWeather.style.justifyContent = "center";
        resultWeather.style.alignItems = "center";
    }
    };
    xhttp.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`, true);
    xhttp.send(); 

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`).then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        for (let i = 0; i < data.list.length; i++) {

            resultForecastElement = document.createElement('div');
            resultForecastElement.style.display = "flex";
            resultForecastElement.style.justifyContent = "center";
            resultForecastElement.style.alignItems = "center";
            resultForecastElement.style.border = "1px solid black";
            resultForecastElement.style.margin = "10px";

            dateDiv = document.createElement('div');
            dateDiv.innerHTML = data.list[i].dt_txt;
            dateDiv.style.fontSize = "20px";
            resultForecastElement.appendChild(dateDiv);
        
            iconDiv = document.createElement('img');
            iconDiv.src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
            resultForecastElement.appendChild(iconDiv);

            infoWrapperDiv = document.createElement('div');

            temperatureDiv = document.createElement('div');
            temperatureDiv.innerHTML = data.list[i].main.temp.toString().replace(".", ",") + " °C";
            temperatureDiv.style.fontSize = "30px";
            temperatureDiv.style.fontWeight = "bold";
            infoWrapperDiv.appendChild(temperatureDiv);
        
            feelDiv = document.createElement('div');
            feelDiv.innerHTML = "Odczuwalna: " + data.list[i].main.feels_like.toString().replace(".", ",") + " °C";
            infoWrapperDiv.appendChild(feelDiv);

            descriptionDiv = document.createElement('div');
            descriptionData = data.list[i].weather[0].description;
            descriptionDiv.innerHTML = descriptionData.charAt(0).toUpperCase() + descriptionData.slice(1);
            infoWrapperDiv.appendChild(descriptionDiv);

            resultForecastElement.appendChild(infoWrapperDiv);
            resultForecast.appendChild(resultForecastElement);
        }
    })
    .catch(error => {
        alert('Błąd: ' + error.message);
    });
});