import './App.css';
import useFetch from './api/useFetch';
import {useState, useCallback, memo, useEffect} from 'react'

const API_URL = 'http://api.weatherapi.com/v1/current.json?key=6218c2cc155b48e29ac101355221608';

function App() {

  const [inputCity, setInputCity] = useState('');
  let BASE_URL = API_URL;
    BASE_URL += `&q=${inputCity}&aqi=yes`; 
  const {data, setData, cityData, search, setSearch} = useFetch(BASE_URL);

  const handleSearch =  useCallback(() => {
    if (!search || search.length <= 3) 
    {
      setSearch('');
      return alert('City Name Length must be more than 3 Characters');
    }else {
      setInputCity(search);
      setSearch('');
    }
  },[search])

  const handleChangeInput = useCallback((e: { target: { value: string; }; }) => {
    setSearch(e.target.value);
  }, [search])

  const historyData = localStorage.getItem('Search History');

    useEffect(()=>{
      if (historyData !== null) {
        setData(JSON.parse(historyData));
      }else{
        setData([])
      }
    },[search])

    useEffect(() => {
      localStorage.setItem('Search History', JSON.stringify(data));
    }, [data, setData])
    
      const deleteCity = useCallback((cityWeather: string ) => () => {
          setData(data.filter((city: {weather: string}) => 
          city.weather !== cityWeather))
      }, [data, setData]);
    
  return (
    <div className="App">
      <div className='container'>
        <h1>Weather App</h1>
        <div className='search-bar'>
          <input type="text"
           placeholder="Type a city" 
           value={search} 
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
                  {data.map((item: {
                    date: string,
                    name: string,
                    weather: string,
                    status: string,
                  }) => 
                      <tr key={item.name}>
                          <td>{item.date}</td>
                          <td>{item.name}</td>
                          <td>{item.weather} ({item.status}) </td>
                          <td><button className='btn-delete' onClick={deleteCity(item.weather)}>Delete</button></td>
                      </tr>)}        
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