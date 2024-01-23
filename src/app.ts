import express, { Request, Response } from 'express';
import { getDistance ,getCenter} from 'geolib';
const app = express();
const port = process.env.PORT || 3000;
const appId = "c7922a4bae3f5cefc5a5c93013e44093"

app.get('/distances/:firstCity/:secondCity',async (req: Request, res: Response) => {
    const firstCity = req.params.firstCity;
    const secondCity = req.params.secondCity;

    const {coord:{lat:firstCityLat,lon:firstCityLon}} = await getLatAndLong(firstCity)
    const {coord:{lat:secondCityLat,lon:secondCityLon}} = await getLatAndLong(secondCity)

    
    const distance = getDistance(
        { latitude: firstCityLat, longitude: firstCityLon },
        { latitude: secondCityLat, longitude: secondCityLon }
    );
    // ho impostato i parametri con any,controllarne il tipo in futuro
    const {longitude:center_lon,latitude:center_lat}:any = getCenter([
        { latitude: firstCityLat, longitude: firstCityLon },
        { latitude: secondCityLat, longitude: secondCityLon }
    ]);

    const middleCity = await getMiddleCity(center_lat,center_lon)

    res.json({
        description:`The distance between ${firstCity} and ${secondCity} is ${distance/1000} km`,
        city_in_between:middleCity,
        distanceBetween:`${distance/1000} km`});
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
const getLatAndLong = async (city:string) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appId}`)
    const payload = await response.json();
    return payload
}
const getMiddleCity = async (lat:string,lon:string) =>{  
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`)
        const payload = await response.json();
        const {name} = payload
        return name 
    }
