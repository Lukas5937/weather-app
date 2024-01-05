const unitCheckbox = document.querySelector("#unit");
const unitCheckboxLabel = document.querySelector("label[for='unit']");
const temperatureWrapper = document.querySelector(".temperature-wrapper");
const loaderWrapper = document.querySelector(".loader-wrapper");

function checkUnit() {
  let unit = "Celsius";
  if (unitCheckbox.checked) {
    unit = "Fahrenheit";
  } else unit = "Celsius";
  return unit;
}

unitCheckbox.addEventListener("click", () => {
  const unit = checkUnit();
  unitCheckboxLabel.textContent = unit;
});

async function getWeatherData() {
  let city = document.querySelector("#city").value;
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=58b771819ace42c288b24449233112&q=${city}&aqi=no`,
      { mode: "cors" },
    );
    if (!response.ok) {
      throw new Error("Please enter a valid City name.");
    }
    const data = await response.json();
    city = data.location.name;
    const countryName = data.location.country;
    const unit = checkUnit();
    let temp = data.current.temp_c;
    if (unit === "Fahrenheit") {
      temp = data.current.temp_f;
    }
    return { city, countryName, temp };
  } catch (error) {
    return console.error(error.message);
  }
}

function adjustBackgroundColor(unitText, temp) {
  console.log(unitText);
  console.log(temp);
  if (unitText === "°C") {
    if (temp < 10) {
      temperatureWrapper.style.background = "blue";
    } else if (temp < 20) {
      temperatureWrapper.style.background = "green";
    } else if (temp < 30) {
      temperatureWrapper.style.background = "orange";
    } else if (temp >= 30) {
      temperatureWrapper.style.background = "red";
    }
  } else if (unitText === "°F") {
    if (temp < 10) {
      temperatureWrapper.style.background = "blue";
    } else if (temp < 20) {
      temperatureWrapper.style.background = "green";
    } else if (temp < 30) {
      temperatureWrapper.style.background = "orange";
    } else if (temp >= 30) {
      temperatureWrapper.style.background = "red";
    }
  }
}

function showLoader() {
  const loaderImg = document.createElement("img");
  loaderImg.src =
    "https://img.freepik.com/premium-vector/processing-icon-circular-loader-loading-progress-indicator-isolated-white-background_543062-380.jpg?w=2000";
  loaderImg.style.height = "50px";
  loaderImg.style.width = "50px";
  loaderWrapper.append(loaderImg);
}

function removeLoader() {
  const loaderImg = document.querySelector("img");
  loaderWrapper.removeChild(loaderImg);
}

async function showWeatherData(apiCall) {
  showLoader();
  const weatherData = await apiCall();
  removeLoader();
  const unit = checkUnit();
  let unitText = "°C";
  if (unit === "Fahrenheit") {
    unitText = "°F";
  }
  const temp = document.createElement("p");
  const city = document.createElement("p");
  const country = document.createElement("p");
  temp.textContent = `${weatherData.temp} ${unitText}`;
  city.textContent = weatherData.city;
  country.textContent = weatherData.countryName;
  temperatureWrapper.append(temp, city, country);
  adjustBackgroundColor(unitText, weatherData.temp);
}

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  showWeatherData(getWeatherData);
  event.preventDefault();
});
