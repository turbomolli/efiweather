const debug = require('debug')('weathermap');

const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');

const appId = process.env.APPID || 'a0ee7426f0c7db7c449da875b08d9a96';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

const fetchWeather = async () => {
  const endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}&`;
  console.log(endpoint);
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  const weatherData = await fetchWeather();

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.weather ? weatherData.weather[0] : {};
  // ctx.body = weatherData;
});

const fetchForecast = async (params) => {
  const endpoint = `${mapURI}/forecast?lat=${params.lat}&lon=${params.lon}&appid=${appId}&`;
  console.log(endpoint);
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

router.get('/api/forecast/:lat/:lon', async ctx => {
  const forecastData = await fetchForecast(ctx.params);
  console.log(ctx.params);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = forecastData.list;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);
