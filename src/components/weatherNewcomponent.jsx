import { useEffect, useState } from "react";
import Styles from "../styles/weather.module.css";

function WeatherAppComponent() {
    const [CityName, setCityName] = useState("");
    const [WeatherData, setWeatherData] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)

    async function getWeatherData() {
        try {
            let API_key = process.env.REACT_APP_API_KEY;
            // console.log(API_key,"API_key");
            // let API_key = "609cb45418e8608822ff1053f3bc3045";
            setLoading(true)
            let respones = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CityName}&appid=${API_key}`);
            let result = await respones.json();
            if (result.cod === "404") {
                setError(result.message)

            }
            if (result.cod !== "400" && result.cod !== "404") {
                setWeatherData(result)
                setError("")
            }

        } catch (error) {
            setError("An Error occurred while fetching request")
        } finally {
            setLoading(false)
        }
    };
    function ConvertToCelsius(temp) {
        let newTemp = temp - 273.15;
        return Math.floor(newTemp);
    }

    function lengthConverter(valNum) {
        let value = valNum * 0.0003048;
        return value.toFixed(2);
    }
    useEffect(() => { getWeatherData(); }, [CityName])


    const getBackgroundImage = () => {
        if (!getWeatherData) return null;

        const weatherDescription =WeatherData?.weather && WeatherData?.weather[0]?.description.toLowerCase();
        console.log(weatherDescription); 

        if (weatherDescription&& weatherDescription.includes('clear sky')) {

            return 'https://i.pinimg.com/originals/a9/37/d4/a937d47b0d3d47df7a4faf34f3ee61f3.gif';
        } else if (weatherDescription.includes('haze')) {
            return 'https://i.gifer.com/origin/8d/8d1c415cc7016510e1578b3b300a3ce2_w200.webp';
        } else if (weatherDescription.includes('rain')) {
            return 'https://i.pinimg.com/originals/96/df/d4/96dfd411ab0e68f8bc1eb47e4eee8771.gif';
        }
        console.log(weatherDescription.includes(''));

        return 'https://i.pinimg.com/originals/02/3a/bf/023abf6fac6adaa2b9778c532f800f52.gif';
    }
    const backgroundStyle = {
        backgroundImage: `url(${getBackgroundImage()})`,
    };
    return <div className={Styles.weather_card} style={{ backgroundImage: { backgroundStyle } }} >

        <input type="text" placeholder="Enter Your City Name" value={CityName} onChange={(e) => setCityName(e.target.value)} className={Styles.input_felid} />
        {loading && <p style={{ textAlign: "center" }}>Loading.....</p>}
        {error && <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>}


        {WeatherData && (
            <div>
                <div className={Styles.weather_update}>
                    <div>
                        <h2>{WeatherData?.name}</h2>
                        <p className={Styles.status}>{WeatherData.weather && WeatherData?.weather[0]?.description}</p>
                        {WeatherData.weather &&
                            (<img className={Styles.weather_icons} alt="image1" src={`${WeatherData?.weather[0].icon}.svg`} />)}
                    </div>
                    <h2 className={Styles.temp}>{ConvertToCelsius(WeatherData?.main?.temp)}°</h2>

                </div>
                <div className={Styles.weather_details}>
                    <div className={Styles.weather_01}>
                        <p>HUMIDITY</p>
                        <h3>{WeatherData?.main?.humidity}%</h3>
                    </div>
                    <div className={Styles.weather_01}>
                        <p>WIDE</p>
                        <h3>{WeatherData?.wind?.speed}km/h</h3>
                    </div>
                    <div className={Styles.weather_01}>
                        <p>VISIBILITY</p>
                        <h3>{lengthConverter(WeatherData?.visibility)}km</h3>
                    </div>
                </div>
            </div>
        )}
    </div>
}

export default WeatherAppComponent;