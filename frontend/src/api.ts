enum dataType{
  weatherData = 'weatherData',
  AQIData = 'AQIData'
}
function generateCacheKey(lat: string, lon: string, dataType: dataType){
  const location = `${lat},${lon}`
  const date = new Date()
  const timestamp = `${date.getDate()}/${date.getHours()}`
  const key = `${dataType}_${location}_${timestamp}`
  return key
}
function isInCache(key: string){
  return localStorage.getItem(key) ? true : false
}

export async function getWeather(lat: string, lon: string) {
  const cacheKey = generateCacheKey(lat, lon, dataType.weatherData)
  if(!isInCache(cacheKey)){
    const res = await fetch(`/api/weatherData?lat=${lat}&lon=${lon}`);
    const data = await res.json()
    localStorage.setItem(cacheKey, JSON.stringify(data))
    return data
  } else {
    return localStorage.getItem(cacheKey)
  }
  
}
export async function getAQI(lat: string, lon: string) {
  const cacheKey = generateCacheKey(lat, lon, dataType.AQIData)
  if(!isInCache(cacheKey)){
    const res = await fetch(`/api/airQualityData?lat=${lat}&lon=${lon}`);
    const data = await res.json()
    localStorage.setItem(cacheKey, JSON.stringify(data))
    return data
  } else{
    return localStorage.getItem(cacheKey)
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

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}