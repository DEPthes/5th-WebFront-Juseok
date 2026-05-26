const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const geoUrl = "https://api.openweathermap.org/geo/1.0/direct";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const messageElement = document.querySelector(".message");
const weatherIcon = document.querySelector(".weather-icon");
const cityElement = document.querySelector(".city");
const tempElement = document.querySelector(".temp");
const humidityElement = document.querySelector(".humidity");
const windElement = document.querySelector(".wind");
const weatherDetails = document.querySelector(".weather-details");

weatherDetails.style.display = "none";

function showMessage(message, isError = false) {
    messageElement.textContent = message;
    messageElement.classList.toggle("error", isError);
}

function formatWindSpeed(speed) {
    return `${(speed * 3.6).toFixed(2)} km/h`;
}

function getWeatherIcon(weatherMain) {
    if (weatherMain === "Clouds") {
        return "assets/cloudy-forecast-svgrepo-com.svg";
    }

    if (weatherMain === "Clear") {
        return "assets/sun-color-icon.svg";
    }

    if (weatherMain === "Rain") {
        return "assets/rain-svgrepo-com.svg";
    }

    if (weatherMain === "Drizzle") {
        return "assets/cloud-drizzle-svgrepo-com.svg";
    }

    if (weatherMain === "Mist" || weatherMain === "Fog" || weatherMain === "Haze") {
        return "assets/mist-svgrepo-com.svg";
    }

    if (weatherMain === "Snow") {
        return "assets/snowing-forecast-svgrepo-com.svg";
    }

    return "assets/ios-weather.svg";
}

async function fetchCoordinates(city) {
    const params = new URLSearchParams({
        q: city,
        limit: 1,
        appid: apiKey,
    });

    const response = await fetch(`${geoUrl}?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("API 키가 아직 활성화되지 않았거나 올바르지 않습니다. 잠시 기다렸다가 다시 시도해주세요.");
        }

        throw new Error(data.message || "도시 좌표를 찾지 못했습니다.");
    }

    if (data.length === 0) {
        throw new Error("도시를 찾을 수 없습니다. 예: 서울, 부산, Tokyo, London처럼 입력해보세요.");
    }

    return data[0];
}

async function fetchWeather(location) {
    const params = new URLSearchParams({
        lat: location.lat,
        lon: location.lon,
        appid: apiKey,
        units: "metric",
        lang: "kr",
    });

    const response = await fetch(`${weatherUrl}?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("API 키가 아직 활성화되지 않았거나 올바르지 않습니다. 잠시 기다렸다가 다시 시도해주세요.");
        }

        if (response.status === 404) {
            throw new Error("해당 도시의 날씨 정보를 찾을 수 없습니다.");
        }

        throw new Error(data.message || "날씨 정보를 불러오지 못했습니다.");
    }

    return data;
}

function renderWeather(weather, location) {
    const [condition] = weather.weather;
    const cityName = location.local_names?.ko || location.name || weather.name;

    weatherDetails.style.display = "block";
    cityElement.textContent = cityName;
    tempElement.textContent = `${Math.round(weather.main.temp)}°C`;
    humidityElement.textContent = `${weather.main.humidity}%`;
    windElement.textContent = formatWindSpeed(weather.wind.speed);
    weatherIcon.src = getWeatherIcon(condition.main);
    weatherIcon.alt = condition.description;
}

async function checkWeather(city) {
    const trimmedCity = city.trim();

    if (trimmedCity === "") {
        weatherDetails.style.display = "none";
        showMessage("도시 이름을 입력해주세요.", true);
        searchBox.focus();
        return;
    }

    if (apiKey === "YOUR_OPENWEATHER_API_KEY") {
        weatherDetails.style.display = "none";
        showMessage("app.js 상단의 apiKey에 OpenWeather API 키를 넣어주세요.", true);
        return;
    }

    searchBtn.disabled = true;
    showMessage("날씨를 불러오는 중입니다...");

    try {
        const location = await fetchCoordinates(trimmedCity);
        const weather = await fetchWeather(location);
        renderWeather(weather, location);
        showMessage("현재 날씨를 불러왔습니다.");
    } catch (error) {
        weatherDetails.style.display = "none";
        showMessage(error.message, true);
    } finally {
        searchBtn.disabled = false;
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});
