import React from 'react';

function WeatherIcon({time,weatherCode,background}) {
    const timeOfDay = (time>7 && time<18) ? 'day' : 'night';
    const className = `weather-icon wi wi-owm-${timeOfDay}-${weatherCode}`;

    return <i className={className+' layer'}></i>


}

export default WeatherIcon;