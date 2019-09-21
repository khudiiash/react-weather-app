import React from 'react';

function WeatherDetails({city,country, temperature}) {
    return (
        <div className='weather-details layer' id='weather-details'>
            <div className='city'>{city}</div>
            <div className='country'>{country}</div>
            <div className='temperature'>{temperature} &deg; C</div>
        </div>
    )
}

export default WeatherDetails;