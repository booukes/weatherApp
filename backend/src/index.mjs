import express from "express";
import path from 'path'

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve()


app.use(express.static(path.join(__dirname, 'demo_board/demo/dist')))

const forecast_types = {
    current: "current",
    hourly: "hourly"
}

function formatDate(date){
    const currDate = date
    const [datePart, timePart] = currDate.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    const tempDate = new Date(year, month - 1, day, hour, minute);

    if(tempDate.getMinutes()>0){
        tempDate.setMinutes(0)
    }

    const formatted = tempDate.toLocaleString("pl-PL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
    const [d, t] = formatted.split(", ");
    const [dayStr, monthStr, yearStr] = d.split(".");
    const output = `${yearStr}-${monthStr}-${dayStr}T${t.slice(0,5)}`;
    return output; 
}

app.get('/api/weatherData', async (req, res)=>{
    try {
        const {lat,lon,forecast_type,forecast_days} = req.query
        if(!lat || !lon){
            return res.status(400).json({error: "Missing lat or lon"})
        }
        if(forecast_type===forecast_types.current){
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weathercode,wind_speed_10m,surface_pressure,cloud_cover&hourly=precipitation_probability&daily=sunrise,sunset&timezone=auto&forecast_days=1`;
            const apiResponse = await fetch(url);
            const data = await apiResponse.json();
            if(!apiResponse.ok){
                throw new Error(`API returned ${apiResponse.status}`)
            }
            const currData = data.current
            const { time, precipitation_probability } = data.hourly
            const rainProb = time.map((t, i) => ({ time: t.slice(-5), probability: precipitation_probability[i] }))
            const hourlyWeatherData = {
                location: `${data.latitude}, ${data.longitude}`,
                temperature: currData.temperature_2m,
                feels_like: currData.apparent_temperature,
                humidity: currData.relative_humidity_2m,
                description: currData.weathercode,
                wind_speed: currData.wind_speed_10m,
                pressure: currData.surface_pressure,
                cloud_cover: currData.cloud_cover
            };
            const dailyWeatherData = {
                sunrise: data.daily.sunrise[0].slice(-5),
                sunset: data.daily.sunset[0].slice(-5),
                rain_probability: rainProb,
            }
            const payload = {
                hourly: hourlyWeatherData,
                daily: dailyWeatherData
            }
            res.json(payload)
        }
        if(forecast_type===forecast_types.hourly){
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,weathercode,wind_speed_10m,surface_pressure,cloud_cover,precipitation_probability&daily=sunrise,sunset&timezone=auto&forecast_days=${forecast_days}`
            const apiResponse = await fetch(url)
            const data = await apiResponse.json()
            if(!apiResponse.ok){
                throw new Error(`API returned ${apiResponse.status}`)
            }
            const allForecastDates = data.daily.time
            const hourlyData = data.hourly
            const dates = hourlyData.time
            const allRainProb = dates.map((t, i) => ({ time: t.slice(-5), probability: hourlyData.precipitation_probability[i], day: new Date(t).toDateString() }))
            const filteredRainProb = new Map()

            for(const date of allForecastDates){
                const dateStr = new Date(date).toDateString()
                const dailyRainProb = allRainProb.filter(tpr => tpr.day===dateStr).map(({ time, probability }) => ({ time, probability }))
                filteredRainProb.set(date, dailyRainProb)
            }

            const dailyWeatherData = allForecastDates.map((t, i) => {
                return {
                    time: t,
                    sunrise: data.daily.sunrise[i].slice(-5),
                    sunset: data.daily.sunset[i].slice(-5),
                    rain_probability: filteredRainProb.get(t)
                } 
            })

            const hourlyWeatherData = dates.map((t, i) => {
                const currDate = t
                const currDay = new Date(currDate).getDate()
                const dailyDateIndex = allForecastDates.findIndex(d => new Date(d).getDate()==currDay)
                return {
                    date: allForecastDates[dailyDateIndex],
                    time: currDate,
                    location: `${data.latitude}, ${data.longitude}`,
                    temperature: hourlyData.temperature_2m[i],
                    feels_like: hourlyData.apparent_temperature[i],
                    humidity: hourlyData.relative_humidity_2m[i],
                    description: hourlyData.weathercode[i],
                    wind_speed: hourlyData.wind_speed_10m[i],
                    pressure: hourlyData.surface_pressure[i],
                    cloud_cover: hourlyData.cloud_cover[i]
                }
            })
           const payload = {
                hourly: hourlyWeatherData,
                daily: dailyWeatherData
           }
            res.json(payload)

        }
    } catch (err) {
        console.error("Error fetching weather", err)
        res.status(500).json({error: "Failed to fetch weather data"})
    }

})


app.get('/api/airQualityData', async(req, res) =>{
    try {
        const {lat,lon} = req.query
        if(!lat || !lon){
            return res.status(400).json({error: "Missing lat or lon"})
        }
        const url=`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=methane,european_aqi&current=pm10,pm2_5,carbon_monoxide,ozone,sulphur_dioxide,european_aqi&timezone=auto&forecast_days=1`
        const apiResponse = await fetch(url)
        const data = await apiResponse.json()
        if(!apiResponse.ok){
            throw new Error(`API returned ${apiResponse.status}`)
        }
        const currData = data.current
        const currUnits = data.current_units
        const newTime = formatDate(currData.time)
        const { time, european_aqi } = data.hourly
        const euroAqi = time.map((t, i) => ({ time: t.slice(-5), index: european_aqi[i] }))
        const airQualityData={
            currentAqi: currData.european_aqi,
            dominantPollutant: 'pm2_5',
            pollutants: {
                pm2_5: { value: currData.pm2_5, unit: currUnits.pm2_5 },
                pm10: { value: currData.pm10, unit: currUnits.pm10 },
                co: { value: currData.carbon_monoxide, unit: currUnits.carbon_monoxide },
                o3: { value: currData.ozone, unit: currUnits.ozone },
                so2: { value: currData.sulphur_dioxide, unit: currUnits.sulphur_dioxide },
            },
            eaqi: euroAqi
        }
        res.json(airQualityData)
    } catch(err){
        console.error("Error fetching air quality", err)
        res.status(500).json({error: "Failed to fetch air quality data"})
    }
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo_board/demo/dist/index.html'))
})

app.listen(PORT, ()=>{
    console.log(`Running on Port ${PORT}`)
})



//req param - :param
//access req params - req.params
//req query params - req.query
//destruct query params const {query:{param, param}}=req;
