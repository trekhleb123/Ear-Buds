import React, { useState, useEffect } from "react";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import axios from 'axios'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
 const SearchBar = props => {
  const token = props.token;
  let [search, setSearch] = useState("");
  let [results, setResults] = useState([{ value: 'chocolate', label: 'Chocolate' }]);
  const searchHandler = async () => {
    const q = encodeURIComponent(`${search}`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${q}&type=show&market=US`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const searchJSON = await response.json();
    // console.log(searchJSON)
    let searchArr = [{ value: 'chocolate', label: 'Chocolate' }]
    
    if(searchJSON.shows) {
      searchArr = searchJSON.shows.items.map(item => {
        return {value: item.uri, label: item.name}
      })
    }

    setResults(searchArr);
  };

  useEffect(() => {
    const foo = async function () {
      await searchHandler()
    }
    foo()
  }, [props.search])
  
  
  
  const activeSearch = async text => {
    setSearch(text);
    await searchHandler();
  }; 
  
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  console.log(results)
  return (
    <div>
        {/* <h1>{results.map(result => result.name)}</h1> */}
        
        <input 
        type="text"
        onChange={text => activeSearch(text)}
        options={results.shows}
        />

    <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        // value={text => activeSearch(text)}
        options={results.map(item => item.label )}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={setSearch}
            label="Search input"
            margin="normal"
            variant="outlined"
            // InputProps={{ ...params, type: 'search' }}
        />
        )}
    /> 
        {/* <p>{results}</p> */}
        {/* {results} */}
    </div>
  )
}


export default SearchBar