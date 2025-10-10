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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weathercode,wind_speed_10m,surface_pressure,cloud_cover,precipitation_probability&daily=sunrise,sunset&timezone=auto&forecast_days=1`;
        const apiResponse = await fetch(url);
        const data = await apiResponse.json();
        if(!apiResponse.ok){
            throw new Error(`API returned ${apiResponse.status}`)
        }

        const weatherData = {
            location: `${data.latitude}, ${data.longitude}`,
            temperature: data.current.temperature_2m,
            feels_like: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            wind_speed: data.current.wind_speed_10m,
            pressure: data.current.surface_pressure,
            cloud_cover: data.current.cloud_cover,
            rain_probability: data.current.precipitation_probability,
            sunrise: data.daily.sunrise[0],
            sunset: data.daily.sunset[0],
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
        const url=`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=methane&current=pm10,pm2_5,carbon_monoxide,ozone,sulphur_dioxide,european_aqi&timezone=auto&forecast_days=1`
        const apiResponse = await fetch(url)
        const data = await apiResponse.json()
        if(!apiResponse.ok){
            throw new Error(`API returned ${apiResponse.status}`)
        }
        const currData = data.current
        const time = currData.time
        const [datePart, timePart] = time.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hour, minute] = timePart.split(":").map(Number);
        let formattedTime = new Date(year, month - 1, day, hour, minute);
        if(formattedTime.getMinutes()>0){
            formattedTime.setMinutes(0)
            formattedTime = formattedTime.toISOString().slice(0, 16)
        }
        const newTime = formattedTime.toLocaleString("sv-SE", { hour12: false }).replace(" ", "T").slice(0, 16);
        const timeIndex = data.hourly.time.findIndex(t => t === newTime)
        const airQualityData={
            pm2: currData.pm2_5,
            pm10: currData.pm10,
            co: currData.carbon_monoxide,
            o3: currData.ozone,
            ch4: data.hourly.methane[timeIndex],
            so2: currData.sulphur_dioxoide,
            eaqi: {time: time, index: currData.european_aqi}
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
