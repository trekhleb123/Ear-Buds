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
    return episode;
  } catch (err) {
    console.log(err);
  }
};

export const pausePlayback = async (token, devId) => {
  try {
    fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${devId}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const startPodcast = async (token, devId, podcastUri, startTime) => {
  try {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${devId}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        uris: [podcastUri],
        position_ms: startTime,
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const seekPodcast = async (token, devId, podcastUri, position) => {
  try {
    fetch(`https://api.spotify.com/v1/me/player/seek?device_id=${devId}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        uris: [podcastUri],
        position_ms: position,
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
  } catch (err) {
    console.log(err);
  }
};

export const resumePlayback = async (token, devId) => {
  try {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${devId}`, {
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

export const getEpisode = async (id, token) => {
  try {
    const episode = await fetch(`https://api.spotify.com/v1/episodes/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const epJson = await episode.json();

    return epJson;
  } catch (err) {
    console.log(err);
  }
};

export const fetchShows = async (search, token, num) => {
  try {
    const q = encodeURIComponent(`${search}`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${q}&type=show&market=US&limit=${num}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const searchJSON = await response.json();
    return searchJSON;
  } catch (err) {
    console.log(err);
  }
};

export const fetchEpisodes = async (result, token) => {
  try {
    const episodes = await fetch(
      `https://api.spotify.com/v1/shows/${result}/episodes?limit=49`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const episodesJSON = await episodes.json();
    return episodesJSON;
  } catch (err) {
    console.log(err);
  }
};

export const getDevices = async (token) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/player/devices`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data.devices;
  } catch (err) {
    console.log(err);
  }
};

export const transferDevice = async (token, devId) => {
  try {
    fetch(`https://api.spotify.com/v1/me/player`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        device_ids: [devId],
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const subscribe = async (token, showId) => {
  try {
    fetch(`https://api.spotify.com/v1/me/shows?ids=${showId}`, {
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

export const checkSubscription = async (token, showId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/shows/contains?ids=${showId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data[0];
  } catch (err) {
    console.log(err);
  }
};
