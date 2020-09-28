import React, { useState, useEffect }from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Paper,
} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import logo from './logo.svg';
import './App.css';
import Table from './Table';
import {sortData, prettyPrintStat} from './helper'
import LineGraph from './LineGraph';
import numeral from "numeral";
import "leaflet/dist/leaflet.css";
import ComboBox from './ComboBox';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("india");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 25.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/countries/IN")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    });
  }, []);
  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        const sortedData = sortData(data)
        setTableData(sortedData);
        setMapCountries(data)
        setCountries(countries);
      });
    };
    getCountries()
  }, []);

  const onCountryChange = async (event, value) => {
    let countryCode="india";
    if(value.length != 0)
      countryCode = value;
    console.log("flkjsdkfjdsklj "+countryCode);
    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : "https://disease.sh/v3/covid-19/countries/" + countryCode;
    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
      setCountry(countryCode);
      setCountryInfo(data);
    }); 
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
        <h1>Covid-19</h1>
        <Autocomplete
          id="combo-box-demo"
          options={countries}
          getOptionLabel={(option) => option.name}
          style={{ width: 250 }}
          // onChange={(e,v) => setCountry(v)}
          onInputChange={onCountryChange}
          renderInput={(params) => <TextField {...params} label={country} variant="outlined" />}
        />


        {/* <ComboBox countries={countries} onChange={onCountryChange} /> */}
        {/* <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>
            <MenuItem value="india">India</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl> */}
        </div>

        <div className="app__stats" value={countryInfo}>
          <InfoBox 
          onClick={(e) => setCasesType("cases")}
          title="Corovirus Cases"
          active={casesType === "cases"}
          isRed
          cases={prettyPrintStat(countryInfo.todayCases)} 
          total={numeral(countryInfo.cases).format("0.0a")}>

          </InfoBox>
          <InfoBox 
          onClick={(e) => setCasesType("recovered")}
          title="Recovered" 
          active={casesType === "recovered"}
          cases={prettyPrintStat(countryInfo.todayRecovered)} 
          total={numeral(countryInfo.recovered).format("0.0a")}>

          </InfoBox>
          <InfoBox 
          onClick={(e) => setCasesType("deaths")}
          title="Deaths" 
          active={casesType === "deaths"}
          isRed
          cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total={numeral(countryInfo.deaths).format("0.0a")}>
          
          </InfoBox>
        </div>
        <h3 className="worldwide">  {countryInfo.country} </h3>
        <LineGraph casesType={casesType} countryName={country} />
        
          <div className="app__information">
          <h3>Top most affected countries</h3>
          <Table countries={tableData}></Table>

          {/* <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          /> */}
          
          </div>

        
      </div>
        
    </div>
  );
}

export default App;
