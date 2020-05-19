import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ListItem from "@material-ui/core/ListItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Player from "./Player";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import Button from "@material-ui/core/Button";
import { getAccessToken, setSpotifyCode, getUserData } from "../redux/store";
import { connect } from "react-redux";
import { getEpisode, fetchEpisodes, fetchShows } from "../api/spotifyApi";
import { changeQueue } from "../firebase/firebase";
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import tileData from './tileData';

const useStyles = makeStyles((theme) => ({
  display: 'flex',
  root: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));

const SearchBar = (props) => {
  const token = props.token;
  // const [state, setState] = useState({
  //   epId: "",
  // });
  const classes = useStyles();
  let [search, setSearch] = useState("");
  let [result, setResult] = useState([]);
  let [episodes, setEpisodes] = useState([]);
  let [chosenEpisode, setEpisode] = useState();
  let [uri, setUri] = useState();
  let [results, setResults] = useState([{value: "chocolate", label: "Start typing..."}]);
  let [popularPodcasts, setPopularPodcasts] = useState([{}])
    const popPodcasts = async () => {
       const response = await fetch(
      `https://api.spotify.com/v1/playlists/37i9dQZF1DXdlkPQJ1PlTQ/tracks`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const ppJSON = await response.json();
    result = []
    if(ppJSON.items){
      result = await ppJSON.items.map((item) => {
        return {
          uri: item.track.uri,
          name: item.track.name,
          image: item.track.album.images[1].url,
        }
      })
      setPopularPodcasts(result)
    }
    }
  const searchHandler = async () => {
    const res = await fetchShows(search, token, 50);

    // const q = encodeURIComponent(`${search}`);
    // const response = await fetch(
    //   `https://api.spotify.com/v1/search?q=${q}&type=show&market=US&limit=50`,
    //   {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    // const searchJSON = await response.json();

    let searchArr = [{ value: "chocolate", label: "Start typing..." }];

    if (res.shows) {
      searchArr = res.shows.items.map((item) => {
        return { value: item.id, label: item.name };
      });
    }
    console.log("search arr!!", searchArr);
    setResults(searchArr);
  };

  // useEffect(() => {
  //   const foo = async function () {
  //     await searchHandler();
  //   };
  //   foo();
  // }, [props.search]);

  const handleChange = async (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // setState({
    //   ...state,
    //   [name]: value,
    // });
    getEpisode(value, token).then((res) =>
      changeQueue(props.roomId, res, value, props.userData.display_name)
    );
  };

  const activeSearch = async (text) => {
    setSearch(text);
    await searchHandler();
  };

  const getEpisodes = async () => {
    fetchShows(search, token, 1)
      .then((res) => {
        result = res.shows.items.map((item) => {
          return item.id;
        });
      })
      .then(() => setResult(result))
      .then(() => fetchEpisodes(result, token))
      .then((res) => {
        return res.items.map((item) => {
          return {
            uri: item.uri,
            name: item.name,
            date: item.release_date,
            id: item.id,
          };
        });
      })
      .then((res) => setEpisodes(res));
  };
  popPodcasts()
  return (
    <div className="right-panel">
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={2.5}>
          {popularPodcasts.map((podcast) => (
            <GridListTile key={podcast.image}>
              <img src={podcast.image} alt={podcast.name} />
              <GridListTileBar
                title={podcast.name}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
      <div className="search-container">
        <Autocomplete
          className="search"
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          onChange={(e, v) => activeSearch(v)}
          options={results.map((item) => item.label)}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={({ target }) => {
                // activeSearch(target.value);
                activeSearch(target.value);
              }}
              label="Search input"
              margin="normal"
              variant="outlined"
            />
          )}
        />
        <Button
          id="search-button"
          variant="contained"
          color="primary"
          onClick={getEpisodes}
        >
          Search
        </Button>
      </div>
      {episodes.length > 1 ? (
        <div>
          <FormControl fullWidth="true" margin="normal" variant="outlined">
            <InputLabel>{`Select from ${search} Episodes`}</InputLabel>
            <Select native value="Episodes" onChange={handleChange}>
              <option aria-label="None" value="" />
              {episodes &&
                episodes.map((episode) => (
                  <option
                    key={episode.id}
                    value={episode.id}
                    onClick={() => {
                      getEpisode(episode.id);
                      setUri(episode.uri);
                    }}
                  >
                    {episode.name}
                  </option>
                ))}
            </Select>
          </FormControl>
        </div>
      ) : (
        <div>
          <FormControl
            disabled="true"
            fullWidth="true"
            margin="normal"
            variant="outlined"
          >
            <InputLabel>Select Show from Above</InputLabel>
            <Select
              native
              value={`Select Show from Above`}
              onChange={handleChange}
            >
              <option aria-label="None" value="" />
            </Select>
          </FormControl>
        </div>
      )}

      <Player
        token={token}
        uri={uri}
        roomId={props.roomId}
        episode={chosenEpisode}
      />
    </div>
  );
};
const stateToProps = (state) => ({
  token: state.access_token,
  userData: state.userData,
});

export default connect(stateToProps)(SearchBar);
