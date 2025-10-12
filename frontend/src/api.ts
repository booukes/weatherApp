export async function getWeather(lat: string, lon: string) {
  const res = await fetch(`/api/weatherData?lat=${lat}&lon=${lon}`);
  return await res.json();
}
export async function getAQI(lat: string, lon: string) {
  const res = await fetch(`/api/airQualityData?lat=${lat}&lon=${lon}`);
  return await res.json();
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