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

export const pausePlayback = async (token, devId) => {
  try {
    fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${devId}`, {
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
    console.log("DEVICES", response);
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

// export const sampleEp = {
//   audio_preview_url:
//     "https://p.scdn.co/mp3-preview/ae962b343e142fa4cb7a03a28d8fc5bb69e11c4c",
//   description:
//     "         Dave and Chris Ying call up former World Bank president and epidemiology expert Jim Kim to discuss the science-based methods for the United States to combat the COVID-19 pandemic.       ",
//   duration_ms: 4127347,
//   explicit: true,
//   external_urls: {
//     spotify: "https://open.spotify.com/episode/0Fi9ugysDfXC0llixpYwHl",
//   },
//   href: "https://api.spotify.com/v1/episodes/0Fi9ugysDfXC0llixpYwHl",
//   id: "0Fi9ugysDfXC0llixpYwHl",
//   images: [
//     {
//       height: 640,
//       url: "https://i.scdn.co/image/a7de7e0497e4b718a08d99e98241533f5113a3e1",
//       width: 640,
//     },
//     {
//       height: 300,
//       url: "https://i.scdn.co/image/f280373bb7732a259b299788441d848529741642",
//       width: 300,
//     },
//     {
//       height: 64,
//       url: "https://i.scdn.co/image/4c3a026cf990d91ab5390f2c615adf3420bdf98f",
//       width: 64,
//     },
//   ],
//   is_externally_hosted: false,
//   is_playable: true,
//   language: "en",
//   languages: ["en"],
//   name: "Too Small to Fail, Vol. 6: Jim Kim | The Dave Chang Show",
//   release_date: "2020-05-11",
//   release_date_precision: "day",
//   resume_point: {
//     fully_played: false,
//     resume_position_ms: 0,
//   },
//   show: {
//     available_markets: [
//       "AD",
//       "AE",
//       "AR",
//       "AT",
//       "AU",
//       "BE",
//       "BG",
//       "BH",
//       "BO",
//       "BR",
//       "CA",
//       "CH",
//       "CL",
//       "CO",
//       "CR",
//       "CY",
//       "CZ",
//       "DE",
//       "DK",
//       "DO",
//       "DZ",
//       "EC",
//       "EE",
//       "ES",
//       "FI",
//       "FR",
//       "GB",
//       "GR",
//       "GT",
//       "HK",
//       "HN",
//       "HU",
//       "ID",
//       "IE",
//       "IL",
//       "IN",
//       "IS",
//       "IT",
//       "JO",
//       "JP",
//       "KW",
//       "LB",
//       "LI",
//       "LT",
//       "LU",
//       "LV",
//       "MA",
//       "MC",
//       "MT",
//       "MX",
//       "MY",
//       "NI",
//       "NL",
//       "NO",
//       "NZ",
//       "OM",
//       "PA",
//       "PE",
//       "PH",
//       "PL",
//       "PS",
//       "PT",
//       "PY",
//       "QA",
//       "RO",
//       "SE",
//       "SG",
//       "SK",
//       "SV",
//       "TH",
//       "TN",
//       "TR",
//       "TW",
//       "US",
//       "UY",
//       "VN",
//       "ZA",
//     ],
//     copyrights: [],
//     description:
//       "       Dave Chang has a few questions. Besides being the chef of the Momofuku restaurants and the creator and host of Netflix’s 'Ugly Delicious,' Dave is an avid student and fan of sports, music, art, film, and, of course, food. In ranging conversations that cover everything from the creative process to his guest’s guiltiest pleasures, Dave and a rotating cast of smart, thought-provoking guests talk about their inspirations, failures, successes, fame, and identities.     ",
//     explicit: true,
//     external_urls: {
//       spotify: "https://open.spotify.com/show/0y4DksD5a6sJvcVR6okX5r",
//     },
//     href: "https://api.spotify.com/v1/shows/0y4DksD5a6sJvcVR6okX5r",
//     id: "0y4DksD5a6sJvcVR6okX5r",
//     images: [
//       {
//         height: 640,
//         url: "https://i.scdn.co/image/a7de7e0497e4b718a08d99e98241533f5113a3e1",
//         width: 640,
//       },
//       {
//         height: 300,
//         url: "https://i.scdn.co/image/f280373bb7732a259b299788441d848529741642",
//         width: 300,
//       },
//       {
//         height: 64,
//         url: "https://i.scdn.co/image/4c3a026cf990d91ab5390f2c615adf3420bdf98f",
//         width: 64,
//       },
//     ],
//     is_externally_hosted: false,
//     languages: ["en"],
//     media_type: "audio",
//     name: "The Dave Chang Show",
//     publisher: "The Ringer & Majordomo Media",
//     type: "show",
//     uri: "spotify:show:0y4DksD5a6sJvcVR6okX5r",
//   },
//   type: "episode",
//   uri: "spotify:episode:0Fi9ugysDfXC0llixpYwHl",
// };
