import React, { useState, useEffect } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

class SearchBar2 extends React.Component {
  constructor(props) {
    super();
    this.state = {
      searchArr: [],
      results: [],
    };
    this.token = props.token || "";
    this.search = "";
    this.results = [];
    this.result = "";
    this.episodes = [];
    this.searchHandler = this.searchHandler.bind(this);
    this.activeSearch = this.activeSearch.bind(this);
    this.getEpisodes = this.getEpisodes.bind(this);
  }

  searchHandler = async () => {
    const q = encodeURIComponent(`${this.search}`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${q}&type=show&market=US&limit=50&offset=5`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
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
    console.log("searchArr", searchArr);
    this.state.results = searchArr;
  };

  activeSearch = async (text) => {
    this.search = text;
    await this.searchHandler();
  };

  getEpisodes = async () => {
    console.log("entered get eps");
    console.log(this.search);
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].label.toLowerCase() === this.search.toLowerCase()) {
        console.log("entered the loop!");
        this.result = this.results[i];
        break;
      }
    }
    console.log("this.result", this.result);
    if (this.result.value) {
      const episodes = await fetch(
        `https://api.spotify.com/v1/shows/${this.result.value}/episodes`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      const episodesJSON = await episodes.json();
      try {
        let episodesArr = episodesJSON.items.map((item) => {
          return { uri: item.uri, name: item.name, date: item.release_date };
        });
        this.episodes = episodesArr;
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    return (
      <div>
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          onChange={(e, v) => this.activeSearch(v)}
          options={this.state.results.map((item) => item.label)}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={({ target }) => {
                this.activeSearch(target.value);
              }}
              label="Search input"
              margin="normal"
              variant="outlined"
            />
          )}
        />
        <button onClick={this.getEpisodes}>Get Episodes</button>
        {this.episodes.length > 0 &&
          this.episodes.map((episode) => <li>{episode.name}</li>)}
      </div>
    );
  }
}

export default SearchBar2;
