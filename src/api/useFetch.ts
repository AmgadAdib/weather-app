import { useCallback, useState, useEffect } from 'react'

const useFetch = (BASE_URL : string) => {

  const [data, setData] = useState<{name: string, country: string,date: string, weather: string, status: string}[]>([{
    name:"",
    country: "",
    date: "",
    weather:"",
    status:"",
   }]);

  const [cityData, setCityData] = useState({
    name:"",
    country: "",
    date: "",
    weather:"",
    status:"",
    });

  const [search, setSearch] = useState('');

  const fetchWeather = useCallback(async(BASE_URL: string) => {
    const response = await fetch(BASE_URL);
    const cityData =await response.json();
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
    }]);
    setSearch("");
    },[BASE_URL])
    
  useEffect(() => {
    fetchWeather(BASE_URL)
    }, [BASE_URL]);

    return{data, setData, cityData, search, setSearch}

}

export default useFetch
