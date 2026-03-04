import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer, Cloud, Sun, CloudRain, Sunrise, Sunset } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DATA = {
    "coord": { "lon": 145.77, "lat": -16.92 },
    "weather": [{ "id": 802, "main": "Clouds", "description": "scattered clouds", "icon": "03n" }],
    "main": { "temp": 300.15, "feels_like": 302.15, "temp_min": 300.15, "temp_max": 300.15, "pressure": 1007, "humidity": 74 },
    "wind": { "speed": 3.6, "deg": 160 },
    "sys": { "country": "AU", "sunrise": 1485720272, "sunset": 1485766550 },
    "name": "Cairns"
};

const Weather = () => {
    const [data, setData] = useState(null);
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Replace this with your OpenWeatherMap API key
    const API_KEY = "96b9ed231d69d802680e962956ab066c";

    const fetchWeather = async (cityToFetch = "London") => {
        if (!API_KEY) {
            console.warn("No API Key provided. Showing mock data for Cairns.");
            setData(MOCK_DATA);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityToFetch}&units=metric&appid=${API_KEY}`
            );
            if (!response.ok) throw new Error('City not found');
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (city.trim()) fetchWeather(city);
    };

    const kelvinToCelsius = (k) => (k - 273.15).toFixed(1);
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Search Header */}
            <form onSubmit={handleSearch} className="flex gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-50 translate-y-50-neg text-slate-400" size={20} />
                    <input
                        type="text"
                        className="input-field pl-12"
                        placeholder="Search city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-red-20 border border-red-50 rounded-xl text-center text-red-20 mb-8"
                    >
                        {error}
                    </motion.div>
                )}

                {data && (
                    <motion.div
                        key={data.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="glass-card overflow-hidden"
                    >
                        {/* Top Section */}
                        <div className="p-8 grid md:grid-cols-2 gap-8 items-center bg-gradient-card-top">
                            <div>
                                <div className="flex items-center gap-2 text-indigo-400 mb-4">
                                    <MapPin size={18} />
                                    <span className="text-xl font-semibold tracking-wide uppercase">{data.name}, {data.sys.country}</span>
                                </div>
                                <h1 className="text-8xl font-bold mb-2">
                                    {data.main.temp > 200 ? kelvinToCelsius(data.main.temp) : data.main.temp.toFixed(1)}°
                                </h1>
                                <p className="text-2xl text-slate-300 capitalize flex items-center gap-2">
                                    <Cloud className="text-indigo-400" />
                                    {data.weather[0].description}
                                </p>
                            </div>

                            <div className="flex flex-col items-center md:items-end">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-20 blur-3xl rounded-full" />
                                    <img
                                        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
                                        alt="Weather status"
                                        className="relative w-48 h-48 drop-shadow-2xl animate-pulse"
                                    />
                                </div>
                                <div className="text-right mt-4">
                                    <p className="text-slate-400">Feels like</p>
                                    <p className="text-2xl font-bold">
                                        {data.main.feels_like ? (data.main.feels_like > 200 ? kelvinToCelsius(data.main.feels_like) : data.main.feels_like.toFixed(1)) : 'N/A'}°
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white-10">
                            <DetailBox icon={<Wind />} label="Wind Speed" value={`${data.wind.speed} m/s`} />
                            <DetailBox icon={<Droplets />} label="Humidity" value={`${data.main.humidity}%`} />
                            <DetailBox icon={<Sunrise />} label="Sunrise" value={formatTime(data.sys.sunrise)} />
                            <DetailBox icon={<Sunset />} label="Sunset" value={formatTime(data.sys.sunset)} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!API_KEY && !error && (
                <div className="mt-8 p-4 bg-yellow-10 border border-white-10 rounded-xl text-yellow-200 text-sm text-center">
                    Note: Currently using Mock Data. Add your OpenWeatherMap API key in <code>Weather.jsx</code> to fetch real-time weather.
                </div>
            )}
        </div>
    );
};

const DetailBox = ({ icon, label, value }) => (
    <div className="p-6 border-r border-white-5 last:border-0 hover:bg-white-5 transition-colors">
        <div className="text-indigo-400 mb-2">{icon}</div>
        <p className="text-slate-400 text-sm mb-1">{label}</p>
        <p className="text-lg font-bold">{value}</p>
    </div>
);

export default Weather;
