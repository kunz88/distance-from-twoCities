"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const geolib_1 = require("geolib");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const appId = "c7922a4bae3f5cefc5a5c93013e44093";
app.get('/distances/:firstCity/:secondCity', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firstCity = req.params.firstCity;
    const secondCity = req.params.secondCity;
    const { coord: { lat: firstCityLat, lon: firstCityLon } } = yield getLatAndLong(firstCity);
    const { coord: { lat: secondCityLat, lon: secondCityLon } } = yield getLatAndLong(secondCity);
    const distance = (0, geolib_1.getDistance)({ latitude: firstCityLat, longitude: firstCityLon }, { latitude: secondCityLat, longitude: secondCityLon });
    // ho impostato i parametri con any,controllarne il tipo in futuro
    const { longitude: center_lon, latitude: center_lat } = (0, geolib_1.getCenter)([
        { latitude: firstCityLat, longitude: firstCityLon },
        { latitude: secondCityLat, longitude: secondCityLon }
    ]);
    const middleCity = yield getMiddleCity(center_lat, center_lon);
    res.json({
        description: `The distance between ${firstCity} and ${secondCity} is ${distance / 1000} km`,
        city_in_between: middleCity,
        distanceBetween: `${distance / 1000} km`
    });
}));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
const getLatAndLong = (city) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appId}`);
    const payload = yield response.json();
    return payload;
});
const getMiddleCity = (lat, lon) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`);
    const payload = yield response.json();
    const { name } = payload;
    return name;
});
