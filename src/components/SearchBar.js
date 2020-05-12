import React, { useState, useEffect } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
const SearchBar = (props) => {
  const token = props.token;
  let [search, setSearch] = useState("");
  let [result, setResult] = useState([]);
  let [episodes, setEpisodes] = useState([]);
  let [id, setId] = useState("");
  let [results, setResults] = useState([
    { value: "chocolate", label: "Chocolate" },
  ]);
  const searchHandler = async () => {
    const q = encodeURIComponent(`${search}`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${q}&type=show&market=US&limit=50&offset=5`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const searchJSON = await response.json();
    console.log(searchJSON);
    let searchArr = [{ value: "chocolate", label: "Chocolate" }];

    if (searchJSON.shows) {
      searchArr = searchJSON.shows.items.map((item) => {
        return { value: item.id, label: item.name };
      });
    }
    setResults(searchArr);
    // var result = results.filter(item => item.label === search)
    // setResult(result)
  };

  useEffect(() => {
    const foo = async function () {
      await searchHandler();
    };
    foo();
  }, [props.search]);

  const activeSearch = async (text) => {
    setSearch(text);
    await searchHandler();
  };
  const getEpisodes = async () => {
    console.log("before loop results", results);
    console.log("before loop search", search);
    for (let i = 0; i < results.length; i++) {
      if (results[i].label.toLowerCase() === search.toLowerCase()) {
        console.log("entered the loop!");
        setResult(results[i]);
        setId(result.value);
        break;
      }
    }
    console.log("after loop result", result);
    console.log("after loop id", id);
    if (id) {
      const episodes = await fetch(
        `https://api.spotify.com/v1/shows/${id}/episodes`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("episodes before json", episodes);
      const episodesJSON = await episodes.json();
      try {
        let episodesArr = episodesJSON.items.map((item) => {
          return { uri: item.uri, name: item.name, date: item.release_date };
        });
        setEpisodes(episodesArr);
      } catch (err) {
        console.log(err);
      }
    }

    // let searchArr = [{ value: 'chocolate', label: 'Chocolate' }]

    // if(searchJSON.shows) {
    //   searchArr = searchJSON.shows.items.map(item => {
    //     return {value: item.id, label: item.name}
    //   })
    // }
    // setResults(searchArr);
  };

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  console.log(results);
  console.log(search);
  console.log("RESULT ", result.value);
  console.log("ID ", id);
  console.log("Episodes ", episodes);
  return (
    <div>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        onChange={(e, v) => activeSearch(v)}
        options={results.map((item) => item.label)}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={({ target }) => {
              activeSearch(target.value);
            }}
            label="Search input"
            margin="normal"
            variant="outlined"
          />
        )}
      />
      <button onClick={getEpisodes}>Get Episodes</button>
      {episodes.map((episode) => (
        <li>{episode.name}</li>
      ))}
    </div>
  );
};

export default SearchBar;
