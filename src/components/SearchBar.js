import React, { useState, useEffect } from "react";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import axios from 'axios'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import Player from './Player';

const SearchBar = props => {
  const token = props.token;
//   console.log("token", token)
  let [search, setSearch] = useState("");
  let [result, setResult] = useState([]);
  let [episodes, setEpisodes] = useState([]);
  let [chosenEpisode, setEpisode] = useState()
  let [results, setResults] = useState([{ value: 'chocolate', label: 'Chocolate' }]);
  const searchHandler = async () => {
    const q = encodeURIComponent(`${search}`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${q}&type=show&market=US&limit=50`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const searchJSON = await response.json();
    console.log(searchJSON)
    let searchArr = [{ value: 'chocolate', label: 'Chocolate' }]

    if (searchJSON.shows) {
      searchArr = searchJSON.shows.items.map(item => {
        return { value: item.id, label: item.name }
      })
    }
    setResults(searchArr);
    // var result = results.filter(item => item.label === search)
    // setResult(result)
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
  const getEpisodes = async () => {
    const q = encodeURIComponent(`${search}`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${q}&type=show&market=US&limit=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      
    );
    const searchJSON = await response.json();
    console.log(searchJSON)
    if (searchJSON.shows) {
        result = searchJSON.shows.items.map(item => {
          return item.id 
        })
    }
    setResult(result)
    if (result) {
      console.log('getting episodes')
      const episodes = await fetch(
        `https://api.spotify.com/v1/shows/${result}/episodes`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const episodesJSON = await episodes.json();
      try {
        let episodesArr = episodesJSON.items.map(item => {
          return { uri: item.uri, name: item.name, date: item.release_date, id: item.id}
        })
        setEpisodes(episodesArr)
      } catch (err) {
        console.log(err)
      }
    }
  }
// console.log('CHOSEN EPISODE URI ', chosenEpisode)
  return (
    <div>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        onChange={(e, v) => activeSearch(v)}
        options={results.map(item => item.label)}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={({ target }) => { activeSearch(target.value) }}
            label="Search input"
            margin="normal"
            variant="outlined"
          />
        )}
      />
      <button onClick={getEpisodes}>Get Episodes</button>
      {episodes.map(episode => <ListItem button onClick={() => setEpisode(episode.uri)} key={episode.id}>{episode.name}</ListItem>)}
      <Player token={token} uri={chosenEpisode}/>
    </div>
  );
};

export default SearchBar;
