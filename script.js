
document.addEventListener('DOMContentLoaded', function() {
    var menuToggle = document.getElementById('menu-toggle');
    var navbar = document.getElementById('navbar');
    var closeIcon = document.getElementById('close-icon');

    menuToggle.addEventListener('click', function() {
        navbar.classList.toggle('show');
    });

    closeIcon.addEventListener('click', function() {
        navbar.classList.remove('show');
    });
});

function SubForm(event){
    event.preventDefault();
    $.ajax({
        url:'https://api.apispreadsheets.com/data/PR5bpx6FzNjUqavg/',
        type:'post',
        data:$("#myForm").serializeArray(),
        success: function(){
            document.querySelector("#myForm").reset();
          alert("Suggestion has been sent to the WeatherWave Teams :)")
        },
        error: function(){
          alert("There was an error :(")
        }
    });
}

document.querySelector(".btn").addEventListener("click", function(e){
    e.preventDefault();
    var emailInput= document.querySelector(".contact-input");
    var success= document.querySelector(".successEmail");
    var emailValue = emailInput.value;

var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(emailPattern.test(emailValue)){
    emailInput.value="";
    emailInput.placeholder="Thanks For Subscribing";
    emailInput.classList.add('green-placeholder');
}
    else
    {
        alert("Please enter valid email");
    }
});




function validateEmail() {
    const email = document.getElementById('email').value;
    const emailError = document.getElementById('emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        emailError.style.display = 'block';
        return false;
    } else {
        emailError.style.display = 'none';
        return true;
    }
}


function validateConfirmPassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    if (password !== confirmPassword) {
        confirmPasswordError.style.display = 'block';
        return false;
    } else {
        confirmPasswordError.style.display = 'none';
        return true;
    }
}

function validateForm() {
    const isEmailValid = validateEmail();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (isEmailValid && isConfirmPasswordValid) {
        document.querySelector('form').submit();
    }
}

function togglePasswordVisibility(inputId, iconElement) {
    const passwordInput = document.getElementById(inputId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        iconElement.classList.add('fa-eye');
        iconElement.classList.remove('fa-eye-slash');
    } else {
        passwordInput.type = "password";
        iconElement.classList.add('fa-eye-slash');
        iconElement.classList.remove('fa-eye');
    }
}

function showForm(formType) {
    var loginForm = document.getElementById('loginForm');
    var signUpForm = document.getElementById('signUpForm');
    var loginTab = document.getElementById('loginTab');
    var signUpTab = document.getElementById('signUpTab');

    if (formType === 'login') {
        loginForm.style.display = 'flex';
        signUpForm.style.display = 'none';
        loginTab.classList.add('active');
        signUpTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signUpForm.style.display = 'flex';
        loginTab.classList.remove('active');
        signUpTab.classList.add('active');
    }
}

window.onload = function() {
    if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then(function(permissionStatus) {
            if (permissionStatus.state === 'granted') {
                navigator.geolocation.getCurrentPosition(showWeather, showError);
            } else if (permissionStatus.state === 'prompt') {
                navigator.geolocation.getCurrentPosition(showWeather, showError);
            } else {
                document.getElementById('weather').textContent = "Location access has been denied. Please enable location services and refresh the page.";
            }
        });
    } else {
        document.getElementById('weather').textContent = "Permissions API not supported.";
    }
};

function showWeather(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = 'da402f5b0e9b10b853615d542430a00b';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const weather = data.weather[0].description;
            const temp = data.main.temp;
            const city = data.name; 
            document.getElementById('weather').innerHTML = `City: ${city}, Weather: ${weather}, Temperature: ${temp}°C`;
        })
        .catch(error => {
            document.getElementById('weather').textContent = "Unable to fetch weather data.";
            console.error('Error fetching data:', error);
        });
};

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('weather').textContent = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('weather').textContent = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('weather').textContent = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('weather').textContent = "An unknown error occurred.";
            break;
    }
};

let map; 
let weatherData; 

document.getElementById('getWeather-map').addEventListener('click', getWeather);
document.getElementById('narrateWeather-map').addEventListener('click', narrateWeather);

async function getWeather() {
    const city = document.getElementById('city-weather').value;
    const apiKey = 'da402f5b0e9b10b853615d542430a00b'; 
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error('City not found');
        }
        weatherData = await weatherResponse.json();

        console.log('Weather data fetched:', weatherData);
        const { coord, main } = weatherData;
        const temperature = main.temp;
        initializeOrUpdateMap(coord.lat, coord.lon, temperature);

        displayWeather(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weather-map');
    weatherDiv.innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
    `;
}

function narrateWeather() {
    if (!weatherData) {
        alert('Please fetch the weather first.');
        return;
    }

    const weatherDescription = `The current weather in ${weatherData.name} is ${weatherData.weather[0].description} with a temperature of ${weatherData.main.temp} degrees Celsius.`;

    const utterance = new SpeechSynthesisUtterance(weatherDescription);
    window.speechSynthesis.speak(utterance);
}

function initializeOrUpdateMap(lat, lon, temperature) {
    const mapContainer = document.getElementById('map-container');
    mapContainer.style.height = '400px';

    if (map) {
        map.setView([lat, lon], 10);
    } else {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }
    if (map.marker) {
        map.removeLayer(map.marker);
    }
    map.marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`Current Temperature: ${temperature}°C`)
        .openPopup();
}
const triviaFacts = [
    "Did you know that the highest temperature ever recorded on Earth was 56.7°C (134°F) in Furnace Creek Ranch, California, USA in 1913?",
    "The coldest temperature ever recorded on Earth was -89.2°C (-128.6°F) at the Soviet Union's Vostok Station in Antarctica in 1983.",
    "The wettest place on Earth is Mawsynram, India, where an average of 467.4 inches of rain falls annually.",
    "A single bolt of lightning contains enough energy to cook 100,000 slices of toast.",
    "The word 'hurricane' comes from the Taino (Caribbean) word 'huracán,' which was used to describe a god of the storm.",
    "Snowflakes come in a variety of shapes and sizes, but they are generally classified into 6 types: plates, columns, needles, dendrites, spatial dendrites, and capped columns.",
    "In the Arctic, the sun does not set for about two months during the summer, a phenomenon known as the 'Midnight Sun.'"
];

function showTrivia() {
    const randomIndex = Math.floor(Math.random() * triviaFacts.length);
    document.getElementById('trivia-fact').textContent = triviaFacts[randomIndex];
}


document.getElementById('check-weather').addEventListener('click', function() {
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;

    if (!location || !date) {
        document.getElementById('result').textContent = "Please enter both location and date.";
        return;
    }

    const today = new Date();
    const selectedDate = new Date(date);
    const daysFromToday = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24));

    if (daysFromToday < 0 || daysFromToday > 7) {
        document.getElementById('result').textContent = "Please select a date within the next 7 days.";
        return;
    }

    getWeatherForecast(location, daysFromToday);
});

function getWeatherForecast(location, daysFromToday) {
    const apiKey = 'da402f5b0e9b10b853615d542430a00b';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const forecast = data.list[daysFromToday * 8 - 1]; 

            const weatherDescription = forecast.weather[0].description;
            const temperature = forecast.main.temp;
            const windSpeed = forecast.wind.speed;

            let suggestion = `The weather on ${location} for your selected date is: ${weatherDescription}, 
            with a temperature of ${temperature}°C and wind speed of ${windSpeed} m/s. `;

            if (weatherDescription.includes('rain') || weatherDescription.includes('storm')) {
                suggestion += "It's recommended to plan an indoor event.";
            } else if (temperature > 30) {
                suggestion += "It's going to be hot. Make sure to stay hydrated!";
            } else if (temperature < 10) {
                suggestion += "It's going to be cold. Consider providing warm beverages and blankets.";
            } else {
                suggestion += "The weather looks good for an outdoor event!";
            }

            document.getElementById('result').textContent = suggestion;
        })
        .catch(error => {
            document.getElementById('result').textContent = "Unable to fetch weather data.";
            console.error('Error fetching data:', error);
        });
}

document.querySelector(".btn").addEventListener("click", function(e){
    e.preventDefault();
    var emailInput= document.querySelector(".contact-input");
    var success= document.querySelector(".successEmail");
    var emailValue = emailInput.value;

var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(emailPattern.test(emailValue)){
    emailInput.value="";
    emailInput.placeholder="Thanks For Subscribing";
    emailInput.classList.add('green-placeholder');
}
    else
    {
        alert("Please enter valid email");
    }
});

function SubQuery(event) {
    event.preventDefault(); 

   
    const formData = new FormData(document.getElementById("myQuery"));

    fetch('/send', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message); 
            document.getElementById("myQuery").reset();  
        } else {
            alert("There was an error sending the feedback.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("There was an error sending the feedback.");
    });
}

function error_register() {
    const passPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=])[A-Za-z\d@#$%^&+=]{10}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const conPattern = /^\d{10}$/;

    var email = document.getElementById('email').value;
    var contact = document.getElementById('contact').value;
    var password = document.getElementById('password').value;
    var confirm_password = document.getElementById('confirmpassword').value;

    if (conPattern.test(contact)) {
        if (emailPattern.test(email)) {
            if (passPattern.test(password)) {
                if (password === confirm_password) {
                    alert("Registration successful");
                } else {
                    alert("Password and Confirm Password are not matched");
                }
            } else {
                alert("Password must contain one capital letter, one number, and one special symbol");
            }
        } else {
            alert("Please enter a valid email");
        }
    } else {
        alert("Please enter a 10-digit number");
    }
}
