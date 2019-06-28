import React from 'react';
import ReactDOM from 'react-dom';

const baseURL = process.env.ENDPOINT;

const getWeatherFromApi = async () => {
  try {
    const response = await fetch(`${baseURL}/weather`);
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

const getForecastFromApi = async (lat, lon) => {
  try {
    const response = await fetch(`${baseURL}/forecast/${lat}/${lon}`);
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.getGeoLoc = this.getGeoLoc.bind(this);

    this.state = {
      icon: '',
      lon: '',
      lat: '',
      forecastArr: [],
      isLoading: true,
    };
  }

  async componentWillMount() {
    await this.getGeoLoc();
    const weather = await getWeatherFromApi();
    this.setState({ icon: weather.icon.slice(0, -1) });
  }

  componentDidMount() {

  }

  // Get geolocation and forecast
  getGeoLoc() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLongitude = JSON.stringify(Math.round(position.coords.longitude));
        const currentLatitude = JSON.stringify(Math.round(position.coords.latitude));

        console.log(`Lat: ${currentLatitude}`);
        console.log(`Lon: ${currentLongitude}`);

        // Get forecast with current coordinates
        getForecastFromApi(currentLatitude, currentLongitude)
        .then(res => this.setState(
          {
            forecastArr: res,
            lon: currentLongitude,
            lat: currentLatitude,
            isLoading: false,
          }))
        .catch(err => console.log(err));
      },
      error => alert(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      }
   );
  }


  render() {
    const { icon } = this.state;

    // Current weather icon
    const current = this.state.forecastArr.slice(0, 1).map((item, index) => (
      <img key={item.dt} alt="current" src={`/img/${item.weather[0].icon.slice(0, -1)}.svg`} />
    ));

    // Forecast icons
    const forecast = this.state.forecastArr.slice(1, 6).map((item, index) => (
      <li key={item.dt}>
        <img height="40" alt={item.dt_txt} src={`/img/${item.weather[0].icon.slice(0, -1)}.svg`} />
      </li>
    ));

    return (
      <div className="icon">
        { /* this.state.isLoading && <h3>Loading weather</h3> */ }
        {!this.state.lon && <div><img alt="icon" src={`/img/${icon}.svg`} />
          <p>Cannot get geolocation. Using default Helsinki, FI</p></div>
        }
        {!this.state.isLoading && (
          <div>
            <h2>Weather</h2>
            <p>longitude: {this.state.lon}</p>
            <p>latitude: {this.state.lat}</p>
            {current}
            <div>
              <ul>{forecast}</ul>
            </div>

          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
