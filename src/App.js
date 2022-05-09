import axios from "axios";
import { useState, useEffect } from "react";
import Filter from "./Components/Filter";

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [searched, setSearched] = useState([]);
  const [weather, setWeather] = useState({});
  const api_key = process.env.REACT_APP_WEATHER_KEY;

  const hook = () => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  };
  useEffect(hook, []);

  const weatherHook = () => {
    if (searched === []) {
      axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?q=Bern&APPID=${api_key}`
        )
        .then((response) => {
          setWeather(response.data);
        });
    } else if (searched.length > 0) {
      axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?q=${searched[0].capital[0]}&APPID=${api_key}`
        )
        .then((response) => {
          setWeather(response.data);
        });
    }
  };
  useEffect(weatherHook, [searched, api_key]);

  const findCountries = (event) => {
    setFilter(event.target.value);
    setSearched(
      countries.filter((country) =>
        country.name.common
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      )
    );
  };
  const fillSearch = (name) => {
    console.log(name);
    setFilter(name);
    setSearched(countries.filter((country) => country.name.common === name));
  };
  if (searched.length > 10) {
    console.log(searched.length);
    return (
      <div>
        <div>
          find country:
          <Filter value={filter} changeFunction={findCountries} />
        </div>
        <p>Too many matches, specify another filter</p>
      </div>
    );
  } else if (searched.length > 1) {
    return (
      <div>
        <div>
          find country:
          <Filter value={filter} changeFunction={findCountries} />
        </div>
        <div>
          {searched.map((country, i) => (
            <p key={i}>
              {country.name.common}
              <button onClick={() => fillSearch(country.name.common)}>
                show
              </button>
            </p>
          ))}
        </div>
      </div>
    );
  } else if (searched.length > 0) {
    let languages = [];
    console.log(weather);
    console.log(api_key);
    for (const property in searched[0].languages) {
      languages.push(searched[0].languages[property]);
    }
    let source = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    console.log(source);
    return (
      <div>
        <div>
          find country:
          <Filter value={filter} changeFunction={findCountries} />
        </div>
        <h1>{searched[0].name.common}</h1>
        <p>capital {searched[0].capital}</p>
        <p>area {searched[0].area} </p>
        <h3>Languages:</h3>
        <ul>
          {languages.map((language, i) => (
            <li key={i}>{language}</li>
          ))}
        </ul>
        <img src={searched[0].flags.png} alt={searched[0].name.common}></img>
        <h2>Weather in {searched[0].capital}</h2>
        <p>temperature {(weather.main.temp - 273.15).toFixed(2)} Celcius</p>
        <img src={source} alt={weather.weather[0].description}></img>
        <p>Wind {weather.wind.speed} m/s </p>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          find country:
          <Filter value={filter} changeFunction={findCountries} />
        </div>
      </div>
    );
  }
}

export default App;
