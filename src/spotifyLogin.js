import axios from "axios"
import queryString from "querystring"

const redirectUri = "http://localhost:3000"
const clientId = process.env.REACT_APP_CLIENT_ID
const clientSecret = process.env.REACT_APP_CLIENT_SECRET
const scopes =
  "user-read-currently-playing user-read-playback-state user-modify-playback-state streaming user-read-email user-read-private"

export const spotifyLogin = (code) => {
  if (code) {
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
