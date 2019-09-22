import React, {Component} from 'react';
import './App.css';
import WeatherIcon from './components/WeatherIcon';
import WeatherDetails from './components/WeatherDetails';
const publicIp = require("react-public-ip");

class App extends Component {
  state = {
    icon: '',
    time: 1,
    city: '',
    country: '',
    temperature: '',
    weatherCode: '',
    background: '',
    fetching: true
  }
  componentDidMount () {
    this.fetchIp();
  }

  getIp = async () => {
    const ipv6 = await publicIp.v6() || "";     
    return ipv6    
  } 

  fetchWeatherData = (city,country)=> {

    this.setState({city: city, country: country})
    const baseUrl = 'https://api.openweathermap.org/';
    const path = 'data/2.5/weather';
    const appId = '6e075600b6fa650e1ad395015724effa';
    const query = `units=metric&lang=ru&appid=${appId}`;



    fetch(`${baseUrl}${path}?q=${city}&${query}`)
      .then(response => response.json())
      .then(data => {
        const date = new Date();
        const time = date.getHours();

        this.setState({
          time,
          city,
          temperature: Math.round(data.main.temp),
          weatherCode: data.weather[0].id,
          fetching: false
        });
      })
      .catch(error => console.error(error));
      this.getImageByCity(city,country)
  }


  fetchIp = () => {
    this.getIp().then((ip) => {
       fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=a64e46f9c9794dd591567912234795e1&ip=${ip}`)
        .then(response => response.json())
        .then(({city,country_name}) => this.fetchWeatherData(city,country_name))
        
        .catch(error => console.log(error));
       
    })
   
  }
  

  getImageByCity = (city,country) => {
    fetch(`https://pixabay.com/api/?key=13701567-8bf223d8e47e2f76b39ca952c&q=${city}&image_type=photo`)
      .then(response => response.json())
      .then(({hits}) => {
        try {
          var imageURL = hits[2].largeImageURL
          this.setState({background: imageURL})
        }
        catch {
          this.getImageByCountry(country)
        } 

      })
      .catch(error => console.log(error))
  }
  getImageByCountry = (country) => {
    
    fetch(`https://pixabay.com/api/?key=13701567-8bf223d8e47e2f76b39ca952c&q=${country}&image_type=photo`)
      .then(response => response.json())
      .then(({hits}) => {
        try {
          var imageURL = hits[2].largeImageURL
          this.setState({background: imageURL})
        }
        catch {
          this.setState({background: 'https://images.pexels.com/photos/247478/pexels-photo-247478.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'})
        }  
      })
      .catch(error => console.log(error))
  }
  

  render() {
    const {fetching, icon, time, city, country, temperature, background, weatherCode} = this.state;
      
    return fetching ? 
      <div className='app' ><span ref='loading'>Загрузка</span></div>
      :
      <div className='app' style={{
        background: ` linear-gradient(
          rgba(0, 0, 0, 0.8), 
          rgba(0, 0, 0, 0.8)
        ), url(${background}) no-repeat center center`,
        backgroundSize: 'cover',

        }} data-hour={time}>
        
        <WeatherIcon 
          background = {background}
          icon = {icon}
          weatherCode={weatherCode}
          time={time} />
        
        <WeatherDetails
            city={city}
            country={country}
            temperature={temperature} />

        </div>
  }

}


function parallax(event) {
	this.querySelectorAll('.layer').forEach(layer => {
    layer.style.transform = `translate(${-event.clientX*4/600}px,${-event.clientY*1/600}px)`
    
  })
  this.querySelectorAll('.app').forEach(app => {
		app.style.backgroundPosition = `${event.clientX/900}% ${event.clientY/100+64}%`
  })
}

document.addEventListener('mousemove', parallax)

export default App;
