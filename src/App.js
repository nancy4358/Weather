import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const App = () => {
  const [data, setData] = useState(null);
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY; 
  const cities = ['London', 'Berlin'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityData = await Promise.all(
          cities.map(city =>
            axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`)
          )
        );

    
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const londonTemps = cityData[0].data.forecast.forecastday.map(day => day.day.avgtemp_c);
        const berlinTemps = cityData[1].data.forecast.forecastday.map(day => day.day.avgtemp_c);

        setData({
          labels: labels,
          datasets: [
            {
              label: 'London',
              data: londonTemps,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: 'Berlin',
              data: berlinTemps,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
          ]
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiKey]);

  return (
    <div>
      <h1>Weather Data</h1>
      {data ? (
        <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } }, scales: { x: { stacked: true }, y: { stacked: true } } }} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
