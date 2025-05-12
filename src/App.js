import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './App.css'; 
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const App = () => {
  const [data, setData] = useState(null);  
  const [cities, setCities] = useState(['London', 'Berlin']); 
  const [cityInput1, setCityInput1] = useState('London'); 
  const [cityInput2, setCityInput2] = useState('Berlin'); 
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;  


  const handleAddCities = () => {
    if (cityInput1 && cityInput2 && cityInput1 !== cityInput2) {
      setCities([cityInput1, cityInput2]);  
    } else {
      alert("Please select two different cities!"); 
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityData = await Promise.all(
          cities.map(city =>
            axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`)
          )
        );
        console.log(cityData);


        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];  
        const datasets = cityData.map((data, index) => {
          const temps = data.data.forecast.forecastday.map(day => day.day.avgtemp_c);
          return {
            label: cities[index],  
            data: temps,
            backgroundColor: index % 2 === 0 ? 'rgba(54, 162, 235, 0.6)' : 'rgba(75, 192, 192, 0.6)',  // 
          };
        });

        setData({
          labels: labels,
          datasets: datasets,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (cities.length === 2) { 
      fetchData();
    }
  }, [cities, apiKey]);

  return (
    <div>
      <h1>Weather Data</h1>

    
      <select 
        value={cityInput1}
        onChange={(e) => setCityInput1(e.target.value)} 
      >
        <option value="London">London</option>
        <option value="Berlin">Berlin</option>
        <option value="Taipei">Taipei</option>
        <option value="New York">New York</option>
        <option value="Tokyo">Tokyo</option>
        <option value="Bangkok">Bangkok</option>
        <option value="Seoul">Seoul</option> 
      </select>

      <select 
        value={cityInput2}
        onChange={(e) => setCityInput2(e.target.value)}  
      >
        <option value="London">London</option>
        <option value="Berlin">Berlin</option>
        <option value="Taipei">Taipei</option>
        <option value="New York">New York</option>
        <option value="Tokyo">Tokyo</option>
        <option value="Bangkok">Bangkok</option>
        <option value="Seoul">Seoul</option> 
      </select>

      <button onClick={handleAddCities}>Add Cities</button> 


      {data ? (
        <Bar 
          data={data} 
          options={{ responsive: true }}  
          
        />
      ) : (
        <p>Loading...</p>  
      )}
    </div>
  );
};

export default App;
