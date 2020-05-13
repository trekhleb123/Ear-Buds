import axios from "axios";

export const getNowPlaying = async (token) => {
  try {
    const episode = await axios.get(
      `https://api.spotify.com/v1/me/player/currently-playing`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log("Now Playing", episode);
    return episode;
  } catch (err) {
    console.log(err);
  }
};

export const pausePlayback = async (token) => {
  try {
    fetch(`https://api.spotify.com/v1/me/player/pause`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log("timeStamp", Date.now());
  } catch (err) {
    console.log(err);
  }
};

export const startPodcast = async (token, devId, podcastUri) => {
  try {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${devId}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        uris: [podcastUri],
        position_ms: 0,
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const startPodcastAnywhere = async (token, podcastUri) => {
  try {
    fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        uris: [podcastUri],
        position_ms: 0,
      }),
    });
    console.log("timeStamp", Date.now());
  } catch (err) {
    console.log(err);
  }
};

export const resumePlayback = async (token) => {
  try {
    fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      // body: JSON.stringify({
      //   uris: [`spotify:track:${action.track.id}`],
      // }),
    });
  } catch (err) {
    console.log(err);
  }
};
