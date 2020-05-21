import React, { useState, useEffect } from "react"
import AsyncSelect from "react-select/async"
import axios from "axios"
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from "@material-ui/core/TextField"
import ListItem from "@material-ui/core/ListItem"
import Select from "@material-ui/core/Select"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import Player from "./Player"
import DropDownMenu from "material-ui/DropDownMenu"
import MenuItem from "material-ui/MenuItem"
import Button from "@material-ui/core/Button"
import { getAccessToken, setSpotifyCode, getUserData } from "../redux/store"
import { connect } from "react-redux"
import { getEpisode, fetchEpisodes, fetchShows } from "../api/spotifyApi"
import { changeQueue } from "../firebase/firebase"
import MyCarousel from "./Carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const SearchBar = (props) => {
  const token = props.token
  // const [state, setState] = useState({
  //   epId: "",
  // });  
  let [search, setSearch] = useState("")
  let [result, setResult] = useState([ { value: "chocolate", label: "Start typing..." }])
  let [episodes, setEpisodes] = useState([])
  let [chosenEpisode, setEpisode] = useState()
  let [uri, setUri] = useState()
  let [results, setResults] = useState([
    { value: "chocolate", label: "Start typing..." },
  ])
  let [popularPodcasts, setPopularPodcasts] = useState([{}])
  let [playlist, setPlaylist] = useState([{}])

  const popPodcasts = async () => {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/37i9dQZF1DXdlkPQJ1PlTQ/tracks`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const ppJSON = await response.json()
    result = []
    if (ppJSON.items) {
      result = await ppJSON.items.map((item) => {
        return {
          uri: item.track.uri,
          name: item.track.name,
          id: item.track.id,
          image: item.track.album.images[1].url,
        }
      })
      setPopularPodcasts(result)
    }
  }

  const getPlaylist = async () => {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/37i9dQZF1DX0sZ6o42ll0w/tracks`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const plJSON = await response.json()
    result = []
    if (plJSON.items) {
      result = await plJSON.items.map((item) => {
        return {
          uri: item.track.uri,
          name: item.track.name,
          id: item.track.id,
          image: item.track.album.images[1].url,
        }
      })
      setPlaylist(result)
    }
  }

  const searchHandler = async () => {
    const res = await fetchShows(search, token, 50)

    let searchArr = [{ value: "chocolate", label: "Start typing..." }]

    if (res.shows) {
      searchArr = res.shows.items.map((item) => {
        return { value: item.id, label: item.name }
      })
    }
    console.log("search arr!!", searchArr)
    setResults(searchArr)
  }


  const handleChange = async (event) => {
    const name = event.target.name
    const value = event.target.value

    getEpisode(value, token).then((res) =>
    changeQueue(props.roomId, res, value, props.userData.display_name)
    )
  }

  const activeSearch = async (text) => {
    setSearch(text)
    await searchHandler()
  }

  const getEpisodes = async () => {
    fetchShows(search, token, 1)
      .then((res) => {
        if(res.shows){
          if(res.shows.items){
            result = res.shows.items.map((item) => {
              return item.id;
            });
          }
         
        }
      })
      .then(() => setResult(result))
      .then(() => fetchEpisodes(result, token))
      .then((res) => {
        if(res !== undefined){
          if(res.items){
            return res.items.map((item) => {
              return {
                uri: item.uri,
                name: item.name,
                date: item.release_date,
                id: item.id,
              };
            });
          }
         
        }
      })
      .then((res) => {
        if(res !== undefined){
          setEpisodes(res)
        }
      });
  };
  useEffect(() => {
    popPodcasts()
    getPlaylist()
  }, [])
  useEffect(() => {
    getEpisodes()
  },[search])
  return (
    <div className="right-panel">
         <div>
        <MyCarousel podcasts={popularPodcasts} playlist={playlist} />
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
                getEpisodes();
              }}
              label="Search input"
              margin="normal"
              variant="outlined"
            />
          )}
        />
        {/* <Button
          id="search-button"
          variant="contained"
          color="primary"
          onClick={getEpisodes}
        >
          Search
        </Button> */}
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
                      getEpisode(episode.id)
                      setUri(episode.uri)
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
        showId={result[0].value}
      />
    </div>
  )
}
const stateToProps = (state) => ({
  token: state.access_token,
  userData: state.userData,
})

export default connect(stateToProps)(SearchBar)
