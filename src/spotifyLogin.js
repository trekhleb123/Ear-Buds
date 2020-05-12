import axios from "axios"
import queryString from "querystring"

const redirectUri = "http://localhost:3000"
const clientId = "5831023fb4004d61a610f092f1e612b4"
const clientSecret = "a0174569adec4c988e845ace473ae66a"
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "app-remote-control",
]

export const spotifyLogin = (code) => {
  if(code) {
    return
  } else {
    window.location.replace(
      "https://accounts.spotify.com/authorize?" +
        queryString.stringify({
          response_type: "code",
          client_id: clientId,
          scope: scopes,
          redirect_uri: redirectUri,
        })
    )
  }
}

export const loginHelper = async (code) => {
  console.log("in login helper")
  const accessForm = queryString.stringify({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  })
  // base64 encode auth data
  const auth = btoa(`${clientId}:${clientSecret}`)
  return await axios
    .post("https://accounts.spotify.com/api/token", accessForm, {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Basic ${auth}`,
      },
    })
    .then((res) => {
      console.log(res)
      // removes 'code' query param to clean up URL
      window.history.replaceState(null, null, window.location.pathname)
      return res.data
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getNewToken = (refreshToken) => {
  const accessForm = queryString.stringify({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  })
  const auth = btoa(`${clientId}:${clientSecret}`)
  axios
    .post("https://accounts.spotify.com/api/token", accessForm, {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Basic ${auth}`,
      },
    })
    .then((res) => {
      console.log(res)
      return res.data.access_token
    })
}

export const getMyData = (token) => {
  if (token) {
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
      .then((data) => {
        console.log("data", data)
        return data
      })
  }
}
