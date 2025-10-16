import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/weatherData', async (req, res)=>{
    try {
        const {lat,lon} = req.query
        if(!lat || !lon){
            return res.status(400).json({error: "Missing lat or lon"})
        }
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weathercode,wind_speed_10m,surface_pressure,cloud_cover&hourly=precipitation_probability&daily=sunrise,sunset&timezone=auto&forecast_days=1`;
        const apiResponse = await fetch(url);
        const data = await apiResponse.json();
        if(!apiResponse.ok){
            throw new Error(`API returned ${apiResponse.status}`)
        }
        const currData = data.current
        const { time, precipitation_probability } = data.hourly
        const rainProb = time.map((t, i) => ({ time: t.slice(-5), probability: precipitation_probability[i] }))
        const weatherData = {
            location: `${data.latitude}, ${data.longitude}`,
            temperature: currData.temperature_2m,
            feels_like: currData.apparent_temperature,
            humidity: currData.relative_humidity_2m,
            description: currData.weathercode,
            wind_speed: currData.wind_speed_10m,
            pressure: currData.surface_pressure,
            cloud_cover: currData.cloud_cover,
            sunrise: data.daily.sunrise[0].slice(-5),
            sunset: data.daily.sunset[0].slice(-5),
            rain_probability: rainProb,
        };
        res.json(weatherData)

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
        const currTime = currData.time
        const [datePart, timePart] = currTime.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hour, minute] = timePart.split(":").map(Number);
        let formattedTime = new Date(year, month - 1, day, hour, minute);
        if(formattedTime.getMinutes()>0){
            formattedTime.setMinutes(0)
            formattedTime = formattedTime.toISOString().slice(0, 16)
        }
        const newTime = formattedTime.toLocaleString("sv-SE", { hour12: false }).replace(" ", "T").slice(0, 16);
        const timeIndex = data.hourly.time.findIndex(t => t === newTime)
        const { time, european_aqi } = data.hourly
        const euroAqi = time.map((t, i) => ({ time: t.slice(-5), index: european_aqi[i] }))
        const airQualityData={
            currentAqi: currData.european_aqi,
            dominantPollutant: 'pm2_5', //make a function deciding which pollutant is the dominant one
            pollutants: {
                pm2_5: { value: currData.pm2_5, unit: currUnits.pm2_5 },
                pm10: { value: currData.pm10, unit: currUnits.pm10 },
                co: { value: currData.carbon_monoxide, unit: currUnits.carbon_monoxide },
                o3: { value: currData.ozone, unit: currUnits.ozone },
                ch4: { value: data.hourly.methane[timeIndex], unit: data.hourly_units.methane },
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
app.listen(PORT, ()=>{
    console.log(`Running on Port ${PORT}`)
})

//req param - :param
//access req params - req.params
//req query params - req.query
//destruct query params const {query:{param, param}}=req;
