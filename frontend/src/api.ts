enum dataType{
  weatherData = 'weatherData',
  AQIData = 'AQIData',
  userCoords = 'userCoords'
}
export enum forecast_types{
  current = 'current',
  hourly = 'hourly'
}

function generateCacheKey(keyDataType: dataType, lat?: string, lon?: string, forecast_type?: forecast_types, forecast_days?: Number){
  const location = `${lat},${lon}`
  const date = new Date()
  const timestamp = `${date.getDate()}/${date.getHours()}`
  let key
  if(location.length==0 || keyDataType===dataType.userCoords){
    key = `${keyDataType}`
  } else {
    switch(forecast_type){
      case forecast_types.current:
        key = `${keyDataType}_${location}_${timestamp}`
        break
      case forecast_types.hourly:
        key = `${keyDataType}_${forecast_types.hourly}_${forecast_days}_${location}_${timestamp}`
        break
      default:
        key = `${keyDataType}_${location}_${timestamp}`
        break
    }
  }
  return key
}
function isInCache(key: string){
  return localStorage.getItem(key) ? true : false
}

export async function getWeather(lat: string, lon: string, forecast_type: forecast_types, forecast_days: Number = 1) {
  const cacheKey = generateCacheKey(dataType.weatherData, lat, lon, forecast_type, forecast_days)
  if(!isInCache(cacheKey)){
    const res = await fetch(`/api/weatherData?lat=${lat}&lon=${lon}&forecast_type=${forecast_type}&forecast_days=${forecast_days}`);
    const data = await res.json()
    localStorage.setItem(cacheKey, JSON.stringify(data))
    return data
  } else {
    const data = localStorage.getItem(cacheKey)
    if(data) return JSON.parse(data)
  }
  
}
export async function getAQI(lat: string, lon: string) {
  const cacheKey = generateCacheKey(dataType.AQIData, lat, lon)
  if(!isInCache(cacheKey)){
    const res = await fetch(`/api/airQualityData?lat=${lat}&lon=${lon}`);
    const data = await res.json()
    localStorage.setItem(cacheKey, JSON.stringify(data))
    return data
  } else{
    const data = localStorage.getItem(cacheKey)
    if(data) return JSON.parse(data)
  }
}
type Coordinates = {
  lat: number;
  lon: number;
};

export async function getGeolocation(): Promise<Coordinates> {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser.");
  }
  const cacheKey = generateCacheKey(dataType.userCoords)
  if(!isInCache(cacheKey)){
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const data = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }
          localStorage.setItem(cacheKey, JSON.stringify(data))
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  return new Promise((resolve, reject) => {
        const testData = localStorage.getItem(cacheKey)
        if(testData){
          const parsedData = JSON.parse(testData)
          const data:Coordinates={
            lat: Number(parsedData.lat),
            lon: Number(parsedData.lon)
          }
          resolve(data)
        }
        reject("error");
      }
    );
  };
  
