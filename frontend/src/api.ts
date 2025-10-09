export async function getWeather(lat: string, lon: string) {
  const res = await fetch(`/api/weatherData?lat=${lat}&lon=${lon}`);
  return await res.json();
}