import React, { useState, useEffect } from "react"
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from "@material-ui/core/TextField"
import Select from "@material-ui/core/Select"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import Player from "./Player"
import { connect } from "react-redux"
import { getEpisode, fetchEpisodes, fetchShows } from "../api/spotifyApi"
import { changeQueue, getPlaylist } from "../firebase/firebase"
import MyCarousel from "./Carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const SearchBar = (props) => {
  const token = props.token
  let [search, setSearch] = useState("")
  let [result, setResult] = useState([
    { value: "chocolate", label: "Start typing..." },
  ])
  let [episodes, setEpisodes] = useState([])
  let [chosenEpisode, setEpisode] = useState()
  let [uri, setUri] = useState()
  let [results, setResults] = useState([
    { value: "chocolate", label: "Start typing..." },
  ])
  let [popularPodcasts, setPopularPodcasts] = useState([{}])
  let [selectedPodcasts, setSelectedPodcasts] = useState([{}])
  let [dailyPlaylist, setDailyPlaylist] = useState([{}])

  useEffect(() => {
    getPlaylist("37i9dQZF1DXdlkPQJ1PlTQ", token).then((res) =>
      setPopularPodcasts(res)
    )
    getPlaylist("37i9dQZF1DX0sZ6o42ll0w", token).then((res) =>
      setSelectedPodcasts(res)
    )
    getPlaylist("37i9dQZF1EnOBYmteT8p3O", token).then((res) =>
      setDailyPlaylist(res)
    )
  }, [])

  const searchHandler = async () => {
    const res = await fetchShows(search, token, 50)

    let searchArr = [{ value: "chocolate", label: "Start typing..." }]

    if (res.shows) {
      searchArr = res.shows.items.map((item) => {
        return { value: item.id, label: item.name }
      })
    }
    setResults(searchArr)
  }

  const handleChange = async (event) => {
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
        if (res.shows) {
          if (res.shows.items) {
            result = res.shows.items.map((item) => {
              return item.id
            })
          }
        }
      })
      .then(() => setResult(result))
      .then(() => fetchEpisodes(result, token))
      .then((res) => {
        if (res !== undefined) {
          if (res.items) {
            return res.items.map((item) => {
              return {
                uri: item.uri,
                name: item.name,
                date: item.release_date,
                id: item.id,
              }
            })
          }
        }
      })
      .then((res) => {
        if (res !== undefined) {
          setEpisodes(res)
        }
      })
  }

  useEffect(() => {
    getEpisodes()
  }, [search])

  return (
    <div className="panel">
      <div>
        <MyCarousel
          podcasts={popularPodcasts}
          playlist={selectedPodcasts}
          dailyPodcasts={dailyPlaylist}
        />
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
                activeSearch(target.value)
                getEpisodes()
              }}
              label="Search input"
              size="small"
              margin="dense"
              variant="filled"
            />
          )}
        />
      </div>
      {episodes.length > 1 ? (
        <div>
          <FormControl
            fullWidth="true"
            size="small"
            margin="dense"
            variant="filled"
          >
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
            size="small"
            margin="dense"
            variant="filled"
          >
            <InputLabel>Select Show from Above</InputLabel>
            <Select
              native
              value={`Select Show from Above`}
              onChange={handleChange}
              size="small"
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
