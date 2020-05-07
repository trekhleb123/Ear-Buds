import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Spotify from "spotify-web-api-js";

const spotifyWebApi = new Spotify();

class App extends React.Component {
  constructor() {
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: { name: "Not Checked", image: "" },
    };
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
    }
  }

  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      //adding the access token to URL
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      //updating URL bar
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;

    //instead, make a call to write it to firebase
  }

  getNowPlaying() {
    console.log("clicked");
    spotifyWebApi.getMyCurrentPlaybackState().then((response) => {
      this.setState({
        nowPlaying: {
          name: response.item.name,
          image: response.item.album.images[0].url,
        },
      });
      console.log("response", response);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>Now Playing: {this.state.nowPlaying.name}</div>
          <img src={this.state.nowPlaying.image} style={{ width: 100 }} />
          <a href="http://localhost:8888">
            <button>Login with Spotify</button>
          </a>
          <a>
            <button onClick={() => this.getNowPlaying()}>
              Get Now Playing
            </button>
          </a>
        </header>
      </div>
    );
  }
}

export default App;
