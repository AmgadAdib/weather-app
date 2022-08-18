import './App.css';
import {useState, useCallback, memo, useEffect} from 'react'

function App() {

  const [inputCity, setInputCity] = useState('')
  const API_KEY= '6218c2cc155b48e29ac101355221608';
  const BASE_URL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${inputCity}&aqi=yes`;
  const [data, setData] = useState([{}]);
  const [cityData, setCityData] = useState({
    name:"",
    country: "",
    date: "",
    weather:"",
    status:"",
  });

  const fetchWeather = async(BASE_URL: string)=>{
    const apiCall = await fetch(BASE_URL);
    const response =await apiCall.json();
    const cityData = response;  
    setCityData({
    name: cityData.location.name,
    country: cityData.location.country,
    date: cityData.location.localtime,
    weather: cityData.current.feelslike_c,
    status: cityData.current.condition.text
    })
    setData([...data, {
    name: cityData.location.name,
    country: cityData.location.country,
    date: cityData.location.localtime,
    weather: cityData.current.feelslike_c,
    status: cityData.current.condition.text,
  }])
    setInputCity('')
};

  const handleSearch =  useCallback(() => {
    if (!inputCity || inputCity.length <= 3) 
    {
      setInputCity('');
      return alert('City Name Length must be more than 3 Characters');
    }else {
      fetchWeather(BASE_URL)
      setInputCity('');
    }
  },[inputCity])

  const handleChangeInput = useCallback((e: { target: { value: string; }; }) => {
    setInputCity(e.target.value)
  }, [inputCity])

  const get: any = localStorage.getItem('data')
    useEffect(()=>{
      if (window.localStorage.getItem('data') !== null) {
        setData(JSON.parse(get));
      }else{
        setData([])
      }
    },[inputCity])

    useEffect(() => {
      localStorage.setItem('data', JSON.stringify(data));
    }, [data, setData])
    
      const deleteCity = (cityWeather: string ) => {
          setData(data.filter((city: any) => 
          city.weather !== cityWeather))
      }
    
  return (
    <div className="App">
      <div className='container'>
        <h1>Weather App</h1>
        <div className='search-bar'>
          <input type="text"
           placeholder="Type a city" 
           value={inputCity} 
           onChange={handleChangeInput}
           />
          <button  onClick={handleSearch}>Search</button>
          <div className="data">
            <h1>{cityData.name}, {cityData.country}</h1>
            <span>{cityData.date}</span>
            <h1>{cityData.weather} °C</h1>
            <span>{cityData.status}</span>
            <div className="search-history">
              <h2>Search History</h2>
              <table id="table">
                  <thead>
                      <th>Date</th>
                      <th>City</th>
                      <th>Weather</th>
                      <th>Action</th>
                  </thead>
                  <tbody id="data">
                  {data.map((item: any) => 
                      <tr>
                          <td>{item.date}</td>
                          <td>{item.name}</td>
                          <td>{item.weather} ({item.status}) </td>
                          <td><button className='btn-delete' onClick={() => {deleteCity(item.weather)}}>Delete</button></td>
                      </tr>
                  )}        
                </tbody>
              </table>
           </div>
         </div>
        </div>
      </div>
    </div>
  );
}

export default memo(App);
